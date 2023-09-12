namespace eu_projects_main_platform.Models.Planet.GraphQL
{
    public class Shipment
    {
        public string id { get; set; }
        public string code { get; set; }
        public IEnumerable<ShipmentLogisticUnit> logisticUnits { get; set; }
    }

    public class ShipmentLogisticUnit
    {
        public string id { get; set; }
        public string code { get; set; }
    }

    public class ShipmentSet
    {
        public IEnumerable<Shipment> shipment { get; set; }
    }

    public class ShipmentSetWrapper
    {
        public ShipmentSet data { get; set; }
    }

    public class DetailedShipmentLogisticUnitSensor
    {
        public string id { get; set; }
        public string name { get; set; }
        public IEnumerable<DetailedWeatherHost> hosts { get; set; }
    }

    public class DetailedShipmentLogisticUnit
    {
        public string id { get; set; }
        public IEnumerable<DetailedShipmentLogisticUnitSensor> sensors { get; set; }
    }

    public class DetailedShipment
    {
        public string id { get; set; }
        public IEnumerable<DetailedShipmentLogisticUnit> LogisticUnits { get; set; }
    }

    public class DetailedShipmentSet
    {
        public IEnumerable<DetailedShipment> shipment { get; set; }
    }

    public class DetailedShipmentSetWrapper
    {
        public DetailedShipmentSet data { get; set; }
    }
}
