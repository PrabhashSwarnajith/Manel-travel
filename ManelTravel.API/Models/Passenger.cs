using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ManelTravel.API.Models
{
    public class Passenger
    {
        [Key]
        public int PassengerId { get; set; }

        [Required, MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Surname { get; set; } = string.Empty;

        [MaxLength(20)]
        public string AgeCategory { get; set; } = "Adult"; // Adult, Child, Infant

        [MaxLength(50)]
        public string Nationality { get; set; } = string.Empty;

        [MaxLength(10)]
        public string Gender { get; set; } = string.Empty;

        public DateTime? DateOfBirth { get; set; }

        [MaxLength(30)]
        public string PassportNumber { get; set; } = string.Empty;

        public DateTime? PassportExpiry { get; set; }

        public bool NoExpiration { get; set; } = false;

        // Foreign Key
        public int FlightBookingId { get; set; }

        [ForeignKey("FlightBookingId")]
        public FlightBooking? FlightBooking { get; set; }
    }
}
