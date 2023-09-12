using eu_projects_main_platform.Models._5gEpicentre.Constants;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace eu_projects_main_platform.Controllers
{
    //[Route("api/[controller]")]
    [ApiController]
    public class _5gEpicentreController : ControllerBase
    {

        //ALB
        [HttpGet(_5gEpicentreAPIRoutes.ALBRoutes.GetSub)]
        public IActionResult GetAlbSub(int id)
        {
            return Ok();
        }

        [HttpPost(_5gEpicentreAPIRoutes.ALBRoutes.AddSub)]
        public IActionResult PostAlbSub([FromBody] string value)
        {
            return Ok();
        }

        [HttpPut(_5gEpicentreAPIRoutes.ALBRoutes.UpdateSub)]
        public IActionResult PutAlbSub(int id, [FromBody] string value)
        {
            return Ok();
        }

        [HttpDelete(_5gEpicentreAPIRoutes.ALBRoutes.DeleteSub)]
        public IActionResult DeleteAlbSub(int id)
        {
            return Ok();
        }


        //HHI
        [HttpGet(_5gEpicentreAPIRoutes.HHIRoutes.configurationLogs)]
        public IActionResult GetHhiConfigLogs(int id)
        {
            return Ok();
        }

        [HttpPut(_5gEpicentreAPIRoutes.HHIRoutes.UpdateAppResources)]
        public IActionResult UpdateHhiApp([FromBody] string value)
        {
            return Ok();
        }


        //UMA
        [HttpGet(_5gEpicentreAPIRoutes.UMARoutes.configurationLogs)]
        public IActionResult GetUmaConfigLogs(int id)
        {
            return Ok();
        }

        [HttpPut(_5gEpicentreAPIRoutes.UMARoutes.AddAppConfiguration)]
        public void UpdateUmaApp([FromBody] string value)
        {
        }



    }
}
