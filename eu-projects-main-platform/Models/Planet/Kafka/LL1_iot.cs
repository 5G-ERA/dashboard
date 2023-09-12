using Newtonsoft.Json;

namespace eu_projects_main_platform.Models.Planet.Kafka
{
    public class LL1_iot
    {
        [JsonProperty("@context")]
        public List<object> Context { get; set; } = new List<object>();
        public string type { get; set; } = String.Empty;
        public string schemaVersion { get; set; } = String.Empty;
        public DateTime creationDate { get; set; }
        public EpcisBody? epcisBody { get; set; }
    }
    public class BizLocation
    {
        public string id { get; set; }
    }

    public class EpcisBody
    {
        public List<EventList> eventList { get; set; } = new List<EventList>();
    }

    public class EventList
    {
        public string type { get; set; } = String.Empty;
        public string action { get; set; } = String.Empty;
        public string bizStep { get; set; } = String.Empty;
        public DateTime eventTime { get; set; }
        public string eventTimeZoneOffset { get; set; } = String.Empty;
        public ReadPoint? readPoint { get; set; }
        public string disposition { get; set; } = String.Empty;
        public BizLocation? bizLocation { get; set; }
        public string parentID { get; set; } = String.Empty;
        public List<string> childEPCs { get; set; } = new List<string>();
        public List<SensorElement> sensorElementList { get; set; }
    }

    public class ReadPoint
    {
        public string id { get; set; }
    }

    public class SensorElement
    {
        public SensorMetadata SensorMetadata { get; set; }
        public IEnumerable<SensorReportItem> sensorReport { get; set; }
    }

    public class SensorMetadata
    {
        public string time { get; set; }
        public string DeviceID { get; set; }
    }

    public class SensorReportItem
    {
        public string type { get; set; }
        public decimal value { get; set; }
        public string uom { get; set; }
        public string component { get; set; }
    }
}
