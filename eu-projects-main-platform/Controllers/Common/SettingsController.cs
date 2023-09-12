using eu_projects_main_platform.Business;
using eu_projects_main_platform.Models._5ghub;
using eu_projects_main_platform.Models._5ghub.Managers;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eu_projects_main_platform.Controllers.Common
{
    public class SettingsController : Controller
    {
        public IActionResult Index(long userId)
        {
            var authenticationBusiness = new AuthenticationBusiness();
            var lookupUser = authenticationBusiness.RetrieveUserPerId(userId);
            var user = authenticationBusiness.LoginAuthentication(lookupUser.Username, lookupUser.Password);

            if (user.ProjectControllerCode is not null &&
                user.ProjectName.ToLower().Equals("5ghub"))
            {
                string tokenCipherDetails = HttpContext.Session.Get<String>("_UserToken");

                var tokenDetails =
                    JsonConvert.DeserializeObject<_5GhubTokenInfos>(
                        EncryptionDecryption.DecryptString(tokenCipherDetails));

                var ummUser = RetrieveUmmUserByToken(tokenDetails.access_token).Result;

                user.Fullname = ummUser.name;
                user.Username = ummUser.name;

                ViewBag.fullname = ummUser.name;
                ViewBag.email = ummUser.email;
                ViewBag.firstname = ummUser.given_name;
                ViewBag.lastname = ummUser.family_name;
                ViewBag.username = ummUser.preferred_username;

                ViewBag.project_name = user.ProjectName != null ? user.ProjectName : String.Empty;
                ViewBag.project_code = user.ProjectControllerCode;
                ViewBag.project_id = user.ProjectId;
                ViewBag.password = user.Password;
                ViewBag.user_id = user.userId;

                return PartialView();
            }

            ViewBag.fullname = user.Fullname != null ? user.Fullname : String.Empty;
            ViewBag.username = user.Username != null ? user.Username : String.Empty;
            ViewBag.project_name = user.ProjectName != null ? user.ProjectName : String.Empty;
            ViewBag.project_code = user.ProjectControllerCode;
            ViewBag.project_id = user.ProjectId;
            ViewBag.password = user.Password;
            ViewBag.user_id = user.userId;

            return PartialView();
        }


        public IActionResult AddNewAlertThreshold(long userId, string name, string type, decimal maxValue, decimal minValue, string status, string table)
        {
            bool isActive = bool.Parse(status);
            var result = new PlanetBusiness().AddNewAlertThreshold(userId, name, type, maxValue, minValue, isActive, table);
            return Json(new { status = "success", content = result });
        }

        public IActionResult EditAlertThreshold(long userId, long alertId, string name, string type, decimal maxValue,
            decimal minValue, string status, string table)
        {
            bool isActive = bool.Parse(status);
            var result = new PlanetBusiness().EditAlertThreshold(userId, alertId, name, type, maxValue, minValue, isActive, table);
            return Json(new { status = "success", content = result });
        }

        public IActionResult RetrieveAlertThresholdDetails(long alertId)
        {
            return Json(new PlanetBusiness().RetrieveAlertThresholdDetails(alertId));
        }

        public IActionResult DeleteAlertThreshold(long alertId)
        {
            var deleteAlertThreshold = new PlanetBusiness().DeleteAlertThreshold(alertId);
            return Json(deleteAlertThreshold);
        }

        public IActionResult RetrieveUserAlertThresholds(long userId)
        {
            return Json(new PlanetBusiness().RetrieveAlertThresholds(userId));
        }

        public IActionResult RetrieveProjectUsersPerProject(long projectId)
        {
            return Json(new PlanetBusiness().RetrieveProjectUsersPerProject(projectId));
        }

        public IActionResult UpdateUserPassword(long userId, string password)
        {
            return Json(new PlanetBusiness().UpdateUserPassword(userId, password));
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

