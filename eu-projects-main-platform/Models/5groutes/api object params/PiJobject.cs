namespace eu_projects_main_platform.Models._5groutes.api_object_params
{
    public class PiJobject
    {
        public string composite_kpi { get; set; }
        public string name { get; set; }
        public string code { get; set; }
        public string? unit { get; set; }
        public decimal red_threshold { get; set; }
        public decimal green_threshold { get; set; }
        public string red_threshold_operator { get; set; }
        public string green_threshold_operator { get; set; }
    }
}
