using Microsoft.AspNetCore.Mvc;
using PatiDestekAPI.Data;
using PatiDestekAPI.Models;
using PatiDestekAPI.Services;
using PatiDestekAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace PatiDestekAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
private readonly TokenService _tokenService;
private readonly EmailService _emailService;

public AuthController(
    AppDbContext context,
    TokenService tokenService,
    EmailService emailService)
{
    _context = context;
    _tokenService = tokenService;
    _emailService = emailService;
}

        [HttpGet("debug-env")]
        public IActionResult DebugEnv([FromServices] IConfiguration config)
        {
            var email = config["SeedSuperAdmin:Email"];
            var password = config["SeedSuperAdmin:Password"];

            return Ok(new
            {
                emailPresent = !string.IsNullOrEmpty(email),
                emailValue = email,
                passwordPresent = !string.IsNullOrEmpty(password),
                passwordLength = password?.Length ?? 0
            });
        }

        [HttpGet("debug-user")]
        public IActionResult DebugUser(string email)
        {
            var matches = _context.Users
                .Where(u => u.Email.ToLower() == email.ToLower())
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.Role,
                    u.IsEmailVerified,
                    u.FailedLoginCount,
                    u.LockoutEnd
                })
                .ToList();

            return Ok(matches);
        }

        [HttpPost("register")]
        public IActionResult Register(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            bool emailExists = _context.Users.Any(u => u.Email.ToLower() == user.Email.ToLower());

            if (emailExists)
            {
                return Conflict(new
{
    message = "Bu e-posta adresi ile daha önce kayıt olunmuş. Giriş yapabilir veya 'Şifremi Unuttum' seçeneğini kullanabilirsiniz."
});
            }
             user.Role = "User";
            // Şifreyi hashle
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
var verificationCode = new Random().Next(100000, 999999).ToString();

user.IsEmailVerified = false;
user.EmailVerificationCode = verificationCode;
user.VerificationCodeExpireDate = DateTime.UtcNow.AddMinutes(10);
            _context.Users.Add(user);
_context.SaveChanges();

_emailService.SendEmail(
    user.Email,
    "Pati Destek - E-posta Doğrulama",
    $"Merhaba {user.FirstName},\n\n" +
    $"Doğrulama kodunuz: {verificationCode}\n\n" +
    $"Bu kod 10 dakika boyunca geçerlidir.");

return Ok(new
{
    message = "Kullanıcı başarıyla kaydedildi."
});}
           
        
        [HttpPost("verify-email")]
public IActionResult VerifyEmail(VerifyEmailRequest request)
{
    var user = _context.Users.FirstOrDefault(u => u.Email.ToLower() == request.Email.ToLower());

    if (user == null)
    {
        return BadRequest(new
        {
            message = "Kullanıcı bulunamadı."
        });
    }

    if (user.EmailVerificationCode != request.Code)
    {
        return BadRequest(new
        {
            message = "Doğrulama kodu hatalı."
        });
    }

    if (user.VerificationCodeExpireDate < DateTime.UtcNow)
    {
        return BadRequest(new
        {
            message = "Doğrulama kodunun süresi dolmuş."
        });
    }

    user.IsEmailVerified = true;
    user.EmailVerificationCode = null;
    user.VerificationCodeExpireDate = null;

    _context.SaveChanges();

    return Ok(new
    {
        message = "E-posta başarıyla doğrulandı."
    });
}

[HttpPost("resend-verification-code")]
public IActionResult ResendVerificationCode(ResendVerificationCodeRequest request)
{
    var user = _context.Users.FirstOrDefault(u => u.Email.ToLower() == request.Email.ToLower());

    if (user == null)
    {
        return BadRequest(new
        {
            message = "Kullanıcı bulunamadı."
        });
    }

    if (user.IsEmailVerified)
    {
        return BadRequest(new
        {
            message = "Bu e-posta zaten doğrulanmış."
        });
    }

    var verificationCode = new Random().Next(100000, 999999).ToString();

    user.EmailVerificationCode = verificationCode;
    user.VerificationCodeExpireDate = DateTime.UtcNow.AddMinutes(10);

    _context.SaveChanges();

    _emailService.SendEmail(
        user.Email,
        "Pati Destek - Yeni Doğrulama Kodu",
        $"Merhaba {user.FirstName},\n\n" +
        $"Yeni doğrulama kodunuz: {verificationCode}\n\n" +
        $"Bu kod 10 dakika boyunca geçerlidir."
    );

    return Ok(new
    {
        message = "Yeni doğrulama kodu gönderildi."
    });
}

[HttpPost("forgot-password")]
public IActionResult ForgotPassword(ForgotPasswordRequest request)
{
    var user = _context.Users.FirstOrDefault(u => u.Email.ToLower() == request.Email.ToLower());

    if (user == null)
    {
        return BadRequest(new
        {
            message = "Bu e-posta adresine ait kullanıcı bulunamadı."
        });
    }

    var resetCode = new Random().Next(100000, 999999).ToString();

    user.ResetPasswordCode = resetCode;
    user.ResetPasswordCodeExpireDate = DateTime.UtcNow.AddMinutes(10);

    _context.SaveChanges();

    _emailService.SendEmail(
        user.Email,
        "Pati Destek - Şifre Sıfırlama",
        $"Merhaba {user.FirstName},\n\n" +
        $"Şifre sıfırlama kodunuz: {resetCode}\n\n" +
        $"Bu kod 10 dakika boyunca geçerlidir.");

    return Ok(new
    {
        message = "Şifre sıfırlama kodu e-posta adresinize gönderildi."
    });
}

