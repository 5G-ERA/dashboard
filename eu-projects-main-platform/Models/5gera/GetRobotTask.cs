using System.ComponentModel.DataAnnotations;

namespace eu_projects_main_platform.Models._5gera
{
    public class GetRobotTask
    {
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
        public string firstPage { get; set; }
        public string lastPage { get; set; }
        public int totalPages { get; set; }
        public int totalRecords { get; set; }
        public object nextPage { get; set; }
        public object previousPage { get; set; }
        public RobotTasks[] data { get; set; }
        public int statusCode { get; set; }
        public object message { get; set; }
        public DateTime timeStamp { get; set; }
        public bool isError { get; set; }
    }

    public class RobotTasks
    {
        public string robotName { get; set; }
        public string robotId { get; set; }
        public string taskName { get; set; }
        public string taskId { get; set; }
        public DateTime taskStartTime { get; set; }
        public object taskCompletedTime { get; set; }
        public string robotStatus { get; set; }
    }
    // Edit Task
    public class EditTask
    {
        public RelationTask[] relations { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public bool ReplanActionPlannerLocked { get; set; }
        public bool ResourceLock { get; set; }
        public int TaskPriority { get; set; }
        public string ActionPlanId { get; set; }
        public bool FullReplan { get; set; }
        public bool PartialRePlan { get; set; }
        public bool DeterministicTask { get; set; }
        public bool MarkovianProcess { get; set; }
        public ActionsequenceTask[] ActionSequence { get; set; }
        public string[] Tags { get; set; }
    }

    public class RelationTask
    {
        public InitiatesfromTask initiatesFrom { get; set; }
        public string relationName { get; set; }
        public RelationattributeTask[] relationAttributes { get; set; }
        public Pointsto pointsToTask { get; set; }
    }

    public class InitiatesfromTask
    {
        public string id { get; set; }
        public string type { get; set; }
        public string name { get; set; }
    }

    public class PointstoTask
    {
        public string id { get; set; }
        public string type { get; set; }
        public string name { get; set; }
    }

    public class RelationattributeTask
    {
        public string key { get; set; }
        public string value { get; set; }
    }

    public class ActionsequenceTask
    {
        public Relation1[] relations { get; set; }
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

    public class Relation1
    {
        public Initiatesfrom1 initiatesFrom { get; set; }
        public string relationName { get; set; }
        public Relationattribute1[] relationAttributes { get; set; }
        public Pointsto1 pointsTo { get; set; }
    }

    public class Initiatesfrom1
    {
        public string id { get; set; }
        public string type { get; set; }
        public string name { get; set; }
    }

    public class Pointsto1
    {
        public string id { get; set; }
        public string type { get; set; }
        public string name { get; set; }
    }

    public class Relationattribute1
    {
        public string key { get; set; }
        public string value { get; set; }
    }

    public class Service
    {
        public Relation2[] relations { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string ServiceInstanceId { get; set; }
        public string ServiceType { get; set; }
        public bool IsReusable { get; set; }
        public string DesiredStatus { get; set; }
        public string ServiceUrl { get; set; }
        public Rostopicspub[] RosTopicsPub { get; set; }
        public Rostopicssub[] RosTopicsSub { get; set; }
        public int ROSVersion { get; set; }
        public string ROSDistro { get; set; }
        public string[] Tags { get; set; }
        public string InstanceFamily { get; set; }
        public int SuccessRate { get; set; }
        public string ServiceStatus { get; set; }
        public int MinimumRam { get; set; }
        public int MinimumNumCores { get; set; }
        public DateTime OnboardedTime { get; set; }
    }

    public class Relation2
    {
        public Initiatesfrom2 initiatesFrom { get; set; }
        public string relationName { get; set; }
        public Relationattribute2[] relationAttributes { get; set; }
        public Pointsto2 pointsTo { get; set; }
    }

    public class Initiatesfrom2
    {
        public string id { get; set; }
        public string type { get; set; }
        public string name { get; set; }
    }

    public class Pointsto2
    {
        public string id { get; set; }
        public string type { get; set; }
        public string name { get; set; }
    }

    public class Relationattribute2
    {
        public string key { get; set; }
        public string value { get; set; }
    }

    public class Rostopicspub
    {
        public string name { get; set; }
        public string type { get; set; }
        public string description { get; set; }
        public bool enabled { get; set; }
    }

    public class Rostopicssub
    {
        public string name { get; set; }
        public string type { get; set; }
        public string description { get; set; }
        public bool enabled { get; set; }
    }


}
