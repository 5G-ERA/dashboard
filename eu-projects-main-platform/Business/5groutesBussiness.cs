using eu_projects_main_platform.Data;
using eu_projects_main_platform.Models._5groutes;
using eu_projects_main_platform.Models.DatabaseHandler;
using eu_projects_main_platform.Models.Planet.Constant;
using eu_projects_main_platform.Models.Planet.UserSettings.DTO;
using eu_projects_main_platform.Models.Planet.UserSettings;
using MongoDB.Driver;
using eu_projects_main_platform.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.CodeModifier.CodeChange;

namespace eu_projects_main_platform.Business
{
    public class _5groutesBussiness
    {
        public CustomResponseModel RetrieveDomainName()
        {
            return new _5groutesData().RetrieveDomainName();
        }
        
        public CustomResponseModel RetrieveDomainCoordinates(int id)
        {
            return new _5groutesData().RetrieveDomainCoordinates(id);
        }
        public CustomResponseModel RetrieveDomain(int id)
        {
            return new _5groutesData().RetrieveDomain(id);
        }
        public CustomResponseModel RetrieveUseCases(long userid, string username)
        {
            return new _5groutesData().RetrieveUseCases(userid, username);
        }

        public CustomResponseModel RetrieveSingleExperimentResultsEvaluation(long id)
        {
            return new _5groutesData().RetrieveSingleExperimentResultsEvaluation(id);
        }

        public CustomResponseModel RetrieveExperimentResultsEvaluationPerTestID(long testId)
        {
            return new _5groutesData().RetrieveExperimentResultsEvaluationPerTestID(testId);
        }

        public CustomResponseModel RetrieveUCGeneralInfo(long usecase_id)
        {
            return new _5groutesData().RetrieveUCGeneralInfo(usecase_id);
        }

        public CustomResponseModel RetrieveScenarioPerUseCase(long usecase_id)
        {
            return new _5groutesData().RetrieveScenarioPerUseCase(usecase_id);
        }

        public CustomResponseModel RetrieveKPIs(long scenario_id)
        {
            return new _5groutesData().RetrieveKPIs(scenario_id);
        }

        public CustomResponseModel RetrieveUnits()
        {
            return new _5groutesData().RetrieveUnits();
        }

        public CustomResponseModel RetrieveKPI(long kpiid)
        {
            return new _5groutesData().RetrieveKPI(kpiid);
        }
        public CustomResponseModel AddKPI(long usecaseid, long typeid, string piCode, long subtypeid, string name, string highvalue, long highoperatorid, string lowvalue, long lowoperatorid, long unitid)
        {
            return new _5groutesData().AddKPI(usecaseid, typeid, piCode ,subtypeid, name, highvalue, highoperatorid, lowvalue, lowoperatorid, unitid);
        }

        public CustomResponseModel DeleteKPI(long kpiid)
        {
            return new _5groutesData().DeleteKPI(kpiid); ;
        }
        public CustomResponseModel EditKPI(long selectedkpi, long typeid, string piCode, long subtypeid, string name, string highvalue, long highoperatorid, string lowvalue, long lowoperatorid, long unitid)
        {
            return new _5groutesData().EditKPI(selectedkpi, typeid, piCode, subtypeid, name, highvalue, highoperatorid, lowvalue, lowoperatorid, unitid);
        }
        public CustomResponseModel EditUseCase(long UseCaseID, string UseCaseCode, string CaseDescription, string Responsible, string Contact, DateTime Date)
        {
            return new _5groutesData().EditUseCase(UseCaseID, UseCaseCode, CaseDescription, Responsible, Contact, Date);
        }

        public CustomResponseModel DuplicateScenario(long scenarioid)
        {
            return new _5groutesData().DuplicateScenario(scenarioid);
        }
        public CustomResponseModel ScenarioOverWrite(long scenario_id_from, long scenario_id_to)
        {
            return new _5groutesData().ScenarioOverWrite(scenario_id_from, scenario_id_to);
        }

