using eu_projects_main_platform.Models._5groutes.static_classes;

namespace eu_projects_main_platform.Models._5groutes
{
    public class ScenarioMeasurementValue
    {
        public long MeasurementValueId { get; set; }
        public long MeasurementId { get; set; }
        public long TestScenarioId { get; set; }
        public decimal? MeasurementValue { get; set; }
        public SatisfactoryLevelTypes SatisfactoryLevelType { get; set; }
        public string SatisfactoryLevelTypeValue{get; set;}
        public decimal SatisfactoryPercentageValue { get; set; }
        
    }
}
