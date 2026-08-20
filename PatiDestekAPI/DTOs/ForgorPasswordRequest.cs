using System.ComponentModel.DataAnnotations;

namespace PatiDestekAPI.DTOs
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}