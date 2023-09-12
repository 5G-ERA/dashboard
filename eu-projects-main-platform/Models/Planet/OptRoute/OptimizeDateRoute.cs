namespace eu_projects_main_platform.Models.Planet.OptRoute
{
    public class OptimizeDateRoute
    {
        public string _id { get; set; }
        public string date { get; set; }
        public string remaining_driver_hours { get; set; }
        public string message { get; set; }
        public string updated { get; set; }
        public IEnumerable<DateRouteVanStat> van_stats { get; set; }
        public IEnumerable<DateRoute> routes { get; set; }
    }

    public class LookupOptimizeDateRoute
    {
        public string _id { get; set; }
        public string date { get; set; }
        public string remaining_driver_hours { get; set; }
        public string message { get; set; }
        public string updated { get; set; }
    }

    public class DateRouteVanStat
    {
        public long van_index { get; set; }
        public long van_type { get; set; }
        public long total_time_seconds { get; set; }
        public long total_distand_km { get; set; }
        public long total_volume_cm { get; set; }
        public long total_quantity { get; set; }
        public long total_weight { get; set; }
    }

    public class DateRoute
    {
    public string _id { get; set; }
    public string Date { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public string Activity { get; set; }
    public string Service_Type { get; set; }
    public string Hub_origin { get; set; }
    public string Task_ID { get; set; }
    public decimal weight_kg { get; set; }
    public decimal Volume_cm { get; set; }
    public decimal quantity { get; set; }
    public decimal van_index { get; set; }
    public decimal delivery_order { get; set; }
    public decimal step_distance { get; set; }
    public decimal step_duration { get; set; }
    public decimal van_type { get; set; }
    public decimal cluster { get; set; }
    public string delivery_time { get; set; }
    public string steps { get; set; }
    }
}
