using Jukeboxd.Data;
using Jukeboxd.DTO;
using Jukeboxd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jukeboxd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ArtistController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ArtistController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("saveArtist")]
        public async Task<IActionResult> SaveArtist([FromBody] ArtistModel artist)
        {

            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }

            var artistDb = await _context.Artists.FindAsync(artist.Id);

            if (artistDb == null)
            {
                Artist newArtist = new Artist
                {
                    Id = artist.Id,
                    Name = artist.Name,
                    Href = artist.Href,
                    Image = artist.Image,
                    Popularity = artist.Popularity,
                    Followers = artist.Followers,
                    Genres = artist.Genres,
                };

                _context.Artists.Add(newArtist);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpGet("getDiscoveredArtists/{userId}")]
        public async Task<IActionResult> GetDiscoveredArtists(string userId)
        {
            var artists = await _context.DiscoverList.Where(d => d.UserId == userId).Select(d => d.Artist).ToListAsync();

            return Ok(artists);
        }
    }
}
