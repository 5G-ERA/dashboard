using eu_projects_main_platform.Data;
using eu_projects_main_platform.Models.DatabaseHandler;
using MongoDB.Driver;
using eu_projects_main_platform.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.CodeModifier.CodeChange;
using eu_projects_main_platform.Models._5gepicentre;

namespace eu_projects_main_platform.Business
{
    public class _5gepicenterBusiness
    {

        public CustomResponseModel Retrieve5GE5QiValues()
        {
            return new _5gepicenterData().Retrieve5GE5QiValues();
        }

        public CustomResponseModel Retrieve5GE5QiValuesrequest()
        {
            return new _5gepicenterData().Retrieve5GE5QiValuesrequest();
        }

        public CustomResponseModel Insert5GE5QiValuesrequest(string exe_id, string qival, string rtyp, string dprio, string pdely, string perro, string dmax, string dave, string eserv, string rdate)
        {
            return new _5gepicenterData().Insert5GE5QiValuesrequest(exe_id,qival,rtyp,dprio,pdely,perro,dmax,dave,eserv, rdate);
        }

    }
}
