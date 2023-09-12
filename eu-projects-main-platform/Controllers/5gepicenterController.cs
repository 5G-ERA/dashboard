using eu_projects_main_platform.Business;
using Microsoft.AspNetCore.Mvc;

namespace eu_projects_main_platform.Controllers
{
    public class _5gepicenterController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Retrieve5GE5QiValues()
        {
            return Json(new _5gepicenterBusiness().Retrieve5GE5QiValues().Result);
        }

        public IActionResult Retrieve5GE5QiValuesrequest()
        {
            return Json(new _5gepicenterBusiness().Retrieve5GE5QiValuesrequest().Result);
        }

        public IActionResult Insert5GE5QiValuesrequest(string exe_id, string qival, string rtyp, string dprio, string pdely, string perro, string dmax, string dave, string eserv, string rdate)
        {
            return Json(new _5gepicenterBusiness().Insert5GE5QiValuesrequest(exe_id, qival, rtyp, dprio, pdely, perro, dmax, dave, eserv, rdate));
        }
    }
}
