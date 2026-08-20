namespace PatiDestekAPI.DTOs
{
    public class DashboardStatisticsDto
    {
        // Günlük
        public int TodayReports { get; set; }
        public int TodayWaiting { get; set; }
        public int TodayReviewing { get; set; }
        public int TodayCompleted { get; set; }

        // Genel
        public int TotalReports { get; set; }
        public int TotalWaiting { get; set; }
        public int TotalReviewing { get; set; }
        public int TotalCompleted { get; set; }
    }
}