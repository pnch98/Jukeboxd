using Jukeboxd.Data;
using Jukeboxd.DTO;
using Jukeboxd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jukeboxd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AlbumController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AlbumController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("saveAlbum")]
        public async Task<IActionResult> SaveAlbum([FromBody] AlbumModel album)
        {
            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }

            var albumDb = await _context.Albums.FindAsync(album.Id);

            if (albumDb == null)
            {
                Album newAlbum = new Album
                {
                    Id = album.Id,
                    Name = album.Name,
                    Image = album.Image,
                    Artist = album.Artist,
                    ReleaseDate = album.ReleaseDate,
                    Popularity = album.Popularity,
                    Href = album.Href,
                    Duration = album.Duration,
                };

                _context.Albums.Add(newAlbum);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpGet("getSavedAlbums/{userId}")]
        public async Task<IActionResult> GetSavedAlbums(string userId)
        {
            var albums = await _context.SavedList.Where(s => s.UserId == userId).Select(s => s.Album).ToListAsync();

            return Ok(albums);
        }

        [HttpGet("getJukeboxAlbums/{userId}")]
        public async Task<IActionResult> GetJukeboxAlbums(string userId)
        {
            var albums = await _context.JukeboxList.Where(j => j.UserId == userId).Select(j => j.Album).ToListAsync();

            return Ok(albums);
        }

        [HttpGet("getRandomAlbums")]
        public async Task<IActionResult> GetRandomAlbums()
        {
            var albums = await _context.Albums.OrderBy(a => Guid.NewGuid()).Take(4).ToListAsync();

            return Ok(albums);
        }

    }
}
