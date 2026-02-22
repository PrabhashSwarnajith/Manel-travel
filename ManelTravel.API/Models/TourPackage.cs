using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ManelTravel.API.Models
{
    public class TourPackage
    {
        [Key]
        public int PackageId { get; set; }

        [Required, MaxLength(100)]
        public string PackageName { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Destination { get; set; } = string.Empty;

        [Required, MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public int Duration { get; set; } // in days

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public int MaxParticipants { get; set; }
        public int CurrentParticipants { get; set; } = 0;

        [MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string Itinerary { get; set; } = string.Empty;

        // Navigation property
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
