namespace PatiDestekAPI.DTOs
{
using PatiDestekAPI.Enums;

    public class ReportResponse
    {
        public int Id { get; set; }

        public string AnimalType { get; set; } = string.Empty;
        public ReportCategory Category { get; set; }
        public PriorityLevel Priority { get; set; }        public string Description { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public int UserId { get; set; }

        public DateTime CreatedDate { get; set; }

        public string Status { get; set; } = string.Empty;

        public string? AdminNote { get; set; }

        public string? ImageUrl { get; set; }
    }
}