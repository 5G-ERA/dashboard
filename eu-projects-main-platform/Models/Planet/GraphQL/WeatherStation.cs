namespace eu_projects_main_platform.Models.Planet.GraphQL
{
    public class WeatherStation
    {
        public string Id { get; set; }
        public string rdfs_label { get; set; }
    }

    public class WeatherStationList
    {
        public List<WeatherStation> weatherStation { get; set; }
    }

    public class WeatherStations
    {
        public WeatherStationList data { get; set; }
    }
}
