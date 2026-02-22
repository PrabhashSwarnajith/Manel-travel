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
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;

        public NotificationsController(AppDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // GET: api/notifications/my
        [HttpGet("my")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetMyNotifications()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "Customer";

            return await _context.Notifications
                .Where(n => n.UserId == userId && n.UserType == userRole)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NotificationDto
                {
                    NotificationId = n.NotificationId,
                    Message = n.Message,
                    CreatedAt = n.CreatedAt,
                    IsRead = n.IsRead
                })
                .ToListAsync();
        }

        // PUT: api/notifications/{id}/read
        [HttpPut("{id}/read")]
        [Authorize]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null) return NotFound();

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "Customer";

            if (notification.UserId != userId || notification.UserType != userRole) return Forbid();

            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return Ok();
        }

        // POST: api/notifications/send (Admin)
        [HttpPost("send")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SendNotification(CreateNotificationDto dto)
        {
            if (string.IsNullOrEmpty(dto.UserType)) dto.UserType = "Customer";

            List<string> emailAddresses = new List<string>();

            if (dto.UserId == 0)
            {
                // Send to all users of the specified type
                if (dto.UserType == "Customer")
                {
                    var allUsers = await _context.Customers.ToListAsync();
                    foreach (var user in allUsers)
                    {
                        _context.Notifications.Add(new Notification
                        {
                            UserId = user.CusId,
                            UserType = "Customer",
                            Message = dto.Message,
                            CreatedAt = DateTime.Now
                        });
                        emailAddresses.Add(user.Email);
                    }
                }
                else if (dto.UserType == "Admin")
                {
                    var allAdmins = await _context.Admins.ToListAsync();
                    foreach (var admin in allAdmins)
                    {
                        _context.Notifications.Add(new Notification
                        {
                            UserId = admin.AdminId,
                            UserType = "Admin",
                            Message = dto.Message,
                            CreatedAt = DateTime.Now
                        });
                        emailAddresses.Add(admin.Email);
                    }
                }
            }
            else
            {
                // Send to specific user
                string email = "";
                if (dto.UserType == "Customer")
                {
                    var customer = await _context.Customers.FindAsync(dto.UserId);
                    if (customer != null) email = customer.Email;
                }
                else if (dto.UserType == "Admin")
                {
                    var admin = await _context.Admins.FindAsync(dto.UserId);
                    if (admin != null) email = admin.Email;
                }

                _context.Notifications.Add(new Notification
                {
                    UserId = dto.UserId,
                    UserType = dto.UserType,
                    Message = dto.Message,
                    CreatedAt = DateTime.Now
                });

                if (!string.IsNullOrEmpty(email)) emailAddresses.Add(email);
            }

            await _context.SaveChangesAsync();

            // Send emails
            foreach (var email in emailAddresses)
            {
                await _emailService.SendEmailAsync(email, "Manel Travel Notification", dto.Message);
            }

            return Ok();
        }
    }
}
