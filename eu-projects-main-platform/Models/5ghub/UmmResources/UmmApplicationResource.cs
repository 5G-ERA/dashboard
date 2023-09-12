namespace eu_projects_main_platform.Models._5ghub.UmmResources
{
    public class UmmApplicationResource
    {
        public Guid UmmResourceID { get; set; }
        public string UmmResourceName { get; set; }
        public string UmmResourceOwner { get; set; }
        public Guid? ResourceGroupID { get; set; }
        public string ResourceGroupName { get; set; }
    }
}
