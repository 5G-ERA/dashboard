using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eu_projects_main_platform.Models._5groutes
{
    public class ExperimentResultsEvaluation
    {
        public long ExperimentResultsEvaluationId { get; set; }
        public DateTime EntryDate { get; set; }
        public string? Name { get; set; }
        public string? Data { get; set; }
        public string? ExcelFileName { get; set; }
        public DateTime LastUpdated { get; set; }
        public Guid UniqueResultId { get; set; }
    }
}
