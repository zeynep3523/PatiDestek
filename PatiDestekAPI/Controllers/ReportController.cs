using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.JSInterop.Infrastructure;
using PatiDestekAPI.Data;
using PatiDestekAPI.DTOs;
using PatiDestekAPI.Models;
using System.Security.Claims;
using PatiDestekAPI.Enums;
using PatiDestekAPI.Helpers;
namespace PatiDestekAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ReportController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null)
                throw new UnauthorizedAccessException("Kullanıcı bilgisi bulunamadı.");

            return int.Parse(claim.Value);
        }

        // İhbar oluştur
        [HttpPost]
        public IActionResult CreateReport(CreateReportRequest request)
        {
            var userId = GetUserId();

            var report = new Report
            {
                AnimalType = request.AnimalType,
                Category = request.Category,
                Priority = request.Priority,
                Description = request.Description,
                Location = request.Location,
District = request.District,
Latitude = request.Latitude,
Longitude = request.Longitude,
                UserId = userId,
                CreatedDate = DateTime.Now,
                Status = "Bekliyor"
            };

            _context.Reports.Add(report);
            _context.SaveChanges();
            _context.ReportTimelines.Add(new ReportTimeline
{
    ReportId = report.Id,
    Title = "İhbar oluşturuldu.",
    Description = "Vatandaş tarafından yeni ihbar oluşturuldu.",
    CreatedAt = DateTime.Now
});

_context.SaveChanges();
            var adminUsers = _context.Users
    .Where(u => u.Role == "Admin" || u.Role == "SuperAdmin")
    .ToList();

foreach (var admin in adminUsers)
{
    var notification = new Notification
    {
        UserId = admin.Id,
        ReportId = report.Id,
        Type = "NewReport",
        Title = "Yeni İhbar Oluşturuldu",
        Message = $"#{report.Id} numaralı yeni {report.AnimalType} ihbarı oluşturuldu.",
        CreatedAt = DateTime.UtcNow
    };

    _context.Notifications.Add(notification);
}

_context.SaveChanges();

            return Ok(new
            {
                message = "İhbar başarıyla oluşturuldu.",
                report
            });
        }

        // Kullanıcının ihbarları
        [HttpGet("MyReports")]
        public IActionResult GetMyReports()
        {
            var userId = GetUserId();

            var reports = _context.Reports
                .Where(r => r.UserId == userId && !r.IsDeleted)
                .OrderByDescending(r => r.CreatedDate)
                .Select(r => new ReportResponse
                {
                    Id = r.Id,
                    AnimalType = r.AnimalType,
                    Category = r.Category,
                    Priority = r.Priority,
                    Description = r.Description,
                    Location = r.Location,
                    Latitude = r.Latitude,
                    Longitude = r.Longitude,
                    CreatedDate = r.CreatedDate,
                    Status = r.Status,
                    AdminNote = r.AdminNote,
                    ImageUrl = r.ImageUrl
                })
                .ToList();

            return Ok(reports);
        }
[HttpGet("filter")]
public async Task<IActionResult> FilterReports([FromQuery] ReportFilterRequest filter)
{
    var query = _context.Reports.AsQueryable();

    if (filter.Category.HasValue)
    {
        query = query.Where(r => r.Category == filter.Category.Value);
    }

    if (filter.Priority.HasValue)
    {
        query = query.Where(r => r.Priority == filter.Priority.Value);
    }

    if (!string.IsNullOrWhiteSpace(filter.Status))
    {
        query = query.Where(r => r.Status == filter.Status);
    }

    if (!string.IsNullOrWhiteSpace(filter.AnimalType))
    {
        query = query.Where(r => r.AnimalType.Contains(filter.AnimalType));
    }

    var reports = await query.Select(report => new ReportResponse
    {
        Id = report.Id,
        AnimalType = report.AnimalType,
        Category = report.Category,
        Priority = report.Priority,
        Description = report.Description,
        Location = report.Location,
        Latitude = report.Latitude,
        Longitude = report.Longitude,
        Status = report.Status,
        UserId = report.UserId
    }).ToListAsync();
    return Ok(reports);
}
        // Id'ye göre ihbar getir
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var userId = GetUserId();

            var report = _context.Reports
                .Where(r => r.Id == id && r.UserId == userId && !r.IsDeleted)
                .Select(r => new ReportResponse
                {
                    Id = r.Id,
                    AnimalType = r.AnimalType,
                    Description = r.Description,
                    Priority = r.Priority,
                    Location = r.Location,
                    Latitude = r.Latitude,
                    Longitude = r.Longitude,
                    CreatedDate = r.CreatedDate,
                    Status = r.Status,
                    AdminNote = r.AdminNote,
                    ImageUrl = r.ImageUrl
                })
                .FirstOrDefault();

            if (report == null)
                return NotFound(new { message = "İhbar bulunamadı." });

            return Ok(report);
        }

        // İhbar güncelle
        [HttpPut("{id}")]
        public IActionResult UpdateReport(int id, UpdateReportRequest updatedReport)
        {
            var userId = GetUserId();

            var report = _context.Reports
                .FirstOrDefault(r => r.Id == id && r.UserId == userId && !r.IsDeleted);

            if (report == null)
                return NotFound(new { message = "İhbar bulunamadı." });
report.AnimalType = updatedReport.AnimalType;
report.Category = updatedReport.Category;
report.Priority = updatedReport.Priority;
report.Description = updatedReport.Description;
report.Location = updatedReport.Location;
report.District = updatedReport.District;
report.Latitude = updatedReport.Latitude;
report.Longitude = updatedReport.Longitude;
_context.SaveChanges();

var adminUsers = _context.Users
    .Where(u => u.Role == "Admin" || u.Role == "SuperAdmin")
    .ToList();

foreach (var admin in adminUsers)
{
    var notification = new Notification
    {
        UserId = admin.Id,
        ReportId = report.Id,
        Type = "UpdateReport",
        Title = "İhbar Güncellendi",
        Message = $"ID: {report.Id} numaralı ihbar güncellendi.",
        CreatedAt = DateTime.UtcNow
    };

    _context.Notifications.Add(notification);
}

_context.SaveChanges();
          

            return Ok(new
            {
                message = "İhbar güncellendi.",
                report
            });
        }

        // İhbar sil
        [HttpDelete("{id}")]
        public IActionResult DeleteReport(int id)
        {
            var userId = GetUserId();

            var report = _context.Reports
    .FirstOrDefault(r => r.Id == id && !r.IsDeleted);
            if (report == null)
                return NotFound(new { message = "İhbar bulunamadı." });

            report.IsDeleted = true;
            _context.SaveChanges();

var notification = new Notification
{
    UserId = userId,
    ReportId = report.Id,
    Type = "DeleteReport",
    Title = "İhbar Silindi",
    Message = $"ID: {report.Id} numaralı ihbar silindi.",
    CreatedAt = DateTime.Now
};

_context.Notifications.Add(notification);
_context.SaveChanges();

            return Ok(new
            {
                message = "İhbar silindi."
            });
        }
       
     // Admin / SuperAdmin ihbar sil
