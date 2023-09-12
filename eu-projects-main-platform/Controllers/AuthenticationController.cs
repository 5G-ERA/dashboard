using eu_projects_main_platform.Business;
using eu_projects_main_platform.Models._5ghub.Managers;
using eu_projects_main_platform.Models.Authentication;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eu_projects_main_platform.Controllers
{
    public class AuthenticationController : Controller
    {
        public IActionResult Login([FromQuery] string username, [FromQuery] string password, string? project)
        {
            if (project is not null && project.ToLower().Equals("5ghub"))
            {
                var redirect_url = _5GhubUmmAuthConfigManager.GetAuthUrl();
                return Redirect(redirect_url);
            }
            else
            {
                if (username != null || password != null)
                {
                    var login = new LoginViewModel()
                    {
                        Username = username,
                        Password = password
                    };
                    return AccountVerification(login);
                }
                @ViewBag.FatalError = String.Empty;
                @ViewBag.HostIdentifier = new AuthenticationBusiness().RetrieveHostIdentifier(Request);
                return View();
            }
        }

        [HttpPost]
        public IActionResult Logout()
        {
            String _error = String.Empty;
            try
            {
                HttpContext.Session.Remove("_UserDetails");
            }
            catch (Exception ex)
            {
                _error = ex.Message + "|" + ex.StackTrace;
                PlatformAudit.ERROR("Authentication", "Logout", ex.Message, ex.StackTrace);
            }
            return Json(_error);
        }

        [HttpPost]
        public IActionResult AccountVerification(LoginViewModel login_details)
        {

            @ViewBag.FatalError = String.Empty;
            try
            {
                @ViewBag.HostIdentifier = new AuthenticationBusiness().RetrieveHostIdentifier(Request);
                Users? _user = new AuthenticationBusiness().LoginAuthentication(login_details.Username, login_details.Password);
                if (_user == null)
                    @ViewBag.FatalError = "Something went wrong during the authentication process. Please contact with administrator";
                else if (!String.IsNullOrEmpty(_user.authentication_error))
                    @ViewBag.FatalError = _user.authentication_error;
                else if (String.IsNullOrEmpty(_user.ProjectName))
                    @ViewBag.FatalError = "User is not authorized. Please contact with administrator";
                else
                {
                    //if (_user.ProjectName.ToLower().Equals("5ghub"))
                    //{
                    //    var redirect_url = _5GhubUmmAuthConfigManager.GetAuthUrl();
                    //    return Redirect(redirect_url);
                    //}

                    String cipher = EncryptionDecryption.EncryptString(JsonConvert.SerializeObject(_user));
                    HttpContext.Session.Set<String>("_UserDetails", cipher);
                    return Redirect("~/Home/Index");
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("Authentication", "AccountVerification", ex.Message, ex.StackTrace);
                @ViewBag.FatalError = ex.Message;
            }

            return View("Login");
        }

        public async Task<IActionResult> Grant5ghubaccess([FromQuery] string code, [FromQuery] string session_state)
        {
            var username = "5ghub";
            var password = "5ghub";

            var defaultLogin = new LoginViewModel()
            {
                Username = username,
                Password = password
            };

            var tokenDetails = JsonConvert.DeserializeObject<_5GhubTokenInfos>(await RetrieveToken(code));

            var encryptedUserToken = EncryptionDecryption.EncryptString(JsonConvert.SerializeObject(tokenDetails));
            HttpContext.Session.Set<String>("_UserToken", encryptedUserToken);

            return AccountVerification(defaultLogin);
        }
        

        private async Task<string> RetrieveToken(string code)
        {
            using (var httpClient = new HttpClient())
            {
                var config = _5GhubUmmAuthConfigManager.GetClientAppProperties();
                var url = config.token_endpoint;
                //httpClient.DefaultRequestHeaders.Add("Content-Type", "application/x-www-form-urlencoded");

                var parameterList = new Dictionary<string, string>();
                parameterList.Add("code", code);
                parameterList.Add("grant_type", "authorization_code");
                parameterList.Add("client_id", config.credentials.client_id);
                parameterList.Add("client_secret", config.credentials.secret);
                parameterList.Add("redirect_uri", config.redirect_url);

                var msg = new HttpRequestMessage
                {
                    RequestUri = new Uri(url),
                    Method = HttpMethod.Post,
                    Content = new FormUrlEncodedContent(parameterList)
                };

                var request = httpClient.Send(msg);

                var response = await request.Content.ReadAsStringAsync();

                return response;

            }
        }

    }

    public class _5GhubTokenInfos
    {
        public string access_token { get; set; }
        public long expires_in { get; set; }
        public long refresh_expires_in { get; set; }
        public string refresh_token { get; set; }
        public string token_type { get; set; }
        public string session_state{ get; set; }
        public string scope { get; set; }
    }
}
