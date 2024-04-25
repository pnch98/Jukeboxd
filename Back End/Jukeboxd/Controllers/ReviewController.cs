using Jukeboxd.Data;
using Jukeboxd.DTO;
using Jukeboxd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jukeboxd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ReviewController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ReviewController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("addReview")]
        public async Task<IActionResult> AddReview([FromBody] ReviewModel review)
        {
            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }

            var reviewDb = await _context.Reviews.SingleOrDefaultAsync(r => r.UserId == review.UserId && r.AlbumId == review.AlbumId);

            if (reviewDb == null)
            {
                Review newReview = new Review
                {
                    UserId = review.UserId,
                    AlbumId = review.AlbumId,
                    Rating = review.Rating,
                    Comment = review.Comment,
                };

                _context.Reviews.Add(newReview);
                await _context.SaveChangesAsync();
            }
            else
            {
                reviewDb.Rating = review.Rating;
                reviewDb.Comment = review.Comment;

                _context.Reviews.Update(reviewDb);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpGet("getReviews/{albumId}")]
        public async Task<IActionResult> GetReviews(string albumId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.AlbumId == albumId)
                .Include(r => r.User)
                .Select(r => new
                {
                    ReviewId = r.Id,
                    Comment = r.Comment,
                    Rating = r.Rating,
                    Username = r.User.Username
                })
                .ToListAsync();

            return Ok(reviews);
        }


        [HttpGet("getAlbumRating/{albumId}")]
        public async Task<IActionResult> GetAlbumRating(string albumId)
        {
            var reviews = await _context.Reviews.Where(r => r.AlbumId == albumId).ToListAsync();

            if (reviews.Count == 0)
            {
                return Ok(0);
            }

            double rating = 0;

            foreach (var review in reviews)
            {
                rating += review.Rating;
            }

            rating /= reviews.Count;

            return Ok(rating);
        }

        [HttpGet("getUserReview/{userId}/{albumId}")]
        public async Task<IActionResult> GetUserReview(string userId, string albumId)
        {
            var review = await _context.Reviews.SingleOrDefaultAsync(r => r.UserId == userId && r.AlbumId == albumId);

            return Ok(review);
        }

        [HttpGet("getAllUserReviews/{userId}")]
        public async Task<IActionResult> GetUsersReviews(string userId)
        {
            var reviews = await _context.Reviews.Where(r => r.UserId == userId).ToListAsync();

            return Ok(reviews);
        }
    }
}
