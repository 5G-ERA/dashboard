using System.ComponentModel.DataAnnotations;

namespace eu_projects_main_platform.Models._5gera
{

    public class GetCloud
    {
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
        public string firstPage { get; set; }
        public string lastPage { get; set; }
        public int totalPages { get; set; }
        public int totalRecords { get; set; }
        public object nextPage { get; set; }
        public object previousPage { get; set; }
        public Datum[] data { get; set; }
        public int statusCode { get; set; }
        public object message { get; set; }
        //public DateTime timeStamp { get; set; }
        //public bool isError { get; set; }
    }

    public class Datum
    {
        public DateTime lastUpdatedTime { get; set; }
        public string name { get; set; }
        [UIHint("isTrue")]
        public bool isOnline { get; set; }
        [UIHint("isTrue")]
        public bool isBusy { get; set; }
        public int numberOfRunningContainers { get; set; }
        public string status { get; set; }
    }

    public class EditEdge
    {
        public string id { get; set; }
        public string name { get; set; }
        public object type { get; set; }
        public object organization { get; set; }
        public string edgeStatus { get; set; }
        public string edgeIp { get; set; }
        public string macAddress { get; set; }
        public int cpu { get; set; }
        public int ram { get; set; }
        public int virtualRam { get; set; }
        public int diskStorage { get; set; }
        public int numberOfCores { get; set; }
        public DateTime lastUpdatedTime { get; set; }
        public bool isOnline { get; set; }
        //public object relations { get; set; }
    }

    public class EditCloud
    {
        public string id { get; set; }
        public string name { get; set; }
        public object type { get; set; }
        public object organization { get; set; }
        public string cloudStatus { get; set; }
        public string cloudIp { get; set; }
        public int numberOfCores { get; set; }
        public int diskStorage { get; set; }
        public object virtualRam { get; set; }
        public int cpu { get; set; }
        public int ram { get; set; }
        public object macAddress { get; set; }
        public DateTime lastUpdatedTime { get; set; }
        public bool isOnline { get; set; }
        //public RelationCloud[] relations { get; set; }
    }

    public class RelationCloud
    {
        public InitiatesfromCloud initiatesFrom { get; set; }
        public string relationName { get; set; }
        public RelationattributeCloud[] relationAttributes { get; set; }
        public PointstoCloud pointsTo { get; set; }
    }

    public class InitiatesfromCloud
    {
        public string id { get; set; }
        public string type { get; set; }
        public string name { get; set; }
    }

    public class PointstoCloud
    {
        public string id { get; set; }
        public string type { get; set; }
        public string name { get; set; }
    }

    public class RelationattributeCloud
    {
        public string key { get; set; }
        public string value { get; set; }
    }


}
