namespace PatiDestekAPI.DTOs
{
    public class CreateStaffRequest
    {
        public string FirstName { get; set; } = "";

        public string LastName { get; set; } = "";

        public string Email { get; set; } = "";

        public string Phone { get; set; } = "";

        public string Password { get; set; } = "";

        public string JobTitle { get; set; } = "";

        // Municipality veya Veterinarian
        public string Role { get; set; } = "";
    }
}