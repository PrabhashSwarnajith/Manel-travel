using ManelTravel.API.Data;
using ManelTravel.API.Models;
using ManelTravel.API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ManelTravel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PackagesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PackagesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/packages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PackageDto>>> GetPackages()
        {
            return await _context.TourPackages
                .OrderBy(p => p.StartDate)
                .Select(p => new PackageDto
                {
                    PackageId = p.PackageId,
                    PackageName = p.PackageName,
                    Destination = p.Destination,
                    Description = p.Description,
                    Duration = p.Duration,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    Price = p.Price,
                    MaxParticipants = p.MaxParticipants,
                    CurrentParticipants = p.CurrentParticipants,
                    ImageUrl = p.ImageUrl,
                    Itinerary = p.Itinerary
                })
                .ToListAsync();
        }

        // GET: api/packages/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PackageDto>> GetPackage(int id)
        {
            var package = await _context.TourPackages.FindAsync(id);

            if (package == null)
            {
                return NotFound();
            }

            return new PackageDto
            {
                PackageId = package.PackageId,
                PackageName = package.PackageName,
                Destination = package.Destination,
                Description = package.Description,
                Duration = package.Duration,
                StartDate = package.StartDate,
                EndDate = package.EndDate,
                Price = package.Price,
                MaxParticipants = package.MaxParticipants,
                CurrentParticipants = package.CurrentParticipants,
                ImageUrl = package.ImageUrl,
                Itinerary = package.Itinerary
            };
        }

        // POST: api/packages
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<PackageDto>> CreatePackage(CreatePackageDto dto)
        {
            var package = new TourPackage
            {
                PackageName = dto.PackageName,
                Destination = dto.Destination,
                Description = dto.Description,
                Duration = dto.Duration,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Price = dto.Price,
                MaxParticipants = dto.MaxParticipants,
                CurrentParticipants = 0,
                ImageUrl = dto.ImageUrl,
                Itinerary = dto.Itinerary
            };

            _context.TourPackages.Add(package);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPackage), new { id = package.PackageId }, new PackageDto
            {
                PackageId = package.PackageId,
                PackageName = package.PackageName,
                Destination = package.Destination,
                Description = package.Description,
                Duration = package.Duration,
                StartDate = package.StartDate,
                EndDate = package.EndDate,
                Price = package.Price,
                MaxParticipants = package.MaxParticipants,
                CurrentParticipants = package.CurrentParticipants,
                ImageUrl = package.ImageUrl,
                Itinerary = package.Itinerary
            });
        }

        // PUT: api/packages/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePackage(int id, UpdatePackageDto dto)
        {
            var package = await _context.TourPackages.FindAsync(id);
            if (package == null)
            {
                return NotFound();
            }

            package.PackageName = dto.PackageName;
            package.Destination = dto.Destination;
            package.Description = dto.Description;
            package.Duration = dto.Duration;
            package.StartDate = dto.StartDate;
            package.EndDate = dto.EndDate;
            package.Price = dto.Price;
            package.MaxParticipants = dto.MaxParticipants;
            package.ImageUrl = dto.ImageUrl;
            package.Itinerary = dto.Itinerary;

            _context.TourPackages.Update(package);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/packages/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePackage(int id)
        {
            var package = await _context.TourPackages.FindAsync(id);
            if (package == null)
            {
                return NotFound();
            }

            _context.TourPackages.Remove(package);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
