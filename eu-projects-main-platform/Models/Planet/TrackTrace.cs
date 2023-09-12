namespace eu_projects_main_platform.Models.Planet
{
    public class TrackTrace
    {
        public string? ID { set; get; }

        public string? MACAddress { set; get; }

        public DateTime Timestamp { set; get; }

        public string? coordinates { set; get; }

        public decimal Temperature { set; get; }

        public decimal Humidity { set; get; }

        public double AccelerometerX { set; get; }

        public double AccelerometerY { set; get; }

        public double AccelerometerZ { set; get; }

        public bool Exceedthreshold { set; get; }

        public string? ContainerID { set; get; }


    }
}
