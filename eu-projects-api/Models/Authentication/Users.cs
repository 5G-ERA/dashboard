namespace eu_projects_api.Models.Authentication
{
    public class Users
    {
        public Int64 userId { get; set; }
        public String? Username { get; set; }
        public String? Password { get; set; }
        public String? Fullname { get; set; }
        public Int64 ProjectId { get; set; }
        public String? ProjectControllerCode { get; set; }
        public String? ProjectName { set; get; }
        public String? LoginSessionToken { set; get; }
        public DateTime? LastLoginTime { set; get; }
        public String? authentication_error { set; get; }
        public string? LeaderName { get; set; }
    }
}