        public CustomResponseModel RetrieveLeaderName(string username)
        {
            return new _5groutesData().RetrieveLeaderName(username);
        }

        public CustomResponseModel RetrieveOperators()
        {
            return new _5groutesData().RetrieveOperators();
        }

        public CustomResponseModel AddNewScenario(long usecase_id, string usecasedescription, string usecasetrialtype)
        {
            return new _5groutesData().AddNewScenario(usecase_id, usecasedescription, usecasetrialtype);
        }

        public CustomResponseModel EditScenario(long scenario_id, string usecasedescription, string usecasetrialtype)
        {
            return new _5groutesData().EditScenario(scenario_id, usecasedescription, usecasetrialtype);
        }

        public CustomResponseModel DeleteScenario(long scenario_id)
        {
            return new _5groutesData().DeleteScenario(scenario_id);
        }

        public CustomResponseModel DeleteExperimentResults(long ExperimentResultsEvaluationId)
        {
            return new _5groutesData().DeleteExperimentResults(ExperimentResultsEvaluationId);
        }

        public CustomResponseModel AddExperimentResults(string ExperimentResultsName, string excelfile, long testId, string datastring, Guid fileUID)
        {
            return new _5groutesData().AddExperimentResults(ExperimentResultsName, excelfile, testId, datastring, fileUID);
        }

        public CustomResponseModel RetrieveCompositeKPIsPerProject(long projectId)
        {
            return new _5groutesData().RetrieveCompositeKPIsPerProject(projectId);
        }

        public CustomResponseModel? RetrieveKPIThresholdPerUseCase(long useCaseId)
        {
            return new _5groutesData().RetrieveKPIThresholdPerUseCase(useCaseId);
        }

        public CustomResponseModel RetrieveScenarioPerId(long scenarioId)
        {
            return new _5groutesData().RetrieveScenarioPerId(scenarioId);
        }

        public CustomResponseModel RetrieveTestScenarioMeasurementPerUseCase(long usecase_id)
        {
            return new _5groutesData().RetrieveTestScenarioMeasurementPerUseCase(usecase_id);
        }

        public CustomResponseModel RetrieveKPITypes()
        {
            return new _5groutesData().RetrieveKPITypes();
        }

        public CustomResponseModel RetrieveTestScenariosPerScenario(long scenarioId)
        {
            return new _5groutesData().RetrieveTestScenariosPerScenario(scenarioId);
        }

        public CustomResponseModel AddTestScenario(long scenarioId, string testName, string randomTestColor)
        {
            return new _5groutesData().AddTestScenario(scenarioId, testName, randomTestColor);
        }

        public CustomResponseModel RetrieveTestScenarioMeasurementPerId(long measurementId)
        {
            return new _5groutesData().RetrieveTestScenarioMeasurementPerId(measurementId);
        }

        public CustomResponseModel AddTestScenarioMeasureValue(ScenarioMeasurementValue measurementValueObj)
        {
            return new _5groutesData().AddTestScenarioMeasureValue(measurementValueObj);
        }

        public CustomResponseModel RetrieveLastestTestScenarioMeasureValue(long testScenarioId, long measure_id)
        {
            return new _5groutesData().RetrieveLastestTestScenarioMeasureValue(testScenarioId ,measure_id);
        }

        public CustomResponseModel RetrieveMeasurementValuesPerKpi(long kpiSubTypeId)
        {
            return new _5groutesData().RetrieveMeasurementValuesPerKpi(kpiSubTypeId);
        }

        public CustomResponseModel RetrieveMeasurementValuesPerTestAndKpiType(long testId, long kpiSubtypeId)
        {
            return new _5groutesData().RetrieveMeasurementValuesPerTestAndKpiType(testId, kpiSubtypeId);
        }

        public CustomResponseModel DeleteTestScenario(long testScenarioId)
        {
            return new _5groutesData().DeleteTestScenario(testScenarioId);
        }

