namespace eu_projects_main_platform.Models._5gera
{
    public class Robot
    {
        public IEnumerable<Object>? relations { get; set; } // ref: RelationModel
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Manufacturer { get; set; }
        public string? RobotModel { get; set; }
        public string? RobotStatus { get; set; }
        public string CurrentTaskID { get; set; }
        public IEnumerable<Object>? TaskList { get; set; }
        public int BatteryStatus { get; set; }
        public string? MacAddress { get; set; }
        public string? LocomotionSystem { get; set; }
        public object? Sensors { get; set; } 
        public int CPU { get; set; }
        public int RAM { get; set; }
        public int VirtualRam { get; set; }
        public int StorageDisk { get; set; }
        public int NumberCores { get; set; }
        public IEnumerable<Object>? Questions { get; set; }

    }
}
