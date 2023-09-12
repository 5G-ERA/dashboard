using eu_projects_main_platform.Data;
using eu_projects_main_platform.Models;
using eu_projects_main_platform.Models.Authentication;
using eu_projects_main_platform.Models.DatabaseHandler;
using eu_projects_main_platform.Models.Planet;
using eu_projects_main_platform.Models.Planet.Auth;
using eu_projects_main_platform.Models.Planet.Constant;
using eu_projects_main_platform.Models.Planet.SignalR;
using eu_projects_main_platform.Models.Planet.UserSettings;
using eu_projects_main_platform.Models.Planet.UserSettings.DTO;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using eu_projects_main_platform.Models.Planet.Background_jobs;
using Microsoft.AspNetCore.Mvc;

namespace eu_projects_main_platform.Business
{
    public class PlanetBusiness
    {
        //private readonly IHubContext<PlanetHub> _planetHub;
        public PlanetBusiness(/*IHubContext<PlanetHub> planetHub*/)
        {
            //_planetHub = planetHub;
        }
        #region auth
        public PlanetAuthResponse GenerateToken(Users user, RefreshTokenRequest refreh = null)
        {

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.userId.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
                new Claim("Fullname", user.Fullname),
                new Claim("Role", ""),
                new Claim("ProjectId", user.ProjectId.ToString()),
                //new Claim("ProjectCode", user.ProjectControllerCode),
            };

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(AppSettings.tokenSecret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            //var tokenExpiryDate = DateTime.Now.AddMinutes(10);
            var tokenExpiryDate = DateTime.Now.AddDays(1);
            var refreshTokenExpiryDate = DateTime.Now.AddDays(14);
            var token = new JwtSecurityToken(claims: claims, expires: tokenExpiryDate,
                signingCredentials: credentials);


            var refreshToken = getRefreshToken();
            var resp = new PlanetAuthResponse
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                RefreshToken = refreshToken
            };

            //TODO: save to db
            var userToken = new UserToken
            {
                TokenKey = resp.Token,
                UserID = user.userId,
                Note = "",
                ExpiryDate = refreshTokenExpiryDate,
                RefreshToken = refreshToken
            };
            new PlanetData().AddUserToken(userToken);
            if(refreh != null)
            {
                new PlanetData().DeleteTokenInfo(refreh);
            }

