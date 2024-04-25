using Jukeboxd.Data;
using Jukeboxd.DTO;
using Jukeboxd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jukeboxd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SavedController : Controller
    {
        private readonly ApplicationDbContext _context;

        public SavedController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("addAlbumToSaved")]
        public async Task<IActionResult> AddAlbumToSaved([FromBody] SavedModel saved)
        {
            var selectedSaved = await _context.SavedList.SingleOrDefaultAsync(s => s.UserId == saved.UserId && s.AlbumId == saved.AlbumId);

            if (selectedSaved == null)
            {
                Saved newSaved = new Saved
                {
                    UserId = saved.UserId,
                    AlbumId = saved.AlbumId
                };

                _context.SavedList.Add(newSaved);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpPost("removeAlbumFromSaved")]
        public async Task<IActionResult> RemoveAlbumFromSaved([FromBody] SavedModel saved)
        {
            var selectedSaved = await _context.SavedList.SingleOrDefaultAsync(s => s.UserId == saved.UserId && s.AlbumId == saved.AlbumId);

            if (selectedSaved != null)
            {
                _context.SavedList.Remove(selectedSaved);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpGet("getAllSaved/{userId}")]
        public async Task<IActionResult> GetSavedList(string userId)
        {
            var savedList = await _context.SavedList.Where(s => s.UserId == userId).ToListAsync();

            return Ok(savedList);
        }
    }
}
