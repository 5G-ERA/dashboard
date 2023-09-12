using eu_projects_main_platform.Controllers;
using eu_projects_main_platform.Data;
using eu_projects_main_platform.Models.DatabaseHandler;
using eu_projects_main_platform.Models._5ghub;
using eu_projects_main_platform.Models._5ghub.API;
using Microsoft.AspNetCore.Mvc;

namespace eu_projects_main_platform.Business
{
    public class _5ghubBusiness
    {
        public CustomResponseModel RetrieveUseCases(long userid, string username)
        {
            return new _5ghubData().RetrieveUseCases(userid, username);
        }

        public CustomResponseModel RetrieveUseCasesPerProjectId(long projectId)
        {
            return new _5ghubData().RetrieveUseCasesPerProjectId(projectId);
        }

        public CustomResponseModel RetrieveUCGeneralInfo(long usecaseId)
        {
            return new _5ghubData().RetrieveUCGeneralInfo(usecaseId);
        }

        public CustomResponseModel RetrieveScenarioPerUseCase(long usecaseId)
        {
            return new _5ghubData().RetrieveScenarioPerUseCase(usecaseId);
        }

        public CustomResponseModel AddNewScenario(long usecase_id, string usecasedescription, string usecasetrialtype)
        {
            return new _5ghubData().AddNewScenario(usecase_id, usecasedescription, usecasetrialtype);
        }

        public CustomResponseModel EditUseCase(long UseCaseID, string UseCaseCode, string CaseDescription, string Responsible, string Contact, DateTime Date)
        {
            return new _5ghubData().EditUseCase(UseCaseID, UseCaseCode, CaseDescription, Responsible, Contact, Date);
        }

        public CustomResponseModel RetrieveCompositeKPIsPerProject(long projectId)
        {
            return new _5ghubData().RetrieveCompositeKPIsPerProject(projectId);
        }

        public CustomResponseModel RetrieveKPIs(long scenarioId)
        {
            return new _5ghubData().RetrieveKPIs(scenarioId);
        }

        public CustomResponseModel RetrieveUnits()
        {
            return new _5ghubData().RetrieveUnits();
        }

        public CustomResponseModel RetrieveOperators()
        {
            return new _5ghubData().RetrieveOperators();
        }

        public CustomResponseModel AddKPI(long usecaseid, long typeid, string piCode, long subtypeid, string name, string highvalue, long highoperatorid, string lowvalue, long lowoperatorid, long unitid)
        {
            return new _5groutesData().AddKPI(usecaseid, typeid, piCode, subtypeid, name, highvalue, highoperatorid, lowvalue, lowoperatorid, unitid);
        }

        public CustomResponseModel DeleteKPI(long kpiid)
        {
            return new _5ghubData().DeleteKPI(kpiid); ;
        }
        public CustomResponseModel EditKPI(long selectedkpi, long typeid, string piCode, long subtypeid, string name, string highvalue, long highoperatorid, string lowvalue, long lowoperatorid, long unitid)
        {
            return new _5ghubData().EditKPI(selectedkpi, typeid, piCode, subtypeid, name, highvalue, highoperatorid, lowvalue, lowoperatorid, unitid);
        }

        public CustomResponseModel EditScenario(long scenario_id, string usecasedescription)
        {
            return new _5ghubData().EditScenario(scenario_id, usecasedescription);
        }
        public CustomResponseModel DeleteScenario(long scenario_id)
        {
            return new _5ghubData().DeleteScenario(scenario_id);
        }

        public CustomResponseModel MakePreviousUserTokensInvalid(long userId)
        {
            return new _5ghubData().MakePreviousUserTokensInvalid(userId);
        }

        public CustomResponseModel RecordUserApiToken(UserApiToken userToken)
        {
            return new _5ghubData().RecordUserApiToken(userToken);
        }

        public CustomResponseModel SaveTestCaseRecords(string serializedObject)
        {
            return new _5ghubData().SaveTestCaseRecords(serializedObject);
        }

        public CustomResponseModel RetrieveNetApps()
        {
            return new _5ghubData().RetrieveNetApps();
        }

        public CustomResponseModel RetrieveNetAppPerId(long netappId)
        {
            return new _5ghubData().RetrieveNetAppPerId(netappId);
        }

        public CustomResponseModel RecordNetApp(NetAppModel netApp)
        {
            return new _5ghubData().RecordNetApp(netApp);
        }

        public CustomResponseModel RecordNetAppKpiData(long netappId, string executionId, string timestamp, KpiApiObject kpi, string moidObject)
        {
            return new _5ghubData().RecordNetAppKpiData(netappId, executionId, timestamp, kpi, moidObject);
        }

        public CustomResponseModel RecordUseCase(TestModel test)
        {
            return new _5ghubData().RecordUseCase(test);
        }

        public CustomResponseModel RecordTestKpiData(long ucId, string testTestCaseId, string dataTimestamp, KpiApiObject kpi, string moidObject)
        {
            return new _5ghubData().RecordTestKpiData(ucId, testTestCaseId, dataTimestamp, kpi, moidObject);
        }

        public CustomResponseModel RecordScheduledTestKpiData(long ucId, string testTestCaseId, string dataTimestamp, KpiApiObject kpi, string moidObject, bool? isScheduled, DateTime? startDate)
        {
            return new _5ghubData().RecordScheduledTestKpiData(ucId, testTestCaseId, dataTimestamp, kpi, moidObject, isScheduled, startDate);
        }

        public CustomResponseModel RetrieveNetAppExecution(long netappId)
        {
            return new _5ghubData().RetrieveTestKpiData(netappId);
        }

        public CustomResponseModel RetrieveUcTests(long usecaseId)
        {
            return new _5ghubData().RetrieveUcTests(usecaseId);
        }

        public CustomResponseModel RetrieveNetAppKpiValuesPerExecutionId(string executionId)
        {
            return new _5ghubData().RetrieveNetAppKpiValuesPerExecutionId(executionId);
        }

        public CustomResponseModel RetrieveTestKpiValuesPerTestId(string testId)
        {
            return new _5ghubData().RetrieveTestKpiValuesPerTestId(testId);
        }

        public CustomResponseModel RetrieveAvailableExperimentResources()
        {
            return new _5ghubData().RetrieveAvailableExperimentResources();
        }

        public CustomResponseModel UpdateExperimentResourceAvailability(Guid resourceId, bool isInUse)
        {
            return new _5ghubData().UpdateExperimentResourceAvailability(resourceId, isInUse);
        }

        public CustomResponseModel RetrieveAllExperimentResources()
        {
            return new _5ghubData().RetrieveAllExperimentResources();
        }

        public CustomResponseModel InsertUmmResource(UmmResourceDetails res)
        {
            return new _5ghubData().InsertUmmResource(res);
        }

        public CustomResponseModel RetrieveUmmResourcePerOwner(string ownerEmail)
        {
            return new _5ghubData().RetrieveUmmResourcePerOwner(ownerEmail);
        }

        public CustomResponseModel RetrieveAllUmmResourcesPerOwner(string email)
        {
            return new _5ghubData().RetrieveAllUmmResourcesPerOwner(email);
        }

        public CustomResponseModel RetrieveAllTestDataSentByDataCollector()
        {
            return new _5ghubData().RetrieveAllTestDataSentByDataCollector();
        }
    }
}
