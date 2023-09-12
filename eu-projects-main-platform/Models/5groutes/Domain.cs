namespace eu_projects_main_platform.Models._5groutes
{
    public class Domain
    {
        public int Id { get; set; }
        public string DomainName { get; set; }
        public string ServerNetwork { get; set; }
        public string PublishTopic { get; set; }
        public string SubscribeTopic { get; set; }
        public string Operation { get; set; }
    }

    public class Coordinate
    {
        public int Id { get; set; }
        public string Coordinates { get; set; }
    }
}
