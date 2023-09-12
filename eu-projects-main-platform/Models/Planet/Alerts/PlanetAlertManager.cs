using eu_projects_main_platform.Controllers;
using eu_projects_main_platform.Models.Common;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eu_projects_main_platform.Models.Planet.Alerts
{
    public static class PlanetAlertManager
    {
        public static List<PlanetUserAlert> GetAlertFromDssTable(IEnumerable<AlertThreshold> thresholds, DssLastMileObjectData dssData)
        {
            var alerts = new List<PlanetUserAlert>();
            foreach (var item in dssData.LastMile1)
            {
                var etaValue = (decimal) TimeSpan.Parse(item.ETA2).TotalHours;
                foreach (var t in thresholds)
                {
                    if (t.MinValue <= etaValue && t.MaxValue >= etaValue)
                    {
                        var newAlert = new PlanetUserAlert
                        {
                            AlertTitle = "Alert: ETA Threshold",
                            AlertTableType = "DSS Table",
                            AlertMessage = JsonConvert.SerializeObject(item),
                            IsNew = true,
                            AlertDataObject = JsonConvert.SerializeObject(t)
                        };

                        alerts.Add(newAlert);
                    }
                }
            }

            foreach (var item in dssData.LastMile2)
            {
                var etaValue = (decimal)TimeSpan.Parse(item.ETA2).TotalHours;
                foreach (var t in thresholds)
                {
                    if (t.MinValue <= etaValue && t.MaxValue >= etaValue)
                    {
                        var newAlert = new PlanetUserAlert
                        {
                            AlertTitle = "Alert: ETA Threshold",
                            AlertTableType = "DSS Table",
                            AlertMessage = JsonConvert.SerializeObject(item),
                            IsNew = true,
                            AlertDataObject = JsonConvert.SerializeObject(t)
                        };

                        alerts.Add(newAlert);
                    }
                }
            }

            return alerts;
        }

        public static List<PlanetUserAlert> GetAlertFromTrackAndTraceTable(IEnumerable<AlertThreshold> thresholds, List<TrackAndTraceRecordItem> allShipmentRecords)
        {
            var alerts = new List<PlanetUserAlert>();

            foreach (var threshold in thresholds)
            {
                if (threshold.AlertThresholdType.ToLower().Equals(TrackAndTracePropertyTypes.Battery.ToString().ToLower()))
                {
                    foreach (var r in allShipmentRecords)
                    {
                        if (threshold.MinValue <= r.Battery && threshold.MaxValue >= r.Battery)
                        {
                            var newAlert = new PlanetUserAlert
                            {
                                AlertTitle = $"Alert: {threshold.AlertThresholdType} Threshold",
                                AlertTableType = "T&T Table",
                                AlertMessage = JsonConvert.SerializeObject(r),
                                IsNew = true,
                                AlertDataObject = JsonConvert.SerializeObject(threshold)
                            };

                            alerts.Add(newAlert);
                        }
                    }
                }

                if (threshold.AlertThresholdType.ToLower().Equals(TrackAndTracePropertyTypes.Luminance.ToString().ToLower()))
                {
                    foreach (var r in allShipmentRecords)
                    {
                        if (threshold.MinValue <= r.Luminance && threshold.MaxValue >= r.Luminance)
                        {
                            var newAlert = new PlanetUserAlert
                            {
                                AlertTitle = $"Alert: {threshold.AlertThresholdType} Threshold",
                                AlertTableType = "T&T Table",
                                AlertMessage = JsonConvert.SerializeObject(r),
                                IsNew = true,
                                AlertDataObject = JsonConvert.SerializeObject(threshold)
                            };

                            alerts.Add(newAlert);
                        }
                    }
                }

                if (threshold.AlertThresholdType.ToLower().Equals(TrackAndTracePropertyTypes.Humidity.ToString().ToLower()))
                {
                    foreach (var r in allShipmentRecords)
                    {
                        if (threshold.MinValue <= r.Humidity && threshold.MaxValue >= r.Humidity)
                        {
                            var newAlert = new PlanetUserAlert
                            {
                                AlertTitle = $"Alert: {threshold.AlertThresholdType} Threshold",
                                AlertTableType = "T&T Table",
                                AlertMessage = JsonConvert.SerializeObject(r),
                                IsNew = true,
                                AlertDataObject = JsonConvert.SerializeObject(threshold)
                            };

                            alerts.Add(newAlert);
                        }
                    }
                }

                if (threshold.AlertThresholdType.ToLower().Equals(TrackAndTracePropertyTypes.Temperature.ToString().ToLower()))
                {
                    foreach (var r in allShipmentRecords)
                    {
                        if (threshold.MinValue <= r.Temperature && threshold.MaxValue >= r.Temperature)
                        {
                            var newAlert = new PlanetUserAlert
                            {
                                AlertTitle = $"Alert: {threshold.AlertThresholdType} Threshold",
                                AlertTableType = "T&T Table",
                                AlertMessage = JsonConvert.SerializeObject(r),
                                IsNew = true,
                                AlertDataObject = JsonConvert.SerializeObject(threshold)
                            };

                            alerts.Add(newAlert);
                        }
                    }
                }

                if (threshold.AlertThresholdType.ToLower().Equals(TrackAndTracePropertyTypes.AccelerationX.ToString().ToLower()))
                {
                    foreach (var r in allShipmentRecords)
                    {
                        if (threshold.MinValue <= r.AccelerometerX && threshold.MaxValue >= r.AccelerometerY)
                        {
                            var newAlert = new PlanetUserAlert
                            {
                                AlertTitle = $"Alert: {threshold.AlertThresholdType} Threshold",
                                AlertTableType = "T&T Table",
                                AlertMessage = JsonConvert.SerializeObject(r),
                                IsNew = true,
                                AlertDataObject = JsonConvert.SerializeObject(threshold)
                            };

                            alerts.Add(newAlert);
                        }
                    }
                }

                if (threshold.AlertThresholdType.ToLower().Equals(TrackAndTracePropertyTypes.AccelerationY.ToString().ToLower()))
                {
                    foreach (var r in allShipmentRecords)
                    {
                        if (threshold.MinValue <= r.AccelerometerY && threshold.MaxValue >= r.AccelerometerY)
                        {
                            var newAlert = new PlanetUserAlert
                            {
                                AlertTitle = $"Alert: {threshold.AlertThresholdType} Threshold",
                                AlertTableType = "T&T Table",
                                AlertMessage = JsonConvert.SerializeObject(r),
                                IsNew = true,
                                AlertDataObject = JsonConvert.SerializeObject(threshold)
                            };

                            alerts.Add(newAlert);
                        }
                    }
                }

                if (threshold.AlertThresholdType.ToLower().Equals(TrackAndTracePropertyTypes.AccelerationZ.ToString().ToLower()))
                {
                    foreach (var r in allShipmentRecords)
                    {
                        if (threshold.MinValue <= r.AccelerometerZ && threshold.MaxValue >= r.AccelerometerZ)
                        {
                            var newAlert = new PlanetUserAlert
                            {
                                AlertTitle = $"Alert: {threshold.AlertThresholdType} Threshold",
                                AlertTableType = "T&T Table",
                                AlertMessage = JsonConvert.SerializeObject(r),
                                IsNew = true,
                                AlertDataObject = JsonConvert.SerializeObject(threshold)
                            };

                            alerts.Add(newAlert);
                        }
                    }
                }
            }

            return alerts;
        }
    }

    enum TrackAndTracePropertyTypes
    {
        Battery,
        Humidity,
        Luminance,
        Temperature,
        AccelerationX,
        AccelerationY,
        AccelerationZ
    }

    public class DssLastMileObjectData
    {
        public IEnumerable<MileDataItem1> LastMile1 { get; set; }
        public IEnumerable<MileDataItem2> LastMile2 { get; set; }

    }

    public class MileDataItem1
    {
        public string ID { get; set; }

        [JsonProperty("Origin Warehouse")]
        public string OriginWarehouse { get; set; }

        [JsonProperty("Task ID")]
        public string TaskID { get; set; }
        public string Date { get; set; }
        public string Route { get; set; }
        public string Sequence { get; set; }

        [JsonProperty("Begin time")]
        public string BeginTime { get; set; }

        [JsonProperty("Finish Time")]
        public string FinishTime { get; set; }

        [JsonProperty("Client representative")]
        public string ClientRepresentative { get; set; }
        public string Country { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string ETA { get; set; }
        public string Volume { get; set; }
        public string between_ETA { get; set; }
        public string Colour { get; set; }
        public string label { get; set; }
        public string label_route { get; set; }
        public string node_id_vrp { get; set; }
        public string vrp_sequence { get; set; }
        public string vrp_ETA { get; set; }
        public string vrp_ETA_time { get; set; }
        public string ETA2 { get; set; }
    }

    public class MileDataItem2
    {
        public string ID { get; set; }

        [JsonProperty("Type of service")]
        public string TypeOfService { get; set; }
        public string Origen { get; set; }

        [JsonProperty("Task ID")]
        public string TaskID { get; set; }

        [JsonProperty("Date ")]
        public string Date { get; set; }
        public string Route { get; set; }
        public string Sequence { get; set; }

        [JsonProperty("Begin Time")]
        public string BeginTime { get; set; }

        [JsonProperty("End Time")]
        public string EndTime { get; set; }

        [JsonProperty("Client representative")]
        public string ClientRepresentative { get; set; }
        public string Country { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }

        [JsonProperty("Service Time")]
        public string ServiceTime { get; set; }
        public string ETA { get; set; }
        public string Articles { get; set; }
        public string Weight { get; set; }
        public string Volume { get; set; }
        public string between_ETA { get; set; }
        public string status { get; set; }
        public string Colour { get; set; }
        public string label { get; set; }
        public string label_route { get; set; }
        public string time_window { get; set; }
        public string node_id_vrp { get; set; }
        public string vrp_sequence { get; set; }
        public string vrp_ETA { get; set; }
        public string vrp_ETA_time { get; set; }
        public string ETA2 { get; set; }
    }
}