        public CustomResponseModel RetrieveTestScenarioPerId(long testScenarioid)
        {
            return new _5groutesData().RetrieveTestScenarioPerId(testScenarioid);
        }

        public CustomResponseModel EditTestScenario(long testId, string? testName, string? testDescription)
        {
            return new _5groutesData().EditTestScenario(testId, testName, testDescription);
        }

        public CustomResponseModel AddTestAttachment(TestAttachmentFile uploadedFile)
        {
            return new _5groutesData().AddTestAttachment(uploadedFile);
        }

        public CustomResponseModel RetrieveTestAttachmentFilesPerTest(long testId)
        {
            return new _5groutesData().RetrieveTestAttachmentFilesPerTest(testId);
        }

        public CustomResponseModel RetrieveAllTestMeasurementValuesPerTest(long testScenarioId)
        {
            return new _5groutesData().RetrieveAllTestMeasurementValuesPerTest(testScenarioId);
        }

        public CustomResponseModel RetrieveMeasurementValuesPerScenarioAndKpiSubtypeId(long scenarioId, long subtypeKpiId)
        {
            return new _5groutesData().RetrieveMeasurementValuesPerScenarioAndKpiSubtypeId(scenarioId, subtypeKpiId);
        }

        public CustomResponseModel RetrieveTestDetailsPerId(long testId)
        {
            return new _5groutesData().RetrieveTestDetailsPerId(testId);
        }

        public CustomResponseModel RetrieveTestAttachementPerFileId(Guid fileUid)
        {
            return new _5groutesData().RetrieveTestAttachementPerFileId(fileUid);
        }

        public CustomResponseModel DeleteTestAttachmentPerFileId(Guid fileUid)
        {
            return new _5groutesData().DeleteTestAttachmentPerFileId(fileUid);
        }

        public CustomResponseModel RecordUserApiToken(UserApiToken userToken)
        {
            return new _5groutesData().RecordUserApiToken(userToken);
        }

        public CustomResponseModel RetrieveUserApiTokens(long userId)
        {
            return new _5groutesData().RetrieveUserApiTokens(userId);
        }

        public CustomResponseModel DeleteUserApiToken(long tokenId)
        {
            return new _5groutesData().DeleteUserApiToken(tokenId);
        }

        public CustomResponseModel MakePreviousUserTokensInvalid(long userId)
        {
            return new _5groutesData().MakePreviousUserTokensInvalid(userId);
        }

        public CustomResponseModel RetrieveUseCaseCategories()
        {
            return new _5groutesData().RetrieveUseCaseCategories();
        }

        public CustomResponseModel InsertUseCase(string code, string description, long categoryId, long leaderId, string? responsible, string? contact)
        {
            return new _5groutesData().InsertUseCase(code, description, categoryId, leaderId, responsible, contact);
        }

        public CustomResponseModel EditUseCaseNew(long id, string code, string description, long categoryId, long leaderId, string? responsible, string? contact)
        {
            return new _5groutesData().EditUseCaseNew(id, code, description, categoryId, leaderId, responsible, contact);
        }

        public CustomResponseModel DeleteUseCase(long id)
        {
            return new _5groutesData().DeleteUseCase(id);
        }

        public CustomResponseModel Retrieve5GRoutesLeaders()
        {
            return new _5groutesData().Retrieve5GRoutesLeaders();
        }

        public CustomResponseModel RetrievePIsCodes(long useCaseId, long? piToExcludeId)
        {
            return new _5groutesData().RetrievePIsCodes(useCaseId, piToExcludeId);
        }

        public CustomResponseModel StopTestScenario(long testId)
        {
            return new _5groutesData().StopTestScenario(testId);
        }

        public CustomResponseModel FindTestPerTestKey(string testKey)
        {
            return new _5groutesData().FindTestPerTestKey(testKey);
        }

        public CustomResponseModel RetrieveUseCaseCodes(long? useCaseId)
        {
            return new _5groutesData().RetrieveUseCaseCodes(useCaseId);
        }

