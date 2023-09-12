namespace eu_projects_main_platform.Models._5gera
{

    public class GraphRelationship
    {
        public string initiatesFromid { get; set; }
        public string initiatesFromtype { get; set; }
        public string initiatesFromname { get; set; }
        public string relationName { get; set; }
        public string pointsToid { get; set; }
        public string pointsTotype { get; set; }
        public string pointsToname { get; set; }
    }
    public class Relationship
    {
        public Initiatesfrom initiatesFrom { get; set; }
        public string relationName { get; set; }
        public Relationattribute[] relationAttributes { get; set; }
        public Pointsto pointsTo { get; set; }
    }
    public class Initiatesfrom
    {
        public string id { get; set; }
        public string type { get; set; }
        public string name { get; set; }
    }

    public class Pointsto
    {
        public string id { get; set; }
        public string type { get; set; }
        public string name { get; set; }
    }

    public class Relationattribute
    {
        public string key { get; set; }
        public string value { get; set; }
    }

}
