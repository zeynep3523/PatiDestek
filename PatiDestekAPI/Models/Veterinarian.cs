using System.ComponentModel.DataAnnotations;

namespace PatiDestekAPI.Models
{
    public class Veterinarian
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Klinik adı zorunludur.")]
        [StringLength(150, ErrorMessage = "Klinik adı en fazla 150 karakter olabilir.")]
        public string ClinicName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Veteriner adı zorunludur.")]
        [StringLength(100, ErrorMessage = "Veteriner adı en fazla 100 karakter olabilir.")]
        public string VeterinarianName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Telefon numarası zorunludur.")]
        [Phone(ErrorMessage = "Geçerli bir telefon numarası giriniz.")]
        [StringLength(20, ErrorMessage = "Telefon numarası en fazla 20 karakter olabilir.")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Adres zorunludur.")]
        [StringLength(300, ErrorMessage = "Adres en fazla 300 karakter olabilir.")]
        public string Address { get; set; } = string.Empty;

        [Range(-90, 90, ErrorMessage = "Geçerli bir enlem (Latitude) giriniz.")]
        public double Latitude { get; set; }

        [Range(-180, 180, ErrorMessage = "Geçerli bir boylam (Longitude) giriniz.")]
        public double Longitude { get; set; }

        [Required(ErrorMessage = "Çalışma saatleri zorunludur.")]
        [StringLength(50, ErrorMessage = "Çalışma saatleri en fazla 50 karakter olabilir.")]
        public string WorkingHours { get; set; } = "09:00 - 18:00";

        public bool IsEmergencyService { get; set; }

        public bool IsActive { get; set; } = true;
    }
}