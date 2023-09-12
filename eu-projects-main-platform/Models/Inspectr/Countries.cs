namespace eu_projects_main_platform.Models.Inspectr
{
    public class Countries
    {
        public long countryID { get; set; }
        public string? CountryName { get; set; }

        public string? Code { get; set; }
        public string? FullCountry
        {
            get { return $"{this.CountryName} ({this.Code})"; }
        }
    }
}
