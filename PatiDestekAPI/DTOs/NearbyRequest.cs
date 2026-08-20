namespace PatiDestekAPI.DTOs
{
    public class NearbyRequest
    {
        public double Latitude { get; set; }

        public double Longitude { get; set; }

        // Kilometre cinsinden
        public double Radius { get; set; } = 5;
    }
}