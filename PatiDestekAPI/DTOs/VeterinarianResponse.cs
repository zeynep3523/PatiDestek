namespace PatiDestekAPI.DTOs
{
    public class VeterinarianResponse
    {
        public int Id { get; set; }
        public string ClinicName { get; set; } = string.Empty;
        public string VeterinarianName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string WorkingHours { get; set; } = string.Empty;
        public bool IsEmergencyService { get; set; }
        public bool IsActive { get; set; }
    }
}