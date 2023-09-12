namespace eu_projects_main_platform.Models.Inspectr
{
    public class RequestInspectRule
    {
        public long RequestRuleID { get; set; }
        public Guid RequestRuleUniqueID { get; set; }
        public string ReferenceID { get; set; }
        public long? RequestorCountryID { get; set; }
        public long? RequestorMemberID { get; set; }
        public long? RequestTypeID { get; set; }
        public long? RequestJurisdictionID { get; set; }
        public long? CrimeTypeID { get; set; }
        public long? CrimeCountryID { get; set; }
        public long? CrimeCaseID { get; set; }
        public long? CrimeLevelID { get; set; }
        public long? EvidenceSourceID { get; set; }
        public long? EvidenceTypeID { get; set; }
        public DateTime EntryDate { get; set; }
        public string? RequestQuery { get; set; }
    }
}
