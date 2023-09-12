namespace eu_projects_api.Models.Planet.Helpers
{
    public interface IPlanetDbSettings
    {
        public string collectionName { get; set; }
        public string connectionString { get; set; }
        public string DataBaseName { get; set; }
    }
}
