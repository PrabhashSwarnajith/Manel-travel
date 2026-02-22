using ManelTravel.API.Data;
using ManelTravel.API.Models;
using ManelTravel.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ManelTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/reviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviews()
        {
            return await _context.Reviews
                .Include(r => r.Customer)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto
                {
                    ReviewId = r.ReviewId,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    CustomerName = r.Customer != null ? r.Customer.FirstName : "Anonymous",
                    CustomerId = r.CustomerId
                })
                .ToListAsync();
        }

        // GET: api/reviews/package/{packageId}
        [HttpGet("package/{packageId}")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviewsByPackage(int packageId)
        {
            return await _context.Reviews
                .Include(r => r.Customer)
                .Where(r => r.PackageId == packageId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto
                {
                    ReviewId = r.ReviewId,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    CustomerName = r.Customer != null ? r.Customer.FirstName : "Anonymous",
                    CustomerId = r.CustomerId
                })
                .ToListAsync();
        }

        // POST: api/reviews
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddReview(CreateReviewDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            // Check if package exists
            var package = await _context.TourPackages.FindAsync(dto.PackageId);
            if (package == null) return NotFound("Package not found");

            var review = new Review
            {
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.Now,
                CustomerId = userId,
                PackageId = dto.PackageId
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/reviews/{id} (Admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound();

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
