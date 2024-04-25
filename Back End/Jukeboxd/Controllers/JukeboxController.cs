using Jukeboxd.Data;
using Jukeboxd.DTO;
using Jukeboxd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jukeboxd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class JukeboxController : Controller
    {
        private readonly ApplicationDbContext _context;

        public JukeboxController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("addAlbumToJukebox")]
        public async Task<IActionResult> AddAlbumToJukebox([FromBody] SavedModel jukebox)
        {
            var selectedJukebox = await _context.JukeboxList.SingleOrDefaultAsync(j => j.UserId == jukebox.UserId && j.AlbumId == jukebox.AlbumId);

            if (selectedJukebox == null)
            {
                Jukebox newJukebox = new Jukebox
                {
                    UserId = jukebox.UserId,
                    AlbumId = jukebox.AlbumId,
                    DateAdded = DateOnly.FromDateTime(DateTime.Now)
                };

                _context.JukeboxList.Add(newJukebox);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpPost("removeAlbumFromJukebox")]
        public async Task<IActionResult> RemoveAlbumFromJukebox([FromBody] SavedModel jukebox)
        {
            var selectedJukebox = await _context.JukeboxList.SingleOrDefaultAsync(j => j.UserId == jukebox.UserId && j.AlbumId == jukebox.AlbumId);

            if (selectedJukebox != null)
            {
                _context.JukeboxList.Remove(selectedJukebox);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpGet("getAllJukebox/{userId}")]
        public async Task<IActionResult> GetJukeboxList(string userId)
        {
            var jukeboxList = await _context.JukeboxList.Where(j => j.UserId == userId).ToListAsync();

            return Ok(jukeboxList);
        }

        [HttpGet("getMonthlyJukeboxData/{userId}")]
        public async Task<IActionResult> GetMonthlyJukeboxData(string userId)
        {
            var monthAgo = DateOnly.FromDateTime(DateTime.Now.AddDays(-30));

            var jukeboxData = await _context.JukeboxList
                .Where(j => j.UserId == userId && j.DateAdded >= monthAgo)
                .GroupBy(j => j.DateAdded)
                .Select(group => new { Date = group.Key, Count = group.Count() })
                .ToListAsync();

            return Ok(jukeboxData);
        }

        [HttpGet("getWeeklyJukeboxData/{userId}")]
        public async Task<IActionResult> GetWeeklyJukeboxData(string userId)
        {
            var weekAgo = DateOnly.FromDateTime(DateTime.Now.AddDays(-7));

            var thisWeekJukes = await _context.JukeboxList
                .Where(j => j.UserId == userId && j.DateAdded >= weekAgo)
                .GroupBy(j => j.DateAdded)
                .Select(group => new { Date = group.Key, Count = group.Count() })
                .ToListAsync();

            return Ok(thisWeekJukes);
        }

        [HttpGet("getWeeklyJukeboxCount/{userId}")]
        public async Task<IActionResult> GetWeeklyJukeboxCount(string userId)
        {
            var weekAgo = DateOnly.FromDateTime(DateTime.Now.AddDays(-7));

            var thisWeekJukes = await _context.JukeboxList
                .Where(j => j.UserId == userId && j.DateAdded >= weekAgo)
                .CountAsync();

            return Ok(thisWeekJukes);
        }

        [HttpGet("getTotalHoursListened/{userId}")]
        public async Task<IActionResult> GetTotalHoursListened(string userId)
        {
            var jukeboxList = await _context.JukeboxList.Where(j => j.UserId == userId).ToListAsync();

            var totalHoursListened = 0;

            foreach (var jukebox in jukeboxList)
            {
                var album = await _context.Albums.SingleOrDefaultAsync(a => a.Id == jukebox.AlbumId);
                totalHoursListened += album.Duration;
            }

            return Ok(totalHoursListened);
        }

        [HttpGet("getWeeklyHoursListened/{userId}")]
        public async Task<IActionResult> GetWeeklyHoursListened(string userId)
        {
            var weekAgo = DateOnly.FromDateTime(DateTime.Now.AddDays(-7));

            var jukeboxList = await _context.JukeboxList
                .Where(j => j.UserId == userId && j.DateAdded >= weekAgo)
                .ToListAsync();

            var totalHoursListened = 0;

            foreach (var jukebox in jukeboxList)
            {
                var album = await _context.Albums.SingleOrDefaultAsync(a => a.Id == jukebox.AlbumId);
                totalHoursListened += album.Duration;
            }

            return Ok(totalHoursListened);
        }
    }
}
