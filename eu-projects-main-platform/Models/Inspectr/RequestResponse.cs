namespace eu_projects_main_platform.Models.Inspectr
{
    public class RequestResponse
    {
        public long RequestId { get; set; }
        public string ReferenceId { get; set; }
        public DateTime? DateRecorded { get; set; }
        public string? FormatedDateRecorded
        {
            get { return $"{this.DateRecorded:F}"; }
        }
        public string? RequestQuery { get; set; }
        public string? Response { get; set; }
    }
}
