using PatiDestekAPI.Enums;

namespace PatiDestekAPI.DTOs
{
    public class NearbyReportResponse
    {
        public int Id { get; set; }

        public string AnimalType { get; set; } = string.Empty;

        public ReportCategory Category { get; set; }

        public PriorityLevel Priority { get; set; }

        public string Description { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string Status { get; set; } = string.Empty;

        public double DistanceKm { get; set; }
    }
}