using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using eu_projects_main_platform.Business;
using eu_projects_main_platform.Models._5ghub;
using eu_projects_main_platform.Models._5ghub.API;
using eu_projects_main_platform.Models._5ghub.Managers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Bogus;
using eu_projects_main_platform.Models._5ghub.UmmResources;

namespace eu_projects_main_platform.Controllers
{
    public class _5ghub : Controller
    {
        private readonly IConfiguration _configuration;

        public _5ghub(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        #region Views
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult RetrieveHomeView()
        {
            return PartialView("Home");
        }

        public IActionResult RetrieveMessages()
        {
            return PartialView("Messages");
        }
        #endregion

        #region NetApps
        public IActionResult RetrieveNetApps()
        {
            return Json(new _5ghubBusiness().RetrieveNetApps());
        }

        public IActionResult RetrieveNetAppPerId(long netappId)
        {
            return Json(new _5ghubBusiness().RetrieveNetAppPerId(netappId));
        }

        public IActionResult RetrieveNetAppExecution(long netappId)
        {
            return Json(new _5ghubBusiness().RetrieveNetAppExecution(netappId));
        }

        public IActionResult RetrieveUcTests(long usecaseId)
        {
            return Json(new _5ghubBusiness().RetrieveUcTests(usecaseId));
        }

        public IActionResult RetrieveNetAppKpiValuesPerExecutionId(string execution_id)
        {
            var allKpiValues = JsonConvert.DeserializeObject<IEnumerable<NetAppKpiValue>>(new _5ghubBusiness().RetrieveNetAppKpiValuesPerExecutionId(execution_id).Result);

            var groupedKpiValuesPerKpi = allKpiValues.GroupBy(v => v.KpiName).Select(g => new
            {
                kpi = g.Key,
                unit = g.Select(v => v.KpiUnit).First(),
                values = GetGraphValues(g.Key, allKpiValues)
            });
            return Json(groupedKpiValuesPerKpi);
        }

        public IActionResult RetrieveTestKpiValuesPerTestId(string test_id)
        {
            var allKpiValues =
                JsonConvert.DeserializeObject<IEnumerable<TestKpiValue>>(new _5ghubBusiness()
                    .RetrieveTestKpiValuesPerTestId(test_id).Result);

            var groupedKpiValuesPerKpi = allKpiValues.GroupBy(v => v.KpiName).Select(g => new
            {
                kpi = g.Key,
                unit = g.Select(v => v.KpiUnit).First(),
                values = GetGraphValues(g.Key, allKpiValues)
            });
            return Json(groupedKpiValuesPerKpi);
        }

        private IEnumerable<Object> GetGraphValues(string kpiname, IEnumerable<TestKpiValue> allKpiValues)
        {
            var graphValues = new List<KpiGraphInfos>();
            foreach (var kpiValue in allKpiValues.Where(k => k.KpiName.ToLower().Equals(kpiname.ToLower())))
            {
                //var moids = JsonConvert.DeserializeObject<IEnumerable<Moid>>(kpiValue.MoidObject);
                string name = "";

                if (kpiValue.MoidObject is not null)
                {
                    var moids = JsonConvert.DeserializeObject<IEnumerable<Moid>>(kpiValue.MoidObject);

                    foreach (var moid in moids)
                    {
                        if (name.Length >= 1)
                        {
                            name += "; ";
                        }

                        name += moid.name + ": " + moid.value;
                    }
                    
                }

                if (name.Length == 0)
                {
                    name = "N/A";
                }

                graphValues.Add(new KpiGraphInfos(DateTime.Parse(kpiValue.TimeStamp), kpiValue.KpiValue, name));
            }

            var groupedGraphValues = graphValues.GroupBy(e => e.graphName).Select(g => new
            {
                graphName = g.Key,
                values = graphValues.Where(elt => elt.graphName.ToLower().Equals(g.Key.ToLower()))
            });

            return groupedGraphValues;
        }

        private IEnumerable<Object> GetGraphValues(string kpiname, IEnumerable<NetAppKpiValue> allKpiValues)
        {
            var graphValues = new List<KpiGraphInfos>();
            foreach (var kpiValue in allKpiValues.Where(k => k.KpiName.ToLower().Equals(kpiname.ToLower())))
            {
                string name = "";

                if (kpiValue.MoidObject is not null)
                {
                    var moids = JsonConvert.DeserializeObject<IEnumerable<Moid>>(kpiValue.MoidObject);

                    foreach (var moid in moids)
                    {
                        if (name.Length >= 1)
                        {
                            name += "; ";
                        }

                        name += moid.name + ": " + moid.value;
                    }
                    
                }

                if (name.Length == 0)
                {
                    name = "N/A";
                }

                graphValues.Add(new KpiGraphInfos(DateTime.Parse(kpiValue.TimeStamp), kpiValue.KpiValue, name));
            }

            var groupedGraphValues = graphValues.GroupBy(e => e.graphName).Select(g => new
            {
                graphName = g.Key,
                values = graphValues.Where(elt => elt.graphName.ToLower().Equals(g.Key.ToLower()))
            });

            return groupedGraphValues;
        }
        

        #endregion

        #region UseCases

        public IActionResult EditUseCase(long UseCaseID, string UseCaseCode, string CaseDescription, string Responsible, string Contact,
            DateTime Date)
        {
            return Json(new _5ghubBusiness().EditUseCase(UseCaseID, UseCaseCode, CaseDescription, Responsible, Contact, Date));
        }

        public IActionResult RetrieveUseCasesPerProject(long projectId)
        {
            return Json(new _5ghubBusiness().RetrieveUseCasesPerProjectId(projectId));
        }

        public IActionResult RetrieveUCGeneralInfo(long usecase_id)
        {
            return Json(new _5ghubBusiness().RetrieveUCGeneralInfo(usecase_id));
        }

        #endregion

        #region Composite KPIs
        public IActionResult RetrieveCompositeKPIsPerProject(long projectId)
        {
            var resultString = new _5ghubBusiness().RetrieveCompositeKPIsPerProject(projectId).Result;
            var compositeKpis = JsonConvert.DeserializeObject<IEnumerable<CompositeKpiType>>(resultString);

            var groupedKpis = compositeKpis.GroupBy(k => k.KpiTypeId).Select(k => new
            {
                KpiCode = k.Select(k => k.KpiTypeCode).First(),
                SubTypes = k
            });

            return Json(groupedKpis);
        }

        public IActionResult RetrieveKPIs(long scenario_id)
        {
            return Json(new _5ghubBusiness().RetrieveKPIs(scenario_id));

        }
        public IActionResult RetrieveUnits()
        {
            return Json(new _5ghubBusiness().RetrieveUnits());
        }
        public IActionResult RetrieveOperators()
        {
            return Json(new _5ghubBusiness().RetrieveOperators());
        }

        public IActionResult AddKPI(long usecaseid, long typeid, string picode, long subtypeid, string name,
            string highvalue, long highoperatorid, string lowvalue, long lowoperatorid, long unitid)
        {
            return Json(new _5ghubBusiness().AddKPI(usecaseid, typeid, null, subtypeid, name, highvalue,
                highoperatorid, lowvalue, lowoperatorid, unitid));
        }

        public IActionResult DeleteKPI(long kpiid)
        {
            return Json(new _5ghubBusiness().DeleteKPI(kpiid));
        }

        public IActionResult EditKPI(long selectedkpi, long typeid, string picode, long subtypeid, string name,
            string highvalue, long highoperatorid, string lowvalue, long lowoperatorid, long unitid)
        {
            return Json(new _5ghubBusiness().EditKPI(selectedkpi, typeid, picode, subtypeid, name, highvalue,
                highoperatorid, lowvalue, lowoperatorid, unitid));
        }
        #endregion

        #region Scenarios
        public IActionResult RetrieveScenarioPerUseCase(long usecase_id)
        {
            return Json(new _5ghubBusiness().RetrieveScenarioPerUseCase(usecase_id));
        }

        public IActionResult AddNewScenario(long usecase_id, string usecasedescription)
        {
            return Json(new _5ghubBusiness().AddNewScenario(usecase_id, usecasedescription, null));
        }

        public IActionResult EditScenario(long scenario_id, string usecasedescription)
        {
            return Json(new _5ghubBusiness().EditScenario(scenario_id, usecasedescription));
        }

        public IActionResult DeleteScenario(long scenario_id)
        {
            return Json(new _5ghubBusiness().DeleteScenario(scenario_id));
        }
        #endregion

        #region API
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GenerateToken([FromHeader] string username, [FromHeader] string password)
        {
            var _user = new AuthenticationBusiness().LoginAuthentication(username, password);
            if (_user == null)
                return BadRequest(
                    "Something went wrong during the authentication process. Please contact with administrator");
            else if (!String.IsNullOrEmpty(_user.authentication_error))
                return BadRequest(_user.authentication_error);
            else
            {
                try
                {
                    this.MakePreviousUserTokensInvalid(_user.userId);

                    var newTokenObj = this.GenerateUserApiToken(_user.userId, null);
                    var resp = new
                    {
                        Token = newTokenObj.TokenKey,
                        Expirationdate_utc = newTokenObj.RemainingTime
                    };
                    return Ok(resp);
                }
                catch (Exception e)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
                }
            }
        }