[Authorize(Roles = "Admin,SuperAdmin,")]
[HttpDelete("Admin/{id}")]
public IActionResult DeleteAdminReport(int id)
{
    var report = _context.Reports
        .FirstOrDefault(r => r.Id == id && !r.IsDeleted);

    if (report == null)
    {
        return NotFound(new
        {
            message = "İhbar bulunamadı."
        });
    }

    report.IsDeleted = true;

    var notification = new Notification
    {
        UserId = report.UserId,
        ReportId = report.Id,
        Type = "DeleteReport",
        Title = "İhbar Silindi",
        Message = $"#{report.Id} numaralı ihbarınız yönetici tarafından silindi.",
        CreatedAt = DateTime.Now
    };

    _context.Notifications.Add(notification);
    _context.SaveChanges();

    return Ok(new
    {
        message = "İhbar başarıyla silindi."
    });
}
     


        // Dashboard istatistikleri
[HttpGet("Dashboard")]
public IActionResult GetDashboard()
{
    var userId = GetUserId();

    var reports = _context.Reports
        .Where(r => r.UserId == userId && !r.IsDeleted);

    var result = new
    {
        TotalReports = reports.Count(),
        Waiting = reports.Count(r => r.Status == "Bekliyor"),
        Reviewing = reports.Count(r => r.Status == "İnceleniyor"),
        Completed = reports.Count(r => r.Status == "Tamamlandı")
    };

    return Ok(result);
}
[AllowAnonymous]
[HttpGet("PublicDashboard")]
public IActionResult GetPublicDashboard()
{
    var reports = _context.Reports
        .Where(r => !r.IsDeleted);

    var result = new
    {
        TotalReports = reports.Count(),
        Waiting = reports.Count(r => r.Status == "Bekliyor"),
        Reviewing = reports.Count(r => r.Status == "İnceleniyor"),
        Completed = reports.Count(r => r.Status == "Tamamlandı")
    };

    return Ok(result);
}
[Authorize(Roles = "Admin,SuperAdmin,Municipality")]
[HttpGet("AdminDashboard")]
public IActionResult GetAdminDashboard()
{
    var today = DateTime.Today;

    var allReports = _context.Reports
        .Where(r => !r.IsDeleted);

    var todayReports = allReports
        .Where(r => r.CreatedDate.Date == today);

    var result = new
    {
        // Günlük
        TodayReports = todayReports.Count(),
        TodayWaiting = todayReports.Count(r => r.Status == "Bekliyor"),
        TodayReviewing = todayReports.Count(r => r.Status == "İnceleniyor"),
        TodayCompleted = todayReports.Count(r => r.Status == "Tamamlandı"),

        // Genel
        TotalReports = allReports.Count(),
        TotalWaiting = allReports.Count(r => r.Status == "Bekliyor"),
        TotalReviewing = allReports.Count(r => r.Status == "İnceleniyor"),
        TotalCompleted = allReports.Count(r => r.Status == "Tamamlandı"),
        TotalIntervention = allReports.Count(r => r.Status == "Müdahale Ediliyor"),

TotalVeterinarians = _context.Users
    .Count(u => u.Role == "Veterinarian"),

ActiveCases = allReports.Count(r =>
    r.AssignedStaffId != null &&
    r.Status != "Tamamlandı"),
  
CriticalReports = allReports
   .Where(r => r.Priority == PriorityLevel.Kritik &&
            r.Status == "Bekliyor")
    .OrderByDescending(r => r.CreatedDate)
    .Take(5)
    .Select(r => new
    {
        r.Id,
        r.AnimalType,
        r.District,
        r.Status,
        r.CreatedDate
    }),

LatestReports = allReports
    .OrderByDescending(r => r.CreatedDate)
    .Take(5)
    .Select(r => new
    {
        r.Id,
        r.AnimalType,
        r.District,
        r.Status,
        r.CreatedDate
    })
    };

    return Ok(result);
    
}
[Authorize(Roles = "Municipality")]
[HttpGet("MunicipalityDashboard")]
public IActionResult GetMunicipalityDashboard()
{
    var userId = GetUserId();

    var reports = _context.Reports
        .Where(r =>
            r.AssignedStaffId == userId &&
            !r.IsDeleted)
        .ToList();

    return Ok(new
    {
        todayReports = reports.Count(r =>
            r.CreatedDate.Date == DateTime.Today),

        todayWaiting = reports.Count(r =>
            r.CreatedDate.Date == DateTime.Today &&
            r.Status == "Bekliyor"),

        todayReviewing = reports.Count(r =>
            r.CreatedDate.Date == DateTime.Today &&
            r.Status == "İnceleniyor"),

        todayCompleted = reports.Count(r =>
            r.CreatedDate.Date == DateTime.Today &&
            r.Status == "Tamamlandı"),

        totalIntervention = reports.Count(r =>
            r.Status == "Müdahale Ediliyor"),

        totalVeterinarians = _context.Users
            .Count(u => u.Role == "Veterinarian"),

        activeCases = reports.Count(r =>
            r.Status != "Tamamlandı"),

        criticalReports = reports
            .Where(r =>
                r.Priority == PriorityLevel.Kritik &&
                r.Status == "Bekliyor")
            .OrderByDescending(r => r.CreatedDate)
            .Take(5)
            .Select(r => new
            {
                r.Id,
                r.AnimalType,
                r.District,
                r.Status,
                r.CreatedDate
            }),

        latestReports = reports
            .OrderByDescending(r => r.CreatedDate)
            .Take(5)
            .Select(r => new
            {
                r.Id,
                r.AnimalType,
                r.District,
                r.Status,
                r.CreatedDate
            })
    });
}
[Authorize(Roles = "Veterinarian")]
[HttpGet("VeterinarianDashboard")]
public IActionResult GetVeterinarianDashboard()
{
    var userId = GetUserId();

    var reports = _context.Reports
        .Where(r =>
            r.AssignedStaffId == userId &&
            !r.IsDeleted);

    var todayReports = reports
        .Where(r => r.CreatedDate.Date == DateTime.Today);

    var result = new
    {
        // Günlük
        TodayReports = todayReports.Count(),
        TodayWaiting = todayReports.Count(r => r.Status == "Bekliyor"),
        TodayReviewing = todayReports.Count(r => r.Status == "İnceleniyor"),
        TodayCompleted = todayReports.Count(r => r.Status == "Tamamlandı"),

        // Genel
        TotalReports = reports.Count(),
        TotalWaiting = reports.Count(r => r.Status == "Bekliyor"),
        TotalReviewing = reports.Count(r => r.Status == "İnceleniyor"),
        TotalCompleted = reports.Count(r => r.Status == "Tamamlandı"),
        TotalIntervention = reports.Count(r => r.Status == "Müdahale Ediliyor"),

        // Kritik ihbarlar
        CriticalReports = reports
            .Where(r =>
                r.Priority == PriorityLevel.Kritik &&
                r.Status != "Tamamlandı")
            .OrderByDescending(r => r.CreatedDate)
            .Take(5)
            .Select(r => new
            {
                r.Id,
                r.AnimalType,
                r.District,
                r.Status,
                r.CreatedDate
            }),

        // Son ihbarlar
        LatestReports = reports
            .OrderByDescending(r => r.CreatedDate)
            .Take(5)
            .Select(r => new
            {
                r.Id,
                r.AnimalType,
                r.District,
                r.Status,
                r.CreatedDate
            })
    };

    return Ok(result);
}
[Authorize(Roles = "Veterinarian")]
[HttpGet("VeterinarianStatistics")]
public IActionResult GetVeterinarianStatistics(string period = "all")
{
    var userId = GetUserId();

    var reports = _context.Reports
        .Where(r =>
            r.AssignedStaffId == userId &&
            !r.IsDeleted);

    DateTime today = DateTime.Today;

    switch (period.ToLower())
    {
        case "today":
            reports = reports.Where(r => r.CreatedDate.Date == today);
            break;

        case "week":
            reports = reports.Where(r => r.CreatedDate >= today.AddDays(-7));
            break;

        case "month":
            reports = reports.Where(r =>
                r.CreatedDate.Month == today.Month &&
                r.CreatedDate.Year == today.Year);
            break;

        case "year":
            reports = reports.Where(r =>
                r.CreatedDate.Year == today.Year);
            break;
    }

    var allDistricts = new List<string>
    {
        "Atatürk Mahallesi",
        "Bahçeağıl Mahallesi",
        "Bahçelievler Mahallesi",
        "Cumhuriyet Mahallesi",
        "Fatih Mahallesi",
        "İnönü Mahallesi",
        "İsmetpaşa Mahallesi",
        "Kazım Karabekir Mahallesi",
        "Mimar Sinan Mahallesi",
        "Pınarca Mahallesi",
        "Yanıkağıl Mahallesi",
        "Karaağaç Mahallesi"
    };

    var districtCounts = reports
        .GroupBy(r => r.District)
        .ToDictionary(g => g.Key, g => g.Count());

    var result = new
    {
        TotalReports = reports.Count(),

        Waiting = reports.Count(r => r.Status == "Bekliyor"),
        Reviewing = reports.Count(r => r.Status == "İnceleniyor"),
        Completed = reports.Count(r => r.Status == "Tamamlandı"),

        YaraliHayvan = reports.Count(r => r.Category == ReportCategory.YaraliHayvan),
        KayipHayvan = reports.Count(r => r.Category == ReportCategory.KayipHayvan),
        MamaIhtiyaci = reports.Count(r => r.Category == ReportCategory.MamaIhtiyaci),
        SuIhtiyaci = reports.Count(r => r.Category == ReportCategory.SuIhtiyaci),
        GeciciYuva = reports.Count(r => r.Category == ReportCategory.GeciciYuva),
        AcilKurtarma = reports.Count(r => r.Category == ReportCategory.AcilKurtarma),
        OluHayvan = reports.Count(r => r.Category == ReportCategory.OluHayvan),
        Diger = reports.Count(r => r.Category == ReportCategory.Diger),

        Dusuk = reports.Count(r => r.Priority == PriorityLevel.Dusuk),
        Orta = reports.Count(r => r.Priority == PriorityLevel.Orta),
        Yuksek = reports.Count(r => r.Priority == PriorityLevel.Yuksek),
        Kritik = reports.Count(r => r.Priority == PriorityLevel.Kritik),

        Districts = allDistricts.Select(d => new
        {
            District = d,
            Count = districtCounts.ContainsKey(d)
                ? districtCounts[d]
                : 0
        }),

        AnimalTypes = new[]
        {
            new { Animal = "Kedi", Count = reports.Count(r => r.AnimalType == "Kedi") },
            new { Animal = "Köpek", Count = reports.Count(r => r.AnimalType == "Köpek") },
            new { Animal = "Kuş", Count = reports.Count(r => r.AnimalType == "Kuş") },
            new { Animal = "Tavşan", Count = reports.Count(r => r.AnimalType == "Tavşan") },
            new { Animal = "Kaplumbağa", Count = reports.Count(r => r.AnimalType == "Kaplumbağa") },
            new { Animal = "Kirpi", Count = reports.Count(r => r.AnimalType == "Kirpi") },
            new { Animal = "At", Count = reports.Count(r => r.AnimalType == "At") },
            new { Animal = "Keçi", Count = reports.Count(r => r.AnimalType == "Keçi") },
            new { Animal = "Koyun", Count = reports.Count(r => r.AnimalType == "Koyun") },
            new { Animal = "İnek", Count = reports.Count(r => r.AnimalType == "İnek") },
            new { Animal = "Ördek", Count = reports.Count(r => r.AnimalType == "Ördek") },
            new { Animal = "Diğer", Count = reports.Count(r => r.AnimalType == "Diğer") }
        }
    };

    return Ok(result);
}
[Authorize(Roles = "Veterinarian")]
[HttpGet("VeterinarianReports")]
public IActionResult GetVeterinarianReports()
{
    var userId = GetUserId();

    var reports = _context.Reports
        .Where(r =>
            r.AssignedStaffId == userId &&
            !r.IsDeleted)
        .Include(r => r.User)
        .Include(r => r.AssignedStaff)
        .OrderByDescending(r => r.CreatedDate)
        .ToList();

    return Ok(reports);
}
[Authorize(Roles = "Veterinarian")]
[HttpGet("Veterinarian/{id}")]
public IActionResult GetVeterinarianReportDetail(int id)
{
    var userId = GetUserId();

    var report = _context.Reports
        .Include(r => r.User)
        .Include(r => r.AssignedStaff)
        .FirstOrDefault(r =>
            r.Id == id &&
            r.AssignedStaffId == userId &&
            !r.IsDeleted);

    if (report == null)
    {
        return NotFound(new
        {
            message = "İhbar bulunamadı veya bu ihbar size atanmamış."
        });
    }

    return Ok(report);
}
[Authorize(Roles = "Veterinarian")]
[HttpGet("Veterinarian/{id}/timeline")]
public IActionResult GetVeterinarianReportTimeline(int id)
{
    var userId = GetUserId();

    var reportExists = _context.Reports.Any(r =>
        r.Id == id &&
        r.AssignedStaffId == userId &&
        !r.IsDeleted);

    if (!reportExists)
    {
        return NotFound(new
        {
            message = "İhbar bulunamadı veya bu ihbar size atanmamış."
        });
    }

    var timeline = _context.ReportTimelines
        .Where(t => t.ReportId == id)
        .OrderByDescending(t => t.CreatedAt)
        .ToList();

    return Ok(timeline);
}
[Authorize(Roles = "Admin,SuperAdmin")]
[HttpGet("AdminStatistics")]
public IActionResult GetAdminStatistics(string period = "all")
{
    var reports = _context.Reports.Where(r => !r.IsDeleted);
    DateTime today = DateTime.Today;

    switch (period.ToLower())
    {
        case "today":
            reports = reports.Where(r => r.CreatedDate.Date == today);
            break;

        case "week":
            reports = reports.Where(r => r.CreatedDate >= today.AddDays(-7));
            break;

        case "month":
            reports = reports.Where(r =>
                r.CreatedDate.Month == today.Month &&
                r.CreatedDate.Year == today.Year);
            break;

        case "year":
            reports = reports.Where(r =>
                r.CreatedDate.Year == today.Year);
            break;

        case "all":
        default:
            break;
    }

    var allDistricts = new List<string>
    {
        "Atatürk Mahallesi",
        "Bahçeağıl Mahallesi",
        "Bahçelievler Mahallesi",
        "Cumhuriyet Mahallesi",
        "Fatih Mahallesi",
        "İnönü Mahallesi",
        "İsmetpaşa Mahallesi",
        "Kazım Karabekir Mahallesi",
        "Mimar Sinan Mahallesi",
        "Pınarca Mahallesi",
        "Yanıkağıl Mahallesi",
        "Karaağaç Mahallesi"
    };

    var districtCounts = reports
        .GroupBy(r => r.District)
        .ToDictionary(g => g.Key, g => g.Count());

    var result = new
    {
        // Genel
        TotalReports = reports.Count(),
        Waiting = reports.Count(r => r.Status == "Bekliyor"),
        Reviewing = reports.Count(r => r.Status == "İnceleniyor"),
        Completed = reports.Count(r => r.Status == "Tamamlandı"),

        // Kategori
        YaraliHayvan = reports.Count(r => r.Category == ReportCategory.YaraliHayvan),
        KayipHayvan = reports.Count(r => r.Category == ReportCategory.KayipHayvan),
        MamaIhtiyaci = reports.Count(r => r.Category == ReportCategory.MamaIhtiyaci),
        SuIhtiyaci = reports.Count(r => r.Category == ReportCategory.SuIhtiyaci),
        GeciciYuva = reports.Count(r => r.Category == ReportCategory.GeciciYuva),
        AcilKurtarma = reports.Count(r => r.Category == ReportCategory.AcilKurtarma),
        OluHayvan = reports.Count(r => r.Category == ReportCategory.OluHayvan),
        Diger = reports.Count(r => r.Category == ReportCategory.Diger),

        // Öncelik
        Dusuk = reports.Count(r => r.Priority == PriorityLevel.Dusuk),
        Orta = reports.Count(r => r.Priority == PriorityLevel.Orta),
        Yuksek = reports.Count(r => r.Priority == PriorityLevel.Yuksek),
        Kritik = reports.Count(r => r.Priority == PriorityLevel.Kritik),

        // Hayvan Türleri
        Cat = reports.Count(r => r.AnimalType == "Kedi"),
        Dog = reports.Count(r => r.AnimalType == "Köpek"),
        Bird = reports.Count(r => r.AnimalType == "Kuş"),
        Rabbit = reports.Count(r => r.AnimalType == "Tavşan"),
        Turtle = reports.Count(r => r.AnimalType == "Kaplumbağa"),
        Hedgehog = reports.Count(r => r.AnimalType == "Kirpi"),
        Horse = reports.Count(r => r.AnimalType == "At"),
        Goat = reports.Count(r => r.AnimalType == "Keçi"),
        Sheep = reports.Count(r => r.AnimalType == "Koyun"),
        Cow = reports.Count(r => r.AnimalType == "İnek"),
        Duck = reports.Count(r => r.AnimalType == "Ördek"),
        OtherAnimal = reports.Count(r => r.AnimalType == "Diğer"),

        // Mahalle Dağılımı
        Districts = allDistricts.Select(d => new
{
    District = d,
    Count = districtCounts.ContainsKey(d) ? districtCounts[d] : 0
}),

AnimalTypes = new[]
{
    new { Animal = "Kedi", Count = reports.Count(r => r.AnimalType == "Kedi") },
    new { Animal = "Köpek", Count = reports.Count(r => r.AnimalType == "Köpek") },
    new { Animal = "Kuş", Count = reports.Count(r => r.AnimalType == "Kuş") },
    new { Animal = "Tavşan", Count = reports.Count(r => r.AnimalType == "Tavşan") },
    new { Animal = "Kaplumbağa", Count = reports.Count(r => r.AnimalType == "Kaplumbağa") },
    new { Animal = "Kirpi", Count = reports.Count(r => r.AnimalType == "Kirpi") },
    new { Animal = "At", Count = reports.Count(r => r.AnimalType == "At") },
    new { Animal = "Keçi", Count = reports.Count(r => r.AnimalType == "Keçi") },
    new { Animal = "Koyun", Count = reports.Count(r => r.AnimalType == "Koyun") },
    new { Animal = "İnek", Count = reports.Count(r => r.AnimalType == "İnek") },
    new { Animal = "Ördek", Count = reports.Count(r => r.AnimalType == "Ördek") },
    new { Animal = "Diğer", Count = reports.Count(r => r.AnimalType == "Diğer") }
}
    };

    return Ok(result);
}
[Authorize(Roles = "Municipality")]
[HttpGet("MunicipalityStatistics")]
public IActionResult GetMunicipalityStatistics(string period = "all")
{
    var userId = GetUserId();

    var reports = _context.Reports
        .Where(r =>
            !r.IsDeleted &&
            r.AssignedStaffId == userId);

    DateTime today = DateTime.Today;

    switch (period.ToLower())
    {
        case "today":
            reports = reports.Where(r => r.CreatedDate.Date == today);
            break;

        case "week":
            reports = reports.Where(r => r.CreatedDate >= today.AddDays(-7));
            break;

        case "month":
            reports = reports.Where(r =>
                r.CreatedDate.Month == today.Month &&
                r.CreatedDate.Year == today.Year);
            break;

        case "year":
            reports = reports.Where(r =>
                r.CreatedDate.Year == today.Year);
            break;

        case "all":
        default:
            break;
    }

    var allDistricts = new List<string>
    {
        "Atatürk Mahallesi",
        "Bahçeağıl Mahallesi",
        "Bahçelievler Mahallesi",
        "Cumhuriyet Mahallesi",
        "Fatih Mahallesi",
        "İnönü Mahallesi",
        "İsmetpaşa Mahallesi",
        "Kazım Karabekir Mahallesi",
        "Mimar Sinan Mahallesi",
        "Pınarca Mahallesi",
        "Yanıkağıl Mahallesi",
        "Karaağaç Mahallesi"
    };

    var districtCounts = reports
        .GroupBy(r => r.District)
        .ToDictionary(g => g.Key, g => g.Count());

    var result = new
    {
        TotalReports = reports.Count(),

        Waiting = reports.Count(r => r.Status == "Bekliyor"),

        Reviewing = reports.Count(r => r.Status == "İnceleniyor"),

        Completed = reports.Count(r => r.Status == "Tamamlandı"),

        YaraliHayvan = reports.Count(r =>
            r.Category == ReportCategory.YaraliHayvan),

        KayipHayvan = reports.Count(r =>
            r.Category == ReportCategory.KayipHayvan),

        MamaIhtiyaci = reports.Count(r =>
            r.Category == ReportCategory.MamaIhtiyaci),

        SuIhtiyaci = reports.Count(r =>
            r.Category == ReportCategory.SuIhtiyaci),

        GeciciYuva = reports.Count(r =>
            r.Category == ReportCategory.GeciciYuva),

        AcilKurtarma = reports.Count(r =>
            r.Category == ReportCategory.AcilKurtarma),

        OluHayvan = reports.Count(r =>
            r.Category == ReportCategory.OluHayvan),

        Diger = reports.Count(r =>
            r.Category == ReportCategory.Diger),

        Dusuk = reports.Count(r =>
            r.Priority == PriorityLevel.Dusuk),

        Orta = reports.Count(r =>
            r.Priority == PriorityLevel.Orta),

        Yuksek = reports.Count(r =>
            r.Priority == PriorityLevel.Yuksek),

        Kritik = reports.Count(r =>
            r.Priority == PriorityLevel.Kritik),

        Districts = allDistricts.Select(d => new
        {
            District = d,
            Count = districtCounts.ContainsKey(d)
                ? districtCounts[d]
                : 0
        }),

        AnimalTypes = new[]
        {
            new { Animal = "Kedi", Count = reports.Count(r => r.AnimalType == "Kedi") },
            new { Animal = "Köpek", Count = reports.Count(r => r.AnimalType == "Köpek") },
            new { Animal = "Kuş", Count = reports.Count(r => r.AnimalType == "Kuş") },
            new { Animal = "Tavşan", Count = reports.Count(r => r.AnimalType == "Tavşan") },
            new { Animal = "Kaplumbağa", Count = reports.Count(r => r.AnimalType == "Kaplumbağa") },
            new { Animal = "Kirpi", Count = reports.Count(r => r.AnimalType == "Kirpi") },
            new { Animal = "At", Count = reports.Count(r => r.AnimalType == "At") },
            new { Animal = "Keçi", Count = reports.Count(r => r.AnimalType == "Keçi") },
            new { Animal = "Koyun", Count = reports.Count(r => r.AnimalType == "Koyun") },
            new { Animal = "İnek", Count = reports.Count(r => r.AnimalType == "İnek") },
            new { Animal = "Ördek", Count = reports.Count(r => r.AnimalType == "Ördek") },
            new { Animal = "Diğer", Count = reports.Count(r => r.AnimalType == "Diğer") }
        }
    };

    return Ok(result);
}
[Authorize(Roles = "Admin,SuperAdmin")]
[HttpGet("All")]
public IActionResult GetAllReports()
{
    var reports = _context.Reports
        .Include(r => r.User)
        .Include(r => r.AssignedStaff)
        .Where(r => !r.IsDeleted)
        .OrderByDescending(r => r.CreatedDate)
        .Select(r => new
        {
            r.Id,
            r.AnimalType,
            r.Category,
            r.Priority,
            r.Status,
            r.Location,
            r.CreatedDate,
            r.ImageUrl,
            r.IsUpdated,
            r.AssignedStaffId,

            User = r.User == null ? null : new
            {
                r.User.FirstName,
                r.User.LastName,
                r.User.Email,
                r.User.Phone
            },

            AssignedStaff = r.AssignedStaff == null ? null : new
            {     
                r.AssignedStaff.Id,
                r.AssignedStaff.FirstName,
                r.AssignedStaff.LastName,
                r.AssignedStaff.Email,
                r.AssignedStaff.Phone,
                r.AssignedStaff.Role,
                r.AssignedStaff.JobTitle
            }
        })
        .ToList();

    return Ok(reports);
}
[Authorize(Roles = "Municipality")]
[HttpGet("MyAssignedReports")]
public IActionResult GetMyAssignedReports()
{
    var userId = GetUserId();

    var reports = _context.Reports
        .Include(r => r.User)
        .Include(r => r.AssignedStaff)
        .Where(r =>
            r.AssignedStaffId == userId &&
            !r.IsDeleted)
        .OrderByDescending(r => r.CreatedDate)
        .Select(r => new
        {
            r.Id,
            r.AnimalType,
            r.Category,
            r.Priority,
            r.Status,
            r.Location,
            r.CreatedDate,
            r.ImageUrl,
            r.IsUpdated,
            r.AssignedStaffId,

            User = r.User == null ? null : new
            {
                r.User.FirstName,
                r.User.LastName,
                r.User.Email,
                r.User.Phone
            },

            AssignedStaff = r.AssignedStaff == null ? null : new
            {
                r.AssignedStaff.Id,
                r.AssignedStaff.FirstName,
                r.AssignedStaff.LastName,
                r.AssignedStaff.Email,
                r.AssignedStaff.Phone,
                r.AssignedStaff.Role,
                r.AssignedStaff.JobTitle
            }
        })
        .ToList();

    return Ok(reports);
}
[Authorize(Roles = "Admin,SuperAdmin,Municipality")]
[HttpGet("Admin/{id}")]
public IActionResult GetAdminReportById(int id)

