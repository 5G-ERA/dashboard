using Newtonsoft.Json;
using System.ComponentModel;

namespace eu_projects_main_platform.Models.Planet
{
    public class Simulation
    {
        public int idSim { get; set; }
        [JsonProperty("PI (Physical Internet)")]
        public int PI { get; set; }

        [JsonProperty("AI (Artificial Intelligence)")]
        public int AI { get; set; }

        [JsonProperty("IoT (Internet of Things)")]
        public int IoT { get; set; }

        [JsonProperty("BC (Blockchain)")]
        public int BC { get; set; }

        [JsonProperty("Delivered Containers")]
        public int DeliveredContainers { get; set; }

        [JsonProperty("Delivered Containers (On Time)")]
        public int DeliveredContainersOT { get; set; }

        [JsonProperty("% Containers Delivered On Time")]
        public int ContainersDeliveredOnTime { get; set; }

        [JsonProperty("Container Average Lead Time (days)")]
        public int ContainerAverage { get; set; }
        [JsonProperty("Rail Distance (km)")]
        public int RailDistance { get; set; }
        [JsonProperty("Rail Emissions (t CO2)")]
        public int RailEmissions { get; set; }
        [JsonProperty("Rail Modal Split (%)")]
        public int RailModal { get; set; }
        [JsonProperty("Rail Capacity Usage (%)")]
        public int RailCapacityUsage { get; set; }
        [JsonProperty("Road Distance (km)")]
        public int RoadDistance { get; set; }
        [JsonProperty("Road Emissions (t CO2)")]
        public int RoadEmissions { get; set; }
        [JsonProperty("Road Modal Split (%)")]
        public int RoadModalSplit { get; set; }
        [JsonProperty("Road Activated Trucks")]
        public int RoadActivatedTrucks { get; set; }
        [JsonProperty("Total Distance (km x 10e6)")]
        public int TotalDistance { get; set; }
        [JsonProperty("Total Emissions (t CO2)")]
        public int TotalEmissions { get; set; }
    }
}