        //Data collector
        [HttpPost]
        [Route("[controller]/data-collector/kpis")]
        [Authorize]
        public IActionResult PushKpis([FromBody] Object obj)
        {
            var kpiModel = JsonConvert.DeserializeObject<KpiModel>(obj.ToString());

            try
            {
                var errors = ValidateTestCaseObject(kpiModel);
                if (errors.Count > 0)
                {
                    return BadRequest(new{ error_msg = errors });
                }
                var _5ghubBusiness = new _5ghubBusiness();

                var serializedObject = JsonConvert.SerializeObject(kpiModel);
                _5ghubBusiness.SaveTestCaseRecords(serializedObject);

                if (kpiModel.netapp is not null)
                {
                    var savedNetappId = long.Parse(_5ghubBusiness.RecordNetApp(kpiModel.netapp).Result);
                    foreach (var kpi in kpiModel.data.kpis)
                    {
                        //var moids = ExtractMoidPerName(kpiModel.data.moids);

                        var moidDetails = JsonConvert.SerializeObject(kpiModel.data.moids);
                        _5ghubBusiness.RecordNetAppKpiData(savedNetappId, kpiModel.netapp.netapp_execution_id, kpiModel.data.timestamp, kpi, moidDetails);
                    }
                }

                if (kpiModel.test is not null)
                {
                    var ucId = long.Parse(_5ghubBusiness.RecordUseCase(kpiModel.test).Result);
                    foreach (var kpi in kpiModel.data.kpis)
                    {
                        var moidDetails = JsonConvert.SerializeObject(kpiModel.data.moids);
                        _5ghubBusiness.RecordTestKpiData(ucId, kpiModel.test.test_case_id, kpiModel.data.timestamp, kpi, moidDetails);
                    }
                }

                var test_case_id = (kpiModel.test is null) ? null : kpiModel.test.test_case_id;

                return Ok(new { test_case_id = test_case_id });
                
            }
            catch (Exception e)
            {
                throw;
            }
        }

