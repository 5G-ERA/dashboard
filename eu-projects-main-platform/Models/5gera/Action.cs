namespace eu_projects_main_platform.Models._5gera
{
    public class Action
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? ActionFamily { get; set; }
        public int Order { get; set; }
        public string? Placement { get; set; } 
        public string? ActionPriority { get; set; }
        public IEnumerable<Object>? Services { get; set; }
    }
}
