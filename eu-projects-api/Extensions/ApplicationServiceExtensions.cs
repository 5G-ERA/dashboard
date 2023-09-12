using eu_projects_api.Models.Planet.Background_jobs;
using eu_projects_api.Models.Planet.Helpers;
using eu_projects_api.Models.Planet.Services;
using eu_projects_api.Services;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace eu_projects_api.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services, IConfiguration Configuration)
        {
            //mongoDB
            services.Configure<PlanetDbSettings>(
            Configuration.GetSection(nameof(PlanetDbSettings)));
            services.AddSingleton<IPlanetDbSettings>(sp =>
                    sp.GetRequiredService<IOptions<PlanetDbSettings>>().Value);

            //services
            //JWT token 
            services.AddScoped<ITokenService, TokenService>();

            services.AddScoped<IPlanetService, PlanetService>();
            //services.AddSingleton<IPlanetService, PlanetService>();

            services.AddSignalR();

            //kafka
            services.AddHostedService<PlanetKafkaListener>();

            //cors policy
            services
                .AddCors(options => options.AddPolicy("ProjectPolicy",
                builder =>
                {
                    // TODO: For SignalR you must use .SetIsOriginAllowed((host)=>true) with .AllowCredentials()
                    builder
                        .SetIsOriginAllowed((host) => true)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                }));

            return services;
        }
    }
}
