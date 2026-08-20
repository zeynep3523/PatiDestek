
using System.ComponentModel.DataAnnotations;

namespace PatiDestekAPI.DTOs
{
    public class RefreshTokenRequest
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}