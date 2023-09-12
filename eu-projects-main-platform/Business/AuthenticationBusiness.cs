using eu_projects_main_platform.Data;
using eu_projects_main_platform.Models;
using eu_projects_main_platform.Models.Authentication;
using Newtonsoft.Json;

namespace eu_projects_main_platform.Business
{
    public class AuthenticationBusiness
    {
        public Users? LoginAuthentication(String? username, String? password)
        {
            Users? _user = new Users();
            String authentication_error = String.Empty;
            try
            {
                if (String.IsNullOrEmpty(username))
                    authentication_error = "Username is empty";
                else if (String.IsNullOrEmpty(password))
                    authentication_error = "Password is empty";
                else if (username.Length > 250)
                    authentication_error = "Username excited the maximum number of characters";
                else if (password.Length > 500)
                    authentication_error = "Password excited the maximum number of characters";
                else
                {
                    _user = new UsersData().RetrieveUser(username, password);
                    if (_user == null)
                        authentication_error = "Invalid login credentials";
                    else
                    {
                        _user.LastLoginTime = DateTime.Now;
                        _user.LoginSessionToken = Guid.NewGuid().ToString();
                        new UsersData().UpdateUserLoginMetadata(_user);
                    }
                }
            }
            catch (Exception ex)
            {
                authentication_error = ex.Message + "|" + ex.StackTrace;
                PlatformAudit.ERROR("Authentication", "LoginAuthentication", ex.Message, ex.StackTrace);
            }
            if (!String.IsNullOrEmpty(authentication_error))
                _user = new Users()
                {
                    authentication_error = authentication_error
                };

            return _user;
        }

        public String RetrieveHostIdentifier(HttpRequest request)
        {
            String _host_identify = "default_login_logo";
            try
            {
                _host_identify = String.IsNullOrEmpty(AppSettings.default_login_logo_name) ? "default_login_logo" : AppSettings.default_login_logo_name;
                if (AppSettings.supported_domains != null)
                {
                    String? _domain = AppSettings.supported_domains.FirstOrDefault(x => x == request.Host.Host.ToLower());
                    if (!String.IsNullOrEmpty(_domain))
                        _host_identify = _domain.Split('.')[0];
                }
                PlatformAudit.INFO("Authentication", "RetrieveHostIdentifier", "_host_identify:" + _host_identify);
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("Authentication", "RetrieveHostIdentifier|Request:" + JsonConvert.SerializeObject(request), ex.Message, ex.StackTrace);
            }
            return _host_identify;
        }

        public Users RetrieveUserPerId(long userId)
        {
            return new UsersData().RetieveUserPerId(userId);
        }
    }
}
