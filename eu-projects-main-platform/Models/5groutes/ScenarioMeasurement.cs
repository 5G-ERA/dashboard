namespace eu_projects_main_platform.Models._5groutes
{
    public class ScenarioMeasurement
    {
        public long ScenarioMeasurementId { get; set; }
        public long PIId { get; set; }
        public long KPISubTypeId { get; set; }
        public string? PIName { get; set; }
        public string? ShortDescription { get; set; }
        public string? LongDescription { get; set; }
        public string? LowValue { get; set; }
        public string? LowOperator { get; set; }
        public string? HighOperator { get; set; }
        public string? HighValue { get; set; }
        public string? UnitOfMeasure { get; set; }
    }
}
