using Newtonsoft.Json;

namespace eu_projects_main_platform.Models._5ghub.Managers
{
    public static class _5GhubUmmAuthConfigManager
    {
        public static string GetAuthUrl()
        {
            var configs = JsonConvert.DeserializeObject<UmmClientAppProperties>(AppSettings.mediaHub_UMM_Settings);
            var clientId = configs?.credentials.client_id;
            var redirectUri = configs?.redirect_url;

            return $"{configs?.auth_endpoint}?client_id={clientId}&redirect_uri={redirectUri}&response_type=code";
        }

        public static UmmClientAppProperties GetClientAppProperties()
        {
            return JsonConvert.DeserializeObject<UmmClientAppProperties>(AppSettings.mediaHub_UMM_Settings);
        }
    }
}
