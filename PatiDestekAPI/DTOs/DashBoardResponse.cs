namespace PatiDestekAPI.DTOs
{
    public class DashboardResponse
    {
        public int TotalUsers { get; set; }
        public int TotalReports { get; set; }
        public int ActiveReports { get; set; }
        public int ResolvedReports { get; set; }
        public int TotalVeterinarians { get; set; }
    }
}