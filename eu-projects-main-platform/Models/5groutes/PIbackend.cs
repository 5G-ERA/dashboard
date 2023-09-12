using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eu_projects_main_platform.Models._5groutes
{
    public class PIbackend
    {
        public long PIId { get; set; }
        public string? PIName { get; set; }
        public long Unit_Id { get; set; }
        public long KPIType_Id { get; set; }
        public long KPISubType_Id { get; set; }
        public long HighOperator_Id { get; set; }
        public string? HighValue { get; set; }
        public long LowOperator_Id { get; set; }
        public string? LowValue { get; set; }
        public string? ShortDescription { get; set; }
        public string? LongDescription { get; set; }
        public string? Comment { get; set; }
        public string? PICode { get; set; }
        public long MeasurementId { get; set; }
    }
}
