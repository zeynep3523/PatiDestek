using System.ComponentModel.DataAnnotations;
using PatiDestekAPI.Enums;

namespace PatiDestekAPI.DTOs
{
    public class CreateReportRequest
    {
        [Required(ErrorMessage = "Hayvan türü zorunludur.")]
        [StringLength(50)]
        public string AnimalType { get; set; } = string.Empty;

        public ReportCategory Category { get; set; }

        public PriorityLevel Priority { get; set; }

        [Required(ErrorMessage = "Açıklama zorunludur.")]
        [MinLength(10, ErrorMessage = "Açıklama en az 10 karakter olmalıdır.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Konum zorunludur.")]
        [StringLength(200)]
        public string Location { get; set; } = string.Empty;
        [Required(ErrorMessage = "Mahalle zorunludur.")]
[StringLength(100)]
public string District { get; set; } = string.Empty;
        [Required(ErrorMessage = "Enlem (Latitude) zorunludur.")]
        public double Latitude { get; set; }

        [Required(ErrorMessage = "Boylam (Longitude) zorunludur.")]
        public double Longitude { get; set; }
    }
}