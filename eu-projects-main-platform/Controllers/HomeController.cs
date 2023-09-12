using eu_projects_main_platform.Business;
using eu_projects_main_platform.Models;
using eu_projects_main_platform.Models.Authentication;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics;
using eu_projects_main_platform.Models._5ghub;
using eu_projects_main_platform.Models._5ghub.Managers;

namespace eu_projects_main_platform.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            try
            {
                String? cipher = HttpContext.Session.Get<String>("_UserDetails");
                if (!String.IsNullOrEmpty(cipher))
                {
                    Users? session_user = JsonConvert.DeserializeObject<Users>(EncryptionDecryption.DecryptString(cipher));
                    if (session_user != null)
                    {
                        //Update Username if it is a planet user
                        if (session_user.ProjectControllerCode is not null &&
                            session_user.ProjectName.ToLower().Equals("planet") && !session_user.Username.ToLower().Equals("planet"))
                        {
                            session_user.Username =
                                JsonConvert.DeserializeObject<string>(new PlanetBusiness()
                                    .RetrieveUserDepartment(session_user.userId).Result);
                        }

                        if (session_user.ProjectControllerCode is not null &&
                            session_user.ProjectName.ToLower().Equals("5ghub"))
                        {
                            var authConfig = _5GhubUmmAuthConfigManager.GetClientAppProperties();
                            var redirect_url = authConfig.redirect_url.Replace("/grant5ghubaccess", "/Login/5ghub");

                            var url = $"{authConfig.logout_endpoint}?redirect_uri={redirect_url}";

                            string tokenCipherDetails = HttpContext.Session.Get<String>("_UserToken");

                            var tokenDetails =
                                JsonConvert.DeserializeObject<_5GhubTokenInfos>(
                                    EncryptionDecryption.DecryptString(tokenCipherDetails));

                            var ummUser = RetrieveUmmUserByToken(tokenDetails.access_token).Result;
                            
                            session_user.Fullname = ummUser.name;
                            session_user.Username = ummUser.name;
                            ViewBag.user_logout_url = url;
                            ViewBag.user_email = ummUser.email;
                        }

                        session_user.Password = null;
                        ViewBag.fullname = session_user.Fullname != null ? session_user.Fullname : String.Empty;
                        ViewBag.username= session_user.Username != null ? session_user.Username : String.Empty;
                        ViewBag.project_name = session_user.ProjectName != null ? session_user.ProjectName : String.Empty;
                        ViewBag.project_code = session_user.ProjectControllerCode != null ? session_user.ProjectControllerCode.ToLower() : "default_login.png";
                        ViewBag.project_id = session_user.ProjectId;
                        ViewBag.user_id = session_user.userId;
                        ViewBag.token = session_user.LoginSessionToken;
                        return View(session_user);
                    }
                    else
                        PlatformAudit.ERROR("Home", "Index", "User session not found", String.Empty);
                }
                else
                    PlatformAudit.ERROR("Home", "Index", "Cipher is empty", String.Empty);
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("Home", "Index", ex.Message, ex.StackTrace);
            }
            return Redirect("~/Authentication/Login");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        private async Task<UmmUserInfos> RetrieveUmmUserByToken(string token)
        {
            using (var httpClient = new HttpClient())
            {
                var url = _5GhubUmmAuthConfigManager.GetClientAppProperties().user_info_endpoint;
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

                var httpRequestMessage = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(url)
                };

                var response = await httpClient.Send(httpRequestMessage).Content.ReadAsStringAsync().ConfigureAwait(false);

                return JsonConvert.DeserializeObject<UmmUserInfos>(response);
            }
        }
    }
}