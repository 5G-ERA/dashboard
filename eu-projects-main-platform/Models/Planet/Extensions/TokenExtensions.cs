using Microsoft.AspNetCore.SignalR;
using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace eu_projects_main_platform.Models.Planet.Extensions
{
    public static class TokenExtensions
    {
        public static string GetUserId(this HttpContext httpContext)
        {
            return httpContext.User.Claims.Single(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;
        }
        public static string GetUserName(this HttpContext httpContext)
        {
            return httpContext.User.Claims.Single(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name").Value;

        }
        public static string GetFullName(this HttpContext httpContext)
        {
            return httpContext.User.Claims.Single(x => x.Type == "Fullname").Value;
        }
        //public static string GetProjectCode(this HttpContext httpContext)
        //{
        //    return httpContext.User.Claims.Single(x => x.Type == "ProjectCode").Value;
        //}
        public static string GetProjectId(this HttpContext httpContext)
        {
            return httpContext.User.Claims.Single(x => x.Type == "ProjectId").Value;
        }



        //signalR token
        public static string GetUserName(this HubCallerContext httpContext)
        {
            return httpContext.User.Claims.Single(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name").Value;
        }
    }
}
