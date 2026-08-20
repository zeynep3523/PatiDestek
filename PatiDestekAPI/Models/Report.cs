using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PatiDestekAPI.Enums;

namespace PatiDestekAPI.Models
{
    public class Report
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Hayvan türü zorunludur.")]
        [StringLength(100, ErrorMessage = "Hayvan türü en fazla 100 karakter olabilir.")]
        public string AnimalType { get; set; } = string.Empty;

        [Required(ErrorMessage = "Kategori zorunludur.")]
        public ReportCategory Category { get; set; }

        [Required(ErrorMessage = "Öncelik seviyesi zorunludur.")]
        public PriorityLevel Priority { get; set; } = PriorityLevel.Orta;

        [Required(ErrorMessage = "Açıklama zorunludur.")]
        [StringLength(1000, ErrorMessage = "Açıklama en fazla 1000 karakter olabilir.")]
        public string Description { get; set; } = string.Empty;
        [Required(ErrorMessage = "Konum bilgisi zorunludur.")]
[StringLength(250, ErrorMessage = "Konum en fazla 250 karakter olabilir.")]
public string Location { get; set; } = string.Empty;

[Required(ErrorMessage = "Mahalle bilgisi zorunludur.")]
[StringLength(100, ErrorMessage = "Mahalle adı en fazla 100 karakter olabilir.")]
public string District { get; set; } = string.Empty;

        [Range(-90, 90, ErrorMessage = "Geçerli bir enlem (Latitude) giriniz.")]
public double Latitude { get; set; }
        

        [Range(-180, 180, ErrorMessage = "Geçerli bir boylam (Longitude) giriniz.")]
        public double Longitude { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Required(ErrorMessage = "Durum bilgisi zorunludur.")]
        [StringLength(50, ErrorMessage = "Durum en fazla 50 karakter olabilir.")]
        public string Status { get; set; } = "Bekliyor";

        [StringLength(1000, ErrorMessage = "Admin notu en fazla 1000 karakter olabilir.")]
        public string? AdminNote { get; set; }

        [StringLength(500, ErrorMessage = "Resim yolu en fazla 500 karakter olabilir.")]
        public string? ImageUrl { get; set; }
        public bool IsDeleted { get; set; } = false;

        [Required(ErrorMessage = "Kullanıcı bilgisi zorunludur.")]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }
        public bool IsUpdated { get; set; } = false;
        public int? AssignedStaffId { get; set; }

[ForeignKey("AssignedStaffId")]
public User? AssignedStaff { get; set; }
public int? AssignedByUserId { get; set; }

[ForeignKey("AssignedByUserId")]
public User? AssignedByUser { get; set; }
    }
}