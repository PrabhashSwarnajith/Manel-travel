using ManelTravel.API.Data;
using ManelTravel.API.Models;
using ManelTravel.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ManelTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FlightsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/flights (Public – browse available flights)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FlightDto>>> GetFlights(
            [FromQuery] string? origin,
            [FromQuery] string? destination,
            [FromQuery] string? airline,
            [FromQuery] string? flightClass,
            [FromQuery] DateTime? date)
        {
            var query = _context.Flights.AsQueryable();

            if (!string.IsNullOrEmpty(origin))
                query = query.Where(f => f.Origin.Contains(origin));
            if (!string.IsNullOrEmpty(destination))
                query = query.Where(f => f.Destination.Contains(destination));
            if (!string.IsNullOrEmpty(airline))
                query = query.Where(f => f.Airline.Contains(airline));
            if (!string.IsNullOrEmpty(flightClass))
                query = query.Where(f => f.Class == flightClass);
            if (date.HasValue)
                query = query.Where(f => f.DepartureTime.Date == date.Value.Date);

            var flights = await query
                .OrderBy(f => f.DepartureTime)
                .Select(f => new FlightDto
                {
                    FlightId = f.FlightId,
                    FlightNumber = f.FlightNumber,
                    Airline = f.Airline,
                    Origin = f.Origin,
                    Destination = f.Destination,
                    DepartureTime = f.DepartureTime,
                    ArrivalTime = f.ArrivalTime,
                    Price = f.Price,
                    Class = f.Class,
                    AvailableSeats = f.AvailableSeats,
                    ImageUrl = f.ImageUrl
                })
                .ToListAsync();

            return Ok(flights);
        }

        // GET: api/flights/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<FlightDto>> GetFlight(int id)
        {
            var f = await _context.Flights.FindAsync(id);
            if (f == null) return NotFound();

            return Ok(new FlightDto
            {
                FlightId = f.FlightId,
                FlightNumber = f.FlightNumber,
                Airline = f.Airline,
                Origin = f.Origin,
                Destination = f.Destination,
                DepartureTime = f.DepartureTime,
                ArrivalTime = f.ArrivalTime,
                Price = f.Price,
                Class = f.Class,
                AvailableSeats = f.AvailableSeats,
                ImageUrl = f.ImageUrl
            });
        }

        // POST: api/flights (Admin)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateFlight(CreateFlightDto dto)
        {
            var flight = new Flight
            {
                FlightNumber = dto.FlightNumber,
                Airline = dto.Airline,
                Origin = dto.Origin,
                Destination = dto.Destination,
                DepartureTime = dto.DepartureTime,
                ArrivalTime = dto.ArrivalTime,
                Price = dto.Price,
                Class = dto.Class,
                AvailableSeats = dto.AvailableSeats,
                ImageUrl = dto.ImageUrl
            };

            _context.Flights.Add(flight);
            await _context.SaveChangesAsync();

            return Ok(new { flightId = flight.FlightId, message = "Flight created successfully" });
        }

        // PUT: api/flights/{id} (Admin)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateFlight(int id, CreateFlightDto dto)
        {
            var flight = await _context.Flights.FindAsync(id);
            if (flight == null) return NotFound();

            flight.FlightNumber = dto.FlightNumber;
            flight.Airline = dto.Airline;
            flight.Origin = dto.Origin;
            flight.Destination = dto.Destination;
            flight.DepartureTime = dto.DepartureTime;
            flight.ArrivalTime = dto.ArrivalTime;
            flight.Price = dto.Price;
            flight.Class = dto.Class;
            flight.AvailableSeats = dto.AvailableSeats;
            flight.ImageUrl = dto.ImageUrl;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Flight updated successfully" });
        }

        // DELETE: api/flights/{id} (Admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteFlight(int id)
        {
            var flight = await _context.Flights.Include(f => f.FlightBookings).FirstOrDefaultAsync(f => f.FlightId == id);
            if (flight == null) return NotFound();

            if (flight.FlightBookings.Any())
                return BadRequest("Cannot delete a flight that has bookings.");

            _context.Flights.Remove(flight);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Flight deleted successfully" });
        }
    }
}
