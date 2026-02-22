using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ManelTravel.API.Models
{
    public class FlightBooking
    {
        [Key]
        public int FlightBookingId { get; set; }

        public DateTime BookingDate { get; set; } = DateTime.Now;

        [Required, MaxLength(20)]
        public string Status { get; set; } = "Confirmed"; // Confirmed, Cancelled

        [MaxLength(20)]
        public string CountryCode { get; set; } = "+94";

        [MaxLength(20)]
        public string MobileNumber { get; set; } = string.Empty;

        [MaxLength(100)]
        public string ContactEmail { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        // Foreign Keys
        public int CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        public Customer? Customer { get; set; }

        public int FlightId { get; set; }

        [ForeignKey("FlightId")]
        public Flight? Flight { get; set; }

        // Navigation
        public ICollection<Passenger> Passengers { get; set; } = new List<Passenger>();
    }
}
