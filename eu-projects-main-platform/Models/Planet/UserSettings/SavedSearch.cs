namespace eu_projects_main_platform.Models.Planet.UserSettings
{
    public class SavedSearch
    {
        public string Name { get; set; }    
        public List<SavedSearchParams> searchParams { get; set; }
    }
    public class SavedSearchParams
    {
        public string index { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public string value { get; set; }
    }
}