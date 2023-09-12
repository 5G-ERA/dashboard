using System.ComponentModel.DataAnnotations;

namespace eu_projects_main_platform.Models.Planet.Auth
{
    public class RefreshTokenRequest
    {
        [Required]
        public string Token { get; set; }
        [Required]
        public string RefreshToken { get; set; }
    }
}
