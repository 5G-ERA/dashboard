namespace eu_projects_main_platform.Models.Planet.Auth
{
    public class UserToken
    {
        public long UserTokenID { get; set; }
        public string? TokenKey { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime EntryDate { get; set; }
        public long UserID { get; set; }
        public DateTime ExpiryDate { get; set; }
        public bool IsValid { get; set; }
        public string? Note { get; set; }

    }
}
