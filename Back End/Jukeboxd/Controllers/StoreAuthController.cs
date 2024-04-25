using Jukeboxd.Data;
using Jukeboxd.DTO;
using Jukeboxd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Jukeboxd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class StoreAuthController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public StoreAuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("registration")]
        public async Task<IActionResult> Register(RegisterModel userDto)
        {
            var user = await _context.StoreUsers.FirstOrDefaultAsync(u => u.Email == userDto.Email);

            if (user != null)
            {
                return BadRequest("User already exists");
            }

            user = new StoreUser
            {
                Name = userDto.Name,
                LastName = userDto.LastName,
                Email = userDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password)
            };

            await _context.StoreUsers.AddAsync(user);
            await _context.SaveChangesAsync();

            return Ok(user);
        }

        [HttpPost("authentication")]
        public async Task<IActionResult> LogIn(LoginModel userDto)
        {
            var user = await _context.StoreUsers.FirstOrDefaultAsync(u => u.Email == userDto.Email);

            if (user == null)
            {
                return BadRequest("Invalid User");
            }

            if (!BCrypt.Net.BCrypt.Verify(userDto.Password, user.Password))
            {
                return BadRequest("Invalid Password");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.Name, user.Email.ToString()),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role)
}),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            var authenticatedUser = new
            {
                Id = user.Id,
                Name = user.Name,
                LastName = user.LastName,
                Email = user.Email,
                Token = tokenHandler.WriteToken(token),
                Role = user.Role
            };



            return Ok(authenticatedUser);
        }
    }
}
