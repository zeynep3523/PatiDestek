using System.ComponentModel.DataAnnotations;
using PatiDestekAPI.Enums;

namespace PatiDestekAPI.DTOs
{
    public class UpdateReportRequest
    {
        [Required]
        [StringLength(50)]
        public string AnimalType { get; set; } = string.Empty;

        public ReportCategory Category { get; set; }

           [Required]
public PriorityLevel Priority { get; set; }
                public string Description { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Location { get; set; } = string.Empty;
        [Required(ErrorMessage = "Mahalle zorunludur.")]
[StringLength(100)]
public string District { get; set; } = string.Empty;

        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }
    }
}