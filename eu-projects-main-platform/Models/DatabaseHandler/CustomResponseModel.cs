using eu_projects_main_platform.Models.Enums;

namespace eu_projects_main_platform.Models.DatabaseHandler
{
    public class CustomResponseModel
    {
        public String? Result { get; set; }
        public String? Message { get; set; }
        public String? Controller { get; set; }
        public String? Method { get; set; }
        public String? ExceptionMessage { get; set; }
        public int ErrorCode { get; set; } = 0;
        public ResponseMessageCode MeesageCode { get; set; }
    }
}
