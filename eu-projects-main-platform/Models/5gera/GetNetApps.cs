namespace eu_projects_main_platform.Models._5gera
{
    public class GetNetApps
    {
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
        public string firstPage { get; set; }
        public string lastPage { get; set; }
        public int totalPages { get; set; }
        public int totalRecords { get; set; }
        public string nextPage { get; set; }
        public object previousPage { get; set; }
        public NetApp[] data { get; set; }
        public int statusCode { get; set; }
        public object message { get; set; }
        public DateTime timeStamp { get; set; }
        public bool isError { get; set; }
    }

    public class NetApp
    {
        public string name { get; set; }
        public object family { get; set; }
        public int rosVersion { get; set; }
        public object rosDistro { get; set; }
        public DateTime onboardedTime { get; set; }
    }

    public class EditNetApp
    {
        public string id { get; set; }
        public string name { get; set; }
        public string serviceInstanceId { get; set; }
        public string serviceType { get; set; }
        public bool isReusable { get; set; }
        public string desiredStatus { get; set; }
        public string serviceUrl { get; set; }
        public Rostopicspub[] rosTopicsPub { get; set; }
        public Rostopicssub[] rosTopicsSub { get; set; }
        public int rosVersion { get; set; }
        public string rosDistro { get; set; }
        public string[] tags { get; set; }
        public string instanceFamily { get; set; }
        public int successRate { get; set; }
        public string serviceStatus { get; set; }
        public object containerImage { get; set; }
        public int minimumRam { get; set; }
        public int minimumNumCores { get; set; }
        public DateTime onboardedTime { get; set; }
        public object relations { get; set; }
    }

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
