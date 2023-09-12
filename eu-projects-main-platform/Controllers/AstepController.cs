using Microsoft.AspNetCore.Mvc;
using eu_projects_main_platform.Business;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IHostingEnvironment;
using eu_projects_main_platform.Models._5gera.Constant;
using Microsoft.AspNetCore.Authorization;
using eu_projects_main_platform.Models.Astep;
using Newtonsoft.Json;
using eu_projects_main_platform.Models.Authentication;
using System.Security.Claims;
using eu_projects_main_platform.Models.DatabaseHandler;

namespace eu_projects_main_platform.Controllers
{
    public class AstepController : Controller
    {
        private readonly ILogger<AstepController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IHostingEnvironment _hostingEnvironment;

        public AstepController(ILogger<AstepController> logger, IConfiguration configuration,
                IHostingEnvironment hostingEnvironment)
        {
            _logger = logger;
            _configuration = configuration;
            _hostingEnvironment = hostingEnvironment;
        }

        #region Partial Views
        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> loadMenu(string menuName)
        {
            if (menuName == "Home")
                return PartialView("HomeMenu");
            if (menuName == "mandrekas")
                return PartialView("MandrekasMenu");
            if (menuName == "arcellormittal")
                return PartialView("ArcellorMenu");
            if (menuName == "other")
                return PartialView("OthersMenu");
            if (menuName == "docs")
                return PartialView("ViewDocsMenu");
            return PartialView("HomeMenu");

        }
        #endregion
        public IActionResult getUserToken()
        {
            dynamic token = new System.Dynamic.ExpandoObject();

            token.Id = "628f1eeafc59b78d0ca96243";
            token.username = "user";
            token.role = "admin";

            return Ok(token);
        }

        public IActionResult MandrekasCategory1()
        {
            return PartialView("MandrekasCategory1");
        }
        public IActionResult ArcellorCategory1()
        {
            return PartialView("ArcellorCategory1");
        }
        public IActionResult RetrieveUseCases(long userid, string username)
        {
            return Json(new AstepBusiness().RetrieveUseCases(userid, username));
        }
        public IActionResult RetrieveUCGeneralInfo(long usecase_id)
        {
            return Json(new AstepBusiness().RetrieveUCGeneralInfo(usecase_id));
        }

        public IActionResult RetrieveSingleExperimentResultsEvaluation(long usecase_id)
        {
            return Json(new AstepBusiness().FillGrid_ExperimentResultsEvaluation(usecase_id));
        }
    }   
}
