namespace eu_projects_main_platform.Models._5gera
{
    public class TaskPlannerInputModel
    {
        public Guid RobotId { get; set; }
        public string? TaskId { get; set; }
        public IEnumerable<Object>? Questions { get; set; } // ref: DialogueModel
    }
}
