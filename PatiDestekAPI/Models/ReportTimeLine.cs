namespace PatiDestekAPI.Models
{
    public class ReportTimeline
    {
        public int Id { get; set; }

        public int ReportId { get; set; }
        public Report Report { get; set; } = null!;

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}