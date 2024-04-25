using Jukeboxd.Data;
using Jukeboxd.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Jukeboxd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class StoreUserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StoreUserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost("changePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel changePasswordModel)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _context.StoreUsers.FirstOrDefaultAsync(u => u.Id == Convert.ToInt32(userId));

            if (user == null)
            {
                return BadRequest("Invalid User");
            }

            if (!BCrypt.Net.BCrypt.Verify(changePasswordModel.OldPassword, user.Password))
            {
                return BadRequest("Invalid Password");
            }

            if (string.IsNullOrEmpty(changePasswordModel.NewPassword) || changePasswordModel.NewPassword == changePasswordModel.OldPassword)
            {
                return BadRequest("New password is invalid or the same as the old password");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(changePasswordModel.NewPassword);
            await _context.SaveChangesAsync();

            return Ok("Password changed successfully");
        }

    }
}
