using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eu_projects_main_platform.Models._5ghub
{
    public class UseCases
    {
        public long UseCaseId { get; set; }
        public DateTime EntryDate { get; set; }
        public string? UseCaseName { get; set; }
        public string? UseCaseDescription { get; set; }
        public DateTime LastUpdated { get; set; }
        public string? ResponsiblePerson { get; set; }
        public string? ContactPerson { get; set; }
        public string? UCID { get; set; }
        public string? CategoryName { get; set; }
        public string UseCaseCode { get; set; }

    }
}
