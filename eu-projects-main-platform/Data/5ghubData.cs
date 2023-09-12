using eu_projects_main_platform.Controllers;
using eu_projects_main_platform.Models._5ghub;
using eu_projects_main_platform.Models._5ghub.API;
using eu_projects_main_platform.Models._5ghub.UmmResources;
using eu_projects_main_platform.Models.DatabaseHandler;
using eu_projects_main_platform.Models.Enums;
using Microsoft.AspNetCore.Mvc;

namespace eu_projects_main_platform.Data
{
    public class _5ghubData
    {
        private string controller = "5ghub";

        public CustomResponseModel RetrieveUseCases(long userid, string username)
        {
            return new MyDatabaseHandler<UseCases>(controller, "RetrieveUseCases").CallDatabase("RetrieveUseCases", new { userid = userid, username = username }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveUseCasesPerProjectId(long projectId)
        {
            return new MyDatabaseHandler<UseCases>(controller, "SP_RetrieveUseCasesPerProject").CallDatabase(
                "SP_RetrieveUseCasesPerProject", new { projectID = projectId }, ResultType.Multiple,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveUCGeneralInfo(long usecaseId)
        {
            return new MyDatabaseHandler<UseCases>(controller, "RetrieveUCGeneralInfo").CallDatabase("RetrieveUCGeneralInfo", new { UseCase_Id = usecaseId}, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveScenarioPerUseCase(long usecaseId)
        {
            return new MyDatabaseHandler<UseCaseScenario>(controller, "RetrieveScenarioPerUseCase").CallDatabase("RetrieveScenarioPerUseCase", new { UseCase_Id = usecaseId, }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel AddNewScenario(long usecase_id, string usecasedescription, string scenariotrialtype)
        {
            return new MyDatabaseHandler<long>(controller, "AddNewScenario").CallDatabase("AddNewScenario", new { UseCase_Id = usecase_id, ScenarioDescription = usecasedescription, ScenarioTrialType = scenariotrialtype }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel EditUseCase(long UseCaseID, string UseCaseCode, string CaseDescription, string Responsible, string Contact, DateTime Date)
        {
            return new MyDatabaseHandler<long>(controller, "EditUseCase").CallDatabase("EditUseCase", new
            {
                UseCaseID = UseCaseID,
                UseCaseCode = UseCaseCode,
                CaseDescription = CaseDescription,
                Responsible = Responsible,
                Contact = Contact,
                Date = Date,
            }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveCompositeKPIsPerProject(long projectId)
        {
            return new MyDatabaseHandler<CompositeKpiType>(controller, "RetrieveCompositeKPIsPerProject")
                .CallDatabase("Retrieve_5GRoutes_CompositeKpis", new { projectID = projectId }, ResultType.Multiple,
                    ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveKPIs(long scenario_id)
        {
            return new MyDatabaseHandler<KPIs>(controller, "RetrieveKPIs").CallDatabase("RetrieveKPIs", new { scenarioid = scenario_id, }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveUnits()
        {
            return new MyDatabaseHandler<Units>(controller, "RetrieveUnits").CallDatabase("RetrieveUnits", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveOperators()
        {
            return new MyDatabaseHandler<Operators>(controller, "RetrieveOperators").CallDatabase("RetrieveOperators", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }
        public CustomResponseModel AddKPI(long usecaseid, long typeid, string piCode, long subtypeid, string name, string highvalue, long highoperatorid, string lowvalue, long lowoperatorid, long unitid)
        {
            return new MyDatabaseHandler<long>(controller, "AddKPI").CallDatabase("AddKPI", new
            {
                useCaseId = usecaseid,
                typeid = typeid,
                piCode = piCode,
                subtypeid = subtypeid,
                name = name,
                highvalue = highvalue,
                highoperatorid = highoperatorid,
                lowvalue = lowvalue,
                lowoperatorid = lowoperatorid,
                unitid = unitid
            }, ResultType.Single, ExecuteType.StoredProcedure);
        }
        public CustomResponseModel DeleteKPI(long kpiid)
        {
            return new MyDatabaseHandler<long>(controller, "DeleteKPI").CallDatabase("DeleteKPI", new { kpiid = kpiid, }, ResultType.Single, ExecuteType.StoredProcedure);
        }
        public CustomResponseModel EditKPI(long selectedkpi, long typeid, string piCode, long subtypeid, string name, string highvalue, long highoperatorid, string lowvalue, long lowoperatorid, long unitid)
        {
            return new MyDatabaseHandler<long>(controller, "EditKPI").CallDatabase("EditKPI", new
            {
                piid = selectedkpi,
                typeid = typeid,
                picode = piCode,
                subtypeid = subtypeid,
                name = name,
                highvalue = highvalue,
                highoperatorid = highoperatorid,
                lowvalue = lowvalue,
                lowoperatorid = lowoperatorid,
                unitid = unitid
            }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel EditScenario(long scenario_id, string usecasedescription)
        {
            return new MyDatabaseHandler<long>(controller, "EditScenario").CallDatabase("EditScenario", new { ScenarioId = scenario_id, ScenarioDescription = usecasedescription, ScenarioTrialType = string.Empty}, ResultType.Single, ExecuteType.StoredProcedure);
        }
        public CustomResponseModel DeleteScenario(long scenario_id)
        {
            return new MyDatabaseHandler<long>(controller, "DeleteScenario").CallDatabase("DeleteScenario", new { ScenarioId = scenario_id }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel MakePreviousUserTokensInvalid(long userId)
        {
            return new MyDatabaseHandler<long>(controller, "MakePreviousUserTokensInvalid").CallDatabase(
                "MakePreviousUserTokensInvalid", new { userId = userId }, ResultType.Single,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RecordUserApiToken(UserApiToken userToken)
        {
            return new MyDatabaseHandler<UserApiToken>(controller, "RecordUserApiToken").CallDatabase(
                "InsertUserApiToken", new { userId = userToken.UserID, token = userToken.TokenKey, note = userToken.Note, expiryDate = userToken.ExpiryDate }, ResultType.Single,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel SaveTestCaseRecords(string serializedObject)
        {
            return new MyDatabaseHandler<long>(controller, "SaveTestCaseRecords").CallDatabase(
                "Save5ghubTestCaseRecords", new { obj = serializedObject }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveNetApps()
        {
            return new MyDatabaseHandler<NetApp>(controller, "RetrieveNetApps").CallDatabase("Retrieve5gub_NetApps",
                new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveNetAppPerId(long netappId)
        {
            return new MyDatabaseHandler<NetApp>(controller, "RetrieveNetAppPerId").CallDatabase("RetrieveNetAppPerId",
                new { netappId = netappId }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RecordNetApp(NetAppModel netapp)
        {
            return new MyDatabaseHandler<long>(controller, "RecordNetApp").CallDatabase("Record5Ghub_NetApp", new
            {
                uid = netapp.id,
                name = netapp.name
            }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RecordUseCase(TestModel test)
        {
            return new MyDatabaseHandler<long>(controller, "RecordUseCase").CallDatabase("Record5Ghub_UseCase", new
            {
                uc_id = test.use_case
            }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RecordNetAppKpiData(long netappId, string executionId, string timestamp, KpiApiObject kpi, string moidObject)
        {
            return new MyDatabaseHandler<long>(controller, "RecordNetAppKpiData").CallDatabase(
                "Record5Ghub_NetAppKpiData",
                new
                {
                    netapp_id = netappId,
                    execution_id = executionId,
                    timestamp = timestamp,
                    kpi_name = kpi.name,
                    kpi_value = kpi.value,
                    kpi_unit = kpi.unit,
                    moid = moidObject
                }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RecordTestKpiData(long ucId, string testId, string timestamp, KpiApiObject kpi, string moidObject)
        {
            return new MyDatabaseHandler<long>(controller, "RecordTestKpiData").CallDatabase(
                "Record5Ghub_TestKpiData",
                new
                {
                    uc_id = ucId,
                    test_id = testId,
                    timestamp = timestamp,
                    kpi_name = kpi.name,
                    kpi_value = kpi.value,
                    kpi_unit = kpi.unit,
                    moid = moidObject
                }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RecordScheduledTestKpiData(long ucId, string testId, string timestamp, KpiApiObject kpi, string moidObject, bool? isScheduled, DateTime? startDate)
        {
            return new MyDatabaseHandler<long>(controller, "RecordTestKpiData").CallDatabase(
                "Record5Ghub_TestKpiData",
                new
                {
                    uc_id = ucId,
                    test_id = testId,
                    timestamp = timestamp,
                    kpi_name = kpi.name,
                    kpi_value = kpi.value,
                    kpi_unit = kpi.unit,
                    moid = moidObject,
                    is_scheduled = isScheduled,
                    schedule_start = startDate
                }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveTestKpiData(long netappId)
        {
            return new MyDatabaseHandler<string>(controller, "RetrieveTestKpiData").CallDatabase(
                "Retrieve5Ghub_NetAppExecution", new
                {
                    netapp_id = netappId
                }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveUcTests(long usecaseId)
        {
            return new MyDatabaseHandler<ExperimentLookup>(controller, "RetrieveUcTests").CallDatabase(
                "Retrieve5Ghub_TestPerUseCase", new
                {
                    usecaseId = usecaseId
                }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveNetAppKpiValuesPerExecutionId(string executionId)
        {
            return new MyDatabaseHandler<NetAppKpiValue>(controller, "RetrieveNetAppKpiValuesPerExecutionId").CallDatabase(
                "Retrieve5Ghub_KpiValuesPerNetAppExecution", new
                {
                    execution_id = executionId
                }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveTestKpiValuesPerTestId(string testId)
        {
            return new MyDatabaseHandler<TestKpiValue>(controller, "RetrieveTestKpiValuesPerTestId").CallDatabase(
                "Retrieve5Ghub_KpiValuesPerTest", new
                {
                    test_id = testId
                }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveAvailableExperimentResources()
        {
            return new MyDatabaseHandler<ExperimentResource>(controller, "RetrieveAvailableExperimentResources")
                .CallDatabase("Retrieve5ghubAvailableExperimentResources", new { }, ResultType.Multiple,
                    ExecuteType.StoredProcedure);
        }

        public CustomResponseModel UpdateExperimentResourceAvailability(Guid resourceId, bool isInUse)
        {
            return new MyDatabaseHandler<int>(controller, "UpdateExperimentResourceAvailability")
                .CallDatabase("Update5GhubExperimentResourceAvailability", new { resId = resourceId, state = isInUse },
                    ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveAllExperimentResources()
        {
            return new MyDatabaseHandler<ExperimentResource>(controller, "RetrieveAllExperimentResources").CallDatabase(
                "Retrieve5ghubAllExperimentResources", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel InsertUmmResource(UmmResourceDetails res)
        {
            return new MyDatabaseHandler<long>(controller, "InsertUmmResource").CallDatabase("Insert5Ghub_UmmResource", new
                {
                    resId = res.id,
                    resName = res.name,
                    resOwner = res.owner
                },
                ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveUmmResourcePerOwner(string ownerEmail)
        {
            return new MyDatabaseHandler<UmmApplicationResource>(controller, "RetrieveUmmResourcePerOwner").CallDatabase(
                "Retrieve5Ghub_UmmResourcesPerOwner", new { owner = ownerEmail }, ResultType.Multiple,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveAllUmmResourcesPerOwner(string email)
        {
            return new MyDatabaseHandler<UmmApplicationResource>(controller, "RetrieveAllUmmResourcesPerOwner")
                .CallDatabase("RetrieveGhub_AllResourcesPerOwner", new { resOwner = email }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveAllTestDataSentByDataCollector()
        {
            return new MyDatabaseHandler<DataCollectorRecord>(controller, "RetrieveAllTestDataSentByDataCollector").CallDatabase(
                "RetrieveAllTestDataSentByDataCollector", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }
    }
}
