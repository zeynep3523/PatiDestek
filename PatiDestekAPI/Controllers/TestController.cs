using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PatiDestekAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        [Authorize]
        public IActionResult Get()
        {
            return Ok(new
            {
                message = "JWT doğrulaması başarılı. Bu endpoint'e sadece giriş yapan kullanıcılar erişebilir."
            });
        }
    }
}
