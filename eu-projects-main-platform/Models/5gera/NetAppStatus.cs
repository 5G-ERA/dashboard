namespace eu_projects_main_platform.Models._5gera
{
    public class NetAppStatus
    {
        public IEnumerable<Object>? relations { get; set; }
        public Guid id { get; set; }
        public string? name { get; set; }
        public int hardLimit { get; set; }
        public int optimalLimit { get; set; }
        public int currentRobotsCount { get; set; }
        public DateTime timeStamp { get; set; }
    }
}
