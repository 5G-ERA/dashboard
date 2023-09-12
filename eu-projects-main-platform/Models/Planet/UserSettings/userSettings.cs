using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace eu_projects_main_platform.Models.Planet.UserSettings
{
    public class userSettings
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string userId { get; set; }
        public List<pageSettings> pages { get; set; } = new List<pageSettings>();
    }
}
