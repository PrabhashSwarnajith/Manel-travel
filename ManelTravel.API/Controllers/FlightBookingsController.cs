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
    [Authorize]
    public class FlightBookingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ExportService _exportService;

        public FlightBookingsController(AppDbContext context, ExportService exportService)
        {
            _context = context;
            _exportService = exportService;
        }

        // POST: api/flightbookings
        [HttpPost]
        public async Task<IActionResult> CreateBooking(CreateFlightBookingDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var flight = await _context.Flights.FindAsync(dto.FlightId);
            if (flight == null) return NotFound("Flight not found");

            if (dto.Passengers.Count == 0)
                return BadRequest("At least one passenger is required");

            if (flight.AvailableSeats < dto.Passengers.Count)
                return BadRequest("Not enough seats available");

            var totalPrice = flight.Price * dto.Passengers.Count;

            var booking = new FlightBooking
            {
                BookingDate = DateTime.Now,
                Status = "Confirmed",
                CountryCode = dto.CountryCode,
                MobileNumber = dto.MobileNumber,
                ContactEmail = dto.ContactEmail,
                TotalPrice = totalPrice,
                CustomerId = userId,
                FlightId = dto.FlightId
            };

            // Add passengers
            foreach (var p in dto.Passengers)
            {
                booking.Passengers.Add(new Passenger
                {
                    FirstName = p.FirstName,
                    Surname = p.Surname,
                    AgeCategory = p.AgeCategory,
                    Nationality = p.Nationality,
                    Gender = p.Gender,
                    DateOfBirth = p.DateOfBirth,
                    PassportNumber = p.PassportNumber,
                    PassportExpiry = p.PassportExpiry,
                    NoExpiration = p.NoExpiration
                });
            }

            flight.AvailableSeats -= dto.Passengers.Count;

            _context.FlightBookings.Add(booking);
            await _context.SaveChangesAsync();

            return Ok(new { flightBookingId = booking.FlightBookingId, message = "Flight booked successfully" });
        }

        // GET: api/flightbookings/my
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<FlightBookingDto>>> GetMyBookings()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var bookings = await _context.FlightBookings
                .Include(fb => fb.Flight)
                .Include(fb => fb.Passengers)
                .Where(fb => fb.CustomerId == userId)
                .OrderByDescending(fb => fb.BookingDate)
                .ToListAsync();

            var result = bookings.Select(MapToDto).ToList();
            return Ok(result);
        }

        // GET: api/flightbookings (Admin – all bookings)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<FlightBookingDto>>> GetAllBookings()
        {
            var bookings = await _context.FlightBookings
                .Include(fb => fb.Flight)
                .Include(fb => fb.Customer)
                .Include(fb => fb.Passengers)
                .OrderByDescending(fb => fb.BookingDate)
                .ToListAsync();

            var result = bookings.Select(MapToDto).ToList();
            return Ok(result);
        }

        // PUT: api/flightbookings/{id}/cancel
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var booking = await _context.FlightBookings
                .Include(fb => fb.Flight)
                .Include(fb => fb.Passengers)
                .FirstOrDefaultAsync(fb => fb.FlightBookingId == id);

            if (booking == null) return NotFound();
            if (booking.CustomerId != userId && !User.IsInRole("Admin"))
                return Forbid();
            if (booking.Status == "Cancelled")
                return BadRequest("Booking already cancelled");

            booking.Status = "Cancelled";

            // Restore seats
            if (booking.Flight != null)
            {
                booking.Flight.AvailableSeats += booking.Passengers.Count;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Flight booking cancelled" });
        }

        // DELETE: api/flightbookings/{id} (Admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.FlightBookings.FindAsync(id);
            if (booking == null) return NotFound();

            _context.FlightBookings.Remove(booking);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // GET: api/flightbookings/{id}/ticket
        [HttpGet("{id}/ticket")]
        public async Task<IActionResult> DownloadTicket(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var isAdmin = User.IsInRole("Admin");

            var booking = await _context.FlightBookings
                .Include(fb => fb.Flight)
                .Include(fb => fb.Customer)
                .Include(fb => fb.Passengers)
                .FirstOrDefaultAsync(fb => fb.FlightBookingId == id);

            if (booking == null) return NotFound();
            if (booking.CustomerId != userId && !isAdmin)
                return Forbid();

            var pdfBytes = _exportService.GenerateFlightTicket(booking);
            return File(pdfBytes, "application/pdf", $"Ticket_{booking.Flight?.FlightNumber}_{booking.FlightBookingId}.pdf");
        }

        private static FlightBookingDto MapToDto(FlightBooking fb)
        {
            return new FlightBookingDto
            {
                FlightBookingId = fb.FlightBookingId,
                BookingDate = fb.BookingDate,
                Status = fb.Status,
                TotalPrice = fb.TotalPrice,
                CustomerId = fb.CustomerId,
                CustomerName = fb.Customer != null ? $"{fb.Customer.FirstName} {fb.Customer.LastName}" : "Me",
                FlightId = fb.FlightId,
                FlightNumber = fb.Flight?.FlightNumber ?? "",
                Airline = fb.Flight?.Airline ?? "",
                Origin = fb.Flight?.Origin ?? "",
                Destination = fb.Flight?.Destination ?? "",
                DepartureTime = fb.Flight?.DepartureTime ?? DateTime.MinValue,
                ArrivalTime = fb.Flight?.ArrivalTime ?? DateTime.MinValue,
                Passengers = fb.Passengers.Select(p => new PassengerDto
                {
                    FirstName = p.FirstName,
                    Surname = p.Surname,
                    AgeCategory = p.AgeCategory,
                    Nationality = p.Nationality,
                    Gender = p.Gender,
                    DateOfBirth = p.DateOfBirth,
                    PassportNumber = p.PassportNumber,
                    PassportExpiry = p.PassportExpiry,
                    NoExpiration = p.NoExpiration
                }).ToList()
            };
        }
    }
}
