using eu_projects_main_platform.Data;
using eu_projects_main_platform.Models.Common;
using eu_projects_main_platform.Models.DatabaseHandler;

namespace eu_projects_main_platform.Business
{
    public class EuProjectMenuBusiness
    {
        public CustomResponseModel RetrieveProjectMenus(long userId)
        {
            return new EuProjectMenuData().RetrieveProjectMenus(userId);
        }

        public CustomResponseModel RetrieveProjects()
        {
            return new EuProjectMenuData().RetrieveProjects();
        }

        public CustomResponseModel RetrieveTableDataSources()
        {
            return new EuProjectMenuData().RetrieveTableDataSources();
        }

        public CustomResponseModel RetrieveColumnTableDataSources(long tableId)
        {
            return new EuProjectMenuData().RetrieveColumnTableDataSources(tableId);
        }

        public CustomResponseModel InsertDashboard(Dashboard dashboard)
        {
            return new EuProjectMenuData().InsertDashboard(dashboard);
        }

        public CustomResponseModel RetrieveMenuPerProject(long projectId)
        {
            return new EuProjectMenuData().RetrieveMenuPerProject(projectId);
        }

        public CustomResponseModel RetrieveDashboards()
        {
            return new EuProjectMenuData().RetrieveDashboards();
        }
    }
}
