namespace eu_projects_api.Models.Planet.UserSettings
{
    public class pageSettings
    {
        public string Name { get; set; }
        public List<string> hiddenGrids { get; set; } = new List<string>();
        public List<tableColViews> tables{ get; set; } = new List<tableColViews>();
    }
}
