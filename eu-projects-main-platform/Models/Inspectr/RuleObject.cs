namespace eu_projects_main_platform.Models.Inspectr
{
    public class RuleObjectParent
    {
        public string condition { get; set; }
        public List<RuleObject> rules { get; set; }
        public List<Object> inner_rules { get; set; }
    }
    public class RuleObject:RuleObjectParent
    {
        public string id { get; set; }
        public string field { get; set; }
        public string type { get; set; }
        public string input { get; set; }
        public string Operator { get; set; }
        public string value { get; set; }
    }
}
