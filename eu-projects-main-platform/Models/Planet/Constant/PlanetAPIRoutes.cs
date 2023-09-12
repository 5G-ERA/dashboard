namespace eu_projects_main_platform.Models.Planet.Constant
{
    public class PlanetAPIRoutes
    {
        public static class PlanetRoutes
        {
            public const string Base = "api/Planet";
            public const string Auth = Base + "/auth";
            public const string RefreshToken = Base + "/auth/refresh";
            public const string testAlert = Base + "/testAlert";
            public const string updateSimulation = Base + "/simulation";

        }
        public static class MongoRoutes
        {
            //public const string Base = "/test";  overwrite the controller route

            public const string TopBase = "api/Planet";
            public const string Collections = TopBase + "data/{database}/collections";
            public const string Base = TopBase + "data/{database}/{collection}";
            public const string BaseWithId = Base + "/{id}";
            public const string Add = Base;
            public const string AddDynamic = Add + "/dynamic";

            public const string Get = Base;
            public const string GetById = BaseWithId;
            public const string Update = BaseWithId;
            public const string UpdateDynamic = Update + "/dynamic";
            public const string Delete = BaseWithId;

            public const string GetUserSettings = TopBase + "/settings/{id}";
            public const string UpdateUserGridSettings = TopBase + "/settings/{id}/grid";
            public const string UpdateUsertableSettings = TopBase + "/settings/{id}/table";
            public const string UpdateUsertableSearches = TopBase + "/settings/{id}/search";
            public const string DeleteUsertableSearches = TopBase + "/settings/{id}/search/delete";
        }

    }
}
