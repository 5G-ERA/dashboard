namespace eu_projects_api.Models.Planet.Helpers
{
    public class PlanetDbSettings: IPlanetDbSettings
    {
        public string collectionName { get; set; } = String.Empty;
        public string connectionString { get; set; } = String.Empty;
        public string DataBaseName { get; set; } = String.Empty;
    }
}
