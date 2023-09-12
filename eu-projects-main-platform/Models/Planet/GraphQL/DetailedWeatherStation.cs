namespace eu_projects_main_platform.Models.Planet.GraphQL
{
    public class DetailedWeatherStationContent
    {
        public string id { get; set; }
        public string rdfs_label { get; set; }
        public IEnumerable<DetailedWeatherHost> hosts { get; set; }
    }

    public class DetailedWeatherHost
    {
        public string id { get; set; }
        public IEnumerable<DetailedWeatherObservation> observations { get; set; }
    }

    public class DetailedWeatherObservation
    {
        public string time { get; set; }
        public long timestamp { get; set; }
        public decimal value { get; set; }
    }

    public class DetailedWeatherStationContentWrapper
    {
        public IEnumerable<DetailedWeatherStationContent> weatherStation { get; set; }
    }

    public class DetailedWeatherStation
    {
        public DetailedWeatherStationContentWrapper data { get; set; }
    }
}
