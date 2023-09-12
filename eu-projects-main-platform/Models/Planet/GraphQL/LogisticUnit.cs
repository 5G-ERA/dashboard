namespace eu_projects_main_platform.Models.Planet.GraphQL
{
    public class LogisticUnitSet
    {
        public IEnumerable<LogisticUnit> logisticUnit { get; set; }
    }

    public class LogisticUnit
    {
        public string id { get; set; }
        public string status { get; set; }
        public string createdOn { get; set; }
        public string completedOn { get; set; }
        public IEnumerable<LogisticUnitAsset> assets { get; set; }
    }

    public class LogisticUnitAsset
    {
        public string id { get; set; }
    }

    public class LogisticUnitSetWrapper
    {
        public LogisticUnitSet data { get; set; }
    }
}
