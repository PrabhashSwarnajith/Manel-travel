using System.ComponentModel.DataAnnotations;

namespace ManelTravel.API.Models.DTOs
{
    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string NIC { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string TeleNo { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public string Password { get; set; } = string.Empty;
    }
    
    public class UserDto
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
    }

    public class DashboardStatsDto
    {
        public int TotalCustomers { get; set; }
        public int TotalBookings { get; set; }
        public int TotalPackages { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    public class ChartDataDto
    {
        public string Label { get; set; } = string.Empty;
        public decimal Value { get; set; }
    }

    public class PackageDto
    {
        public int PackageId { get; set; }
        public string PackageName { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Duration { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Price { get; set; }
        public int MaxParticipants { get; set; }
        public int CurrentParticipants { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Itinerary { get; set; } = string.Empty;
    }

    public class CreatePackageDto
    {
        [Required]
        public string PackageName { get; set; } = string.Empty;
        [Required]
        public string Destination { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;
        [Required]
        public int Duration { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public int MaxParticipants { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Itinerary { get; set; } = string.Empty;
    }

    public class UpdatePackageDto
    {
        [Required]
        public string PackageName { get; set; } = string.Empty;
        [Required]
        public string Destination { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;
        [Required]
        public int Duration { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public int MaxParticipants { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Itinerary { get; set; } = string.Empty;
    }

    public class BookingDto
    {
        public int BookingId { get; set; }
        public DateTime BookingDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string BookingType { get; set; } = "Homage";
        public int NumberOfParticipants { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public int PackageId { get; set; }
        public string PackageInfo { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }

    public class CreateBookingDto
    {
        public int PackageId { get; set; }
        public string BookingType { get; set; } = "Homage";
        public int NumberOfParticipants { get; set; }
    }

    public class ReviewDto
    {
        public int ReviewId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public int CustomerId { get; set; }
        public int PackageId { get; set; }
    }

    public class CreateReviewDto
    {
        public int PackageId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
    }
    
    public class NotificationDto
    {
        public int NotificationId { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; }
    }

    public class CreateNotificationDto
    {
        public int UserId { get; set; } // 0 for all users? Or specific.
        public string UserType { get; set; } = "Customer"; // "Customer" or "Admin"
        public string Message { get; set; } = string.Empty;
    }
    
    public class CustomerDto
    {
        public int CusId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string TeleNo { get; set; } = string.Empty;
        public string NIC { get; set; } = string.Empty;
        public string Status { get; set; } = "Active"; 
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int UserId { get; set; }
    }

    // ── Flight DTOs ──
    public class FlightDto
    {
        public int FlightId { get; set; }
        public string FlightNumber { get; set; } = string.Empty;
        public string Airline { get; set; } = string.Empty;
        public string Origin { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public decimal Price { get; set; }
        public string Class { get; set; } = "Economy";
        public int AvailableSeats { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }

    public class CreateFlightDto
    {
        [Required] public string FlightNumber { get; set; } = string.Empty;
        [Required] public string Airline { get; set; } = string.Empty;
        [Required] public string Origin { get; set; } = string.Empty;
        [Required] public string Destination { get; set; } = string.Empty;
        [Required] public DateTime DepartureTime { get; set; }
        [Required] public DateTime ArrivalTime { get; set; }
        [Required] public decimal Price { get; set; }
        public string Class { get; set; } = "Economy";
        public int AvailableSeats { get; set; } = 100;
        public string ImageUrl { get; set; } = string.Empty;
    }

    public class PassengerDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string AgeCategory { get; set; } = "Adult";
        public string Nationality { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public string PassportNumber { get; set; } = string.Empty;
        public DateTime? PassportExpiry { get; set; }
        public bool NoExpiration { get; set; } = false;
    }

    public class CreateFlightBookingDto
    {
        public int FlightId { get; set; }
        public string CountryCode { get; set; } = "+94";
        public string MobileNumber { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public List<PassengerDto> Passengers { get; set; } = new();
    }

    public class FlightBookingDto
    {
        public int FlightBookingId { get; set; }
        public DateTime BookingDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;

        // Flight info
        public int FlightId { get; set; }
        public string FlightNumber { get; set; } = string.Empty;
        public string Airline { get; set; } = string.Empty;
        public string Origin { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }

        public List<PassengerDto> Passengers { get; set; } = new();
    }
}
