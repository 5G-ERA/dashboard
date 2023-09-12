namespace eu_projects_main_platform.Models.Inspectr
{
    public class ValidatedRequestObject
    {
        public bool IsValid { get; set; }
        public List<Object> Messages { get; set; }
        public RequestInspectRule? RequestInspectRule { get; set; }  
    }
}
