using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PatiDestekAPI.Data;
using PatiDestekAPI.DTOs;
using PatiDestekAPI.Models;

namespace PatiDestekAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotificationController(AppDbContext context)
        {
            _context = context;
        }

        // Bildirim Oluştur
        [HttpPost]
        public async Task<IActionResult> CreateNotification(CreateNotificationRequest request)
        {
            var user = await _context.Users.FindAsync(request.UserId);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "Kullanıcı bulunamadı."
                });
            }

            var notification = new Notification
            {
                UserId = request.UserId,
                Title = request.Title,
                Message = request.Message
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Bildirim oluşturuldu."
            });
        }

        // Kullanıcının Bildirimleri
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserNotifications(int userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NotificationResponse
                {
                    Id = n.Id,
                    Title = n.Title,
                    Message = n.Message,
                    IsRead = n.IsRead,
                    CreatedAt = n.CreatedAt,
                    ReportId = n.ReportId,
Type = n.Type
                })
                .ToListAsync();

            return Ok(notifications);
        }

        // Bildirimi Okundu Yap
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);

            if (notification == null)
            {
                return NotFound(new
                {
                    message = "Bildirim bulunamadı."
                });
            }

            notification.IsRead = true;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Bildirim okundu olarak işaretlendi."
            });
        }
        
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteNotification(int id)
{
    var notification = await _context.Notifications.FindAsync(id);

    if (notification == null)
    {
        return NotFound(new
        {
            message = "Bildirim bulunamadı."
        });
    }

    _context.Notifications.Remove(notification);
    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "Bildirim başarıyla silindi."
    });
}
    }
}