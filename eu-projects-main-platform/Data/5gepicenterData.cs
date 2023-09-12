using eu_projects_main_platform.Controllers;
using eu_projects_main_platform.Models._5gepicentre;
using eu_projects_main_platform.Models._5ghub;
using eu_projects_main_platform.Models._5ghub.API;
using eu_projects_main_platform.Models._5ghub.UmmResources;
using eu_projects_main_platform.Models.DatabaseHandler;
using eu_projects_main_platform.Models.Enums;
using Microsoft.AspNetCore.Mvc;

namespace eu_projects_main_platform.Data
{
    public class _5gepicenterData
    {
        private string controller = "5gepicenter";
        public CustomResponseModel Retrieve5GE5QiValues()
        {
            return new MyDatabaseHandler<Ge5qivalues>(controller, "Retrieve5GE5QiValues").CallDatabase("SP_Retrieve5GE5QiValues", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel Retrieve5GE5QiValuesrequest()
        {
            return new MyDatabaseHandler<Ge5qivaluesrequest>(controller, "Retrieve5GE5QiValuesrequest").CallDatabase("SP_Retrieve5GE5QiValuesrequest", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel Insert5GE5QiValuesrequest(string exe_id, string qival, string rtyp, string dprio, string pdely, string perro, string dmax, string dave, string eserv, string rdate)
        {
            return new MyDatabaseHandler<long>(controller, "Insert5GE5QiValuesrequest").CallDatabase("SP_Insert5GE5QiValuesrequest", new {
                Experimental_id = exe_id,
                QiValue = qival,
                ResourceType = rtyp,
                DefaultPriority = dprio,
                PacketDelay = pdely,
                PacketError = perro,
                DefaultMaximum = dmax,
                DefaultAverage = dave,
                ExampleServices = eserv,
                RequestDate = rdate
            }, ResultType.Single, ExecuteType.StoredProcedure);
        }

    }
}
