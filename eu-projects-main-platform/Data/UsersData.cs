using eu_projects_main_platform.Business;
using eu_projects_main_platform.Models.Authentication;
using eu_projects_main_platform.Models.DatabaseHandler;
using eu_projects_main_platform.Models.Enums;
using Newtonsoft.Json;

namespace eu_projects_main_platform.Data
{
    public class UsersData
    {
        String _controller_name = "UsersData";
        public Users? RetrieveUser(String username, String password)
        {
            Users? _user = new Users();
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<Users>("Users", "RetrieveUser").CallDatabase("sp_tblUsers_Authentication",
                    new { Username = username, Password = password }, ResultType.Single, ExecuteType.StoredProcedure);
                if (!String.IsNullOrEmpty(resp.ExceptionMessage))
                    PlatformAudit.ERROR(_controller_name, "RetrieveUser", resp.ExceptionMessage, String.Empty);
                else if (resp.Result != null)
                    _user = JsonConvert.DeserializeObject<Users>(resp.Result);
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("UsersData", "RetrieveUser|username:" + username + "|password:" + password, ex.Message, ex.StackTrace);
            }
            return _user;
        }

        public Users RetieveUserPerId(long userId)
        {
            var res = new MyDatabaseHandler<Users>(_controller_name, "RetrieveUserPerId").CallDatabase(
                "RetrieveUserPerId", new { userId = userId }, ResultType.Single, ExecuteType.StoredProcedure);
            return JsonConvert.DeserializeObject<Users>(res.Result);
        }

        public void UpdateUserLoginMetadata(Users _user)
        {
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<Users>("Users", "RetrieveUser").CallDatabase("sp_tblUsers_LoginMetadata",
                    new { userID = _user.userId, LoginSessionToken = _user.LoginSessionToken, LastLoginTime = _user.LastLoginTime }, ResultType.Single, ExecuteType.StoredProcedure);
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR(_controller_name, "UpdateUserLoginMetadata|_user:" + JsonConvert.SerializeObject(_user), ex.Message, ex.StackTrace);
            }
        }

    }
}
