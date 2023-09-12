namespace eu_projects_main_platform.Models._5gera.Constant
{
    public class _5gEraAPIRoutes
    {
        public const string controllerBase = "http://localhost:5047/Data/Dashboard";
        public static class DashboardAPIRoutes 
        { 
            public const string get_robot_task = controllerBase + "/tasks";
            public const string get_cloud = controllerBase + "/locations";
            public const string get_netApps = controllerBase + "/netApps";
            public const string get_Robots = controllerBase + "/Robots";
        }

    }
}
