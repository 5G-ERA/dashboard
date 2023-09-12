namespace eu_projects_api.Models.Planet.UserSettings
{
    public class tableColViews
    {
        public string tableId { get; set; }
        public List<string> hiddenColumns { get; set; } = new List<string>();
        public List<SavedSearch> savedSearches { get; set; } = new List<SavedSearch>();
    }
}