        //private IEnumerable<Object> ExtractMoidPerName(IEnumerable<Moid> dataMoids)
        //{
        //    var group = dataMoids.GroupBy(m => m.name).Select(g => new
        //    {
        //        moid = g.Key,

        //    })
        //}

        #endregion

        #region Private Methods For Api

        public List<string> ValidateTestCaseObject(KpiModel obj)
        {
            var kpiModel = obj;
            string msg = String.Empty;
            var error_List = new List<string>();

            if (kpiModel is not null)
            {
                //if (kpiModel.test is not null && kpiModel.data is not null)
                //{
                //    if (kpiModel.test.test_case_id is null || kpiModel.test.test_case_id.Equals(string.Empty))
                //    {
                //        if (kpiModel.test.test_case is null || kpiModel.test.test_case.Equals(string.Empty))
                //        {
                //            msg = "Invalid request, test_case and test_case_id can't be both null";
                //            error_List.Add(msg);
                //        }
                //    }
                //    else
                //    {
                //        msg = "Invalid request, test_case_id can't be null";
                //        error_List.Add(msg);
                //    }

                //    if (kpiModel.test.use_case is null)
                //    {
                //        msg = "Invalid request, Use Case ID must be provided!";
                //        error_List.Add(msg);
                //    }

                //    if (kpiModel.data.timestamp is null)
                //    {
                //        msg = "Invalid request, Timestamp must be provided!";
                //        error_List.Add(msg);
                //    }
                //}

                //if (kpiModel.netapp is not null)
                //{

                //    if ((kpiModel.netapp.netapp_execution_id is null ||
                //         kpiModel.netapp.netapp_execution_id.Equals(string.Empty)) && !kpiModel.netapp.id.HasValue &&
                //        (kpiModel.netapp.name is null || kpiModel.netapp.name.Equals(string.Empty)))
                //    {
                //        msg = "Invalid request, netapp details must be provided!";
                //        error_List.Add(msg);
                //    }
                //}

                if (kpiModel.data is not null)
                {
                    if (kpiModel.data.timestamp is null)
                    {
                        msg = "Invalid request, Timestamp must be provided!";
                        error_List.Add(msg);
                    }
                }
                else
                {
                    msg = "Invalid request, data object must be provided!";
                    error_List.Add(msg);
                }

                if ((kpiModel.test is not null) && (kpiModel.netapp is not null))
                {
                    msg = "Invalid request, both netapp and test object can be provided at the same time!";
                    error_List.Add(msg);
                }

                if (kpiModel.test is null && kpiModel.netapp is null)
                {
                    msg = "Invalid request, both netapp and test object cannot be null!";
                    error_List.Add(msg);
                }
            }

            return error_List;
        }

