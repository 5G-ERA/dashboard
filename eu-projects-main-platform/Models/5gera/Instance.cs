namespace eu_projects_main_platform.Models._5gera
{
    public class Instance
    {
        public IEnumerable<Object>? relations {get;set;}
        public Guid Id {get;set;}
        public string? Name {get;set;}
        public string ServiceInstanceId {get;set;} 
        public string? ServiceType {get;set;}
        public Boolean? IsReusable {get;set;}
        public string? DesiredStatus {get;set;}
        public Uri? ServiceUrl {get;set;}   
        public string? ServiceStatus {get;set;}
    }
}
