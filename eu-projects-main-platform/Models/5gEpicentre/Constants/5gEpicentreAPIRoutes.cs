namespace eu_projects_main_platform.Models._5gEpicentre.Constants
{
    public class _5gEpicentreAPIRoutes
    {
        public const string controllerBase = "/api/5gEpicentre";
        public static class ALBRoutes
        {
            private const string Base = controllerBase + "/ALB";

            public const string AddSub = Base + "/3gpp-traffic-influence/v1/{afId}/subscriptions";
            public const string GetSub = Base + "/3gpp-traffic-influence/v1/{afId}/subscriptions/{subscriptionId}";
            public const string UpdateSub = Base + "/3gpp-traffic-influence/v1/{afId}/subscriptions/{subscriptionId}";
            public const string DeleteSub = Base + "/3gpp-traffic-influence/v1/{afId}/subscriptions/{subscriptionId}";

        }

        public static class CTTCRoutes
        {
            private const string Base = controllerBase + "/HHI";

        }
        public static class HHIRoutes
        {
            private const string Base = controllerBase + "/HHI";

            public const string UpdateAppResources = Base + "/bin/application";
            public const string configurationLogs = Base + "/logs/{id}";

        }
        public static class UMARoutes
        {
            private const string Base = controllerBase + "/UMA";

            public const string AddAppConfiguration = Base + "/run";
            public const string configurationLogs = Base + "/logs/{id}";


        }
    }
}