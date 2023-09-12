using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eu_projects_main_platform.Models._5ghub
{
    public class KPIs
    {
        public long PIId { get; set; }
        public long UseCaseId { get; set; }
        public long KPISubTypeId { get; set; }
        public string? KPIType { get; set; }
        public string? KPISubType { get; set; }
        public long UnitId { get; set; }
        public string? Unit { get; set; }
        public long HighOperatorId { get; set; }
        public string? HighOperator { get; set; }
        public string? HighValue { get; set; }
        public long LowOperatorId { get; set; }
        public string? LowOperator { get; set; }
        public string? LowValue { get; set; }
        public string? ShortDescription { get; set; }
        public string? PICode { get; set; }
        public long MeasurementId { get; set; }
    }
}
