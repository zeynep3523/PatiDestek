using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PatiDestekAPI.Data;
using PatiDestekAPI.DTOs;
using System.Security.Claims;

namespace PatiDestekAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // Profilimi Gör
        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(new
                {
                    message = "Kullanıcı bilgisi bulunamadı."
                });
            }

            int userId = int.Parse(userIdClaim.Value);

            var user = _context.Users.FirstOrDefault(x => x.Id == userId);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "Kullanıcı bulunamadı."
                });
            }

            return Ok(new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Phone,
                user.Role
            });
        }
        // Profilimi Güncelle
        [HttpPut("profile")]
public IActionResult UpdateProfile(UpdateProfileRequest request)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

    if (userIdClaim == null)
    {
        return Unauthorized(new
        {
            message = "Kullanıcı bilgisi bulunamadı."
        });
    }

    int userId = int.Parse(userIdClaim.Value);

    var user = _context.Users.FirstOrDefault(x => x.Id == userId);

    if (user == null)
    {
        return NotFound(new
        {
            message = "Kullanıcı bulunamadı."
        });
    }

    user.FirstName = request.FirstName;
    user.LastName = request.LastName;
    user.Phone = request.Phone;

    _context.SaveChanges();

    return Ok(new
    {
        message = "Profil başarıyla güncellendi.",
        user.Id,
        user.FirstName,
        user.LastName,
        user.Email,
        user.Phone,
        user.Role
    });
    }

    [HttpPut("change-password")]
public IActionResult ChangePassword(ChangePasswordRequest request)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

    if (userIdClaim == null)
    {
        return Unauthorized(new
        {
            message = "Kullanıcı bilgisi bulunamadı."
        });
    }

    int userId = int.Parse(userIdClaim.Value);

    var user = _context.Users.FirstOrDefault(x => x.Id == userId);

    if (user == null)
    {
        return NotFound(new
        {
            message = "Kullanıcı bulunamadı."
        });
    }

    bool passwordCorrect = BCrypt.Net.BCrypt.Verify(request.OldPassword, user.Password);

    if (!passwordCorrect)
    {
        return BadRequest(new
        {
            message = "Eski şifre hatalı."
        });
    }

    user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

    _context.SaveChanges();

    return Ok(new
    {
        message = "Şifre başarıyla değiştirildi."
    });
}
[Authorize(Roles = "SuperAdmin,Municipality,Veterinarian")]
[HttpGet("communication-users")]
public IActionResult GetCommunicationUsers()
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

    if (userIdClaim == null)
    {
        return Unauthorized(new
        {
            message = "Kullanıcı bilgisi bulunamadı."
        });
    }

    int userId = int.Parse(userIdClaim.Value);

    var users = _context.Users
    .Where(u =>
        u.Id != userId &&
        (
            (User.IsInRole("Veterinarian") && u.Role == "Municipality") ||
            (!User.IsInRole("Veterinarian") && 
 (u.Role == "SuperAdmin" || u.Role == "Municipality" || u.Role == "Veterinarian"))
        ))
    .Select(u => new
    {
        u.Id,
        u.FirstName,
        u.LastName,
        u.Role
    })
    .ToList();
    return Ok(users);
}

    }}