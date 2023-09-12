namespace eu_projects_main_platform.Models.Common
{
    public class ProjectUser
    {
        public long UserId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Fullname { get; set; }
        public long DepartmentId { get; set; }
        public string  DepartmentName { get; set; }
    }
}
