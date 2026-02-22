using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ManelTravel.API.Models
{
    public class Review
    {
        [Key]
        public int ReviewId { get; set; }

        [Required, Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(500)]
        public string Comment { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Foreign Keys
        public int CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        public Customer? Customer { get; set; }

        public int PackageId { get; set; }

        [ForeignKey("PackageId")]
        public TourPackage? Package { get; set; }
    }
}
