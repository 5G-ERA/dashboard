namespace eu_projects_main_platform.Models.Planet.Kafka
{
    public class RawKafkaObject
    {
        public Guid ObjectId { get; set; }
        public string type { get; set; }
        public string ObjectKey { get; set; }
        public string ObjectValue { get; set; }
    }
}
