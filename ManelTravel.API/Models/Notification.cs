using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ManelTravel.API.Models
{
    public class Notification
    {
        [Key]
        public int NotificationId { get; set; }

        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool IsRead { get; set; } = false;

        [Required]
        public string UserType { get; set; } = "Customer"; // "Customer" or "Admin"

        public int UserId { get; set; } // ID of the user (Customer.CusId or Admin.AdminId)

        // Navigation properties (optional, for EF)
        // [ForeignKey("UserId")]
        // public Customer? Customer { get; set; }

        // [ForeignKey("UserId")]
        // public Admin? Admin { get; set; }
    }
}
