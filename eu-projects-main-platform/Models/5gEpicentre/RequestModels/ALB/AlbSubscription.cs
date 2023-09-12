namespace eu_projects_main_platform.Models._5gEpicentre
{
    public class AlbSubscription
    {
        public string afServiceId { get; set; } = String.Empty;
        public string afAppId { get; set; } = String.Empty ;
        public string afTransId { get; set; } = String.Empty;
        public string ipv4Addr { get; set; } = String.Empty;
        public List<TrafficRoute> trafficRoutes { get; set; } = new List<TrafficRoute>();
    }
    public class TrafficRoute
    {
        public string dnai { get; set; } = String.Empty;
        public RouteInfo routeInfo { get; set; } //= new RouteInfo();
        public string routeProfId { get; set; } = String.Empty;
    }

    public class RouteInfo
    {
        public string Ipv4Addr { get; set; } = String.Empty;
        public string Ipv6Addr { get; set; } = String.Empty;
        public int portNumber { get; set; }
    }

    
}
