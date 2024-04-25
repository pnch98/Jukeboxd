using Jukeboxd.Data;
using Jukeboxd.DTO;
using Jukeboxd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe.Checkout;
using System.Security.Claims;

namespace Jukeboxd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public OrderController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [Authorize]
        [HttpPost("submitOrder")]
        public async Task<IActionResult> SubmitOrder([FromBody] CartModel cart)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var tempOrder = new TempOrder
            {
                UserId = Convert.ToInt32(userId),
                Address = cart.Address,
                City = cart.City,
            };
            _context.TempOrders.Add(tempOrder);
            await _context.SaveChangesAsync();

            double totalOrder = 0;

            // Creare i dettagli dell'ordine per ogni item nel carrello
            List<SessionLineItemOptions> lineItems = new List<SessionLineItemOptions>();
            foreach (var item in cart.CartProducts)
            {
                var tempOrderDetail = new TempOrderDetails
                {
                    TempOrderId = tempOrder.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                };
                _context.TempOrderDetails.Add(tempOrderDetail);

                // Calcola il prezzo totale
                var itemFromDb = await _context.Products
                    .FirstOrDefaultAsync(p => p.Id == item.ProductId);

                if (itemFromDb != null)
                {
                    tempOrderDetail.Price = itemFromDb.Price * tempOrderDetail.Quantity;
                    totalOrder += tempOrderDetail.Price;

                    // Aggiungi l'articolo alla lista degli articoli per la sessione di checkout
                    lineItems.Add(new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = "eur",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = itemFromDb.Name,
                            },
                            UnitAmountDecimal = Convert.ToDecimal(itemFromDb.Price * 100), // Converti il prezzo in centesimi
                        },
                        Quantity = item.Quantity,
                    });
                }
            }

            // Imposta il totale dell'ordine
            tempOrder.Total = totalOrder;
            _context.Update(tempOrder);
            await _context.SaveChangesAsync();

            // Stripe
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card", "paypal" },
                LineItems = lineItems,
                Mode = "payment",
                SuccessUrl = _configuration["FrontUrl"] + "store/purchase/success/",
                CancelUrl = "https://example.com/cancel",
                CustomerEmail = User.FindFirstValue(ClaimTypes.Name),
            };

            var service = new SessionService();
            Session session = service.Create(options);

            tempOrder.SessionId = session.Id;
            _context.Update(tempOrder);
            await _context.SaveChangesAsync();

            // Restituisci l'ID della sessione al frontend
            return Ok(new { sessionId = session.Id });
        }

        [Authorize]
        [HttpGet("getOrders")]
        public async Task<IActionResult> GetOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var orders = await _context.Orders
                .Where(o => o.UserId == Convert.ToInt32(userId))
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .Select(order => new OrderModel
                {
                    UserId = order.UserId.ToString(),
                    OrderDate = order.Date,
                    Total = order.Total,
                    City = order.City,
                    Address = order.Address,
                    OrderDetails = order.OrderDetails.Select(od => new OrderDetailsModel
                    {
                        OrderId = od.OrderId,
                        ProductId = od.ProductId,
                        Quantity = od.Quantity,
                        Price = od.Price,
                        Product = new ProductModel
                        {
                            Id = od.Product.Id,
                            Name = od.Product.Name,
                            Description = od.Product.Description,
                            Price = od.Product.Price,
                            Quantity = od.Product.Quantity,
                            Image = od.Product.Image
                        }
                    }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }
    }
}
