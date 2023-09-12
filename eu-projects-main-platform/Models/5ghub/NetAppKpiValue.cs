namespace eu_projects_main_platform.Models._5ghub
{
    public class NetAppKpiValue
    {
        public long KpiValueId { get; set; }
        public long NetAppId { get; set; }
        public string NetAppExecutionId { get; set; }
        public string TimeStamp { get; set; }
        public string KpiName { get; set; }
        public decimal KpiValue { get; set; }
        public string KpiUnit { get; set; }
        public string? MoidObject { get; set; }
    }
}
