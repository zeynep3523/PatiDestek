using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PatiDestekAPI.Data;
using PatiDestekAPI.Models;
using PatiDestekAPI.Services;
using Microsoft.AspNetCore.SignalR;
using PatiDestekAPI.Hubs;


namespace PatiDestekAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        //_logger
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;
        private readonly ILogger<AdminController> _logger;   
          private readonly IHubContext<NotificationHub> _hubContext;
          public AdminController(
    AppDbContext context,
    TokenService tokenService,
    ILogger<AdminController> logger,
    IHubContext<NotificationHub> hubContext)
{
    _context = context;
    _tokenService = tokenService;
    _logger = logger;
    _hubContext = hubContext;
}

        // Admin Kayıt
        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register(Admin admin)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            bool emailExists = _context.Admins.Any(a => a.Email.ToLower() == admin.Email.ToLower());

            if (emailExists)
            {
                return BadRequest(new
                {
                    message = "Bu e-posta adresi zaten kayıtlı."
                });
            }

            admin.Password = BCrypt.Net.BCrypt.HashPassword(admin.Password);

            _context.Admins.Add(admin);
            _context.SaveChanges();
            _logger.LogInformation(
    "Yeni admin oluşturuldu. Email: {Email}",
    admin.Email);

            return Ok(new
            {
                message = "Admin başarıyla kaydedildi."
            });
        }

        // Admin Giriş
        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login(AdminLoginRequest request)
        {
            var admin = _context.Admins.FirstOrDefault(a => a.Email.ToLower() == request.Email.ToLower());

            if (admin == null)
            {
                return BadRequest(new
                {
                    message = "E-posta veya şifre hatalı."
                });
            }

            bool passwordCorrect = BCrypt.Net.BCrypt.Verify(request.Password, admin.Password);

            if (!passwordCorrect)
            {
                return BadRequest(new
                {
                    message = "E-posta veya şifre hatalı."
                });
            }

            var user = new User
            {
                Id = admin.Id,
                FirstName = admin.FullName,
                LastName = "Admin",
                Email = admin.Email,
                Phone = "",
                Role = "Admin"
            };

            var token = _tokenService.CreateToken(user);
            _logger.LogInformation(
    "Admin giriş yaptı. Email: {Email}",
    admin.Email);

            return Ok(new
            {
                message = "Admin girişi başarılı.",
                token,
                admin = new
                {
                    admin.Id,
                    admin.FullName,
                    admin.Email
                }
            });
        }

        // Dashboard
        [HttpGet("dashboard")]
public IActionResult GetDashboard()
{
    var today = DateTime.Today;

    var dashboard = new
    {
        totalUsers = _context.Users.Count(),

        totalReports = _context.Reports.Count(r => !r.IsDeleted),

        pendingReports = _context.Reports.Count(r => r.Status == "Bekliyor" && !r.IsDeleted),

        inProgressReports = _context.Reports.Count(r => r.Status == "İşlemde" && !r.IsDeleted),

        completedReports = _context.Reports.Count(r => r.Status == "Tamamlandı" && !r.IsDeleted),

        totalVeterinarians = _context.Veterinarians.Count(),

        reportsWithImage = _context.Reports.Count(r => r.ImageUrl != null && !r.IsDeleted),

        reportsToday = _context.Reports.Count(r =>
            r.CreatedDate.Date == today &&
            !r.IsDeleted),

        notifications = _context.Notifications.Count()
    };

    return Ok(dashboard);
}

        // Tüm ihbarları listele
        [HttpGet("reports")]
public IActionResult GetAllReports(
    string? status,
    string? animalType,
    string? location,
    int page = 1,
    int pageSize = 10)
{
    var query = _context.Reports
    .Include(r => r.User)
    .Where(r => !r.IsDeleted)
    .AsQueryable();

    if (!string.IsNullOrWhiteSpace(status))
    {
        query = query.Where(r => r.Status == status);
    }

    if (!string.IsNullOrWhiteSpace(animalType))
    {
        query = query.Where(r => r.AnimalType.Contains(animalType));
    }

    if (!string.IsNullOrWhiteSpace(location))
    {
        query = query.Where(r => r.Location.Contains(location));
    }
var totalCount = query.Count();

var reports = query
    .OrderByDescending(r => r.CreatedDate)
    .Skip((page - 1) * pageSize)
    .Take(pageSize)
    .Select(r => new
    {
        r.Id,
        r.AnimalType,
        r.Description,
        r.Location,
        r.CreatedDate,
        r.Status,
        r.AdminNote,
        r.ImageUrl,

        User = new
        {
            r.User!.Id,
            r.User.FirstName,
            r.User.LastName,
            r.User.Email,
            r.User.Phone
        }
    })
    .ToList();

return Ok(new
{
    page,
    pageSize,
    totalCount,
    totalPages = (int)Math.Ceiling((double)totalCount / pageSize),
    data = reports
});
    
}
        
                // İhbar durumunu güncelle
        [HttpPut("report/{id}/status")]
        public async Task<IActionResult> UpdateReportStatus(int id, UpdateStatusRequest request)
        {
            var report = _context.Reports.FirstOrDefault(r => r.Id == id);

            if (report == null)
            {
                return NotFound(new
                {
                    message = "İhbar bulunamadı."
                });
            }

            report.Status = request.Status;
var notification = new Notification

{
    UserId = report.UserId,
    Title = "İhbar Durumu Güncellendi",
    Message = $"İhbarınızın yeni durumu: {request.Status}"
};

_context.Notifications.Add(notification);

            _logger.LogInformation(
    "İhbar durumu güncellendi. ReportId: {ReportId}, Yeni Durum: {Status}",
    report.Id,
    request.Status);
_context.SaveChanges();
await _hubContext.Clients.All.SendAsync(
    "ReceiveNotification",
    $"İhbar #{report.Id} durumu '{request.Status}' olarak güncellendi."
);
            return Ok(new
            {
                message = "İhbar durumu güncellendi.",
                report
            });
        }

        // İhbara admin notu ekle
        [HttpPut("report/{id}/note")]
public IActionResult UpdateAdminNote(int id, AdminNoteRequest request)
{
    var report = _context.Reports.FirstOrDefault(r => r.Id == id);

    if (report == null)
    {
        return NotFound(new
        {
            message = "İhbar bulunamadı."
        });
    }

    report.AdminNote = request.AdminNote;

    _context.SaveChanges();

    return Ok(new
    {
        message = "Admin notu eklendi.",
        report
    });
}

// İhbarlarda arama
[HttpGet("reports/search")]
public IActionResult SearchReports(string keyword)
{
    if (string.IsNullOrWhiteSpace(keyword))
    {
        return BadRequest(new
        {
            message = "Arama kelimesi boş olamaz."
        });
    }
var reports = _context.Reports
    .Include(r => r.User)
    .Where(r =>
        !r.IsDeleted &&
        (
            r.AnimalType.Contains(keyword) ||
            r.Description.Contains(keyword) ||
            r.Location.Contains(keyword) ||
            r.Status.Contains(keyword) ||
            (r.AdminNote != null && r.AdminNote.Contains(keyword))
        ))
    .OrderByDescending(r => r.CreatedDate)
    .Select(r => new
    {
        r.Id,
        r.AnimalType,
        r.Description,
        r.Location,
        r.CreatedDate,
        r.Status,
        r.AdminNote,
        r.ImageUrl,

        User = new
        {
            r.User!.Id,
            r.User.FirstName,
            r.User.LastName,
            r.User.Email,
            r.User.Phone
        }
    })
    .ToList();

    return Ok(reports);
}
    }
    }