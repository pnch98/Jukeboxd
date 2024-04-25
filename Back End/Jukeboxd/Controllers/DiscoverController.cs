using Jukeboxd.Data;
using Jukeboxd.DTO;
using Jukeboxd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jukeboxd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DiscoverController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DiscoverController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("addArtistToDiscover")]
        public async Task<IActionResult> AddArtistToDiscover([FromBody] DiscoverModel discover)
        {
            var selectedDiscover = await _context.DiscoverList.SingleOrDefaultAsync(d => d.UserId == discover.UserId && d.ArtistId == discover.ArtistId);

            if (selectedDiscover == null)
            {
                Discover newDiscover = new Discover
                {
                    UserId = discover.UserId,
                    ArtistId = discover.ArtistId
                };

                _context.DiscoverList.Add(newDiscover);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpPost("removeArtistFromDiscover")]
        public async Task<IActionResult> RemoveArtistFromDiscover([FromBody] DiscoverModel discover)
        {
            var selectedDiscover = await _context.DiscoverList.SingleOrDefaultAsync(d => d.UserId == discover.UserId && d.ArtistId == discover.ArtistId);

            if (selectedDiscover != null)
            {
                _context.DiscoverList.Remove(selectedDiscover);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpGet("getAllDiscoveries/{userId}")]
        public async Task<IActionResult> GetDiscoverList(string userId)
        {
            var discoverList = await _context.DiscoverList.Where(d => d.UserId == userId).ToListAsync();

            return Ok(discoverList);
        }
    }
}