{
    var userId = GetUserId();
var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
    var report = _context.Reports
        .Include(r => r.User)
        .Where(r => r.Id == id && !r.IsDeleted)
        .Select(r => new
        {
            r.Id,
            r.AnimalType,
            r.Category,
            r.Priority,
            r.Description,
            r.Location,
            r.Status,
            r.CreatedDate,
            r.ImageUrl,
            r.AdminNote,

           User = r.User == null ? null : new
{
    r.User.FirstName,
    r.User.LastName,
    r.User.Email,
    r.User.Phone
},

AssignedStaff = r.AssignedStaff == null ? null : new
{
    r.AssignedStaff.Id,
    r.AssignedStaff.FirstName,
    r.AssignedStaff.LastName,
    r.AssignedStaff.Role
}
        })
        .FirstOrDefault();

    if (report == null)
        return NotFound();

    return Ok(report);
}
[HttpGet("nearby")]
public async Task<IActionResult> GetNearbyReports([FromQuery] NearbyRequest request)
{
    var reports = await _context.Reports
    .Where(r =>
    r.Category != ReportCategory.YaraliHayvan &&
    r.Category != ReportCategory.OluHayvan &&
    r.Category != ReportCategory.AcilKurtarma &&
    !r.IsDeleted)
    .ToListAsync();

    var nearbyReports = reports
        .Select(report => new NearbyReportResponse
        {
            Id = report.Id,
            AnimalType = report.AnimalType,
            Category = report.Category,
            Priority = report.Priority,
            Description = report.Description,
            Location = report.Location,
            Latitude = report.Latitude,
            Longitude = report.Longitude,
            Status = report.Status,
            DistanceKm = Math.Round(
                CalculateDistance(
                    request.Latitude,
                    request.Longitude,
                    report.Latitude,
                    report.Longitude),
                2)
        })
        .Where(r => r.DistanceKm <= request.Radius)
        .OrderBy(r => r.DistanceKm)
        .ToList();

    return Ok(nearbyReports);
}


        // Fotoğraf yükle
        [HttpPost("{id}/upload-image")]
        public IActionResult UploadImage(int id, IFormFile image)
        {
            var userId = GetUserId();

            var report = _context.Reports.FirstOrDefault(r => r.Id == id && r.UserId == userId);

            if (report == null)
            {
                return NotFound(new
                {
                    message = "İhbar bulunamadı."
                });
            }
            

            if (image == null || image.Length == 0)
            {
                return BadRequest(new
                {
                    message = "Fotoğraf seçilmedi."
                });
            }

            var uploadsFolder = Path.Combine(_environment.WebRootPath!, "uploads");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);

            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                image.CopyTo(stream);
            }

            report.ImageUrl = "/uploads/" + fileName;

            _context.SaveChanges();


            return Ok(new
            {
                message = "Fotoğraf başarıyla yüklendi.",
                imageUrl = report.ImageUrl
            });
        }
        [Authorize(Roles = "SuperAdmin,Municipality")]
