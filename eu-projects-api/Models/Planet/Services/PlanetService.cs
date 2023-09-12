using eu_projects_api.Models.Planet.Constants;
using eu_projects_api.Models.Planet.Helpers;
using eu_projects_api.Models.Planet.UserSettings;
using eu_projects_api.Models.Planet.UserSettings.DTO;
using MongoDB.Bson;
using MongoDB.Driver;

namespace eu_projects_api.Models.Planet.Services
{
    public class PlanetService : IPlanetService
    {
        private readonly IMongoDatabase _database;
        private readonly IMongoDatabase _UserDatabase;
        public PlanetService(IPlanetDbSettings settings)
        {
            var client = new MongoClient(settings.connectionString);
            _database = client.GetDatabase(settings.DataBaseName);
            _UserDatabase = client.GetDatabase(mongoConst.DataBases.DASHBOARD);
        }
        public async Task<BsonDocument> getById(string collectionName, string id)
        {
            var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
            var collection = _database.GetCollection<BsonDocument>(collectionName);
            return await((await collection.FindAsync(filter)).FirstOrDefaultAsync());

        }
        public async Task<List<BsonDocument>> getList(string collectionName)
        {
            var collection = _database.GetCollection<BsonDocument>(collectionName);
            return await ((await collection.FindAsync(new BsonDocument())).ToListAsync());
        }

        public BsonDocument Create(string collectionName, BsonDocument obj)
        {
            var collection = _database.GetCollection<BsonDocument>(collectionName);
            collection.InsertOne(obj);
            return obj;
        }
        public bool Update(string collectionName, string id, BsonDocument obj)
        {
            var collection = _database.GetCollection<BsonDocument>(collectionName);
            var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
            var res = collection.ReplaceOne(filter, obj);

            return (res.ModifiedCount > 0);
        }
        public bool Delete(string collectionName, string id)
        {
            var collection = _database.GetCollection<BsonDocument>(collectionName);
            var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
            var res = collection.DeleteOne(filter);
            return (res.DeletedCount > 0);
        }


        public List<string> GetCollections()
        {
            List<string> collections = new List<string>();

            foreach (BsonDocument collection in _database.ListCollectionsAsync().Result.ToListAsync<BsonDocument>().Result)
            {
                string name = collection["name"].AsString;
                collections.Add(name);
            }

            return collections;
        }


        // user
        public async Task<userSettings> getUserSetting(string id)
        {
            var collection = _UserDatabase.GetCollection<userSettings>(mongoConst.Collections.DashboardCollections.SETTINGS);
            var filter = Builders<userSettings>.Filter.Eq("userId", id);
            var settings = await ((await collection.FindAsync(filter)).FirstOrDefaultAsync());
            if(settings == null)
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
            var collection = _UserDatabase.GetCollection<userSettings>(mongoConst.Collections.DashboardCollections.SETTINGS);
            var filter = Builders<userSettings>.Filter.Eq("userId", id);
                      

            var oldSettings = await getUserSetting(id);

            //upset --> if it exists over write it/ if not create it
            var page = oldSettings.pages.FirstOrDefault(x=> x.Name == updatedSetting.pageName);
            if(page == null)
            {
                page = new pageSettings
                {
                    Name = updatedSetting.pageName,
                    tables = new List<tableColViews>{ updatedSetting.tables }
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
                if(page.tables.Any(x=> x.tableId == updatedSetting.tables.tableId))
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
            var collection = _UserDatabase.GetCollection<userSettings>(mongoConst.Collections.DashboardCollections.SETTINGS);
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
            var collection = _UserDatabase.GetCollection<userSettings>(mongoConst.Collections.DashboardCollections.SETTINGS);
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
            var collection = _UserDatabase.GetCollection<userSettings>(mongoConst.Collections.DashboardCollections.SETTINGS);
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
                        oldSaved = oldSaved.Where(x=> x.Name != searchToDelete.searchName).ToList();
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

    }
}
