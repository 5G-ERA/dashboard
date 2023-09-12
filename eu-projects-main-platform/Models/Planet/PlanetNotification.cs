
using MongoDB.Bson.Serialization.Attributes;

namespace eu_projects_main_platform.Models.Planet
{
    public class PlanetNotification
    {
        public string Title { get; set; }
        public string Message { get; set; }
        public string ReferenceId { get; set; }
        public DateTime NotificationTime { get; set; }
        public bool IsNew { get; set; } = true;
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string AlertId { get; set; }
    }
}
