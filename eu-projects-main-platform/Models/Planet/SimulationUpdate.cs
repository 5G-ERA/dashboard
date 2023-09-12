using System.ComponentModel.DataAnnotations;

namespace eu_projects_main_platform.Models.Planet
{
    public class SimulationUpdate
    {
        [Required]
        public IFormFile files { get; set; }
    }
}
