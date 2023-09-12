namespace eu_projects_main_platform.Models._5gera
{
    public class ActionPlan
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }    
        public IEnumerable<Object>? ActionSequence { get; set; } 
    }
}
