using eu_projects_api.Models.Planet.UserSettings;
using eu_projects_api.Models.Planet.UserSettings.DTO;
using MongoDB.Bson;

namespace eu_projects_api.Models.Planet.Services
{
    public interface IPlanetService
    {
        Task<List<BsonDocument>> getList(string collectionName);
        Task<BsonDocument>  getById(string collectionName, string id);
        //BsonDocument Create(string collectionName, BsonDocument obj);
        //bool Update(string collectionName, string id, BsonDocument obj);
        //bool Delete(string collectionName, string id);
        List<string> GetCollections();

        Task<userSettings> getUserSetting(string id);
        Task<userSettings> UpdateUserTableSettings(string id, tableSettingUpdate updatedSetting);
        Task<userSettings> UpdateUserGridSettings(string id, gridSettingUpdate updatedSetting);
        Task<userSettings> UpdateUserSearchesSettings(string id, tableSettingUpdate updatedSetting);
        Task<userSettings> DeleteUserSearch(string id, DeleteUserSearch searchToDelete);
    }
}
