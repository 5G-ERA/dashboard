namespace eu_projects_main_platform.Models._5gera
{

    public class getRobots
    {
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
        public string firstPage { get; set; }
        public string lastPage { get; set; }
        public int totalPages { get; set; }
        public int totalRecords { get; set; }
        public object nextPage { get; set; }
        public object previousPage { get; set; }
        public RobotData[] data { get; set; }
        public int statusCode { get; set; }
        public object message { get; set; }
        public DateTime timeStamp { get; set; }
        public bool isError { get; set; }
    }

    public class RobotData
    {
        public string id { get; set; }
        public string name { get; set; }
        public string status { get; set; }
        public DateTime onboardedTime { get; set; }
        public int rosVersion { get; set; }
        public string rosDistro { get; set; }
        public string manufacturer { get; set; }
    }

}
