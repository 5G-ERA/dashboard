namespace eu_projects_main_platform.Models.Inspectr
{
    public class EvidenceSource
    {
        public long EvidenceSourceID { get; set; }

        public string? EvidenceSourceName { get; set; }

        public string? EvidenceSourceNameFormatted
        {
            get
            {
                if (this.EvidenceSourceName is not null)
                {
                    return this.EvidenceSourceName.Replace(' ', '_');
                }
                else
                {
                    return this.EvidenceSourceName;
                }
            }
        }
    }
}
