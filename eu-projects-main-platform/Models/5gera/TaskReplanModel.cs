namespace eu_projects_main_platform.Models._5gera
{
    public class TaskReplanModel
    {
        public IEnumerable<Object> relations { get; set; } // ref: RelationModel
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string ActionPlanId { get; set; }
        public IEnumerable<Object>? ActionSequence { get; set; } // ref KeyValuPair

    }
}
