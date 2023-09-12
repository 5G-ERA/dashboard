namespace eu_projects_main_platform.Models.Inspectr
{
    public class RulesInspectr
    {
        public long RuleID { get; set; }

        public string RuleName { get; set; }

        public string RequestorCountryName { get; set; }

        public string RequestorMemberName { get; set; }

        public string RequestTypeName { get; set; }

        public string RequestJurisdictionName { get; set; }

        public string CrimeTypeName { get; set; }

        public string CrimeCountryName { get; set; }

        public string CrimeLevelName { get; set; }

        public string CrimeCaseName { get; set; }

        public string EvidenceSourceName { get; set; }

        public string EvidenceTypeName { get; set; }

        public string ResponseID { get; set; }

        public string Response { get; set; }

        public string StatusID { get; set; }

        public string Status { get; set; }

        public double Priority { get; set; }
    }
}
