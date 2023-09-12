namespace eu_projects_main_platform.Models.Common
{
    public class EuProjectDashboardJObject
    {
        public string dashboard_name { get; set; }
        public string menu_name { get; set; }
        public string menu_order { get; set; }
        public int project_id { get; set; }
        public int parent_menu_id { get; set; }
        public string dashboard_type { get; set; }
        public string dashboard_object_datasource { get; set; }
        public string dashboard_columns { get; set; }
        public string dashboard_background_color { get; set; }
        public string dashboard_foreground_color { get; set; }

    }
}
