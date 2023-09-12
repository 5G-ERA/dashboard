namespace eu_projects_api.Models.Planet.Constants
{
    public class PlanetAPIRoutes
    {
        public static class PlanetRoutes
        {
            //public const string Base = "/test";  overwrite the controller route
            public const string Collections = "collections";
            public const string Base = "{collection}";
            public const string BaseWithId = Base + "/{id}";
            public const string Add = Base;
            public const string AddDynamic = Add + "/dynamic";

            public const string Get = Base;
            public const string GetById = BaseWithId;
            public const string Update = BaseWithId;
            public const string UpdateDynamic = Update + "/dynamic";
            public const string Delete = BaseWithId;

            public const string GetUserSettings = "settings/{id}";
            public const string UpdateUserGridSettings = "settings/{id}/grid";
            public const string UpdateUsertableSettings = "settings/{id}/table";
            public const string UpdateUsertableSearches = "settings/{id}/search";
            public const string DeleteUsertableSearches = "settings/{id}/search/delete";

        }
    }
}
