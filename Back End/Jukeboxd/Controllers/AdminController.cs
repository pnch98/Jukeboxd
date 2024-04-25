using Jukeboxd.Data;
using Jukeboxd.DTO;
using Jukeboxd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Jukeboxd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("products/editProduct/{productId}")]
        public async Task<IActionResult> EditProduct([FromBody] ProductModel productModel, int productId)
        {
            var productDb = await _context.Products.FindAsync(productId);

            if (productDb == null)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                productDb.Name = productModel.Name;
                productDb.Description = productModel.Description;
                productDb.Price = productModel.Price;
                productDb.Quantity = productModel.Quantity;
                productDb.Image = productModel.Image;

                _context.Products.Update(productDb);
                await _context.SaveChangesAsync();
            }
            else
            {
                return BadRequest(ModelState);
            }

            return Ok();
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost("products/addProduct")]
        public async Task<IActionResult> AddProduct([FromBody] ProductModel productModel)
        {
            ModelState.Remove("Id");

            if (ModelState.IsValid)
            {
                var product = new Product
                {
                    Name = productModel.Name,
                    Description = productModel.Description,
                    Price = productModel.Price,
                    Quantity = productModel.Quantity,
                    Image = productModel.Image,
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();
            }
            else
            {
                return BadRequest(ModelState);
            }

            return Ok();
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("products/deleteProduct/{productId}")]
        public async Task<IActionResult> DeleteProduct(int productId)
        {
            var productDb = await _context.Products.FindAsync(productId);

            if (productDb == null)
            {
                return NotFound();
            }

            _context.Products.Remove(productDb);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet("admins/getAllAdmins")]
        public async Task<IActionResult> GetAllAdmins()
        {
            var admins = await _context.StoreUsers.Where(u => u.Role == "ADMIN").ToListAsync();

            return Ok(admins);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet("users/getUsersByEmail/{email}")]
        public async Task<IActionResult> GetUsersByEmail(string email)
        {
            var user = await _context.StoreUsers.Where(u => u.Email.Contains(email) && u.Role != "ADMIN").ToListAsync();

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("users/makeAdmin/{userId}")]
        public async Task<IActionResult> MakeAdmin(int userId)
        {
            var user = _context.StoreUsers.Find(userId);

            if (user == null)
            {
                return NotFound();
            }

            if (userId == Convert.ToInt16(User.FindFirstValue(ClaimTypes.NameIdentifier)) || user.Role == "ADMIN")
            {
                return BadRequest("Already admin");
            }

            user.Role = "ADMIN";

            _context.StoreUsers.Update(user);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("users/removeAdmin/{userId}")]
        public async Task<IActionResult> RemoveAdmin(int userId)
        {
            var user = _context.StoreUsers.Find(userId);

            if (user == null)
            {
                return NotFound();
            }

            if (user.Role == "USER")
            {
                return BadRequest("Already user");
            }

            if (userId == Convert.ToInt16(User.FindFirstValue(ClaimTypes.NameIdentifier)))
            {
                return BadRequest("Not allowed to remove yourself!");
            }

            user.Role = "USER";

            _context.StoreUsers.Update(user);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet("stats/getSalesStats")]
        public async Task<IActionResult> GetStoreStats()
        {
            var monthAgo = DateTime.Now.AddDays(-30);

            // Vendite mensili per quantità
            var monthlyProductSalesPerDate = await _context.Orders
                .Include(o => o.OrderDetails)
                .Where(o => o.Date >= monthAgo)
                .SelectMany(o => o.OrderDetails)
                .GroupBy(od => od.Order.Date.Date)
                .Select(group => new { DateSells = group.Key, Count = group.Sum(od => od.Quantity) })
                .ToListAsync();

            var weekAgo = DateTime.Now.AddDays(-7);

            // Vendite settimanali per quantità
            var weeklyProductSalesPerDate = await _context.Orders
                .Include(o => o.OrderDetails)
                .Where(o => o.Date >= weekAgo)
                .SelectMany(o => o.OrderDetails)
                .GroupBy(od => od.Order.Date.Date)
                .Select(group => new { DateSells = group.Key, Count = group.Sum(od => od.Quantity) })
                .ToListAsync();

            // Vendite totali
            var totalSales = await _context.Orders
                .Where(o => o.Date >= monthAgo)
                .SelectMany(o => o.OrderDetails)
                .SumAsync(od => od.Quantity);

            // Ricavi totali
            var totalRevenue = await _context.Orders
                .Where(o => o.Date >= monthAgo)
                .SelectMany(o => o.OrderDetails)
                .SumAsync(od => od.Quantity * od.Price);

            // Prodotto più venduto
            var topProduct = await _context.OrderDetails
                .Include(od => od.Product)
                .Where(od => od.Order.Date >= monthAgo)
                .GroupBy(od => od.Product)
                .OrderByDescending(g => g.Sum(od => od.Quantity))
                .Select(g => new { ProductName = g.Key.Name, ProductImage = g.Key.Image, Quantity = g.Sum(od => od.Quantity) })
                .FirstOrDefaultAsync();

            // Prodotto meno venduto
            var bottomProduct = await _context.OrderDetails
                .Include(od => od.Product)
                .Where(od => od.Order.Date >= monthAgo)
                .GroupBy(od => od.Product)
                .OrderBy(g => g.Sum(od => od.Quantity))
                .Select(g => new { ProductName = g.Key.Name, ProductImage = g.Key.Image, Quantity = g.Sum(od => od.Quantity) })
                .FirstOrDefaultAsync();

            // Giorno di picco
            var peakDay = await _context.Orders
                .Where(o => o.Date >= monthAgo)
                .SelectMany(o => o.OrderDetails)
                .GroupBy(od => od.Order.Date.Date)
                .OrderByDescending(g => g.Sum(od => od.Quantity))
                .Select(g => new { Date = g.Key, Quantity = g.Sum(od => od.Quantity) })
                .FirstOrDefaultAsync();

            return Ok(new
            {
                MonthlyPSD = monthlyProductSalesPerDate,
                WeeklyPSD = weeklyProductSalesPerDate,
                TotalSales = totalSales,
                TotalRevenue = totalRevenue,
                TopProduct = topProduct,
                BottomProduct = bottomProduct,
                PeakDay = peakDay
            });
        }

    }
}
