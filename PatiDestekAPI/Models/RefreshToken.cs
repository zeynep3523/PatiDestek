using System.ComponentModel.DataAnnotations;

namespace PatiDestekAPI.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }

        [Required]
        public string Token { get; set; } = string.Empty;

        public DateTime Expires { get; set; }

        public bool IsRevoked { get; set; } = false;

        public int UserId { get; set; }

        public User? User { get; set; }
    }
}