            return resp;
        }
        private string getRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var randomNumberGenerator = RandomNumberGenerator.Create())
            {
                randomNumberGenerator.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
        public CustomResponseModel GetTokenInfo(RefreshTokenRequest req)
        {
            return new PlanetData().RetrieveTokenInfo(req);
        }
        public JwtSecurityToken getJWTToken(string token)
        {
            JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
            return handler.ReadJwtToken(token);
        }
        public PlanetAuthResponse CreateNewToken(UserToken refreshToken,Users user, RefreshTokenRequest refreshRequest)
        {
            if (refreshToken.ExpiryDate < DateTime.Now)
            {
                return null;
            }
            if (!refreshToken.IsValid)
            {
                return null;
            }

            return GenerateToken(user, refreshRequest);
        }
        #endregion

        #region mongo requests
        private IMongoDatabase getMongoClient(string database)
        {
            var client = new MongoClient(AppSettings.planetDbConnectionString);
            var _database = client.GetDatabase(database);
            return _database;
        }

        public async Task<List<BsonDocument>> getMongoList(string databaseName, string collectionName)
        {
            var database = getMongoClient(databaseName);
            var collection = database.GetCollection<BsonDocument>(collectionName);
            return await ((await collection.FindAsync(new BsonDocument())).ToListAsync());
        }
        public async Task<BsonDocument> getMongoDataById(string databaseName, string collectionName, string id)
        {
            var database = getMongoClient(databaseName);

            var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
            var collection = database.GetCollection<BsonDocument>(collectionName);
            return await ((await collection.FindAsync(filter)).FirstOrDefaultAsync());
        }

        public List<string> GetCollections(string databaseName)
        {
            List<string> collections = new List<string>();
            var database = getMongoClient(databaseName);

            foreach (BsonDocument collection in database.ListCollectionsAsync().Result.ToListAsync<BsonDocument>().Result)
            {
                string name = collection["name"].AsString;
                collections.Add(name);
            }

            return collections;
        }
        #endregion

        #region user settings
        public async Task<userSettings> getUserSetting(string id)
        {
            var database = getMongoClient(mongoConst.DataBases.DASHBOARD);
            var collection = database.GetCollection<userSettings>(mongoConst.Collections.DashboardCollections.SETTINGS);
            var filter = Builders<userSettings>.Filter.Eq("userId", id);
            var settings = await ((await collection.FindAsync(filter)).FirstOrDefaultAsync());
            if (settings == null)
            {
                var newSettings = new userSettings
                {
                    userId = id,
                };
                await collection.InsertOneAsync(newSettings);
                return newSettings;
            }
            else
            {
                return settings;
            }
        }
        public async Task<userSettings> UpdateUserTableSettings(string id, tableSettingUpdate updatedSetting)
        {
            var database = getMongoClient(mongoConst.DataBases.DASHBOARD);
            var collection = database.GetCollection<userSettings>(mongoConst.Collections.DashboardCollections.SETTINGS);
            var filter = Builders<userSettings>.Filter.Eq("userId", id);


            var oldSettings = await getUserSetting(id);

            //upset --> if it exists over write it/ if not create it
            var page = oldSettings.pages.FirstOrDefault(x => x.Name == updatedSetting.pageName);
            if (page == null)
            {
                page = new pageSettings
                {
                    Name = updatedSetting.pageName,
                    tables = new List<tableColViews> { updatedSetting.tables }
                };
                //oldSettings.pages.Add(page);

                //var update = Builders<userSettings>.Update.Set(x => x.pages.Single(p => p.Name == updatedSetting.pageName), page);
                //var result = collection.UpdateOneAsync(filter, update).Result;

                var update = Builders<userSettings>.Update
                        .Push<pageSettings>(e => e.pages, page);
                await collection.FindOneAndUpdateAsync(filter, update);
            }
            else
            {
                if (page.tables.Any(x => x.tableId == updatedSetting.tables.tableId))
                {
                    //page.tables.FirstOrDefault(x => x.tableId == updatedSetting.tables.tableId).tableId = updatedSetting.tables.tableId;
                    page.tables.FirstOrDefault(x => x.tableId == updatedSetting.tables.tableId).hiddenColumns = updatedSetting.tables.hiddenColumns;
                }
                else
                {
                    //doesn't exit --> append it
                    page.tables.Add(updatedSetting.tables);
                }

                // exist --> update it
                filter = Builders<userSettings>.Filter.Where(x => x.userId == id && x.pages.Any(i => i.Name == updatedSetting.pageName));
                var update = Builders<userSettings>.Update.Set(x => x.pages[-1].tables, page.tables);
                var result = await collection.UpdateOneAsync(filter, update);
            }

            return await getUserSetting(id);
        }
        public async Task<userSettings> UpdateUserGridSettings(string id, gridSettingUpdate updatedSetting)
        {

            var database = getMongoClient(mongoConst.DataBases.DASHBOARD);
            var collection = database.GetCollection<userSettings>(mongoConst.Collections.DashboardCollections.SETTINGS);
            var filter = Builders<userSettings>.Filter.Eq("userId", id);

            var oldSettings = await getUserSetting(id);

            //upset --> if it exists over write it/ if not create it
            var page = oldSettings.pages.FirstOrDefault(x => x.Name == updatedSetting.pageName);
            if (page == null)
            {
                page = new pageSettings
                {
                    Name = updatedSetting.pageName,
                    hiddenGrids = updatedSetting.hiddenGrids.ToList()
                };
                //oldSettings.pages.Add(page);

                //var update = Builders<userSettings>.Update.Set(x => x.pages.Single(p => p.Name == updatedSetting.pageName), page);
                //var result = collection.UpdateOneAsync(filter, update).Result;

                var update = Builders<userSettings>.Update
                        .Push<pageSettings>(e => e.pages, page);
                await collection.FindOneAndUpdateAsync(filter, update);
            }
            else
            {
                filter = Builders<userSettings>.Filter.Where(x => x.userId == id && x.pages.Any(i => i.Name == updatedSetting.pageName));
                var update = Builders<userSettings>.Update.Set(x => x.pages[-1].hiddenGrids, updatedSetting.hiddenGrids);

                var result = await collection.UpdateOneAsync(filter, update);
            }

            return await getUserSetting(id);
        }
        public async Task<userSettings> UpdateUserSearchesSettings(string id, tableSettingUpdate updatedSetting)
        {

            var database = getMongoClient(mongoConst.DataBases.DASHBOARD);
            var collection = database.GetCollection<userSettings>(mongoConst.Collections.DashboardCollections.SETTINGS); 
            var filter = Builders<userSettings>.Filter.Eq("userId", id);


            var oldSettings = await getUserSetting(id);

            //upset --> if it exists over write it/ if not create it
            var page = oldSettings.pages.FirstOrDefault(x => x.Name == updatedSetting.pageName);
            if (page == null)
            {
                page = new pageSettings
                {
                    Name = updatedSetting.pageName,
                    tables = new List<tableColViews> { updatedSetting.tables }
                };
                //oldSettings.pages.Add(page);

                //var update = Builders<userSettings>.Update.Set(x => x.pages.Single(p => p.Name == updatedSetting.pageName), page);
                //var result = collection.UpdateOneAsync(filter, update).Result;

                var update = Builders<userSettings>.Update
                        .Push<pageSettings>(e => e.pages, page);
                await collection.FindOneAndUpdateAsync(filter, update);
            }
            else
            {
                if (page.tables.Any(x => x.tableId == updatedSetting.tables.tableId))
                {
                    //page.tables.FirstOrDefault(x => x.tableId == updatedSetting.tables.tableId).savedSearches = updatedSetting.tables.savedSearches;


                    var oldSaved = page.tables.FirstOrDefault(x => x.tableId == updatedSetting.tables.tableId).savedSearches;
                    int index = oldSaved.FindIndex(x => x.Name == updatedSetting.tables.savedSearches[0].Name);

                    if (index != -1)
                    {
                        oldSaved[index] = updatedSetting.tables.savedSearches[0];
                        page.tables.FirstOrDefault(x => x.tableId == updatedSetting.tables.tableId).savedSearches = oldSaved;
                    }
                    else
                    {
                        page.tables.FirstOrDefault(x => x.tableId == updatedSetting.tables.tableId).savedSearches.Add(updatedSetting.tables.savedSearches[0]);
                    }

                }
                else
                {
                    //doesn't exit --> append it
                    page.tables.Add(updatedSetting.tables);
                }

                // exist --> update it
                filter = Builders<userSettings>.Filter.Where(x => x.userId == id && x.pages.Any(i => i.Name == updatedSetting.pageName));
                var update = Builders<userSettings>.Update.Set(x => x.pages[-1].tables, page.tables);
                var result = await collection.UpdateOneAsync(filter, update);
            }

            return await getUserSetting(id);
        }
        public async Task<userSettings> DeleteUserSearch(string id, DeleteUserSearch searchToDelete)
        {

            var database = getMongoClient(mongoConst.DataBases.DASHBOARD);
            var collection = database.GetCollection<userSettings>(mongoConst.Collections.DashboardCollections.SETTINGS);
            var filter = Builders<userSettings>.Filter.Eq("userId", id);


            var oldSettings = await getUserSetting(id);

            //upset --> if it exists over write it/ if not create it
            var page = oldSettings.pages.FirstOrDefault(x => x.Name == searchToDelete.pageName);
            if (page == null)
            {
                // not found
            }
            else
            {
                if (page.tables.Any(x => x.tableId == searchToDelete.tableId))
                {

                    var oldSaved = page.tables.FirstOrDefault(x => x.tableId == searchToDelete.tableId).savedSearches;
                    int index = oldSaved.FindIndex(x => x.Name == searchToDelete.searchName);

                    if (index != -1)
                    {
                        oldSaved = oldSaved.Where(x => x.Name != searchToDelete.searchName).ToList();
                        page.tables.FirstOrDefault(x => x.tableId == searchToDelete.tableId).savedSearches = oldSaved;

                        filter = Builders<userSettings>.Filter.Where(x => x.userId == id && x.pages.Any(i => i.Name == searchToDelete.pageName));
                        var update = Builders<userSettings>.Update.Set(x => x.pages[-1].tables, page.tables);
                        var result = await collection.UpdateOneAsync(filter, update);
                    }
                    else
                    {
                        //not found
                    }

                }
                else
                {
                    // not found
                }

                // exist --> update it
            }

            return await getUserSetting(id);
        }
        #endregion

        #region realtime data
        public async Task SendNotification (PlanetNotification notification, string id, IHubContext<PlanetHub> _planetHub)
        {
            //Get the all connections for user (in case logged in from more than 1 device)  
            var connections = await new ConnectionsTracker().GetConnectionsForUser(id);
            await _planetHub.Clients.Clients(connections).SendAsync(PlanetSignalrMethods.Notifications, notification);
        }
        #endregion
        public CustomResponseModel RetrieveContainerID()
        {
            return new PlanetData().RetrieveContainerID();
        }
        public CustomResponseModel RetrieveTrackTrace(string ContainerID)
        {
            return new PlanetData().RetrieveTrackTrace(ContainerID);
        }

        public CustomResponseModel RetrieveUserDepartment(long userId)
        {
            return new PlanetData().RetrieveUserDepartment(userId);
        }

        public CustomResponseModel AddNewAlertThreshold(long userId, string name, string type, decimal maxValue, decimal minValue, bool isActive, string table)
        {
            return new PlanetData().AddNewAlertThreshold(userId, name, type, maxValue, minValue, isActive, table);
        }

        public CustomResponseModel EditAlertThreshold(long userId, long alertId, string name, string type, decimal maxValue, decimal minValue, bool isActive, string table)
        {
            return new PlanetData().EditAlertThreshold(userId, alertId, name, type, maxValue, minValue, isActive, table);
        }

        public CustomResponseModel RetrieveAlertThresholds(long userId)
        {
            return new PlanetData().RetrieveAlertThresholds(userId);
        }

        public CustomResponseModel RetrieveAlertThresholdDetails(long alertId)
        {
            return new PlanetData().RetrieveAlertThresholdDetails(alertId);
        }

        public CustomResponseModel DeleteAlertThreshold(long alertId)
        {
            return new PlanetData().DeleteAlertThreshold(alertId);
        }

        public CustomResponseModel RetrieveProjectUsersPerProject(long projectId)
        {
            return new PlanetData().RetrieveProjectUsersPerProject(projectId);
        }

        public CustomResponseModel RetrievePlanetUserGroups()
        {
            return new PlanetData().RetrievePlanetUserGroups();
        }

        public CustomResponseModel RetrievePlanetPermissionsPerDepartment(long departmentId)
        {
            return new PlanetData().RetrievePlanetPermissionsPerDepartment(departmentId);
        }

        public CustomResponseModel RetrieveUserDetails(long userId)
        {
            return new PlanetData().RetrieveUserDetails(userId);
        }

        public CustomResponseModel EditProjectUserDetails(long userId, string username, string fullname, string password)
        {
            return new PlanetData().EditProjectUserDetails(userId, username, fullname, password);
        }

        public CustomResponseModel AddNewUserToDepartment(long projectId, long departmentId, string username, string fullname, string password)
        {
            return new PlanetData().AddNewUserToDepartment(projectId, departmentId, username, fullname, password);
        }

        public CustomResponseModel RemoveUser2Department(long departmentId, long userId)
        {
            return new PlanetData().RemoveUser2Department(departmentId, userId);
        }

        public CustomResponseModel AddExistingUser2Department(long userId, long departmentId)
        {
            return new PlanetData().AddExistingUser2Department(departmentId, userId);
        }

        public CustomResponseModel RemoveOldDepartmentPermissions(long departmentId)
        {
            return new PlanetData().RemoveOldDepartmentPermissions(departmentId);
        }

        public CustomResponseModel AddDepartmentPermission(long departmentId, long menuId, long projectId)
        {
            return new PlanetData().AddDepartmentPermission(departmentId, menuId, projectId);
        }

        public CustomResponseModel AddNewGroup(string groupName)
        {
            return new PlanetData().AddNewGroup(groupName);
        }

        public CustomResponseModel UpdateUserPassword(long userId, string password)
        {
            return new PlanetData().UpdateUserPassword(userId, password);
        }

        public void RecordKafkaObjectsPerType(string type, List<KafkaResultObject> objects)
        {
            var planetData = new PlanetData();
            foreach (var obj in objects)
            {
                planetData.RecordKafkaObjectPerType(type, obj.Key, obj.Obj);
            }
        }

        public CustomResponseModel RetrieveKafkaTopicObjectsPerType(string type)
        {
            return new PlanetData().RetrieveKafkaTopicObjectsPerType(type);
        }

        public CustomResponseModel RetrieveUserAlertsPerType(long userId, string type)
        {
            return new PlanetData().RetrieveUserAlertsPerType(userId, type);
        }

        public CustomResponseModel InsertNewAlert(PlanetUserAlert planetUserAlert)
        {
            return new PlanetData().InsertNewUserAlert(planetUserAlert);
        }

        public CustomResponseModel MarkAsReadUserAlert(Guid alertId)
        {
            return new PlanetData().MarkAsReadUserAlert(alertId);
        }

        public CustomResponseModel MarkAllUserAlertsAsRead(long userId)
        {
            return new PlanetData().MarkAllUserAlertsAsRead(userId);
        }
    }
}
