namespace eu_projects_main_platform.Models.Inspectr
{
    public class DetailedRuleInspectr
    {
        public long RuleID { get; set; }
        public string? RuleName { get; set; }

        public long StatusId { get; set; }
        public string? Status { get; set; }
        public string? Query { get; set; }
        public string? ApiRuleQueryString { get; set; }
        public string? SqlQuery { get; set; }
        public bool IsActive { get; set; }
    }
}
