namespace eu_projects_main_platform.Models.Inspectr
{
    public class UserApiToken
    {
        public long UserTokenID { get; set; }
        public string? TokenKey { get; set; }
        public DateTime EntryDate { get; set; }
        public long UserID { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string? Note { get; set; }
        public TimeSpan RemainingTime
        {
            get { return this.ExpiryDate.Subtract(DateTime.Now); }
        }
    }
}
