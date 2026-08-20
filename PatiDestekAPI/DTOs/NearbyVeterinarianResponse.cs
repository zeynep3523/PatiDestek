namespace PatiDestekAPI.DTOs
{
    public class NearbyVeterinarianResponse
    {
        public int Id { get; set; }
        public string ClinicName { get; set; } = string.Empty;
        public string VeterinarianName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string WorkingHours { get; set; } = string.Empty;
        public bool IsEmergencyService { get; set; }
        public double DistanceKm { get; set; }
    }
}