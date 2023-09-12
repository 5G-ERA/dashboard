using MongoDB.Bson.Serialization.Attributes;

namespace eu_projects_main_platform.Models.Planet
{
    public class PlanetAlert
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        public int UserId { get; set; }
        public string ReferenceId { get; set; }
        public string DataSource { get; set; }
        public List<AlertCondition> Conditions { get; set; } =  new List<AlertCondition>();
        public DateTime? EventTime { get; set; } //if null ==> didn't happen yet
    }

    public class PlanetUserAlert
    {
        public Guid UserAlertId { get; set; }
        public string AlertTitle { get; set; }
        public string AlertMessage { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsNew { get; set; }
        public long UserId { get; set; }
        public string AlertTableType { get; set; }
        public string AlertDataObject { get; set; }
    }
}
