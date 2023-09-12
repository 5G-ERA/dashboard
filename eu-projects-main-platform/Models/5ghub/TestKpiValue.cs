namespace eu_projects_main_platform.Models._5ghub
{
    public class TestKpiValue
    {
        public long TestKpiValueId { get; set; }
        public long UseCaseId { get; set; }
        public string testCaseId { get; set; }
        public string TimeStamp { get; set; }
        public string KpiName { get; set; }
        public decimal KpiValue { get; set; }
        public string KpiUnit { get; set; }
        public string? MoidObject { get; set; }
    }
}