        public CustomResponseModel RetrieveAllArtefactTypes()
        {
            return new _5groutesData().RetrieveAllArtefactTypes();
        }
        public CustomResponseModel SaveArtefact(string leader, Artefact fileInfos)
        {
            return new _5groutesData().SaveArtefact(leader, fileInfos);
        }
        //public async Task<CustomResponseModel> SaveArtefact(string leader, Artefact fileInfos, string username)
        //{
        //    SaveArtefact(leader, fileInfos);
        //    return await new _5groutesData().PostCamRepoArtFactFile(leader, fileInfos, username);
        //}

        public CustomResponseModel Retrieve5GroutesArtefacts(string leaderName)
        {
            return new _5groutesData().Retrieve5GroutesArtefacts(leaderName);
        }

        public CustomResponseModel DeleteUcNetworkArtefact(long networkArtefactId)
        {
            return new _5groutesData().DeleteUcNetworkArtefact(networkArtefactId);
        }
        public async Task<userSettings> UpdateUserTableSettings(string id, tableSettingUpdate updatedSetting)
        {
            var database = getMongoClient(mongoConst.DataBases.DASHBOARD);
            var collection = database.GetCollection<userSettings>(mongoConst.Collections.DashboardCollections.SETTINGS);
            var filter = Builders<userSettings>.Filter.Eq("userId", id);


            var oldSettings = await getUserSetting(id);

            //upset --> if it exists over write it/ if not create it
            var page = oldSettings.pages.FirstOrDefault(x => x.Name == updatedSetting.pageName);
            if (page == null)
            {
                page = new pageSettings
                {
                    Name = updatedSetting.pageName,
                    tables = new List<tableColViews> { updatedSetting.tables }
                };
                //oldSettings.pages.Add(page);

                //var update = Builders<userSettings>.Update.Set(x => x.pages.Single(p => p.Name == updatedSetting.pageName), page);
                //var result = collection.UpdateOneAsync(filter, update).Result;

                var update = Builders<userSettings>.Update
                        .Push<pageSettings>(e => e.pages, page);
                await collection.FindOneAndUpdateAsync(filter, update);
            }
            else
            {
                if (page.tables.Any(x => x.tableId == updatedSetting.tables.tableId))
                {
                    //page.tables.FirstOrDefault(x => x.tableId == updatedSetting.tables.tableId).tableId = updatedSetting.tables.tableId;
                    page.tables.FirstOrDefault(x => x.tableId == updatedSetting.tables.tableId).hiddenColumns = updatedSetting.tables.hiddenColumns;
                }
                else
                {
                    //doesn't exit --> append it
                    page.tables.Add(updatedSetting.tables);
                }

                // exist --> update it
                filter = Builders<userSettings>.Filter.Where(x => x.userId == id && x.pages.Any(i => i.Name == updatedSetting.pageName));
                var update = Builders<userSettings>.Update.Set(x => x.pages[-1].tables, page.tables);
                var result = await collection.UpdateOneAsync(filter, update);
            }

            return await getUserSetting(id);
        }
        public async Task<userSettings> getUserSetting(string id)
        {
            var database = getMongoClient(mongoConst.DataBases.DASHBOARD);
            var collection = database.GetCollection<userSettings>(mongoConst.Collections.DashboardCollections.SETTINGS);
            var filter = Builders<userSettings>.Filter.Eq("userId", id);
            var settings = await ((await collection.FindAsync(filter)).FirstOrDefaultAsync());
            if (settings == null)
            {
                var newSettings = new userSettings
                {
                    userId = id,
                };
                await collection.InsertOneAsync(newSettings);
                return newSettings;
            }
            else
            {
                return settings;
            }
        }
        private IMongoDatabase getMongoClient(string database)
        {
            var client = new MongoClient(AppSettings.planetDbConnectionString);
            var _database = client.GetDatabase(database);
            return _database;
        }
       
    }
}
