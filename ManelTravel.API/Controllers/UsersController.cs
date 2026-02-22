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
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetAllUsers()
        {
            return await _context.Customers
                .Select(c => new CustomerDto
                {
                    CusId = c.CusId,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Email = c.Email,
                    TeleNo = c.TeleNo,
                    NIC = c.NIC,
                    Status = "Active" // Hardcoded for now, or add Status to Customer model
                })
                .ToListAsync();
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Customers.FindAsync(id);
            if (user == null) return NotFound();

            // Handle related data (Bookings, Reviews)
            // They have Restrict delete behavior, so we might need to delete them first
            var bookings = _context.Bookings.Where(b => b.CustomerId == id);
            _context.Bookings.RemoveRange(bookings);

            var reviews = _context.Reviews.Where(r => r.CustomerId == id);
            _context.Reviews.RemoveRange(reviews);

            _context.Customers.Remove(user);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
