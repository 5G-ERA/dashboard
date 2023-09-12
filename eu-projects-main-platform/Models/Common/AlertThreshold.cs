namespace eu_projects_main_platform.Models.Common
{
    public class AlertThreshold
    {
        public long AlertThresholdId { get; set; }
        public string AlertThresholdName { get; set; }
        public string AlertThresholdType { get; set; }
        public string AlertThresholdTable { get; set; }
        public Decimal MinValue { get; set; }
        public decimal MaxValue { get; set; }
        public bool IsActive { get; set; }
        public long UserId { get; set; }
    }
}
