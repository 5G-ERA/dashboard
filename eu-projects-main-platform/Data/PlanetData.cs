using eu_projects_main_platform.Models.Common;
using eu_projects_main_platform.Models.DatabaseHandler;
using eu_projects_main_platform.Models.Enums;
using eu_projects_main_platform.Models.Planet;
using eu_projects_main_platform.Models.Planet.Auth;
using eu_projects_main_platform.Models.Planet.Kafka;
using eu_projects_main_platform.Models.Planet.Roles;
using Microsoft.AspNetCore.Mvc;

namespace eu_projects_main_platform.Data
{
    public class PlanetData
    {
        private const string controller = "PlanetData";
        public CustomResponseModel RetrieveContainerID()
        {            
            return new MyDatabaseHandler<TrackTrace>(controller, "RetrieveContainerID").CallDatabase("SP_Retrieve_ContainerID", new {  }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }
        public CustomResponseModel RetrieveTrackTrace(string ContainerID)
        {
            return new MyDatabaseHandler<TrackTrace>(controller, "RetrieveTrackTrace").CallDatabase("SP_tblTrackTrace_Select_ALL", new { ContainerID = ContainerID, }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }
        public CustomResponseModel AddUserToken(UserToken userToken)
        {
            return new MyDatabaseHandler<UserToken>(controller, "AddUserToken").CallDatabase(
                "InsertUserTokenWithRefresh", new { userId = userToken.UserID, token = userToken.TokenKey, note = userToken.Note, expiryDate = userToken.ExpiryDate, refreshToken = userToken.RefreshToken }, ResultType.Single,
                ExecuteType.StoredProcedure);
        }
        public CustomResponseModel RetrieveTokenInfo(RefreshTokenRequest req)
        {
            return new MyDatabaseHandler<UserToken>(controller, "RetrieveTokenInfo").CallDatabase("GetRefreshTokenInfo", new { token = req.Token, refreshToken = req.RefreshToken, }, ResultType.Single, ExecuteType.StoredProcedure);
        }
        public CustomResponseModel DeleteTokenInfo(RefreshTokenRequest req)
        {
            return new MyDatabaseHandler<UserToken>(controller, "DeleteTokenInfo").CallDatabase("DeleteRefreshTokenInfo", new { token = req.Token, refreshToken = req.RefreshToken, }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveUserDepartment(long userId)
        {
            return new MyDatabaseHandler<string>(controller, "RetrieveUserDepartment").CallDatabase(
                "RetrievePlanetUserDepartment", new { user_id = userId }, ResultType.Single,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel AddNewAlertThreshold(long userId, string name, string type, decimal maxValue, decimal minValue, bool isActive, string table)
        {
            return new MyDatabaseHandler<long>(controller, "AddNewAlertThreshold").CallDatabase(
                "SavePlanetUserAlertTreshold", new
                {
                    user_id = userId, name = name, type = type, maxValue = maxValue, minValue = minValue, isActive = isActive , table = table
                }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel EditAlertThreshold(long userId, long alertId, string name, string type, decimal maxValue, decimal minValue, bool isActive, string table)
        {
            return new MyDatabaseHandler<AlertThreshold>(controller, "EditAlertThreshold").CallDatabase(
                "EditPlanetUserAlertTreshold", new
                {
                    alertId = alertId,
                    user_id = userId,
                    name = name,
                    type = type,
                    maxValue = maxValue,
                    minValue = minValue,
                    isActive = isActive,
                    table = table
                }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveAlertThresholds(long userId)
        {
            return new MyDatabaseHandler<AlertThreshold>(controller, "RetrieveAlertThresholds").CallDatabase(
                "RetrievePlanetUserAlertThreshold", new { userId = userId }, ResultType.Multiple,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveAlertThresholdDetails(long alertId)
        {
            return new MyDatabaseHandler<AlertThreshold>(controller, "RetrieveAlertThresholdDetails").CallDatabase(
                "RetrieveUserAlertThresholdDetails", new { alertId = alertId }, ResultType.Single,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel DeleteAlertThreshold(long alertId)
        {
            return new MyDatabaseHandler<long>(controller, "DeleteAlertThreshold").CallDatabase("DeletePlanetUserAlertThreshold",
                new { alertId = alertId }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveProjectUsersPerProject(long projectId)
        {
            return new MyDatabaseHandler<ProjectUser>(controller, "RetrieveProjectUsersPerProject").CallDatabase(
                "RetrieveProjectUsersPerId", new { projectId = projectId }, ResultType.Multiple,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrievePlanetUserGroups()
        {
            return new MyDatabaseHandler<DepartmentUserGroup>(controller, "RetrievePlanetUserGroups").CallDatabase(
                "RetrievePlanetUserGroups", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrievePlanetPermissionsPerDepartment(long departmentId)
        {
            return new MyDatabaseHandler<DepartmentPermission>(controller, "RetrievePlanetPermissionsPerDepartment").CallDatabase(
                "RetrievePlanetPermissionsPerDepartment", new { departementId = departmentId }, ResultType.Multiple,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveUserDetails(long userId)
        {
            return new MyDatabaseHandler<ProjectUser>(controller, "RetrieveUserDetails").CallDatabase(
                "RetrieveUserPerId", new { userId = userId }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel EditProjectUserDetails(long userId, string username, string fullname, string password)
        {
            return new MyDatabaseHandler<ProjectUser>(controller, "EditProjectUserDetails").CallDatabase("EditProjectUserDetails",
                new { userId = userId, username = username, fullname = fullname, password = password },
                ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel AddNewUserToDepartment(long projectId, long departmentId, string username, string fullname, string password)
        {
            return new MyDatabaseHandler<ProjectUser>(controller, "AddNewUserToDepartment").CallDatabase("AddNewPlanetUserToDepartment",
                new
                {
                    projectId = projectId, departmentId = departmentId, username = username, fullname = fullname,
                    password = password
                }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RemoveUser2Department(long departmentId, long userId)
        {
            return new MyDatabaseHandler<long>(controller, "RemoveUser2Department").CallDatabase(
                "RemovePlanetUser2Department", new { userId = userId, departmentId = departmentId }, ResultType.Single,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel AddExistingUser2Department(long departmentId, long userId)
        {
            return new MyDatabaseHandler<long>(controller, "AddExistingUser2Department").CallDatabase(
                "AddPlanetExistingUser2Department", new { userId = userId, departmentId = departmentId }, ResultType.Single,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RemoveOldDepartmentPermissions(long departmentId)
        {
            return new MyDatabaseHandler<long>(controller, "RemoveOldDepartmentPermissions").CallDatabase(
                "RemoveOldDepartmentPermissions", new { departmentId = departmentId }, ResultType.Single,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel AddDepartmentPermission(long departmentId, long menuId, long projectId)
        {
            return new MyDatabaseHandler<long>(controller, "AddDepartmentPermission").CallDatabase(
                "AddDepartmentPermission", new { departmentId = departmentId, menuId = menuId, projectId = projectId }, ResultType.Single,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel AddNewGroup(string groupName)
        {
            return new MyDatabaseHandler<long>(controller, "AddNewGroup").CallDatabase("AddPlanetNewGroup",
                new { group = groupName }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel UpdateUserPassword(long userId, string password)
        {
            return new MyDatabaseHandler<long>(controller, "UpdateUserPassword").CallDatabase("UpdateUserPassword",
                new { userId = userId, password = password }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RecordKafkaObjectPerType(string type, string key, string? objString)
        {
            return new MyDatabaseHandler<long>(controller, "RecordKafkaObjectPerType").CallDatabase(
                "RecordPlanetKafkaObjectPerType", new { type = type, key = key, obj = objString }, ResultType.Single,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveKafkaTopicObjectsPerType(string type)
        {
            return new MyDatabaseHandler<RawKafkaObject>(controller, "RetrieveKafkaTopicObjectsPerType").CallDatabase(
                "RetrievePlanetKafkaObjectPerType", new { type = type }, ResultType.Multiple,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveUserAlertsPerType(long userId, string type)
        {
            return new MyDatabaseHandler<PlanetUserAlert>(controller, "RetrieveUserAlertsPerType").CallDatabase(
                "RetrievePlanetUserAlertsPerType", new { userId = userId, type = type }, ResultType.Multiple,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel InsertNewUserAlert(PlanetUserAlert alert)
        {
            return new MyDatabaseHandler<PlanetUserAlert>(controller, "InsertNewUserAlert").CallDatabase("InsertNewPlanetUserAlert",
                new
                {
                    title = alert.AlertTitle,
                    msg = alert.AlertMessage,
                    userId = alert.UserId,
                    table = alert.AlertTableType,
                    obj = alert.AlertDataObject
                }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel MarkAsReadUserAlert(Guid alertId)
        {
            return new MyDatabaseHandler<long>(controller, "MarkAsReadUserAlert").CallDatabase(
                "MarkAsReadPlanetUserAlert", new { alertId = alertId.ToString() }, ResultType.Single,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel MarkAllUserAlertsAsRead(long userId)
        {
            return new MyDatabaseHandler<long>(controller, "MarkAllUserAlertsAsRead").CallDatabase(
                "MarkAsReadAllPlanetUserAlert", new { userId = userId }, ResultType.Single,
                ExecuteType.StoredProcedure);
        }
    }
}
