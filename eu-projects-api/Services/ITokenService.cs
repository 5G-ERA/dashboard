using eu_projects_api.Models.Authentication;

namespace eu_projects_api.Services
{
    public interface ITokenService
    {
        string CreateToken(Users user);
    }
}