
namespace eu_projects_main_platform.Models._5ghub.API
{
    public class KpiModel
    {
        public TestModel test { get; set; }
        public DataModel data { get; set; }
        public NetAppModel netapp { get; set; }
    }

    public class NetAppModel
    {
        public long? id { get; set; }
        public string name { get; set; }
        public string netapp_execution_id { get; set; }
    }

    public class DataModel
    {
        public string timestamp { get; set; }
        public IEnumerable<Moid> moids { get; set; }
        public IEnumerable<KpiApiObject> kpis { get; set; }
    }

    public class TestModel
    {
        public string use_case { get; set; }
        public string test_case { get; set; }
        public string test_case_id { get; set; }
    }

    public class Moid
    {
        public string name { get; set; }
        public string value { get; set; }
    }

    public class KpiApiObject
    {
        public string name { get; set; }
        public string value { get; set; }
        public string unit { get; set; }
    }
}
