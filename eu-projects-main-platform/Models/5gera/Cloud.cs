namespace eu_projects_main_platform.Models._5gera
{
    public class Cloud
    {
        public IEnumerable<Object>? relations { get; set; } // ref: RelationModel
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? CloudStatus { get; set; }
        public Uri? CloudIp{ get; set; }
    }
}
