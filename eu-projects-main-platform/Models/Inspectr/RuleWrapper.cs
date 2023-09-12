namespace eu_projects_main_platform.Models.Inspectr
{
    public class RuleWrapper
    {
  
        public RuleInspectr? RuleInspectr { get; set; }
        public List<long>? RequestorCountries { get; set; }

        public List<long>? RequestorMembers { get; set; }

        public List<long>? RequestTypes { get; set; }

        public List<long>? RequestJurisdictions { get; set; }

        public List<long>? CrimeTypes { get; set; }

        public List<long>? CrimeCountries { get; set; }

        public List<long>? CrimeLevels { get; set; }

        public List<long>? CrimeCases { get; set; }

        public List<long>? EvidenceSources { get; set; }

        public List<long>? EvidenceTypes { get; set; }

     
    }
}
