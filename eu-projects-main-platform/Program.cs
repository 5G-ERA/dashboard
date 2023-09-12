using eu_projects_main_platform.Models;
using System.Security.Cryptography;
using System.Text;
using Confluent.Kafka;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using eu_projects_main_platform.Models.Planet.Background_jobs;
using eu_projects_main_platform.Models.Planet.Interfaces;
using eu_projects_main_platform.Models.Planet.SignalR;
using MongoDB.Driver;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDatabaseDeveloperPageExceptionFilter();
builder.Services.AddControllersWithViews();

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(60);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

//planet background jobs to listen to kafka topics
//builder.Services.AddHostedService<PlanetNewKafkaConsumer>();

builder.Services.AddHostedService<PlanetKafkaListener>();

//builder.Services.AddSingleton<IHostedService, PlanetNewKafkaConsumer>();


builder.Services.AddSignalR();

builder.Services.AddSingleton<IMongoClient, MongoClient>( s => new MongoClient(new MongoClientSettings
{
    SocketTimeout = TimeSpan.FromMinutes(15),
    MaxConnectionIdleTime = TimeSpan.FromMinutes(20),
    ConnectTimeout = TimeSpan.FromMinutes(5),
    ServerSelectionTimeout = TimeSpan.FromMinutes(5),
    MinConnectionPoolSize = 10,
    MaxConnectionPoolSize = 100,
    Server = new MongoServerAddress("135.181.217.228", 30200),
    Credential = MongoCredential.CreateCredential("admin", "mongousr", "TkyCvgY666tutjSg")
}));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("JwtToken").Value))
        };

        //authenticate signalR connection with the JWT token
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/PlanetHub"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });
builder.Services.AddHttpClient();

builder.Services.Configure<FormOptions>(options =>
{
    // Set the limit at 256 MB
    options.MultipartBodyLengthLimit = 268435456;
});

// Add services to the container.

var app = builder.Build();
IConfiguration configuration = app.Configuration;
AppSettings.connection_string = configuration.GetSection("ConnectionStrings").GetSection("DefaultConnection").Value;
AppSettings.log_folder_path = configuration.GetSection("LogFolderPath").Value;
AppSettings.default_login_logo_name = configuration.GetSection("DefaultLoginPageLogo").Value;
AppSettings.supported_domains = configuration.GetSection("SupportedDomains").Get<List<String>>();
AppSettings.cryptography_symmetric_key = Guid.NewGuid().ToString().Replace("-", "");
AppSettings.tokenSecret = configuration.GetSection("JwtToken").Value;
AppSettings.planetDbConnectionString = configuration.GetSection("PlanetDbSettings").GetSection("ConnectionStrings").Value;
AppSettings.mediaHub_UMM_Settings = JsonConvert.SerializeObject(configuration.GetSection("MediaHub_UMM_Settings").Get<UmmClientAppProperties>());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}


app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseDefaultFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();
app.UseSession();

app.MapControllerRoute(name: "auth",
    pattern: "auth/{*SignIn}",
    defaults: new { controller = "Authentication", action = "SignIn" }
    );

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Authentication}/{action=Login}/{project?}");
//app.MapRazorPages();

//planet SignalR hub
app.MapHub<PlanetHub>("/planetHub");

app.Run();