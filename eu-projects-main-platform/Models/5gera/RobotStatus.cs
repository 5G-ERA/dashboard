using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace eu_projects_main_platform.Models._5gera
{
    public class RobotStatus
    {
        public IEnumerable<Object>? relations { get; set; } // ref: RelationModel
        [Required]
        public Guid id { get; set; }
        public string? name { get; set; }
        [Required]
        public string actionSequenceId { get; set; }
        [Required]
        public int currentlyExecutedActionIndex { get; set; }
        public int batteryLevel { get; set; }
        public DateTime timeStamp { get; set; }
    }
}
