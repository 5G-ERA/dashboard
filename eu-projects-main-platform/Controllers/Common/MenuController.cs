using eu_projects_main_platform.Business;
using eu_projects_main_platform.Models.Common;
using Microsoft.AspNetCore.Mvc;

namespace eu_projects_main_platform.Controllers.Common
{
    public class MenuController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult RetrieveProjectMenu(long userId)
        {
            return Json(new EuProjectMenuBusiness().RetrieveProjectMenus(userId));
        }

        public IActionResult RetrieveProjects()
        {
            return Json(new EuProjectMenuBusiness().RetrieveProjects());
        }

        public IActionResult RetrieveTableDataSources()
        {
            return Json(new EuProjectMenuBusiness().RetrieveTableDataSources());
        }

        public IActionResult RetrieveColumnTableDataSources(long tableId)
        {
            return Json(new EuProjectMenuBusiness().RetrieveColumnTableDataSources(tableId));
        }

    }
}
