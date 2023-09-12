using eu_projects_api.Models.Authentication;
using eu_projects_api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace eu_projects_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private ITokenService _context;

        public AuthenticationController(ITokenService context)
        {
                _context = context;
        }
        [HttpPost]
        [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
        //public async Task<IActionResult> AccountVerification(LoginViewModel login_details)
        public IActionResult AccountVerification(LoginViewModel login_details)
        {
            try
            {

                //Users? _user = new AuthenticationBusiness().LoginAuthentication(login_details.Username, login_details.Password);
                Users? _user = new Users
                {
                    Username = login_details.Username,
                    ProjectName = "projectName",
                    ProjectId = -1,
                };

                _user.Password = String.Empty;

                if (_user == null)
                {
                    var resp = new AuthResponse();
                    resp.Success = false;
                    resp.Token = "";
                    return Ok(resp);
                }
                else if (!String.IsNullOrEmpty(_user.authentication_error))
                {
                    return BadRequest();
                }
                else if (String.IsNullOrEmpty(_user.ProjectName))
                {
                    return BadRequest();
                }
                else
                {
                    //String cipher = EncryptionDecryption.EncryptString(JsonConvert.SerializeObject(_user));
                    var resp = new AuthResponse();
                    //var result = await _context.CreateToken(_user);
                    var result = _context.CreateToken(_user);
                    resp.Token = result;
                    resp.Success = result != "";

                    return Ok(resp);
                }
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
            

        }
    }
}
