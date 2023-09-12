using eu_projects_main_platform.Business;
using eu_projects_main_platform.Models.Common;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eu_projects_main_platform.Controllers.Common
{
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            return PartialView();
        }

        public IActionResult InsertDashboard(string dashboard)
        {
            var formattedDashboard =
                JsonConvert.DeserializeObject<EuProjectDashboardJObject>(dashboard);

            var d = new Dashboard
            {
                DashboardName = formattedDashboard.dashboard_name,
                ProjectId = formattedDashboard.project_id,
                ParentMenuId = formattedDashboard.parent_menu_id,
                DashboardObjectConfig = JsonConvert.SerializeObject(formattedDashboard),
                Menu = new ProjectMenu
                {
                    IsMenuActive = true,
                    MenuClickEvent = "",
                    MenuName = formattedDashboard.menu_name,
                    MenuCode = "dashboard_"+formattedDashboard.menu_name.Replace(' ', '_'),
                    MenuOrder = int.Parse(formattedDashboard.menu_order),
                    MenuIcon = (formattedDashboard.dashboard_type.ToLower().Equals("table")) ? "fa-solid fa-table" : "fa-solid fa-chart-pie"
                }
            };

            return Json(new EuProjectMenuBusiness().InsertDashboard(d));
        }

        public IActionResult RetrieveMenuPerProject(long projectId)
        {
            return Json(new EuProjectMenuBusiness().RetrieveMenuPerProject(projectId));
        }

        public IActionResult RetrieveDashboards()
        {
            return Json(new EuProjectMenuBusiness().RetrieveDashboards());
        }
    }
}
