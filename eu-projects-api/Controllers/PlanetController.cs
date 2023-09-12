using eu_projects_api.Extensions;
using eu_projects_api.Models.Planet.Constants;
using eu_projects_api.Models.Planet.Services;
using eu_projects_api.Models.Planet.UserSettings;
using eu_projects_api.Models.Planet.UserSettings.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Dynamic;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace eu_projects_api.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class PlanetController : ControllerBase
    {
        private readonly IPlanetService _context;

        public PlanetController(IPlanetService context)
        {
            _context = context;
        }
        //[Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet(PlanetAPIRoutes.PlanetRoutes.Collections)]
        public List<string> GetCollectionList()
        {
            //string[] collections = { "test"};
            var collections = _context.GetCollections();
            return collections;
        }

        [HttpGet(PlanetAPIRoutes.PlanetRoutes.Get)]
        public async Task<IActionResult> Get(string collection)
        {
            var dataList = await _context.getList(collection);
            var jsonData = dataList.getJson();

            var dataToSend = JsonConvert.DeserializeObject<List<ExpandoObject>>(jsonData, new ExpandoObjectConverter());


            return Ok(dataToSend);
        }

        [HttpGet(PlanetAPIRoutes.PlanetRoutes.GetById)]
        public async Task<IActionResult> GetById(string collection, string id)
        {
            var data = await _context.getById(collection, id);
            var jsonData = data.getJson();

            var dataToSend = JsonConvert.DeserializeObject<ExpandoObject>(jsonData, new ExpandoObjectConverter());

            return Ok(dataToSend);
        }


        [HttpGet(PlanetAPIRoutes.PlanetRoutes.GetUserSettings)]
        [ProducesResponseType(typeof(userSettings), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUserSettings(string id)
        {
            var data = await _context.getUserSetting(id);

            return Ok(data);
        }

        [HttpPut(PlanetAPIRoutes.PlanetRoutes.UpdateUsertableSettings)]
        [ProducesResponseType(typeof(userSettings), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateUserTableSettings(string id, tableSettingUpdate setting)
        {
            var data = await _context.UpdateUserTableSettings(id, setting);

            return Ok(data);
        }

        [HttpPut(PlanetAPIRoutes.PlanetRoutes.UpdateUserGridSettings)]
        [ProducesResponseType(typeof(userSettings), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateUserGridSettings(string id, gridSettingUpdate setting)
        {
            var data = await _context.UpdateUserGridSettings(id,setting);

            return Ok(data);
        }


        [HttpPut(PlanetAPIRoutes.PlanetRoutes.UpdateUsertableSearches)]
        [ProducesResponseType(typeof(userSettings), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateUserSavedTableSearch(string id, tableSettingUpdate setting)
        {
            var data = await _context.UpdateUserSearchesSettings(id, setting);

            return Ok(data);
        }


        [HttpPut(PlanetAPIRoutes.PlanetRoutes.DeleteUsertableSearches)]
        [ProducesResponseType(typeof(userSettings), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteUserSavedSearch(string id, DeleteUserSearch setting)
        {
            var data = await _context.DeleteUserSearch(id, setting);

            return Ok(data);
        }
    }

}
