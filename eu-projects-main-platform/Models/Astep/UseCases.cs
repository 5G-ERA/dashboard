namespace eu_projects_main_platform.Models.Astep
{
    public class UseCases
    {
        public long UseCaseId { get; set; }
        public DateTime EntryDate { get; set; }
        public string? UseCaseName { get; set; }
        public string? UseCaseDescription { get; set; }
        public DateTime LastUpdated { get; set; }
        public string? ResponsiblePerson { get; set; }
        public string? ContactPerson { get; set; }
        public string? UCID { get; set; }
        public string? CategoryName { get; set; }
    }
}
