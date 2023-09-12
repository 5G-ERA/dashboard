namespace eu_projects_main_platform.Models.Inspectr
{
    public class JsonRuleWrapper
    {
        public string name { get; set; }
        public JsonRule rule { get; set; }
        public string status { get; set; }
    }

    public class JsonRule
    {
        public string condition { get; set; }
        public List<JsonRuleItem> inner_rules { get; set; }
        public List<Object> rules { get; set; }
        public string sqlQuery { get; set; }
    }

    public class JsonRuleItem : JsonRule
    {
        public JsonRequestor requestor { get; set; }
        public JsonRequest request { get; set; }
        public JsonCrime crime { get; set; }
        public JsonEvidence evidence { get; set; }
    }

    public class JsonRequestor
    {
        public string country { get; set; }
        public string member { get; set; }
    }

    public class JsonRequest
    {
        public string type { get; set; }
        public string jurisdiction { get; set; }
    }

    public class JsonCrime
    {
        public string type { get; set; }
        public string country { get; set; }
        public string Case { get; set; }
        public string level { get; set; }
    }

    public class JsonEvidence
    {
        public string source { get; set; }
        public string type { get; set; }
    }
}
