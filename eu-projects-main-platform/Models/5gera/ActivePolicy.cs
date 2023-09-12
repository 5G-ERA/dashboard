using System.ComponentModel.DataAnnotations;

namespace eu_projects_main_platform.Models._5gera
{
    public class ActivePolicy
    {
        public string? id { get; set; }
        public string? name { get; set; }
        public object? type { get; set; }
        public DateTime timestamp { get; set; }
        [UIHint("isTrue")]
        public bool isActive { get; set; }
        public string? description { get; set; }
        public int isExclusiveWithinType { get; set; }
        public object? relations { get; set; }
    }


}