[HttpPost("reset-password")]
public IActionResult ResetPassword(ResetPasswordRequest request)
{
    var user = _context.Users.FirstOrDefault(u => u.Email.ToLower() == request.Email.ToLower());

    if (user == null)
    {
        return BadRequest(new
        {
            message = "Kullanıcı bulunamadı."
        });
    }

    if (user.ResetPasswordCode != request.Code)
    {
        return BadRequest(new
        {
            message = "Şifre sıfırlama kodu hatalı."
        });
    }

    if (user.ResetPasswordCodeExpireDate < DateTime.UtcNow)
    {
        return BadRequest(new
        {
            message = "Şifre sıfırlama kodunun süresi dolmuş."
        });
    }

    user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

    user.ResetPasswordCode = null;
    user.ResetPasswordCodeExpireDate = null;

    _context.SaveChanges();

    return Ok(new
    {
        message = "Şifreniz başarıyla güncellendi."
    });
}

        [HttpPost("refresh")]
public IActionResult Refresh(RefreshTokenRequest request)
{
    var refreshToken = _context.RefreshTokens
        .FirstOrDefault(r =>
            r.Token == request.RefreshToken &&
            !r.IsRevoked &&
            r.Expires > DateTime.UtcNow);

    if (refreshToken == null)
    {
        return BadRequest(new
        {
            message = "Geçersiz veya süresi dolmuş Refresh Token."
        });
    }

    var user = _context.Users.FirstOrDefault(u => u.Id == refreshToken.UserId);

    if (user == null)
    {
        return BadRequest(new
        {
            message = "Kullanıcı bulunamadı."
        });
    }

    var newAccessToken = _tokenService.CreateToken(user);

    return Ok(new
    {
        token = newAccessToken
    });
}
[HttpPost("login")]
public IActionResult Login(LoginRequest request)
{
    var user = _context.Users.FirstOrDefault(u => u.Email.ToLower() == request.Email.ToLower());

    if (user == null)
    {
        return BadRequest(new
        {
            message = "E-posta veya şifre hatalı."
        });
    }
    if (user.Role == "User" &&
    user.LockoutEnd.HasValue &&
    user.LockoutEnd > DateTime.UtcNow)
{
    var remaining = user.LockoutEnd.Value - DateTime.UtcNow;

    return BadRequest(new
    {
        message = $"🔒 Hesabınız kilitlendi. Kalan süre: {remaining.Minutes} dakika {remaining.Seconds} saniye."
    });
}

    bool passwordCorrect = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);

    if (!passwordCorrect)
{
    Console.WriteLine($"Hatalı giriş. Sayaç: {user.FailedLoginCount}");
    if (user.Role == "User")
    {
        
        user.FailedLoginCount++;

        if (user.FailedLoginCount >= 5)
{
    user.LockoutEnd = DateTime.UtcNow.AddMinutes(15);
    user.FailedLoginCount = 0;

    _context.SaveChanges();

    return BadRequest(new
    {
        message = "🔒 Hesabınız güvenlik nedeniyle 15 dakika kilitlendi."
    });
}

        _context.SaveChanges();

        return BadRequest(new
        {
            message = $"E-posta veya şifre hatalı. {5 - user.FailedLoginCount} deneme hakkınız kaldı."
        });
    }

    return BadRequest(new
    {
        message = "E-posta veya şifre hatalı."
    });
}


if (!user.IsEmailVerified)

{
    return BadRequest(new
    {
        message = "Lütfen önce e-posta adresinizi doğrulayın."
    });
}
if (user.Role == "User")
{
    user.FailedLoginCount = 0;
    user.LockoutEnd = null;

    _context.SaveChanges();
}
    var token = _tokenService.CreateToken(user);

    var refreshToken = _tokenService.CreateRefreshToken();

    var refreshTokenEntity = new RefreshToken
    {
        Token = refreshToken,
        UserId = user.Id,
        Expires = DateTime.UtcNow.AddDays(7),
        IsRevoked = false
    };

    _context.RefreshTokens.Add(refreshTokenEntity);
    _context.SaveChanges();

    return Ok(new
    {
        message = "Giriş başarılı.",
        token,
        refreshToken,
        user = new
{
    user.Id,
    user.FirstName,
    user.LastName,
    user.Email,
    user.Phone,
    user.Role
}

    });

}
[Authorize]
[HttpGet("profile")]
public IActionResult GetProfile()
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

    if (userIdClaim == null)
    {
        return Unauthorized();
    }

    int userId = int.Parse(userIdClaim.Value);

    var user = _context.Users.FirstOrDefault(u => u.Id == userId);

    if (user == null)
    {
        return NotFound();
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
[Authorize]
[HttpPut("profile")]
public IActionResult UpdateProfile(UserProfileUpdateDto request)
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

    if (userIdClaim == null)
    {
        return Unauthorized();
    }

    int userId = int.Parse(userIdClaim.Value);

    var user = _context.Users.FirstOrDefault(u => u.Id == userId);

    if (user == null)
    {
        return NotFound(new
        {
            message = "Kullanıcı bulunamadı."
        });
    }

    var emailExists = _context.Users.Any(u =>
        u.Email.ToLower() == request.Email.ToLower() &&
        u.Id != userId);

    if (emailExists)
    {
        return BadRequest(new
        {
            message = "Bu e-posta başka bir kullanıcı tarafından kullanılıyor."
        });
    }

    user.FirstName = request.FirstName;
    user.LastName = request.LastName;
    user.Email = request.Email;
    user.Phone = request.Phone;

    _context.SaveChanges();

    return Ok(new
    {
        message = "Profil bilgileri başarıyla güncellendi."
    });
}

    }
}
