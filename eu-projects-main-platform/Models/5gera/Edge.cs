namespace eu_projects_main_platform.Models._5gera
{
    public class Edge
    {
        public IEnumerable<Object>? relations { get; set; } // ref: RelationModel
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? EdgeStatus { get; set; }
        public Uri? EdgeIp { get; set; }
        public string? CPU { get; set; }
        public string? RAM { get; set; }
        public string? VirtualRam { get; set; }
        public string? DiskStorage { get; set; }
        public string? NumberOfCores { get; set; }

    }
}
