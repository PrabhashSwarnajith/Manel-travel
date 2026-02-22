using Microsoft.EntityFrameworkCore;
using ManelTravel.API.Models;

namespace ManelTravel.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<TourPackage> TourPackages { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Flight> Flights { get; set; }
        public DbSet<FlightBooking> FlightBookings { get; set; }
        public DbSet<Passenger> Passengers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure unique constraints
            modelBuilder.Entity<Customer>().HasIndex(c => c.Email).IsUnique();
            modelBuilder.Entity<Customer>().HasIndex(c => c.NIC).IsUnique();
            modelBuilder.Entity<Admin>().HasIndex(a => a.Email).IsUnique();

            // Configure relationships
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Customer)
                .WithMany(c => c.Bookings)
                .HasForeignKey(b => b.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Package)
                .WithMany(p => p.Bookings)
                .HasForeignKey(b => b.PackageId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Customer)
                .WithMany(c => c.Reviews)
                .HasForeignKey(r => r.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Package)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.PackageId)
                .OnDelete(DeleteBehavior.Restrict);

            // Flight booking relationships
            modelBuilder.Entity<FlightBooking>()
                .HasOne(fb => fb.Customer)
                .WithMany()
                .HasForeignKey(fb => fb.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<FlightBooking>()
                .HasOne(fb => fb.Flight)
                .WithMany(f => f.FlightBookings)
                .HasForeignKey(fb => fb.FlightId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Passenger>()
                .HasOne(p => p.FlightBooking)
                .WithMany(fb => fb.Passengers)
                .HasForeignKey(p => p.FlightBookingId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure decimal precision
            modelBuilder.Entity<TourPackage>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Booking>()
                .Property(b => b.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Flight>()
                .Property(f => f.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<FlightBooking>()
                .Property(fb => fb.TotalPrice)
                .HasColumnType("decimal(18,2)");

            // Seed Admin data
            modelBuilder.Entity<Admin>().HasData(new Admin
            {
                AdminId = 1,
                FirstName = "System",
                LastName = "Admin",
                Email = "admin@maneltravel.com",
                TeleNo = "0771234567",
                Address = "Colombo, Sri Lanka",
                PasswordHash = BCryptHelper.HashPassword("Admin@123")
            });

            // Seed Customers
            modelBuilder.Entity<Customer>().HasData(
                new Customer { CusId = 1, FirstName = "John", LastName = "Doe", NIC = "901234567V", Email = "john@example.com", TeleNo = "0777123456", Address = "Colombo", PasswordHash = BCryptHelper.HashPassword("User@123") },
                new Customer { CusId = 2, FirstName = "Jane", LastName = "Smith", NIC = "921234567V", Email = "jane@example.com", TeleNo = "0777123457", Address = "Kandy", PasswordHash = BCryptHelper.HashPassword("User@123") },
                new Customer { CusId = 3, FirstName = "Alice", LastName = "Brown", NIC = "951234567V", Email = "alice@example.com", TeleNo = "0777123458", Address = "Galle", PasswordHash = BCryptHelper.HashPassword("User@123") }
            );

            // Seed Tour Package data
            modelBuilder.Entity<TourPackage>().HasData(
                new TourPackage
                {
                    PackageId = 1,
                    PackageName = "Maldives Paradise",
                    Destination = "Male",
                    Description = "Experience the beautiful islands of Maldives with luxury resorts and water activities.",
                    Duration = 5,
                    StartDate = DateTime.Today.AddDays(2),
                    EndDate = DateTime.Today.AddDays(7),
                    Price = 150000,
                    MaxParticipants = 20,
                    CurrentParticipants = 5,
                    ImageUrl = "https://images.unsplash.com/photo-1552733407-5d5c46b3da98?w=500",
                    Itinerary = "Day 1: Arrival and resort check-in\nDay 2: Island hopping and snorkeling\nDay 3: Water sports and spa\nDay 4: Beach relaxation\nDay 5: Departure"
                },
                new TourPackage
                {
                    PackageId = 2,
                    PackageName = "Dubai Desert Adventure",
                    Destination = "Dubai",
                    Description = "Explore the modern city of Dubai with desert safaris, shopping, and cultural experiences.",
                    Duration = 4,
                    StartDate = DateTime.Today.AddDays(5),
                    EndDate = DateTime.Today.AddDays(9),
                    Price = 120000,
                    MaxParticipants = 25,
                    CurrentParticipants = 8,
                    ImageUrl = "https://images.unsplash.com/photo-1512453695041-1e502f3a0ede?w=500",
                    Itinerary = "Day 1: Airport pickup and city tour\nDay 2: Desert safari and BBQ\nDay 3: Gold souq and shopping mall\nDay 4: Departure"
                },
                new TourPackage
                {
                    PackageId = 3,
                    PackageName = "Singapore City Escape",
                    Destination = "Singapore",
                    Description = "Discover the modern city-state with gardens, food, and iconic attractions.",
                    Duration = 3,
                    StartDate = DateTime.Today.AddDays(10),
                    EndDate = DateTime.Today.AddDays(13),
                    Price = 95000,
                    MaxParticipants = 30,
                    CurrentParticipants = 12,
                    ImageUrl = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500",
                    Itinerary = "Day 1: Arrival and Gardens by the Bay\nDay 2: Marina Bay and city exploration\nDay 3: Departure"
                },
                new TourPackage
                {
                    PackageId = 4,
                    PackageName = "London Royal Tour",
                    Destination = "London",
                    Description = "Explore London's rich history, royal palaces, and iconic landmarks.",
                    Duration = 6,
                    StartDate = DateTime.Today.AddDays(15),
                    EndDate = DateTime.Today.AddDays(21),
                    Price = 280000,
                    MaxParticipants = 15,
                    CurrentParticipants = 3,
                    ImageUrl = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500",
                    Itinerary = "Day 1: Big Ben and Parliament\nDay 2: Tower of London\nDay 3: Royal Palaces\nDay 4: Museum tour\nDay 5: West End theatre\nDay 6: Departure"
                },
                new TourPackage
                {
                    PackageId = 5,
                    PackageName = "Bangkok Cultural Journey",
                    Destination = "Bangkok",
                    Description = "Immerse yourself in Thailand's vibrant culture, temples, and cuisine.",
                    Duration = 4,
                    StartDate = DateTime.Today.AddDays(8),
                    EndDate = DateTime.Today.AddDays(12),
                    Price = 85000,
                    MaxParticipants = 20,
                    CurrentParticipants = 10,
                    ImageUrl = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500",
                    Itinerary = "Day 1: Grand Palace and temples\nDay 2: River cruise and floating markets\nDay 3: Street food tour\nDay 4: Departure"
                }
            );

            // Seed Booking data
            modelBuilder.Entity<Booking>().HasData(
                new Booking { BookingId = 1, BookingDate = DateTime.Now.AddDays(-10), Status = "Completed", BookingType = "Homage", NumberOfParticipants = 2, Price = 300000, CustomerId = 1, PackageId = 1 },
                new Booking { BookingId = 2, BookingDate = DateTime.Now.AddDays(-5), Status = "Confirmed", BookingType = "Console", NumberOfParticipants = 1, Price = 120000, CustomerId = 1, PackageId = 2 },
                new Booking { BookingId = 3, BookingDate = DateTime.Now.AddDays(-2), Status = "Pending", BookingType = "Homage", NumberOfParticipants = 3, Price = 285000, CustomerId = 2, PackageId = 3 },
                new Booking { BookingId = 4, BookingDate = DateTime.Now.AddDays(-20), Status = "Cancelled", BookingType = "Homage", NumberOfParticipants = 2, Price = 300000, CustomerId = 2, PackageId = 1 },
                new Booking { BookingId = 5, BookingDate = DateTime.Now.AddDays(-1), Status = "Confirmed", BookingType = "Console", NumberOfParticipants = 1, Price = 280000, CustomerId = 3, PackageId = 4 },
                // Additional bookings for revenue trend data
                new Booking { BookingId = 6, BookingDate = DateTime.Now.AddMonths(-1), Status = "Completed", BookingType = "Homage", NumberOfParticipants = 4, Price = 600000, CustomerId = 1, PackageId = 1 },
                new Booking { BookingId = 7, BookingDate = DateTime.Now.AddMonths(-1).AddDays(-5), Status = "Completed", BookingType = "Console", NumberOfParticipants = 2, Price = 240000, CustomerId = 2, PackageId = 2 },
                new Booking { BookingId = 8, BookingDate = DateTime.Now.AddMonths(-2), Status = "Completed", BookingType = "Homage", NumberOfParticipants = 1, Price = 150000, CustomerId = 3, PackageId = 3 },
                new Booking { BookingId = 9, BookingDate = DateTime.Now.AddMonths(-2).AddDays(-10), Status = "Completed", BookingType = "Console", NumberOfParticipants = 3, Price = 360000, CustomerId = 1, PackageId = 4 },
                new Booking { BookingId = 10, BookingDate = DateTime.Now.AddMonths(-3), Status = "Completed", BookingType = "Homage", NumberOfParticipants = 2, Price = 300000, CustomerId = 2, PackageId = 5 },
                new Booking { BookingId = 11, BookingDate = DateTime.Now.AddMonths(-3).AddDays(-7), Status = "Completed", BookingType = "Console", NumberOfParticipants = 1, Price = 120000, CustomerId = 3, PackageId = 1 },
                new Booking { BookingId = 12, BookingDate = DateTime.Now.AddMonths(-4), Status = "Completed", BookingType = "Homage", NumberOfParticipants = 5, Price = 750000, CustomerId = 1, PackageId = 2 },
                new Booking { BookingId = 13, BookingDate = DateTime.Now.AddMonths(-4).AddDays(-3), Status = "Completed", BookingType = "Console", NumberOfParticipants = 2, Price = 240000, CustomerId = 2, PackageId = 3 },
                new Booking { BookingId = 14, BookingDate = DateTime.Now.AddMonths(-5), Status = "Completed", BookingType = "Homage", NumberOfParticipants = 3, Price = 450000, CustomerId = 3, PackageId = 4 },
                new Booking { BookingId = 15, BookingDate = DateTime.Now.AddMonths(-5).AddDays(-12), Status = "Completed", BookingType = "Console", NumberOfParticipants = 1, Price = 120000, CustomerId = 1, PackageId = 5 },
                new Booking { BookingId = 16, BookingDate = DateTime.Now.AddMonths(-6), Status = "Completed", BookingType = "Homage", NumberOfParticipants = 4, Price = 600000, CustomerId = 2, PackageId = 1 },
                new Booking { BookingId = 17, BookingDate = DateTime.Now.AddMonths(-6).AddDays(-8), Status = "Completed", BookingType = "Console", NumberOfParticipants = 2, Price = 240000, CustomerId = 3, PackageId = 2 },
                new Booking { BookingId = 18, BookingDate = DateTime.Now.AddMonths(-7), Status = "Completed", BookingType = "Homage", NumberOfParticipants = 1, Price = 150000, CustomerId = 1, PackageId = 3 },
                new Booking { BookingId = 19, BookingDate = DateTime.Now.AddMonths(-7).AddDays(-15), Status = "Completed", BookingType = "Console", NumberOfParticipants = 3, Price = 360000, CustomerId = 2, PackageId = 4 },
                new Booking { BookingId = 20, BookingDate = DateTime.Now.AddMonths(-8), Status = "Completed", BookingType = "Homage", NumberOfParticipants = 2, Price = 300000, CustomerId = 3, PackageId = 5 },
                new Booking { BookingId = 21, BookingDate = DateTime.Now.AddMonths(-8).AddDays(-4), Status = "Completed", BookingType = "Console", NumberOfParticipants = 1, Price = 120000, CustomerId = 1, PackageId = 1 },
                new Booking { BookingId = 22, BookingDate = DateTime.Now.AddMonths(-9), Status = "Completed", BookingType = "Homage", NumberOfParticipants = 6, Price = 900000, CustomerId = 2, PackageId = 2 },
                new Booking { BookingId = 23, BookingDate = DateTime.Now.AddMonths(-9).AddDays(-9), Status = "Completed", BookingType = "Console", NumberOfParticipants = 2, Price = 240000, CustomerId = 3, PackageId = 3 },
                new Booking { BookingId = 24, BookingDate = DateTime.Now.AddMonths(-10), Status = "Completed", BookingType = "Homage", NumberOfParticipants = 3, Price = 450000, CustomerId = 1, PackageId = 4 },
                new Booking { BookingId = 25, BookingDate = DateTime.Now.AddMonths(-10).AddDays(-6), Status = "Completed", BookingType = "Console", NumberOfParticipants = 1, Price = 120000, CustomerId = 2, PackageId = 5 },
                new Booking { BookingId = 26, BookingDate = DateTime.Now.AddMonths(-11), Status = "Completed", BookingType = "Homage", NumberOfParticipants = 4, Price = 600000, CustomerId = 3, PackageId = 1 },
                new Booking { BookingId = 27, BookingDate = DateTime.Now.AddMonths(-11).AddDays(-11), Status = "Completed", BookingType = "Console", NumberOfParticipants = 2, Price = 240000, CustomerId = 1, PackageId = 2 },
                new Booking { BookingId = 28, BookingDate = DateTime.Now.AddMonths(-12), Status = "Completed", BookingType = "Homage", NumberOfParticipants = 2, Price = 300000, CustomerId = 2, PackageId = 3 },
                new Booking { BookingId = 29, BookingDate = DateTime.Now.AddMonths(-12).AddDays(-2), Status = "Completed", BookingType = "Console", NumberOfParticipants = 1, Price = 120000, CustomerId = 3, PackageId = 4 }
            );

            // Seed Review data
            modelBuilder.Entity<Review>().HasData(
                new Review { ReviewId = 1, Rating = 5, Comment = "Amazing tour! Best vacation ever!", CreatedAt = DateTime.Now.AddDays(-8), CustomerId = 1, PackageId = 1 },
                new Review { ReviewId = 2, Rating = 4, Comment = "Great experience but could be better organized.", CreatedAt = DateTime.Now.AddDays(-1), CustomerId = 1, PackageId = 2 }
            );

            // Seed Notification data
            modelBuilder.Entity<Notification>().HasData(
                new Notification { NotificationId = 1, Message = "Welcome to Manel Travel! Book your first tour now.", CreatedAt = DateTime.Now.AddDays(-10), IsRead = true, UserId = 1, UserType = "Customer" },
                new Notification { NotificationId = 2, Message = "Special offer: 15% off on all tour packages!", CreatedAt = DateTime.Now.AddDays(-2), IsRead = false, UserId = 1, UserType = "Customer" },
                new Notification { NotificationId = 3, Message = "New flight bookings available. Check your dashboard.", CreatedAt = DateTime.Now.AddDays(-1), IsRead = false, UserId = 1, UserType = "Admin" }
            );

            // Seed Flight data
            modelBuilder.Entity<Flight>().HasData(
                // SriLankan Airlines
                new Flight { FlightId = 1, FlightNumber = "UL101", Airline = "SriLankan Airlines", Origin = "Colombo", Destination = "Dubai", DepartureTime = DateTime.Today.AddDays(3).AddHours(20), ArrivalTime = DateTime.Today.AddDays(3).AddHours(23).AddMinutes(30), Price = 85000, Class = "Economy", AvailableSeats = 120, ImageUrl = "" },
                new Flight { FlightId = 2, FlightNumber = "UL203", Airline = "SriLankan Airlines", Origin = "Colombo", Destination = "Singapore", DepartureTime = DateTime.Today.AddDays(5).AddHours(17).AddMinutes(30), ArrivalTime = DateTime.Today.AddDays(5).AddHours(22).AddMinutes(20), Price = 72000, Class = "Economy", AvailableSeats = 90, ImageUrl = "" },
                new Flight { FlightId = 3, FlightNumber = "UL305", Airline = "SriLankan Airlines", Origin = "Colombo", Destination = "London", DepartureTime = DateTime.Today.AddDays(7).AddHours(6), ArrivalTime = DateTime.Today.AddDays(7).AddHours(17).AddMinutes(30), Price = 195000, Class = "Economy", AvailableSeats = 60, ImageUrl = "" },
                new Flight { FlightId = 4, FlightNumber = "UL402", Airline = "SriLankan Airlines", Origin = "Colombo", Destination = "Bangkok", DepartureTime = DateTime.Today.AddDays(2).AddHours(14).AddMinutes(15), ArrivalTime = DateTime.Today.AddDays(2).AddHours(18).AddMinutes(45), Price = 62000, Class = "Economy", AvailableSeats = 140, ImageUrl = "" },
                new Flight { FlightId = 5, FlightNumber = "UL503", Airline = "SriLankan Airlines", Origin = "Colombo", Destination = "Tokyo", DepartureTime = DateTime.Today.AddDays(8).AddHours(22), ArrivalTime = DateTime.Today.AddDays(9).AddHours(8).AddMinutes(30), Price = 178000, Class = "Economy", AvailableSeats = 55, ImageUrl = "" },
                new Flight { FlightId = 6, FlightNumber = "UL120", Airline = "SriLankan Airlines", Origin = "Colombo", Destination = "Dubai", DepartureTime = DateTime.Today.AddDays(3).AddHours(8), ArrivalTime = DateTime.Today.AddDays(3).AddHours(11).AddMinutes(40), Price = 145000, Class = "Business", AvailableSeats = 24, ImageUrl = "" },
                new Flight { FlightId = 7, FlightNumber = "UL310", Airline = "SriLankan Airlines", Origin = "Colombo", Destination = "London", DepartureTime = DateTime.Today.AddDays(6).AddHours(21), ArrivalTime = DateTime.Today.AddDays(7).AddHours(8), Price = 425000, Class = "Business", AvailableSeats = 18, ImageUrl = "" },

                // Emirates
                new Flight { FlightId = 8, FlightNumber = "EK343", Airline = "Emirates", Origin = "Colombo", Destination = "Dubai", DepartureTime = DateTime.Today.AddDays(2).AddHours(3).AddMinutes(30), ArrivalTime = DateTime.Today.AddDays(2).AddHours(7), Price = 92000, Class = "Economy", AvailableSeats = 200, ImageUrl = "" },
                new Flight { FlightId = 9, FlightNumber = "EK344", Airline = "Emirates", Origin = "Dubai", Destination = "Colombo", DepartureTime = DateTime.Today.AddDays(4).AddHours(9).AddMinutes(15), ArrivalTime = DateTime.Today.AddDays(4).AddHours(15).AddMinutes(30), Price = 88000, Class = "Economy", AvailableSeats = 185, ImageUrl = "" },
                new Flight { FlightId = 10, FlightNumber = "EK650", Airline = "Emirates", Origin = "Dubai", Destination = "London", DepartureTime = DateTime.Today.AddDays(5).AddHours(2), ArrivalTime = DateTime.Today.AddDays(5).AddHours(7).AddMinutes(30), Price = 210000, Class = "Economy", AvailableSeats = 160, ImageUrl = "" },
                new Flight { FlightId = 11, FlightNumber = "EK355", Airline = "Emirates", Origin = "Colombo", Destination = "Dubai", DepartureTime = DateTime.Today.AddDays(6).AddHours(15), ArrivalTime = DateTime.Today.AddDays(6).AddHours(18).AddMinutes(20), Price = 185000, Class = "Business", AvailableSeats = 30, ImageUrl = "" },
                new Flight { FlightId = 12, FlightNumber = "EK512", Airline = "Emirates", Origin = "Dubai", Destination = "New York", DepartureTime = DateTime.Today.AddDays(9).AddHours(8), ArrivalTime = DateTime.Today.AddDays(9).AddHours(21).AddMinutes(45), Price = 340000, Class = "Economy", AvailableSeats = 180, ImageUrl = "" },
                new Flight { FlightId = 13, FlightNumber = "EK001", Airline = "Emirates", Origin = "Colombo", Destination = "Dubai", DepartureTime = DateTime.Today.AddDays(4).AddHours(23).AddMinutes(50), ArrivalTime = DateTime.Today.AddDays(5).AddHours(3).AddMinutes(15), Price = 365000, Class = "First", AvailableSeats = 8, ImageUrl = "" },

                // Air India
                new Flight { FlightId = 14, FlightNumber = "AI502", Airline = "Air India", Origin = "Colombo", Destination = "Mumbai", DepartureTime = DateTime.Today.AddDays(4).AddHours(20), ArrivalTime = DateTime.Today.AddDays(4).AddHours(22).AddMinutes(30), Price = 45000, Class = "Economy", AvailableSeats = 150, ImageUrl = "" },
                new Flight { FlightId = 15, FlightNumber = "AI271", Airline = "Air India", Origin = "Colombo", Destination = "Delhi", DepartureTime = DateTime.Today.AddDays(3).AddHours(6).AddMinutes(30), ArrivalTime = DateTime.Today.AddDays(3).AddHours(10), Price = 52000, Class = "Economy", AvailableSeats = 130, ImageUrl = "" },
                new Flight { FlightId = 16, FlightNumber = "AI285", Airline = "Air India", Origin = "Colombo", Destination = "Chennai", DepartureTime = DateTime.Today.AddDays(1).AddHours(11), ArrivalTime = DateTime.Today.AddDays(1).AddHours(12).AddMinutes(30), Price = 28000, Class = "Economy", AvailableSeats = 170, ImageUrl = "" },
                new Flight { FlightId = 17, FlightNumber = "AI503", Airline = "Air India", Origin = "Mumbai", Destination = "Colombo", DepartureTime = DateTime.Today.AddDays(6).AddHours(8).AddMinutes(45), ArrivalTime = DateTime.Today.AddDays(6).AddHours(11).AddMinutes(15), Price = 42000, Class = "Economy", AvailableSeats = 145, ImageUrl = "" },

                // Singapore Airlines
                new Flight { FlightId = 18, FlightNumber = "SQ468", Airline = "Singapore Airlines", Origin = "Colombo", Destination = "Singapore", DepartureTime = DateTime.Today.AddDays(3).AddHours(23).AddMinutes(45), ArrivalTime = DateTime.Today.AddDays(4).AddHours(6).AddMinutes(15), Price = 95000, Class = "Economy", AvailableSeats = 110, ImageUrl = "" },
                new Flight { FlightId = 19, FlightNumber = "SQ469", Airline = "Singapore Airlines", Origin = "Singapore", Destination = "Colombo", DepartureTime = DateTime.Today.AddDays(7).AddHours(10).AddMinutes(30), ArrivalTime = DateTime.Today.AddDays(7).AddHours(12).AddMinutes(15), Price = 92000, Class = "Economy", AvailableSeats = 100, ImageUrl = "" },
                new Flight { FlightId = 20, FlightNumber = "SQ470", Airline = "Singapore Airlines", Origin = "Colombo", Destination = "Singapore", DepartureTime = DateTime.Today.AddDays(5).AddHours(13), ArrivalTime = DateTime.Today.AddDays(5).AddHours(19).AddMinutes(30), Price = 185000, Class = "Business", AvailableSeats = 20, ImageUrl = "" },

                // Qatar Airways
                new Flight { FlightId = 21, FlightNumber = "QR301", Airline = "Qatar Airways", Origin = "Colombo", Destination = "Doha", DepartureTime = DateTime.Today.AddDays(2).AddHours(1).AddMinutes(30), ArrivalTime = DateTime.Today.AddDays(2).AddHours(5), Price = 98000, Class = "Economy", AvailableSeats = 175, ImageUrl = "" },
                new Flight { FlightId = 22, FlightNumber = "QR302", Airline = "Qatar Airways", Origin = "Doha", Destination = "Colombo", DepartureTime = DateTime.Today.AddDays(8).AddHours(7), ArrivalTime = DateTime.Today.AddDays(8).AddHours(14).AddMinutes(30), Price = 95000, Class = "Economy", AvailableSeats = 160, ImageUrl = "" },
                new Flight { FlightId = 23, FlightNumber = "QR305", Airline = "Qatar Airways", Origin = "Colombo", Destination = "Doha", DepartureTime = DateTime.Today.AddDays(4).AddHours(19), ArrivalTime = DateTime.Today.AddDays(4).AddHours(22).AddMinutes(20), Price = 210000, Class = "Business", AvailableSeats = 16, ImageUrl = "" },
                new Flight { FlightId = 24, FlightNumber = "QR010", Airline = "Qatar Airways", Origin = "Doha", Destination = "London", DepartureTime = DateTime.Today.AddDays(5).AddHours(1), ArrivalTime = DateTime.Today.AddDays(5).AddHours(7).AddMinutes(45), Price = 235000, Class = "Economy", AvailableSeats = 140, ImageUrl = "" },

                // Air Canada
                new Flight { FlightId = 25, FlightNumber = "AC710", Airline = "Air Canada", Origin = "Colombo", Destination = "Toronto", DepartureTime = DateTime.Today.AddDays(10).AddHours(18), ArrivalTime = DateTime.Today.AddDays(11).AddHours(6).AddMinutes(40), Price = 310000, Class = "Economy", AvailableSeats = 40, ImageUrl = "" },

                // Cathay Pacific
                new Flight { FlightId = 26, FlightNumber = "CX610", Airline = "Cathay Pacific", Origin = "Colombo", Destination = "Hong Kong", DepartureTime = DateTime.Today.AddDays(6).AddHours(22).AddMinutes(30), ArrivalTime = DateTime.Today.AddDays(7).AddHours(6).AddMinutes(45), Price = 115000, Class = "Economy", AvailableSeats = 95, ImageUrl = "" },
                new Flight { FlightId = 27, FlightNumber = "CX611", Airline = "Cathay Pacific", Origin = "Hong Kong", Destination = "Colombo", DepartureTime = DateTime.Today.AddDays(12).AddHours(9), ArrivalTime = DateTime.Today.AddDays(12).AddHours(13).AddMinutes(30), Price = 112000, Class = "Economy", AvailableSeats = 88, ImageUrl = "" },

                // Malaysia Airlines
                new Flight { FlightId = 28, FlightNumber = "MH179", Airline = "Malaysia Airlines", Origin = "Colombo", Destination = "Kuala Lumpur", DepartureTime = DateTime.Today.AddDays(4).AddHours(16).AddMinutes(45), ArrivalTime = DateTime.Today.AddDays(4).AddHours(22).AddMinutes(30), Price = 68000, Class = "Economy", AvailableSeats = 135, ImageUrl = "" },
                new Flight { FlightId = 29, FlightNumber = "MH180", Airline = "Malaysia Airlines", Origin = "Kuala Lumpur", Destination = "Colombo", DepartureTime = DateTime.Today.AddDays(9).AddHours(8).AddMinutes(30), ArrivalTime = DateTime.Today.AddDays(9).AddHours(11), Price = 65000, Class = "Economy", AvailableSeats = 128, ImageUrl = "" },

                // Thai Airways
                new Flight { FlightId = 30, FlightNumber = "TG308", Airline = "Thai Airways", Origin = "Colombo", Destination = "Bangkok", DepartureTime = DateTime.Today.AddDays(3).AddHours(9).AddMinutes(45), ArrivalTime = DateTime.Today.AddDays(3).AddHours(14).AddMinutes(30), Price = 75000, Class = "Economy", AvailableSeats = 110, ImageUrl = "" },
                new Flight { FlightId = 31, FlightNumber = "TG309", Airline = "Thai Airways", Origin = "Bangkok", Destination = "Colombo", DepartureTime = DateTime.Today.AddDays(11).AddHours(15), ArrivalTime = DateTime.Today.AddDays(11).AddHours(17).AddMinutes(45), Price = 72000, Class = "Economy", AvailableSeats = 105, ImageUrl = "" },

                // Turkish Airlines
                new Flight { FlightId = 32, FlightNumber = "TK730", Airline = "Turkish Airlines", Origin = "Colombo", Destination = "Istanbul", DepartureTime = DateTime.Today.AddDays(5).AddHours(2).AddMinutes(15), ArrivalTime = DateTime.Today.AddDays(5).AddHours(10).AddMinutes(30), Price = 142000, Class = "Economy", AvailableSeats = 155, ImageUrl = "" },
                new Flight { FlightId = 33, FlightNumber = "TK731", Airline = "Turkish Airlines", Origin = "Istanbul", Destination = "Colombo", DepartureTime = DateTime.Today.AddDays(13).AddHours(19), ArrivalTime = DateTime.Today.AddDays(14).AddHours(5).AddMinutes(15), Price = 138000, Class = "Economy", AvailableSeats = 148, ImageUrl = "" },
                new Flight { FlightId = 34, FlightNumber = "TK735", Airline = "Turkish Airlines", Origin = "Colombo", Destination = "Istanbul", DepartureTime = DateTime.Today.AddDays(7).AddHours(14), ArrivalTime = DateTime.Today.AddDays(7).AddHours(22).AddMinutes(15), Price = 295000, Class = "Business", AvailableSeats = 12, ImageUrl = "" },

                // Etihad
                new Flight { FlightId = 35, FlightNumber = "EY267", Airline = "Etihad Airways", Origin = "Colombo", Destination = "Abu Dhabi", DepartureTime = DateTime.Today.AddDays(2).AddHours(21).AddMinutes(30), ArrivalTime = DateTime.Today.AddDays(3).AddHours(1), Price = 88000, Class = "Economy", AvailableSeats = 165, ImageUrl = "" },
                new Flight { FlightId = 36, FlightNumber = "EY268", Airline = "Etihad Airways", Origin = "Abu Dhabi", Destination = "Colombo", DepartureTime = DateTime.Today.AddDays(10).AddHours(3).AddMinutes(15), ArrivalTime = DateTime.Today.AddDays(10).AddHours(10).AddMinutes(45), Price = 85000, Class = "Economy", AvailableSeats = 158, ImageUrl = "" },

                // Maldivian
                new Flight { FlightId = 37, FlightNumber = "Q2541", Airline = "Maldivian", Origin = "Colombo", Destination = "Male", DepartureTime = DateTime.Today.AddDays(1).AddHours(15), ArrivalTime = DateTime.Today.AddDays(1).AddHours(16).AddMinutes(30), Price = 35000, Class = "Economy", AvailableSeats = 70, ImageUrl = "" },
                new Flight { FlightId = 38, FlightNumber = "Q2542", Airline = "Maldivian", Origin = "Male", Destination = "Colombo", DepartureTime = DateTime.Today.AddDays(5).AddHours(10), ArrivalTime = DateTime.Today.AddDays(5).AddHours(11).AddMinutes(30), Price = 33000, Class = "Economy", AvailableSeats = 65, ImageUrl = "" },

                // Korean Air
                new Flight { FlightId = 39, FlightNumber = "KE474", Airline = "Korean Air", Origin = "Colombo", Destination = "Seoul", DepartureTime = DateTime.Today.AddDays(8).AddHours(23), ArrivalTime = DateTime.Today.AddDays(9).AddHours(10).AddMinutes(15), Price = 168000, Class = "Economy", AvailableSeats = 80, ImageUrl = "" },

                // First Class specials
                new Flight { FlightId = 40, FlightNumber = "SQ001", Airline = "Singapore Airlines", Origin = "Colombo", Destination = "Singapore", DepartureTime = DateTime.Today.AddDays(14).AddHours(22), ArrivalTime = DateTime.Today.AddDays(15).AddHours(4).AddMinutes(30), Price = 520000, Class = "First", AvailableSeats = 6, ImageUrl = "" }
            );

            // Seed FlightBooking data for revenue trends
            modelBuilder.Entity<FlightBooking>().HasData(
                new FlightBooking { FlightBookingId = 1, BookingDate = DateTime.Now.AddDays(-7), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0771234567", ContactEmail = "john@example.com", TotalPrice = 85000, CustomerId = 1, FlightId = 1 },
                new FlightBooking { FlightBookingId = 2, BookingDate = DateTime.Now.AddDays(-3), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123456", ContactEmail = "jane@example.com", TotalPrice = 72000, CustomerId = 2, FlightId = 2 },
                new FlightBooking { FlightBookingId = 3, BookingDate = DateTime.Now.AddDays(-14), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123457", ContactEmail = "alice@example.com", TotalPrice = 195000, CustomerId = 3, FlightId = 3 },
                new FlightBooking { FlightBookingId = 4, BookingDate = DateTime.Now.AddMonths(-1), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0771234567", ContactEmail = "john@example.com", TotalPrice = 62000, CustomerId = 1, FlightId = 4 },
                new FlightBooking { FlightBookingId = 5, BookingDate = DateTime.Now.AddMonths(-1).AddDays(-5), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123456", ContactEmail = "jane@example.com", TotalPrice = 178000, CustomerId = 2, FlightId = 5 },
                new FlightBooking { FlightBookingId = 6, BookingDate = DateTime.Now.AddMonths(-2), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123457", ContactEmail = "alice@example.com", TotalPrice = 145000, CustomerId = 3, FlightId = 6 },
                new FlightBooking { FlightBookingId = 7, BookingDate = DateTime.Now.AddMonths(-2).AddDays(-10), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0771234567", ContactEmail = "john@example.com", TotalPrice = 425000, CustomerId = 1, FlightId = 7 },
                new FlightBooking { FlightBookingId = 8, BookingDate = DateTime.Now.AddMonths(-3), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123456", ContactEmail = "jane@example.com", TotalPrice = 92000, CustomerId = 2, FlightId = 8 },
                new FlightBooking { FlightBookingId = 9, BookingDate = DateTime.Now.AddMonths(-3).AddDays(-7), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123457", ContactEmail = "alice@example.com", TotalPrice = 88000, CustomerId = 3, FlightId = 9 },
                new FlightBooking { FlightBookingId = 10, BookingDate = DateTime.Now.AddMonths(-4), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0771234567", ContactEmail = "john@example.com", TotalPrice = 210000, CustomerId = 1, FlightId = 10 },
                new FlightBooking { FlightBookingId = 11, BookingDate = DateTime.Now.AddMonths(-4).AddDays(-3), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123456", ContactEmail = "jane@example.com", TotalPrice = 185000, CustomerId = 2, FlightId = 11 },
                new FlightBooking { FlightBookingId = 12, BookingDate = DateTime.Now.AddMonths(-5), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123457", ContactEmail = "alice@example.com", TotalPrice = 340000, CustomerId = 3, FlightId = 12 },
                new FlightBooking { FlightBookingId = 13, BookingDate = DateTime.Now.AddMonths(-5).AddDays(-12), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0771234567", ContactEmail = "john@example.com", TotalPrice = 365000, CustomerId = 1, FlightId = 13 },
                new FlightBooking { FlightBookingId = 14, BookingDate = DateTime.Now.AddMonths(-6), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123456", ContactEmail = "jane@example.com", TotalPrice = 45000, CustomerId = 2, FlightId = 14 },
                new FlightBooking { FlightBookingId = 15, BookingDate = DateTime.Now.AddMonths(-6).AddDays(-8), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123457", ContactEmail = "alice@example.com", TotalPrice = 52000, CustomerId = 3, FlightId = 15 },
                new FlightBooking { FlightBookingId = 16, BookingDate = DateTime.Now.AddMonths(-7), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0771234567", ContactEmail = "john@example.com", TotalPrice = 28000, CustomerId = 1, FlightId = 16 },
                new FlightBooking { FlightBookingId = 17, BookingDate = DateTime.Now.AddMonths(-7).AddDays(-15), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123456", ContactEmail = "jane@example.com", TotalPrice = 42000, CustomerId = 2, FlightId = 17 },
                new FlightBooking { FlightBookingId = 18, BookingDate = DateTime.Now.AddMonths(-8), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123457", ContactEmail = "alice@example.com", TotalPrice = 95000, CustomerId = 3, FlightId = 18 },
                new FlightBooking { FlightBookingId = 19, BookingDate = DateTime.Now.AddMonths(-8).AddDays(-4), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0771234567", ContactEmail = "john@example.com", TotalPrice = 92000, CustomerId = 1, FlightId = 19 },
                new FlightBooking { FlightBookingId = 20, BookingDate = DateTime.Now.AddMonths(-9), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123456", ContactEmail = "jane@example.com", TotalPrice = 185000, CustomerId = 2, FlightId = 20 },
                new FlightBooking { FlightBookingId = 21, BookingDate = DateTime.Now.AddMonths(-9).AddDays(-9), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123457", ContactEmail = "alice@example.com", TotalPrice = 98000, CustomerId = 3, FlightId = 21 },
                new FlightBooking { FlightBookingId = 22, BookingDate = DateTime.Now.AddMonths(-10), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0771234567", ContactEmail = "john@example.com", TotalPrice = 95000, CustomerId = 1, FlightId = 22 },
                new FlightBooking { FlightBookingId = 23, BookingDate = DateTime.Now.AddMonths(-10).AddDays(-6), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123456", ContactEmail = "jane@example.com", TotalPrice = 210000, CustomerId = 2, FlightId = 23 },
                new FlightBooking { FlightBookingId = 24, BookingDate = DateTime.Now.AddMonths(-11), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123457", ContactEmail = "alice@example.com", TotalPrice = 235000, CustomerId = 3, FlightId = 24 },
                new FlightBooking { FlightBookingId = 25, BookingDate = DateTime.Now.AddMonths(-11).AddDays(-11), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0771234567", ContactEmail = "john@example.com", TotalPrice = 310000, CustomerId = 1, FlightId = 25 },
                new FlightBooking { FlightBookingId = 26, BookingDate = DateTime.Now.AddMonths(-12), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123456", ContactEmail = "jane@example.com", TotalPrice = 115000, CustomerId = 2, FlightId = 26 },
                new FlightBooking { FlightBookingId = 27, BookingDate = DateTime.Now.AddMonths(-12).AddDays(-2), Status = "Confirmed", CountryCode = "+94", MobileNumber = "0777123457", ContactEmail = "alice@example.com", TotalPrice = 112000, CustomerId = 3, FlightId = 27 }
            );
        }
    }

    public static class BCryptHelper
    {
        public static string HashPassword(string password)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var bytes = System.Text.Encoding.UTF8.GetBytes(password + "ManelTravelSalt2026");
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        public static bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }
    }
}
