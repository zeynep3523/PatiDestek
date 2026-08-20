namespace PatiDestekAPI.DTOs
{
    public class CreateVeterinarianRequest
    {
        public string ClinicName { get; set; } = string.Empty;
        public string VeterinarianName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string WorkingHours { get; set; } = "09:00 - 18:00";
        public bool IsEmergencyService { get; set; }
    }
}