[HttpPost("{id}/assign/{staffId}")]
public IActionResult AssignStaff(int id, int staffId)
{
    var userId = GetUserId();
    var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

    var report = _context.Reports
        .FirstOrDefault(r => r.Id == id && !r.IsDeleted);

    if (report == null)
    {
        return NotFound(new
        {
            message = "İhbar bulunamadı."
        });
    }

    // Belediye personeli sadece kendisine atanmış ihbarı
    // başka bir görevliye aktarabilir.
    if (userRole == "Municipality" &&
        report.AssignedStaffId != userId)
    {
        return Forbid();
    }

    // Belediye personeli sadece veterinere atama yapabilir.
    if (userRole == "Municipality")
    {
        var veterinarian = _context.Users.FirstOrDefault(u =>
            u.Id == staffId &&
            u.Role == "Veterinarian");

        if (veterinarian == null)
        {
            return BadRequest(new
            {
                message = "Belediye personeli sadece veterinere ihbar atayabilir."
            });
        }
    }

    var staff = _context.Users.FirstOrDefault(u =>
        u.Id == staffId &&
        (u.Role == "Municipality" || u.Role == "Veterinarian"));

    if (staff == null)
    {
        return BadRequest(new
        {
            message = "Görevli bulunamadı."
        });
    }

    report.AssignedStaffId = staffId;

    // İhbarı atayan belediye personelini kaydet
    report.AssignedByUserId = userId;

    _context.ReportTimelines.Add(new ReportTimeline
    {
        ReportId = report.Id,
        Title = "Görevli atandı.",
        Description = $"{staff.FirstName} {staff.LastName} adlı görevliye atandı.",
        CreatedAt = DateTime.Now
    });

    var notification = new Notification
    {
        UserId = staffId,
        ReportId = report.Id,
        Type = "ReportAssigned",
        Title = "Yeni İhbar Atandı",
        Message = $"#{report.Id} numaralı ihbar size atandı.",
        CreatedAt = DateTime.UtcNow
    };

    _context.Notifications.Add(notification);

    _context.SaveChanges();

    return Ok(new
    {
        message = "Görevli başarıyla atandı."
    });
}
        [Authorize(Roles = "Admin,SuperAdmin,Municipality,Veterinarian")]