        private UserApiToken GenerateUserApiToken(long userId, string? tokenNote)
        {
            var user = new AuthenticationBusiness().RetrieveUserPerId(userId);

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration.GetSection("JwtToken").Value));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Fullname),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Sid, user.userId.ToString()),
                new Claim(ClaimTypes.System, user.ProjectId.ToString()) //Hiding project Id
            };

            var tokenExpiryDate = DateTime.Now.AddHours(3);
            var token = new JwtSecurityToken(claims: claims, expires: tokenExpiryDate,
                signingCredentials: credentials);

            var userToken = new UserApiToken
            {
                TokenKey = new JwtSecurityTokenHandler().WriteToken(token),
                UserID = userId,
                Note = tokenNote,
                ExpiryDate = tokenExpiryDate
            };
            return JsonConvert.DeserializeObject<UserApiToken>(new _5ghubBusiness().RecordUserApiToken(userToken)
                .Result);
        }

        private void MakePreviousUserTokensInvalid(long userId)
        {
            new _5ghubBusiness().MakePreviousUserTokensInvalid(userId);
        }
        #endregion

        #region Experiment

        public IActionResult RetrieveAvailableResources()
        {
            var resources = new _5ghubBusiness().RetrieveAvailableExperimentResources();

            return Json(JsonConvert.DeserializeObject<IEnumerable<ExperimentResource>>(resources.Result));
        }

        public IActionResult RetrieveAllResources()
        {
            var res = new _5ghubBusiness().RetrieveAllExperimentResources();

            return Json(JsonConvert.DeserializeObject<IEnumerable<ExperimentResource>>(res.Result));
        }

        public IActionResult UpdateExperimentResourceAvailability(Guid resourceId, bool isInUse)
        {
            new _5ghubBusiness().UpdateExperimentResourceAvailability(resourceId, isInUse);

            return Json(null);
        }

        public IActionResult RetrieveAllTestDataSentByDataCollector(long useCaseId)
        {
            var _5ghubBusiness = new _5ghubBusiness();
            var useCaseDetails =
                JsonConvert.DeserializeObject<UseCases>(_5ghubBusiness.RetrieveUCGeneralInfo(useCaseId).Result);

            var allDataFromDataCollector = JsonConvert.DeserializeObject<IEnumerable<DataCollectorRecord>>
                (_5ghubBusiness.RetrieveAllTestDataSentByDataCollector().Result);


            var allValidExperimentRecords = new List<ExperimentRecord>();

            foreach (var r in allDataFromDataCollector)
            {
                var data_content = JsonConvert.DeserializeObject<KpiModel>(r.RecordObj);
                if (data_content is not null && data_content.test is not null && useCaseDetails.UseCaseName.ToLower().Equals(data_content.test.use_case.ToLower()))
                {
                    var experimentRecord =
                        new ExperimentRecord(data_content.test.test_case_id, r.CreatedAt, data_content.data);

                    allValidExperimentRecords.Add(experimentRecord);
                }
            }

            var groupedExperiments = allValidExperimentRecords.GroupBy(r => r.ExperimentId).Select(g => new
            {
                ExperimentID = g.Key,
                StartedAt = $"{g.Where(r => r.ExperimentId == g.Key).OrderBy(r => r.CreatedAt).First().CreatedAt:g}",
                EndedAt = $"{g.Where(r => r.ExperimentId == g.Key).OrderBy(r => r.CreatedAt).Last().CreatedAt:g}",
                Object = g.Select(r => r.Data)
            });

            return Json(groupedExperiments);
        }

        public IActionResult CreateTestExperiment(long useCaseId, string experimentName)
        {
            int max = new Random().Next(25, 50);
            var faker = new Faker();
            var randomIp1 = faker.Internet.Ip();
            var randomIp2 = faker.Internet.Ip();

            var useCaseDetails =
                JsonConvert.DeserializeObject<UseCases>(new _5ghubBusiness().RetrieveUCGeneralInfo(useCaseId).Result);

            for (int i = 0; i < max; i++)
            {
                if (i % 10 == 0)
                {
                    Task.Delay(30000);
                }
                else
                {
                    var time = DateTime.Now.AddDays(i - max);
                    var testExperimentRecord = new DataModel()
                    {
                        timestamp = $"{time:u}",
                        kpis = new List<KpiApiObject>()
                        {
                            new KpiApiObject()
                            {
                                name = "ul_bitrate",
                                unit = "Mbps",
                                value = new Random().Next(5, 85).ToString()
                            },
                            new KpiApiObject()
                            {
                                name = "dl_bitrate",
                                unit = "Mbps",
                                value = new Random().Next(5, 85).ToString()
                            }
                        },
                        moids = new List<Moid>()
                        {
                            new Moid()
                            {
                                name = "ip",
                                value = (i < 20) ? randomIp1 : randomIp2
                            },
                            new Moid()
                            {
                                name = "ip",
                                value = (i < 20) ? randomIp1 : randomIp2
                            }
                        }
                    };

                    var moidDetails = JsonConvert.SerializeObject(testExperimentRecord.moids);
                    foreach (var kpi in testExperimentRecord.kpis)
                    {
                        var _5ghubBusiness = new _5ghubBusiness();
                        _5ghubBusiness.RecordTestKpiData(useCaseId, experimentName, testExperimentRecord.timestamp, kpi, moidDetails);

                        var kpiModel = new KpiModel()
                        {
                            test = new TestModel()
                            {
                                use_case = "",
                                test_case_id = experimentName,
                                test_case = experimentName
                            },
                            data = testExperimentRecord
                        };
                        kpiModel.test.use_case = useCaseDetails.UseCaseName;
                        var serializedObject = JsonConvert.SerializeObject(kpiModel);
                        _5ghubBusiness.SaveTestCaseRecords(serializedObject);
                    }
                }
            }

            return Json(0);
        }

        public IActionResult CreateSchedulableTestExperiment(long useCaseId, string experimentName, string startDate,
            string startTime)
        {
            int max = new Random().Next(25, 50);
            var faker = new Faker();
            var randomIp1 = faker.Internet.Ip();
            var randomIp2 = faker.Internet.Ip();

            var runningDate = DateTime.Parse($"{startDate} {startTime}");

            var useCaseDetails =
                JsonConvert.DeserializeObject<UseCases>(new _5ghubBusiness().RetrieveUCGeneralInfo(useCaseId).Result);

            for (int i = 0; i < max; i++)
            {
                if (i % 10 == 0)
                {
                    Task.Delay(30000);
                }
                else
                {
                    var time = runningDate.AddDays(i - max);
                    var testExperimentRecord = new DataModel()
                    {
                        timestamp = $"{time:u}",
                        kpis = new List<KpiApiObject>()
                        {
                            new KpiApiObject()
                            {
                                name = "ul_bitrate",
                                unit = "Mbps",
                                value = new Random().Next(5, 85).ToString()
                            },
                            new KpiApiObject()
                            {
                                name = "dl_bitrate",
                                unit = "Mbps",
                                value = new Random().Next(5, 85).ToString()
                            }
                        },
                        moids = new List<Moid>()
                        {
                            new Moid()
                            {
                                name = "ip",
                                value = (i < 20) ? randomIp1 : randomIp2
                            },
                            new Moid()
                            {
                                name = "ip",
                                value = (i < 20) ? randomIp1 : randomIp2
                            }
                        }
                    };

                    var moidDetails = JsonConvert.SerializeObject(testExperimentRecord.moids);
                    foreach (var kpi in testExperimentRecord.kpis)
                    {
                        var _5ghubBusiness = new _5ghubBusiness();
                        _5ghubBusiness.RecordScheduledTestKpiData(useCaseId, experimentName, testExperimentRecord.timestamp, kpi, moidDetails, true, runningDate);

                        var kpiModel = new KpiModel()
                        {
                            test = new TestModel()
                            {
                                use_case = "",
                                test_case_id = experimentName,
                                test_case = experimentName
                            },
                            data = testExperimentRecord
                        };
                        kpiModel.test.use_case = useCaseDetails.UseCaseName;
                        var serializedObject = JsonConvert.SerializeObject(kpiModel);
                        _5ghubBusiness.SaveTestCaseRecords(serializedObject);
                    }
                }
            }

            return Json(0);
        }

        #endregion

        #region User Resources

        public async Task<IActionResult> CreateResource(string resourceName, string resourceType, string token, bool status, string url)
        {
            var ummSettings = _5GhubUmmAuthConfigManager.GetClientAppProperties();

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

                var data = new UmmResource
                {
                    baseUri = url,
                    isPrivate = status,
                    //groups = new List<UmmResourceGroup>
                    //{
                    //    new UmmResourceGroup
                    //    {
                    //        id = Guid.NewGuid().ToString(),
                    //        name = groupName,
                    //    }
                    //},
                    name = resourceName,
                    type = resourceType
                };
                
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri(ummSettings.resource_management_api + "/resources"),
                    Content = JsonContent.Create(data)
                };
                
                request.Headers.Add("X-Client", ummSettings.credentials.x_client);
                request.Headers.Add("Accept", "application/json");

                var response = await httpClient.SendAsync(request);
                var responseContent = "";

                if (response.StatusCode.Equals(HttpStatusCode.Created))
                {
                    responseContent = await response.Content.ReadAsStringAsync();

                    var ummResourceDetails = JsonConvert.DeserializeObject<UmmResourceDetails>(await response.Content.ReadAsStringAsync());

                    new _5ghubBusiness().InsertUmmResource(ummResourceDetails);
                }

                return Json(JsonConvert.DeserializeObject<UmmResourceDetails>(responseContent));
            }
        }

        //public bool IsViewableResource(Guid resourceId, string ownerEmail)
        //{

        //    var userResources = GetUmmResourcesPerOwner(ownerEmail);

        //    if (userResources.Count() == 0)
        //    {
        //        return false;
        //    }
        //    else
        //    {
        //        if (userResources.Any(r => r.UmmResourceID == resourceId))
        //        {
        //            return true;
        //        }
        //        else
        //        {
        //            return false;
        //        }
        //    }
        //}

        private IEnumerable<UmmApplicationResource> GetUmmResourcesPerOwner(string ownerEmail)
        {
            var val = new _5ghubBusiness().RetrieveUmmResourcePerOwner(ownerEmail);

            return JsonConvert.DeserializeObject<IEnumerable<UmmApplicationResource>>(val.Result);
        }

        public IActionResult GetUserResources(string token, string resourceType)
        {
            var ummSettings = _5GhubUmmAuthConfigManager.GetClientAppProperties();

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(ummSettings.resource_management_api + $"/resources/all/{resourceType}"),
                };

                request.Headers.Add("X-Client", ummSettings.credentials.x_client);
                request.Headers.Add("Accept", "application/json");

                var response = httpClient.Send(request);

                return Json(response.Content.ReadAsStringAsync());
            }
        }

        public IActionResult RetrieveAllUmmResourcesPerOwner(long projectId, string email)
        {
            var usecases =
                JsonConvert.DeserializeObject<IEnumerable<UseCases>>(new _5ghubBusiness()
                    .RetrieveUseCasesPerProjectId(projectId).Result);

            var resources =
                JsonConvert.DeserializeObject<IEnumerable<UmmApplicationResource>>(new _5ghubBusiness()
                    .RetrieveAllUmmResourcesPerOwner(email).Result);


            var finalUseCases = new List<Object>();
            foreach (var uc in usecases)
            {
                if (resources.Any(r => r.UmmResourceName.ToLower().Equals(uc.UseCaseCode.ToLower())))
                {
                    finalUseCases.Add(uc);
                }
            }

            return Json(finalUseCases);
        }

        public async Task<IActionResult> GetResourceDetailsPerName(string resourceName)
        {
            var ummSettings = _5GhubUmmAuthConfigManager.GetClientAppProperties();
            string tokenCipherDetails = HttpContext.Session.Get<String>("_UserToken");

            var tokenDetails =
                JsonConvert.DeserializeObject<_5GhubTokenInfos>(
                    EncryptionDecryption.DecryptString(tokenCipherDetails));

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {tokenDetails.access_token}");

                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(ummSettings.resource_management_api + $"/resources/info/{resourceName}"),
                };

                request.Headers.Add("X-Client", ummSettings.credentials.x_client);
                request.Headers.Add("Accept", "application/json");

                var response = await httpClient.SendAsync(request);

                return Json(new
                {
                    code = response.StatusCode.ToString(),
                    content = await response.Content.ReadAsStringAsync()
                });
            }
        }

        public async Task<IActionResult> GetResourcePerId(string resId)
        {
            var ummSettings = _5GhubUmmAuthConfigManager.GetClientAppProperties();
            string tokenCipherDetails = HttpContext.Session.Get<String>("_UserToken");

            var tokenDetails =
                JsonConvert.DeserializeObject<_5GhubTokenInfos>(
                    EncryptionDecryption.DecryptString(tokenCipherDetails));

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {tokenDetails.access_token}");

                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(ummSettings.resource_management_api + $"/resources/{resId}"),
                };

                request.Headers.Add("X-Client", ummSettings.credentials.x_client);
                request.Headers.Add("Accept", "application/json");

                var response = await httpClient.SendAsync(request);

                return Json(new
                {
                    code = response.StatusCode.ToString()
                });
            }
        }

        public async Task<IActionResult> RetrieveUserGroupDetails()
        {
            var ummSettings = _5GhubUmmAuthConfigManager.GetClientAppProperties();
            string tokenCipherDetails = HttpContext.Session.Get<String>("_UserToken");

            var tokenDetails =
                JsonConvert.DeserializeObject<_5GhubTokenInfos>(
                    EncryptionDecryption.DecryptString(tokenCipherDetails));

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {tokenDetails.access_token}");

                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(ummSettings.resource_management_api + "/groups/my"),
                };

                request.Headers.Add("X-Client", ummSettings.credentials.x_client);
                request.Headers.Add("Accept", "application/json");

                var response = await httpClient.SendAsync(request);

                return Json(new
                {
                    code = response.StatusCode.ToString(),
                    content = await response.Content.ReadAsStringAsync()
                });
            }
        }
        #endregion
    }

    public record KpiGraphInfos(DateTime x, decimal y, string graphName);

    public record ExperimentRecord(string ExperimentId, DateTime CreatedAt, DataModel Data);

    public class UmmResource
    {
        public string baseUri { get; set; }
        public bool isPrivate { get; set; }
        //public IEnumerable<UmmResourceGroup> groups { get; set; }
        public string name { get; set; }
        public string type { get; set; }
    }

    public class UmmResourceDetails
    {
        public string id { get; set; }
        public string name { get; set; }
        public string owner { get; set; }
        public string privacy { get; set; }
        public string uri { get; set; }
    }

    public class UmmResourceGroup
    {
        public string id { get; set; }
        public string name { get; set; }
    }
}
