namespace eu_projects_main_platform.Models.Inspectr
{
    public class RuleInspectr
    {
        public long RuleID { get; set; }
        public string? RuleName { get; set; }
        public long Status { get; set; }
        public long Response { get; set; }
        public string? Query { get; set; }
        public float PriorityRange { get; set; }
        public string ApiRuleQueryString { get; set; }
    }
}
