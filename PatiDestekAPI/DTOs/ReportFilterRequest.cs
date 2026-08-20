using PatiDestekAPI.Enums;

namespace PatiDestekAPI.DTOs
{
    public class ReportFilterRequest
    {
        public ReportCategory? Category { get; set; }

        public PriorityLevel? Priority { get; set; }

        public string? Status { get; set; }

        public string? AnimalType { get; set; }
    }
}