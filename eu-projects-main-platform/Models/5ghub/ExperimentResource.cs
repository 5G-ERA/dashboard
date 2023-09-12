namespace eu_projects_main_platform.Models._5ghub
{
    public class ExperimentResource
    {
        public Guid ResourceId { get; set; }
        public string ResourceCode { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsInUse { get; set; }
    }
}
