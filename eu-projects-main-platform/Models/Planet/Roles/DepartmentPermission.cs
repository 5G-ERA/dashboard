namespace eu_projects_main_platform.Models.Planet.Roles
{
    public class DepartmentPermission
    {
        public long MenuPermissionId { get; set; }
        public long MenuId { get; set; }
        public long ProjectId { get; set; }
        public long DepartmentId { get; set; }
        public string MenuName { get; set; }
        public long? ParentMenuId { get; set; }

        public string PermissionName
        {
            get
            {
                return $"View {this.MenuName}";
            }
        }

        public bool HasParent
        {
            get
            {
                return (this.ParentMenuId.HasValue) ? true : false;
            }
        }

    }
}
