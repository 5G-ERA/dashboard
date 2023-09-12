namespace eu_projects_main_platform.Models
{
    public static class AppSettings
    {
        public static String? mediaHub_UMM_Settings { get; set;}
        public static String? connection_string { set; get; }
        public static String? log_folder_path { set; get; }
        public static String? cryptography_symmetric_key { set; get; }
        public static String? default_login_logo_name { set; get; }
        public static List<String>? supported_domains { set; get; }
        public static String? tokenSecret { set; get; }
        public static String? planetDbConnectionString { set; get; }

    }

    public class UmmClientAppProperties
    {
        public string auth_server_url { get; set; }
        public UmmClientAppCredentails credentials { get; set; }
        public string realm { get; set; }
        public string resource_management_api { get; set; }
        public string redirect_url { get; set; }
        public string auth_endpoint
        {
            get { return $"{this.auth_server_url}/protocol/openid-connect/auth"; }
        }
        public string token_endpoint
        {
            get { return $"{this.auth_server_url}/protocol/openid-connect/token"; }
        }
        public string user_info_endpoint
        {
            get { return $"{this.auth_server_url}/protocol/openid-connect/userinfo"; }
        }

        public string logout_endpoint
        {
            get{ return $"{this.auth_server_url}/protocol/openid-connect/logout"; }
        }
    }

    public record UmmClientAppCredentails
    {
        public string client_id { get; set; }
        public string secret { get; set; }
        public string x_client { get; set; }
    }
}
