namespace eu_projects_main_platform.Models.Planet
{
    public class AlertCondition
    {
        public string Type { get; set; } // > , < , =
        public string FieldName { get; set; }
        public string CompareValue { get; set; }
    }
}
