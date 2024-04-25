using Jukeboxd.Data;
using Jukeboxd.DTO;
using Jukeboxd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jukeboxd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class VisitedController : Controller
    {
        private readonly ApplicationDbContext _context;

        public VisitedController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("saveVisited")]
        public async Task<IActionResult> SaveVisited([FromBody] VisitedModel visited)
        {
            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }

            var visitedDb = await _context.VisitedList.FirstOrDefaultAsync(v => v.UserId == visited.UserId && v.ArtistId == visited.ArtistId);

            if (visitedDb == null)
            {
                Visited newVisited = new Visited
                {
                    UserId = visited.UserId,
                    ArtistId = visited.ArtistId,
                };

                _context.VisitedList.Add(newVisited);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpGet("getVisitedArtists/{userId}")]
        public async Task<IActionResult> GetVisitedArtists(string userId)
        {
            var artists = await _context.VisitedList
                .Where(v => v.UserId == userId)
                .OrderByDescending(v => v.Id) // Ordina in base all'ID (o un altro campo appropriato)
                .Select(v => v.Artist)
                .Take(5)
                .ToListAsync();

            return Ok(artists);
        }

    }
}
