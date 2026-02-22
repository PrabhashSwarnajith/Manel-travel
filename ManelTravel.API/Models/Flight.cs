using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ManelTravel.API.Models
{
    public class Flight
    {
        [Key]
        public int FlightId { get; set; }

        [Required, MaxLength(20)]
        public string FlightNumber { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Airline { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Origin { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Destination { get; set; } = string.Empty;

        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [MaxLength(20)]
        public string Class { get; set; } = "Economy"; // Economy, Business, First

        public int AvailableSeats { get; set; } = 100;

        [MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        // Navigation
        public ICollection<FlightBooking> FlightBookings { get; set; } = new List<FlightBooking>();
    }
}
