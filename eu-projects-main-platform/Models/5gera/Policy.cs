namespace eu_projects_main_platform.Models._5gera
{
    public class Policy
    {
        public IEnumerable<Object>? relations { get; set; } // ref: RelationModel
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public DateTime TimeStamp { get; set; }
        public Boolean IsActive { get; set; }
        public string? Description { get; set; } // ref KeyValuPair

    }
}
