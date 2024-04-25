using Jukeboxd.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jukeboxd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public EventController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("getArtistEvents/{artistId}")]
        public async Task<IActionResult> GetArtistEvents(string artistId)
        {
            var events = await _context.Events
                .Where(e => e.ArtistId == artistId && e.Date > DateTime.Now)
                .ToListAsync();

            return Ok(events);
        }

        [HttpGet("getUpcomingEvents")]
        public async Task<IActionResult> GetUpcomingEvents()
        {
            var events = await _context.Events
                .Include(e => e.Artist)
                .Where(e => e.Date > DateTime.Now)
                .OrderBy(e => e.Date)
                .Take(4)
                .Select(e => new
                {
                    Id = e.Id,
                    City = e.City,
                    Venue = e.Venue,
                    Date = e.Date,
                    Artist = e.Artist.Name
                })
                .ToListAsync();

            return Ok(events);
        }

        [HttpGet("getEvent/{eventId}")]
        public async Task<IActionResult> GetEvent(int eventId)
        {
            var selectedEvent = await _context.Events
                .Include(e => e.Artist)
                .Select(e => new
                {
                    e.Id,
                    e.City,
                    e.Venue,
                    e.Date,
                    e.Price,
                    e.IsSoldOut,
                    Artist = new
                    {
                        e.Artist.Id,
                        e.Artist.Name,
                        e.Artist.Image,
                        e.Artist.Popularity,
                        e.Artist.Followers,
                        e.Artist.Genres
                    }
                })
                .FirstOrDefaultAsync(e => e.Id == eventId);

            if (selectedEvent == null)
            {
                return NotFound();
            }

            var otherEvents = await _context.Events
                .Where(e => e.Artist.Id == selectedEvent.Artist.Id && e.Id != eventId)
                .OrderBy(e => e.Date)
                .Select(e => new
                {
                    e.Id,
                    e.City,
                    e.Venue,
                    e.Date,
                    Artist = new
                    {
                        Id = e.ArtistId,
                        Name = e.Artist.Name,
                    }
                })
                .ToListAsync();

            var result = new
            {
                Event = selectedEvent,
                OtherEvents = otherEvents
            };

            return Ok(result);
        }


        [HttpGet("searchEvents")]
        public async Task<IActionResult> SearchEvents(string artistName = "", string city = "")
        {
            var events = _context.Events.AsQueryable();

            if (!string.IsNullOrEmpty(artistName))
            {
                events = events.Include(e => e.Artist)
                    .Where(e => e.Artist.Name.ToLower().Contains(artistName.ToLower()));
            }

            if (!string.IsNullOrEmpty(city))
            {
                events = events.Where(e => e.City.ToLower().Contains(city.ToLower()));
            }

            var result = await events
                .Select(e => new
                {
                    Id = e.Id,
                    City = e.City,
                    Venue = e.Venue,
                    Date = e.Date,
                    Artist = new
                    {
                        Id = e.ArtistId,
                        Name = e.Artist.Name,
                    }
                })
                .ToListAsync();

            return Ok(result);
        }

    }
}
