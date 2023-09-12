namespace eu_projects_main_platform.Models.Common
{
    public class ProjectMenu
    {
        public long MenuId { get; set; }
        public string MenuName { get; set; }
        public string MenuIcon { get; set; }
        public string MenuCode { get; set; }
        public string MenuClickEvent { get; set; }
        public bool IsMenuActive { get; set; }
        public int MenuOrder { get; set; }
        public long ParentMenuId { get; set; }
        public string ProjectName { get; set; }
        public long DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public long MenuPermissionId { get; set; }
    }
}
