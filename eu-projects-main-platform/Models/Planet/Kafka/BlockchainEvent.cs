namespace eu_projects_main_platform.Models.Planet.Kafka
{
    public class BlockchainEvent
    {
        public string Event { get; set; }
        public string Document_ID { get; set; }
        public string Document_type { get; set; }
        public string eCMR_document_hash { get; set; }
        public string Transport_Order_reference_number { get; set; }
        public string City_of_loading { get; set; }
        public string Date_of_loading { get; set; }
        public string Time_of_loading { get; set; }
        public string City_of_discharge { get; set; }
        public string Date_of_discharge { get; set; }
        public string Time_of_discharge { get; set; }
        public string Type_of_package { get; set; }
        public string Number_of_packages { get; set; }
        public string Weight { get; set; }
        public string Volume { get; set; }
        public string Issue_date { get; set; }
        public string State { get; set; }
        public string Ledger_name { get; set; }
        public string TSN_ID { get; set; }
        public string Agreement_ID { get; set; }
        public string Trasmport_Order_reference_number { get; set; }
        public string Code { get; set; }
        public string Reason { get; set; }
        public string Value { get; set; }
        
    }
}
