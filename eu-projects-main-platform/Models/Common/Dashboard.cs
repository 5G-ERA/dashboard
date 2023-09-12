namespace eu_projects_main_platform.Models.Common
{
    public class Dashboard
    {
        public Guid DashboardId { get; set; }
        public string DashboardName { get; set; }
        public long ProjectId { get; set; }
        public long ParentMenuId { get; set; }
        public string DashboardObjectConfig { get; set; }
        public ProjectMenu Menu { get; set; }
    }
}