[HttpPut("{id}/status")]
public IActionResult UpdateReportStatus(int id, [FromBody] string status)
{
    var report = _context.Reports
        .FirstOrDefault(r => r.Id == id && !r.IsDeleted);

    if (report == null)
    {
        return NotFound(new
        {
            message = "İhbar bulunamadı."
        });
    }

    // Veteriner sadece kendisine atanmış ihbarı güncelleyebilir
    var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

    if (userRole == "Veterinarian")
    {
        var userId = GetUserId();

        if (report.AssignedStaffId != userId)
        {
            return Forbid();
        }
    }

    var allowedStatuses = new[]
    {
        "Bekliyor",
        "İnceleniyor",
        "Müdahale Ediliyor",
        "Tamamlandı"
    };

    if (!allowedStatuses.Contains(status))
    {
        return BadRequest(new
        {
            message = "Geçersiz ihbar durumu."
        });
    }

    report.Status = status;

    _context.ReportTimelines.Add(new ReportTimeline
    {
        ReportId = report.Id,
        Title = "İhbar durumu güncellendi.",
        Description = $"İhbarın durumu \"{status}\" olarak güncellendi.",
        CreatedAt = DateTime.Now
    });

    var notification = new Notification
    {
        UserId = report.UserId,
        ReportId = report.Id,
        Type = "StatusChanged",
        Title = "İhbar Durumu Güncellendi",
        Message = $"#{report.Id} numaralı ihbarınızın durumu \"{status}\" olarak güncellendi.",
        CreatedAt = DateTime.UtcNow
    };

    _context.Notifications.Add(notification);

    _context.SaveChanges();

    return Ok(new
    {
        message = "İhbar durumu güncellendi.",
        status = report.Status
    });
}
      
