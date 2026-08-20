using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PatiDestekAPI.Data;
using PatiDestekAPI.DTOs;
using PatiDestekAPI.Models;

namespace PatiDestekAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VeterinarianController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VeterinarianController(AppDbContext context)
        {
            _context = context;
        }

        // Veteriner Ekle
        [HttpPost]
        public async Task<IActionResult> CreateVeterinarian(CreateVeterinarianRequest request)
        {
            var veterinarian = new Veterinarian
            {
                ClinicName = request.ClinicName,
                VeterinarianName = request.VeterinarianName,
                PhoneNumber = request.PhoneNumber,
                Address = request.Address,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                WorkingHours = request.WorkingHours,
                IsEmergencyService = request.IsEmergencyService
            };

            _context.Veterinarians.Add(veterinarian);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Veteriner başarıyla eklendi."
            });
        }
        // Veteriner Sil
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteVeterinarian(int id)
{
    var veterinarian = await _context.Veterinarians.FindAsync(id);

    if (veterinarian == null)
    {
        return NotFound(new
        {
            message = "Veteriner bulunamadı."
        });
    }

    _context.Veterinarians.Remove(veterinarian);
    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "Veteriner başarıyla silindi."
    });
}

// Veteriner Güncelle
[HttpPut("{id}")]
public async Task<IActionResult> UpdateVeterinarian(int id, UpdateVeterinarianRequest request)
{
    var veterinarian = await _context.Veterinarians.FindAsync(id);

    if (veterinarian == null)
    {
        return NotFound(new
        {
            message = "Veteriner bulunamadı."
        });
    }

    veterinarian.ClinicName = request.ClinicName;
    veterinarian.VeterinarianName = request.VeterinarianName;
    veterinarian.PhoneNumber = request.PhoneNumber;
    veterinarian.Address = request.Address;
    veterinarian.Latitude = request.Latitude;
    veterinarian.Longitude = request.Longitude;
    veterinarian.WorkingHours = request.WorkingHours;
    veterinarian.IsEmergencyService = request.IsEmergencyService;
    veterinarian.IsActive = request.IsActive;

    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "Veteriner başarıyla güncellendi."
    });
}
        // Tüm Veterinerleri Listele
        [HttpGet]
        public async Task<IActionResult> GetAllVeterinarians()
        {
            var veterinarians = await _context.Veterinarians
                .Select(v => new VeterinarianResponse
                {
                    Id = v.Id,
                    ClinicName = v.ClinicName,
                    VeterinarianName = v.VeterinarianName,
                    PhoneNumber = v.PhoneNumber,
                    Address = v.Address,
                    Latitude = v.Latitude,
                    Longitude = v.Longitude,
                    WorkingHours = v.WorkingHours,
                    IsEmergencyService = v.IsEmergencyService,
                    IsActive = v.IsActive
                })
                .ToListAsync();

            return Ok(veterinarians);
        }
private static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
{
    const double R = 6371;

    var dLat = DegreesToRadians(lat2 - lat1);
    var dLon = DegreesToRadians(lon2 - lon1);

    var a =
        Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
        Math.Cos(DegreesToRadians(lat1)) *
        Math.Cos(DegreesToRadians(lat2)) *
        Math.Sin(dLon / 2) *
        Math.Sin(dLon / 2);

    var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

    return R * c;
}

private static double DegreesToRadians(double degrees)
{
    return degrees * Math.PI / 180;
}
        // Id'ye Göre Veteriner Getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetVeterinarianById(int id)
        {
            var veterinarian = await _context.Veterinarians.FindAsync(id);

            if (veterinarian == null)
            {
                return NotFound(new
                {
                    message = "Veteriner bulunamadı."
                });
            }

            return Ok(new VeterinarianResponse
            {
                Id = veterinarian.Id,
                ClinicName = veterinarian.ClinicName,
                VeterinarianName = veterinarian.VeterinarianName,
                PhoneNumber = veterinarian.PhoneNumber,
                Address = veterinarian.Address,
                Latitude = veterinarian.Latitude,
                Longitude = veterinarian.Longitude,
                WorkingHours = veterinarian.WorkingHours,
                IsEmergencyService = veterinarian.IsEmergencyService,
                IsActive = veterinarian.IsActive
            });
        }
       
                [HttpGet("nearby")]
        public async Task<IActionResult> GetNearbyVeterinarians([FromQuery] NearbyRequest request)
        {
            var veterinarians = await _context.Veterinarians.ToListAsync();

            var result = veterinarians
                .Where(v => v.IsActive)
                .Select(v => new NearbyVeterinarianResponse
                {
                    Id = v.Id,
                    ClinicName = v.ClinicName,
                    VeterinarianName = v.VeterinarianName,
                    PhoneNumber = v.PhoneNumber,
                    Address = v.Address,
                    WorkingHours = v.WorkingHours,
                    IsEmergencyService = v.IsEmergencyService,
                    DistanceKm = Math.Round(
                        CalculateDistance(
                            request.Latitude,
                            request.Longitude,
                            v.Latitude,
                            v.Longitude), 2)
                })
                .Where(v => v.DistanceKm <= request.Radius)
                .OrderBy(v => v.DistanceKm)
                .ToList();

            return Ok(result);
        }
    }
}
        

    