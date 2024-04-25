using Jukeboxd.Data;
using Jukeboxd.DTO;
using Jukeboxd.Models;
using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using System.Security.Claims;

namespace Jukeboxd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public TicketController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("buyTicket")]
        public async Task<IActionResult> BuyTicket([FromBody] TicketModel ticket)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var tempTicket = new TempTicket
            {
                EventId = ticket.EventId,
                UserId = Convert.ToInt32(userId),
                Price = ticket.Price,
            };
            _context.TempTickets.Add(tempTicket);
            await _context.SaveChangesAsync();

            // Crea una sessione Stripe
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string>
                {
                    "card", "paypal"
                },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = "eur",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = "Ticket",
                            },
                            UnitAmount = (long)(ticket.Price * 100), // Stripe utilizza i centesimi
                        },
                        Quantity = 1,
                    },
                },
                Mode = "payment",
                SuccessUrl = _configuration["FrontUrl"] + "events/tickets/purchase_completed",
                CancelUrl = _configuration["FrontUrl"] + "events/tickets/purchase_failed",
                CustomerEmail = User.FindFirstValue(ClaimTypes.Name),
            };
            var service = new SessionService();
            Session session = service.Create(options);

            tempTicket.SessionId = session.Id;
            _context.Update(tempTicket);
            await _context.SaveChangesAsync();

            return Ok(new { sessionId = session.Id });
        }

    }
}
