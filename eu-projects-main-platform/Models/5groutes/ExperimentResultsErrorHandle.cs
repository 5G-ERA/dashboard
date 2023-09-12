using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace eu_projects_main_platform.Models._5groutes
{
    public class ExperimentResultsErrorHandle
    {
        public string? Status { get; set; }
        public string? Message { get; set; }
        public long NewExperimentResultsId { get; set; }
        public DataTable? data { get; set; }
        public string? Sheetname { get; set; }
        public string? excelFilePath { get; set; }
    }
}
