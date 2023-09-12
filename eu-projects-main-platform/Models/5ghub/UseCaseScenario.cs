using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eu_projects_main_platform.Models._5ghub
{
    public class UseCaseScenario
    {
        public long UseCaseScenarioId { get; set; }
        public DateTime EntryDate { get; set; }
        public string? UseCaseScenarioDescription { get; set; }
        public string? UseCaseScenarioTrialType { get; set; }
        public long UseCase_Id { get; set; }
        public DateTime LastUpdated { get; set; }

    }
}
