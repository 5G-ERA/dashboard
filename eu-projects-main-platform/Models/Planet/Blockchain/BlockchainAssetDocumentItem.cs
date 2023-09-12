namespace eu_projects_main_platform.Models.Planet.Blockchain
{
    public class BlockchainAssetDocumentItem
    {
        public string hash { get; set; }
        public long docType { get; set; }
        public string initiator { get; set; }
        public string key { get; set; }
        public string txHash { get; set; }
        public string blockHash { get; set; }
        public long blockNumber { get; set; }
        public long txIndex { get; set; }
    }
}
