using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PatiDestekAPI.Models
{
    public class Message
    {
        public int Id { get; set; }

        [Required]
        public int SenderId { get; set; }

        [ForeignKey("SenderId")]
        public User? Sender { get; set; }

        [Required]
        public int ReceiverId { get; set; }

        [ForeignKey("ReceiverId")]
        public User? Receiver { get; set; }

        [Required]
        [StringLength(1000)]
        public string Content { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}