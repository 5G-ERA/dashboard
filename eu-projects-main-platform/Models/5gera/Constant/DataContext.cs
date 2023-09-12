namespace eu_projects_main_platform.Models._5gera.Constant
{
    public class DataContext
    {
        public static IList<Robot> robot_task = new List<Robot>();
        public static IList<EditCloud> clouds = new List<EditCloud>();
        public static IList<EditEdge> edges = new List<EditEdge>();
        public static IList<Datum> cloud = new List<Datum>();
        public static IList<Datum> edge = new List<Datum>();
        public static IList<NetApp> netApps = new List<NetApp>();
        public static IList<EditNetApp> netApp = new List<EditNetApp>();
        public static IList<RobotData> robot = new List<RobotData>();
        public static IList<RobotTasks> tasks = new List<RobotTasks>();
        public static IList<GetCloud> gtask = new List<GetCloud>();
        public static IList<EditAction> action = new List<EditAction>();
        public static IList<ActivePolicy> policy = new List<ActivePolicy>();
    }
}
