using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PatiDestekAPI.Data;
using PatiDestekAPI.Models;
using System.Security.Claims;

namespace PatiDestekAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "SuperAdmin,Municipality,Veterinarian")]
    public class MessageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessageController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null)
                throw new UnauthorizedAccessException();

            return int.Parse(claim.Value);
        }

        // Mesaj gönder
        [HttpPost]
        public IActionResult SendMessage([FromBody] MessageRequest request)
        {
            var senderId = GetUserId();

            if (request.ReceiverId <= 0)
            {
                return BadRequest(new
                {
                    message = "Alıcı seçilmedi."
                });
            }

            if (string.IsNullOrWhiteSpace(request.Content))
            {
                return BadRequest(new
                {
                    message = "Mesaj boş olamaz."
                });
            }
            var receiver = _context.Users.FirstOrDefault(u =>
    u.Id == request.ReceiverId &&
    (u.Role == "SuperAdmin" ||
     u.Role == "Municipality" ||
     u.Role == "Veterinarian"));

            

            if (receiver == null)
            {
                return BadRequest(new
                {
                    message = "Alıcı bulunamadı."
                });
            }

            var message = new Message
            {
                SenderId = senderId,
                ReceiverId = request.ReceiverId,
                Content = request.Content.Trim(),
                CreatedAt = DateTime.Now,
                IsRead = false
            };

            _context.Messages.Add(message);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Mesaj başarıyla gönderildi."
            });
        }

        // Kullanıcının aldığı mesajlar
        [HttpGet("inbox")]
        public IActionResult GetInbox()
        {
            var userId = GetUserId();

            var messages = _context.Messages
                .Include(m => m.Sender)
                .Where(m => m.ReceiverId == userId)
                .OrderByDescending(m => m.CreatedAt)
                .Select(m => new
                {
                    m.Id,
                    m.Content,
                    m.IsRead,
                    m.CreatedAt,
                    Sender = m.Sender == null ? null : new
                    {
                        m.Sender.Id,
                        m.Sender.FirstName,
                        m.Sender.LastName,
                        m.Sender.Role
                    }
                })
                .ToList();

            return Ok(messages);
        }
        [HttpGet("conversation/{userId}")]
public IActionResult GetConversation(int userId)
{
    var currentUserId = GetUserId();

    var messages = _context.Messages
        .Include(m => m.Sender)
        .Include(m => m.Receiver)
        .Where(m =>
            (m.SenderId == currentUserId && m.ReceiverId == userId) ||
            (m.SenderId == userId && m.ReceiverId == currentUserId))
        .OrderBy(m => m.CreatedAt)
        .Select(m => new
        {
            m.Id,
            m.Content,
            m.IsRead,
            m.CreatedAt,
            m.SenderId,
            m.ReceiverId,
            Sender = m.Sender == null ? null : new
            {
                m.Sender.Id,
                m.Sender.FirstName,
                m.Sender.LastName
            },
            Receiver = m.Receiver == null ? null : new
            {
                m.Receiver.Id,
                m.Receiver.FirstName,
                m.Receiver.LastName
            }
        })
        .ToList();

    return Ok(messages);
}
[HttpPut("conversation/{userId}/read")]
public IActionResult MarkConversationAsRead(int userId)
{
    var currentUserId = GetUserId();

    var messages = _context.Messages
        .Where(m =>
            m.SenderId == userId &&
            m.ReceiverId == currentUserId &&
            !m.IsRead)
        .ToList();

    foreach (var message in messages)
    {
        message.IsRead = true;
    }

    _context.SaveChanges();

    return Ok(new
    {
        message = "Konuşmadaki mesajlar okundu."
    });
}


        // Kullanıcının gönderdiği mesajlar
        [HttpGet("sent")]
        public IActionResult GetSentMessages()
        {
            var userId = GetUserId();

            var messages = _context.Messages
                .Include(m => m.Receiver)
                .Where(m => m.SenderId == userId)
                .OrderByDescending(m => m.CreatedAt)
                .Select(m => new
                {
                    m.Id,
                    m.Content,
                    m.IsRead,
                    m.CreatedAt,
                    Receiver = m.Receiver == null ? null : new
                    {
                        m.Receiver.Id,
                        m.Receiver.FirstName,
                        m.Receiver.LastName,
                        m.Receiver.Role
                    }
                })
                .ToList();

            return Ok(messages);
        }

        // Mesajı okundu yap
        [HttpPut("{id}/read")]
        public IActionResult MarkAsRead(int id)
        {
            var userId = GetUserId();

            var message = _context.Messages.FirstOrDefault(m =>
                m.Id == id &&
                m.ReceiverId == userId);

            if (message == null)
            {
                return NotFound(new
                {
                    message = "Mesaj bulunamadı."
                });
            }

            message.IsRead = true;
            _context.SaveChanges();

            return Ok(new
            {
                message = "Mesaj okundu olarak işaretlendi."
            });
        }
        [HttpDelete("{id}")]
public IActionResult DeleteMessage(int id)
{
    var userId = GetUserId();

    var message = _context.Messages.FirstOrDefault(m =>
        m.Id == id &&
        m.ReceiverId == userId);

    if (message == null)
    {
        return NotFound(new
        {
            message = "Mesaj bulunamadı."
        });
    }

    _context.Messages.Remove(message);
    _context.SaveChanges();

    return Ok(new
    {
        message = "Mesaj başarıyla silindi."
    });
}
    }

    public class MessageRequest
    {
        public int ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}