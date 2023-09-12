namespace eu_projects_main_platform.Models.Planet.Auth
{
    public class PlanetAuthResponse
    {
        public bool Success { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public string Notes { get; set; }
    }
}