[Authorize(Roles = "SuperAdmin,Municipality")]
[HttpPut("{id}/admin-note")]
public IActionResult UpdateAdminNote(int id, [FromBody] string note)
{
    var report = _context.Reports
        .FirstOrDefault(r => r.Id == id && !r.IsDeleted);

    if (report == null)
    {
        return NotFound(new
        {
            message = "İhbar bulunamadı."
        });
    }

   report.AdminNote = note;

_context.ReportTimelines.Add(new ReportTimeline
{
    ReportId = report.Id,
    Title = "Belediye notu eklendi.",
    Description = "İhbar için belediye tarafından bir not eklendi.",
    CreatedAt = DateTime.Now
});

_context.SaveChanges();

    return Ok(new
    {
        message = "Belediye notu kaydedildi.",
        adminNote = report.AdminNote
    });
}

    
[Authorize(Roles = "Admin,SuperAdmin,Municipality")]
[HttpGet("{id}/timeline")]
public IActionResult GetReportTimeline(int id)
{
    var timelines = _context.ReportTimelines
        .Where(t => t.ReportId == id)
        .OrderByDescending(t => t.CreatedAt)
        .Select(t => new
        {
            t.Id,
            t.Title,
            t.Description,
            t.CreatedAt
        })
        .ToList();

    return Ok(timelines);
}
[Authorize(Roles = "Veterinarian")]
[HttpGet("Veterinarian/Notifications")]
public IActionResult GetVeterinarianNotifications()
{
    var userId = GetUserId();

    var notifications = _context.Notifications
        .Where(n => n.UserId == userId)
        .OrderByDescending(n => n.CreatedAt)
        .ToList();

    return Ok(notifications);
}
    private static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
{
    const double earthRadius = 6371; // km

    var dLat = DegreesToRadians(lat2 - lat1);
    var dLon = DegreesToRadians(lon2 - lon1);

    var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
            Math.Cos(DegreesToRadians(lat1)) *
            Math.Cos(DegreesToRadians(lat2)) *
            Math.Sin(dLon / 2) *
            Math.Sin(dLon / 2);

    var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

    return earthRadius * c;
}

private static double DegreesToRadians(double degrees)
{
    return degrees * Math.PI / 180;
}
}}