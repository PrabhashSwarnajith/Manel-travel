using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ManelTravel.API.Data;
using ManelTravel.API.Models;
using ManelTravel.API.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using static ManelTravel.API.Data.BCryptHelper;

namespace ManelTravel.API.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<AuthResponseDto?> Login(LoginDto dto)
        {
            // Check admin first
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == dto.Email);
            if (admin != null && VerifyPassword(dto.Password, admin.PasswordHash))
            {
                return new AuthResponseDto
                {
                    Token = GenerateToken(admin.AdminId, admin.Email, "Admin"),
                    Role = "Admin",
                    Name = $"{admin.FirstName} {admin.LastName}",
                    Email = admin.Email,
                    UserId = admin.AdminId
                };
            }

            // Check customer
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == dto.Email);
            if (customer != null && VerifyPassword(dto.Password, customer.PasswordHash))
            {
                return new AuthResponseDto
                {
                    Token = GenerateToken(customer.CusId, customer.Email, "Customer"),
                    Role = "Customer",
                    Name = $"{customer.FirstName} {customer.LastName}",
                    Email = customer.Email,
                    UserId = customer.CusId
                };
            }

            return null;
        }

        public async Task<AuthResponseDto?> Register(RegisterDto dto)
        {
            // Check if email already exists
            if (await _context.Customers.AnyAsync(c => c.Email == dto.Email))
                return null;

            var customer = new Customer
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                NIC = dto.NIC,
                Email = dto.Email,
                TeleNo = dto.TeleNo,
                Address = dto.Address,
                DateOfBirth = dto.DateOfBirth,
                PasswordHash = HashPassword(dto.Password)
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return new AuthResponseDto
            {
                Token = GenerateToken(customer.CusId, customer.Email, "Customer"),
                Role = "Customer",
                Name = $"{customer.FirstName} {customer.LastName}",
                Email = customer.Email,
                UserId = customer.CusId
            };
        }

        private string GenerateToken(int userId, string email, string role)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
