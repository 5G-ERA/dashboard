namespace eu_projects_main_platform.Models._5gera
{
    public class GetAction
    {
        public string? taskName { get; set; }
        public string? taskId { get; set; }
        public List<string>? actions { get; set; }
    }

    public class EditAction
    {
        public Relation[] relations { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string[] Tags { get; set; }
        public int Order { get; set; }
        public string Placement { get; set; }
        public string PlacementType { get; set; }
        public string ActionPriority { get; set; }
        public string ActionStatus { get; set; }
        public Service[] Services { get; set; }
        public int MinimumRam { get; set; }
        public int MinimumNumCores { get; set; }
    }

    public class Relation
    {
        public InitiatesfromAction initiatesFrom { get; set; }
        public string relationName { get; set; }
        public RelationattributeAction[] relationAttributes { get; set; }
        public PointstoAction pointsTo { get; set; }
    }

    public class InitiatesfromAction
    {
        public string id { get; set; }
        public string type { get; set; }
        public string name { get; set; }
    }

    public class PointstoAction
    {
        public string id { get; set; }
        public string type { get; set; }
        public string name { get; set; }
    }

    public class RelationattributeAction
    {
        public string key { get; set; }
        public string value { get; set; }
    }

    //public class Service
    //{
    //    public Relation1[] relations { get; set; }
    //    public string Id { get; set; }
    //    public string Name { get; set; }
    //    public string ServiceInstanceId { get; set; }
    //    public string ServiceType { get; set; }
    //    public bool IsReusable { get; set; }
    //    public string DesiredStatus { get; set; }
    //    public string ServiceUrl { get; set; }
    //    public Rostopicspub[] RosTopicsPub { get; set; }
    //    public Rostopicssub[] RosTopicsSub { get; set; }
    //    public int ROSVersion { get; set; }
    //    public string ROSDistro { get; set; }
    //    public string[] Tags { get; set; }
    //    public string InstanceFamily { get; set; }
    //    public int SuccessRate { get; set; }
    //    public string ServiceStatus { get; set; }
    //    public int MinimumRam { get; set; }
    //    public int MinimumNumCores { get; set; }
    //    public DateTime OnboardedTime { get; set; }
    //}

    //public class Relation1
    //{
    //    public Initiatesfrom1 initiatesFrom { get; set; }
    //    public string relationName { get; set; }
    //    public Relationattribute1[] relationAttributes { get; set; }
    //    public Pointsto1 pointsTo { get; set; }
    //}

    //public class Initiatesfrom1
    //{
    //    public string id { get; set; }
    //    public string type { get; set; }
    //    public string name { get; set; }
    //}

    //public class Pointsto1
    //{
    //    public string id { get; set; }
    //    public string type { get; set; }
    //    public string name { get; set; }
    //}

    //public class Relationattribute1
    //{
    //    public string key { get; set; }
    //    public string value { get; set; }
    //}

    //public class Rostopicspub
    //{
    //    public string name { get; set; }
    //    public string type { get; set; }
    //    public string description { get; set; }
    //    public bool enabled { get; set; }
    //}

    //public class Rostopicssub
    //{
    //    public string name { get; set; }
    //    public string type { get; set; }
    //    public string description { get; set; }
    //    public bool enabled { get; set; }
    //}


}
