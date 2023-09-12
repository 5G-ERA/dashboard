namespace eu_projects_main_platform.Models.Inspectr
{
    public class RuleIncomingRequest
    {
        public string reference_id { get; set; }
        public JsonRequestor requestor { get; set; }
        public RequestObj request { get; set; }
        public EvidenceObj evidence { get; set; }
        public CrimeObj crime { get; set; }
    }

    public class RequestObj
    {
        public string? type { get; set; }
        public string? jurisdiction { get; set; }    }

    public class CrimeObj
    {
        public string? type { get; set; }
        public string? origin_country { get; set; }
        public string? level { get; set; }
        public string? case_status { get; set; }
    }

    public class EvidenceObj
    {
        public string? source { get; set; }
        public string? type { get; set; }
    }
}
