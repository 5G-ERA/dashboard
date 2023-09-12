using eu_projects_main_platform.Models._5groutes.static_classes;

namespace eu_projects_main_platform.Models._5groutes
{
    public class DetailedScenarioMeasurementValue
    {
        public long MeasurementValueId { get; set; }
        public long MeasurementId { get; set; }
        public string? TestName { get; set; }
        public long PiId { get; set; }
        public string? PIName { get; set; }
        public long KpiSubTypeId { get; set; }
        public string? KpiSubTypeCode { get; set; }
        public long TestScenarioId { get; set; }
        public decimal? MeasurementValue { get; set; }
        public string? LowValue { get; set; }
        public string? HighValue { get; set; }
        public SatisfactoryLevelTypes SatisfactoryLevelType { get; set; }
        public string SatisfactoryLevelTypeValue { get; set; }
        public decimal SatisfactoryPercentageValue { get; set; }
        public string? UnitOfMeasure { get; set; }
    }
}
