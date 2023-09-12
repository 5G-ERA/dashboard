namespace eu_projects_main_platform.Models._5gera.Auth
{
    public class UserCredentials
    {
        public Guid id { get; set; }
        public string UserName { get; set; }
        public string  password { get; set; }
        public string salt { get; set; }
        public IEnumerable<Object> relations { get; set; }
    }
}
