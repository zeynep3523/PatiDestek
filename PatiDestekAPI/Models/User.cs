using System.ComponentModel.DataAnnotations;

namespace PatiDestekAPI.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Ad zorunludur.")]
        [StringLength(50, ErrorMessage = "Ad en fazla 50 karakter olabilir.")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Soyad zorunludur.")]
        [StringLength(50, ErrorMessage = "Soyad en fazla 50 karakter olabilir.")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "E-posta zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
        [StringLength(100, ErrorMessage = "E-posta en fazla 100 karakter olabilir.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Telefon numarası zorunludur.")]
        [Phone(ErrorMessage = "Geçerli bir telefon numarası giriniz.")]
        [StringLength(20, ErrorMessage = "Telefon numarası en fazla 20 karakter olabilir.")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Şifre zorunludur.")]
        [MinLength(6, ErrorMessage = "Şifre en az 6 karakter olmalıdır.")]
        [MaxLength(100, ErrorMessage = "Şifre en fazla 100 karakter olabilir.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Rol zorunludur.")]
        public string Role { get; set; } = "User";

        public bool IsEmailVerified { get; set; } = false;

        public DateTime? VerificationCodeExpireDate { get; set; }

        public string? ResetPasswordCode { get; set; }

        public DateTime? ResetPasswordCodeExpireDate { get; set; }

        public string? EmailVerificationCode { get; set; }

        
        public int FailedLoginCount { get; set; } = 0;

        public DateTime? LockoutEnd { get; set; }
        public string? JobTitle { get; set; }
    }
}