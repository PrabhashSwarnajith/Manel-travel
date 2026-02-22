using ManelTravel.API.Data;
using ManelTravel.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ManelTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var revenuePrices = await _context.Bookings
                .Where(b => b.Status == "Confirmed" || b.Status == "Completed")
                .Select(b => b.Price)
                .ToListAsync();

            var stats = new DashboardStatsDto
            {
                TotalCustomers = await _context.Customers.CountAsync(),
                TotalBookings = await _context.Bookings.CountAsync(),
                TotalPackages = await _context.TourPackages.CountAsync(),
                TotalRevenue = revenuePrices.Sum()
            };

            return Ok(stats);
        }

        [HttpGet("bookings-by-package")]
        public async Task<IActionResult> GetBookingsByPackage()
        {
            var data = await _context.Bookings
                .Include(b => b.Package)
                .Where(b => b.Package != null)
                .GroupBy(b => b.Package!.PackageName)
                .Select(g => new ChartDataDto
                {
                    Label = g.Key,
                    Value = g.Count()
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("revenue-by-month")]
        public async Task<IActionResult> GetRevenueByMonth()
        {
            var bookings = await _context.Bookings
                .Where(b => b.Status == "Confirmed" || b.Status == "Completed")
                .Select(b => new { b.BookingDate, b.Price })
                .ToListAsync();

            var data = bookings
                .GroupBy(b => new { b.BookingDate.Year, b.BookingDate.Month })
                .Select(g => new ChartDataDto
                {
                    Label = $"{g.Key.Year}-{g.Key.Month:D2}",
                    Value = g.Sum(b => b.Price)
                })
                .OrderBy(d => d.Label)
                .ToList();

            return Ok(data);
        }
    }
}
