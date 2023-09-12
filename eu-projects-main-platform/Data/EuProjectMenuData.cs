using eu_projects_main_platform.Models.Common;
using eu_projects_main_platform.Models.DatabaseHandler;
using eu_projects_main_platform.Models.Enums;
using Microsoft.AspNetCore.Mvc;

namespace eu_projects_main_platform.Data
{
    public class EuProjectMenuData
    {
        private string controller = "Menu";
        public CustomResponseModel RetrieveProjectMenus(long userId)
        {
            return new MyDatabaseHandler<ProjectMenu>(controller, "RetrieveProjectMenus").CallDatabase(
                "GetMenuByUserId", new { userId = userId }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveProjects()
        {
            return new MyDatabaseHandler<Project>(controller, "RetrieveProjects").CallDatabase(
                "RetrieveProjects", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveTableDataSources()
        {
            return new MyDatabaseHandler<TableDataSource>(controller, "RetrieveTableDataSources").CallDatabase(
                "RetrieveAllTables", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveColumnTableDataSources(long tableId)
        {
            return new MyDatabaseHandler<ColumnTableDataSource>(controller, "RetrieveColumnTableDataSources")
                .CallDatabase("RetrieveTableColumnDataSource", new { tableId = tableId }, ResultType.Multiple,
                    ExecuteType.StoredProcedure);
        }

        public CustomResponseModel InsertDashboard(Dashboard dashboard)
        {
            return new MyDatabaseHandler<Dashboard>(controller, "InsertDashboard").CallDatabase("InsertDashboard", new
            {
                name = dashboard.DashboardName,
                projectId = dashboard.ProjectId,
                parent_menuId = dashboard.ParentMenuId,
                menuName = dashboard.Menu.MenuName,
                menuCode = dashboard.Menu.MenuCode,
                menuIcon = dashboard.Menu.MenuIcon,
                menuOrder = dashboard.Menu.MenuOrder,
                dashboardObject = dashboard.DashboardObjectConfig
            }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveMenuPerProject(long projectId)
        {
            return new MyDatabaseHandler<LookupMenu>(controller, "RetrieveMenuPerProject").CallDatabase(
                "RetrieveMenusPerProject", new { projectId = projectId }, ResultType.Multiple,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveDashboards()
        {
            return new MyDatabaseHandler<Dashboard>(controller, "RetrieveMenuPerProject").CallDatabase(
                "RetrieveDashboards", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }
    }
}
