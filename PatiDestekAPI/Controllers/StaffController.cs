using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PatiDestekAPI.Data;
using PatiDestekAPI.DTOs;
using PatiDestekAPI.Models;

namespace PatiDestekAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
public class StaffController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StaffController(AppDbContext context)
        {
            _context = context;
        }

        
        [Authorize(Roles = "SuperAdmin,Municipality")]
[HttpGet]
        public IActionResult GetStaff()
        {
            var staff = _context.Users
                .Where(x =>
    x.Role == "Municipality" ||
    x.Role == "Veterinarian")
.Select(x => new
{
    x.Id,
    x.FirstName,
    x.LastName,
    x.Email,
    x.Phone,
    x.JobTitle,
    x.Role,
    x.IsEmailVerified
})
.ToList();
                

            return Ok(staff);
        }
        [HttpPost]
        [Authorize(Roles = "SuperAdmin")]
public IActionResult CreateStaff(CreateStaffRequest request)
{
if (string.IsNullOrWhiteSpace(request.FirstName) ||
    string.IsNullOrWhiteSpace(request.LastName) ||
    string.IsNullOrWhiteSpace(request.Phone) ||
    string.IsNullOrWhiteSpace(request.Email) ||
    string.IsNullOrWhiteSpace(request.Password) ||
    string.IsNullOrWhiteSpace(request.JobTitle) ||
    string.IsNullOrWhiteSpace(request.Role))
{
    return BadRequest(new
    {
        message = "Lütfen tüm alanları doldurun."
    });
}


    if (_context.Users.Any(x => x.Email.ToLower() == request.Email.ToLower()))
    {
        return BadRequest(new
        {
            message = "Bu e-posta zaten kullanılıyor."
        });
    }

    var user = new User
    {
        FirstName = request.FirstName,
        LastName = request.LastName,
        Email = request.Email,
        Phone = request.Phone,
        JobTitle = request.JobTitle,
        Role = request.Role,
        IsEmailVerified = true,
        Password = BCrypt.Net.BCrypt.HashPassword(request.Password)
    };

    _context.Users.Add(user);
    _context.SaveChanges();

    return Ok(new
    {
        message = "Görevli başarıyla oluşturuldu."
    });
}
[Authorize(Roles = "SuperAdmin")]
[HttpDelete("{id}")]
public IActionResult DeleteStaff(int id)
{
    var user = _context.Users.FirstOrDefault(x => x.Id == id);

    if (user == null)
    {
        return NotFound(new
        {
            message = "Görevli bulunamadı."
        });
    }

    _context.Users.Remove(user);
    _context.SaveChanges();

    return Ok(new
    {
        message = "Görevli silindi."
    });
}
[HttpGet("{id}")]
[Authorize(Roles = "SuperAdmin")]
public IActionResult GetStaffById(int id)
{
    var user = _context.Users
        .Where(x =>
            x.Id == id &&
            (x.Role == "Municipality" || x.Role == "Veterinarian"))
        .Select(x => new
        {
            x.Id,
            x.FirstName,
            x.LastName,
            x.Email,
            x.Phone,
            x.JobTitle,
            x.Role
        })
        .FirstOrDefault();

    if (user == null)
    {
        return NotFound(new
        {
            message = "Görevli bulunamadı."
        });
    }

    return Ok(user);
}

[HttpPut("{id}")]
[Authorize(Roles = "SuperAdmin")]
public IActionResult UpdateStaff(int id, CreateStaffRequest request)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    if (string.IsNullOrWhiteSpace(request.FirstName) ||
        string.IsNullOrWhiteSpace(request.LastName) ||
        string.IsNullOrWhiteSpace(request.Phone) ||
        string.IsNullOrWhiteSpace(request.Email) ||
        string.IsNullOrWhiteSpace(request.JobTitle) ||
        string.IsNullOrWhiteSpace(request.Role))
    {
        return BadRequest(new
        {
            message = "Lütfen tüm alanları doldurun."
        });
    }

    var user = _context.Users.FirstOrDefault(x => x.Id == id);

    if (user == null)
    {
        return NotFound(new
        {
            message = "Görevli bulunamadı."
        });
    }

    if (request.Role != "Municipality" &&
        request.Role != "Veterinarian")
    {
        return BadRequest(new
        {
            message = "Geçersiz görevli rolü."
        });
    }

    bool emailExists = _context.Users.Any(x =>
        x.Email.ToLower() == request.Email.ToLower() &&
        x.Id != id);

    if (emailExists)
    {
        return BadRequest(new
        {
            message = "Bu e-posta zaten kullanılıyor."
        });
    }

    user.FirstName = request.FirstName;
    user.LastName = request.LastName;
    user.Email = request.Email;
    user.Phone = request.Phone;
    user.JobTitle = request.JobTitle;
    user.Role = request.Role;

    // Şifre alanı doldurulmuşsa şifreyi de değiştir
    if (!string.IsNullOrWhiteSpace(request.Password))
    {
        user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
    }

    _context.SaveChanges();

    return Ok(new
    {
        message = "Görevli başarıyla güncellendi."
    });
}
    }
}