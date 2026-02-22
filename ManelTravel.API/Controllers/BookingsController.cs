using ManelTravel.API.Data;
using ManelTravel.API.Models;
using ManelTravel.API.Models.DTOs;
using ManelTravel.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ManelTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ExportService _exportService;
        private readonly EmailService _emailService;

        public BookingsController(AppDbContext context, ExportService exportService, EmailService emailService)
        {
            _context = context;
            _exportService = exportService;
            _emailService = emailService;
        }

        // POST: api/bookings
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateBooking(CreateBookingDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var package = await _context.TourPackages.FindAsync(dto.PackageId);
            if (package == null) return NotFound("Package not found");

            // Check available seats
            if (package.CurrentParticipants + dto.NumberOfParticipants > package.MaxParticipants)
                return BadRequest("Not enough seats available");
            
            var booking = new Booking
            {
                BookingDate = DateTime.Now,
                Status = "Confirmed",
                BookingType = dto.BookingType,
                NumberOfParticipants = dto.NumberOfParticipants,
                Price = package.Price * dto.NumberOfParticipants,
                CustomerId = userId,
                PackageId = dto.PackageId
            };

            // Update package current participants
            package.CurrentParticipants += dto.NumberOfParticipants;

            _context.Bookings.Add(booking);
            _context.TourPackages.Update(package);
            await _context.SaveChangesAsync();

            // Send Email
            var customer = await _context.Customers.FindAsync(userId);
            if (customer != null)
            {
                await _emailService.SendEmailAsync(
                    customer.Email,
                    "Booking Confirmed!",
                    $"Your booking for {package.PackageName} has been confirmed. Booking ID: {booking.BookingId}"
                );
            }

            return Ok(new { bookingId = booking.BookingId, message = "Booking created successfully" });
        }

        // GET: api/bookings/my-bookings
        [HttpGet("my-bookings")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetMyBookingsList()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var bookings = await _context.Bookings
                .Include(b => b.Package)
                .Where(b => b.CustomerId == userId)
                .OrderByDescending(b => b.BookingDate)
                .Select(b => new BookingDto
                {
                    BookingId = b.BookingId,
                    BookingDate = b.BookingDate,
                    Status = b.Status,
                    BookingType = b.BookingType,
                    NumberOfParticipants = b.NumberOfParticipants,
                    CustomerId = b.CustomerId,
                    PackageId = b.PackageId,
                    PackageInfo = b.Package != null ? b.Package.PackageName : "Unknown",
                    Price = b.Price,
                    CustomerName = "Me"
                })
                .ToListAsync();

            return Ok(bookings);
        }

        // GET: api/bookings (Admin)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetAllBookings()
        {
            var bookings = await _context.Bookings
                .Include(b => b.Package)
                .Include(b => b.Customer)
                .OrderByDescending(b => b.BookingDate)
                .Select(b => new BookingDto
                {
                    BookingId = b.BookingId,
                    BookingDate = b.BookingDate,
                    Status = b.Status,
                    BookingType = b.BookingType,
                    NumberOfParticipants = b.NumberOfParticipants,
                    CustomerId = b.CustomerId,
                    CustomerName = b.Customer != null ? $"{b.Customer.FirstName} {b.Customer.LastName}" : "Unknown",
                    PackageId = b.PackageId,
                    PackageInfo = b.Package != null ? b.Package.PackageName : "Unknown",
                    Price = b.Price
                })
                .ToListAsync();

            return Ok(bookings);
        }

        // PUT: api/bookings/{id}/status (Admin)
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var booking = await _context.Bookings.Include(b => b.Customer).Include(b => b.Package).FirstOrDefaultAsync(b => b.BookingId == id);
            if (booking == null) return NotFound();

            booking.Status = status;
            await _context.SaveChangesAsync();

            if (booking.Customer != null)
            {
                await _emailService.SendEmailAsync(booking.Customer.Email, "Booking Status Update", 
                    $"Your booking for {booking.Package?.PackageName} is now {status}.");
            }

            return Ok();
        }

        // PUT: api/bookings/{id}/cancel (Customer)
        [HttpPut("{id}/cancel")]
        [Authorize]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var booking = await _context.Bookings.Include(b => b.Package).FirstOrDefaultAsync(b => b.BookingId == id);
            if (booking == null) return NotFound();

            // Only the booking owner can cancel
            if (booking.CustomerId != userId) return Forbid();

            // Only pending or confirmed bookings can be cancelled
            if (booking.Status != "Pending" && booking.Status != "Confirmed")
                return BadRequest("Only pending or confirmed bookings can be cancelled");

            booking.Status = "Cancelled";

            // Restore available seats
            if (booking.Package != null)
            {
                booking.Package.CurrentParticipants -= booking.NumberOfParticipants;
                if (booking.Package.CurrentParticipants < 0) booking.Package.CurrentParticipants = 0;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Booking cancelled successfully" });
        }

        // DELETE: api/bookings/{id} (Admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound();
            
            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
            return Ok();
        }


        // GET: api/bookings/export/pdf
        [HttpGet("export/pdf")]
        [Authorize]
        public async Task<IActionResult> ExportPdf()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var isAdmin = User.IsInRole("Admin");

            IQueryable<Booking> query = _context.Bookings.Include(b => b.Package).Include(b => b.Customer);

            if (!isAdmin)
            {
                query = query.Where(b => b.CustomerId == userId);
            }

            var bookings = await query.ToListAsync();
            var pdfBytes = _exportService.ExportBookingsToPdf(bookings);

            return File(pdfBytes, "application/pdf", "bookings_report.pdf");
        }

        // GET: api/bookings/export/excel
        [HttpGet("export/excel")]
        [Authorize]
        public async Task<IActionResult> ExportExcel()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var isAdmin = User.IsInRole("Admin");

            IQueryable<Booking> query = _context.Bookings.Include(b => b.Package).Include(b => b.Customer);

            if (!isAdmin)
            {
                query = query.Where(b => b.CustomerId == userId);
            }

            var bookings = await query.ToListAsync();
            var excelBytes = _exportService.ExportBookingsToExcel(bookings);

            return File(excelBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "bookings_report.xlsx");
        }
    }
}
