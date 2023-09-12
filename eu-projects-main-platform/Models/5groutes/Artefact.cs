namespace eu_projects_main_platform.Models._5groutes
{
    public class Artefact
    {
        public long LeaderArtefactId { get; set; }
        public long ArtefactTypeId { get; set; }
        public string ArtefactTypeName { get; set; }
        public string ArtefactFilePath { get; set; }
        public string ArtefactFileName { get; set; }
        public string ArtefactFileSize { get; set; }
        public Guid ArtefactFileUID { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UploadedAt
        {
            get { return $"{this.CreatedAt:F}"; }
        }
    }
}
