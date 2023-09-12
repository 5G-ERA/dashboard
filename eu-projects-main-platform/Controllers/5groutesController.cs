using System.Collections.Generic;
using eu_projects_main_platform.Business;
using eu_projects_main_platform.Models;
using eu_projects_main_platform.Models._5groutes;
using eu_projects_main_platform.Models.DatabaseHandler;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System.Data;
using System.Data.OleDb;
using System.Drawing;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using eu_projects_main_platform.Models._5groutes.api_object_params;
using eu_projects_main_platform.Models._5groutes.static_classes;
using eu_projects_main_platform.Models.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IHostingEnvironment;
using eu_projects_main_platform.Models.Planet.UserSettings.DTO;
using eu_projects_main_platform.Models.Planet.GraphQL;
using System.Text.Json;
using System;
using System.Net;
using MongoDB.Bson;
using ExcelDataReader;
using SharpCompress.Common;
using MediaTypeHeaderValue = System.Net.Http.Headers.MediaTypeHeaderValue;
using Humanizer;
using static Humanizer.In;
using Syncfusion.XlsIO.Implementation.XmlSerialization;
using System.IO;
using System.Xml.Linq;
using System.Xml;
using eu_projects_main_platform.MQTT._5groutes;
using YamlDotNet.RepresentationModel;

namespace eu_projects_main_platform.Controllers
{
    public class _5groutesController : Controller
    {
        private readonly ILogger<_5groutesController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IHostingEnvironment _hostingEnvironment;
       

        public async Task<IActionResult> RetrieveDomainCoordinates(int id)
        {
           
            var data = new _5groutesBussiness().RetrieveDomainCoordinates(id);
            return Json(data);
        }

        [HttpPost]
        public async Task<JsonResult> UploadYamlFile11()
        {
            foreach(var formfile in Request.Form.Files)
            {
                var fulPath = Path.Combine(_hostingEnvironment.ContentRootPath, "wwwroot\\files", formfile.FileName);
                using (var reader = new StreamReader(fulPath))
                {
                    // Load the stream
                    var yaml = new YamlStream();
                    yaml.Load(reader);
                    // the rest
                }
                using (FileStream fs = System.IO.File.Create(fulPath))
                {
                    formfile.CopyTo(fs);
                        fs.Flush();
                }
                return Json("Upload Image successfully");
            }
            return Json("Plz try again!!");
        }

        public _5groutesController(ILogger<_5groutesController> logger, IConfiguration _configuration,
            IHostingEnvironment hostingEnvironment)
        {
            _logger = logger;
            this._configuration = _configuration;
            _hostingEnvironment = hostingEnvironment;
        }
        #region Partial Views

        public IActionResult UseCaseConfigurations()
        {
            return PartialView("UseCaseConfigurations");
        }

        public IActionResult ShowUseCaseScenriosView()
        {
            return PartialView("UseCaseScenarios");
        }

        public IActionResult VisualiseKPIs()
        {
            return PartialView("VisualiseKPIs");
        }
        //public IActionResult StopNetworkService(string domain)
        //{
        //    _5groutesMQTTClient mQTTClient = new _5groutesMQTTClient();
        //     mQTTClient.MQTTClient(null, null, domain, true);


        //    return Json("");
        //}


        public IActionResult ExperimentResultsEvaluation()
        {
            return PartialView("ExperimentResultsEvaluation");
        }

        public IActionResult ShowApiConfigurationView()
        {
            return PartialView("ApiConfigurations");
        }

        public IActionResult ShowAnalytics()
        {
            return PartialView("Analytics");
        }

        public IActionResult ShowArtefacts()
        {
            return PartialView("Artefacts");
        }

        #endregion
        public async Task<IActionResult> FetchTestNetworkServices()
        {
            var url = _5GRoutesApiUrlRootManager.CamRepoUrl + "/catalogue";
            
            using (var httpClient = new HttpClient())
            {
                var res = new List<string>();

                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(url),
                    //Content = new StringContent(JsonConvert.SerializeObject("HELM"))
                };

                var response = await httpClient.SendAsync(request);
              
                if (response.IsSuccessStatusCode)
                {
                    try
                    {
                        var result = await response.Content.ReadAsStringAsync();

                        JObject objectData = JObject.Parse(result);

                        var nsList = objectData["nsList"].Value<JArray>();

                        //dynamic dynamicObject = JsonConvert.DeserializeObject(result);

                        if (nsList.ToList() != null)
                        {
                            foreach (var item in nsList.ToList())
                            {
                                res.Add(item.ToString());
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }

                //return Json(new
                //{
                //    code = response.StatusCode,
                //    data = await response.Content.ReadAsStringAsync()
                //});

                //res.Add("First");
                //res.Add("Second");
                //res.Add("Test");

                return Json(res);
            }
        }
        public async Task<IActionResult> RetrieveDomainName()
        {
            // call method for return domain data
            var data = new _5groutesBussiness().RetrieveDomainName();
            return Json(data);
        }
            public UserApiToken GenerateUserApiToken(long userId, string? tokenNote)
        {
            var user = new AuthenticationBusiness().RetrieveUserPerId(userId);

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration.GetSection("JwtToken").Value));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Fullname),
                new Claim(ClaimTypes.Role, user.LeaderName.Trim().ToUpper()),
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
            return JsonConvert.DeserializeObject<UserApiToken>(new _5groutesBussiness().RecordUserApiToken(userToken)
                .Result);
        }

        public IActionResult RetrieveUserApiTokens(long userId)
        {
            return Json(new _5groutesBussiness().RetrieveUserApiTokens(userId));
        }

        public IActionResult DeleteUserApiToken(long tokenId)
        {
            return Json(new _5groutesBussiness().DeleteUserApiToken(tokenId));
        }
       
        private void MakePreviousUserTokensInvalid(long userId)
        {
            new _5groutesBussiness().MakePreviousUserTokensInvalid(userId);
        }

        public IActionResult Uploads(long testScenarioId)
        {
            try
            {
                var file = Request.Form.Files[0];
                var fileRecord = UploadTestFile(testScenarioId, file);

                SaveTestAttachmentUpload(fileRecord);

                return Json("Upload Successful.");
            }
            catch (System.Exception ex)
            {
                return Json("Upload Failed: " + ex.Message);
            }
        }

        private TestAttachmentFile UploadTestFile(long testScenarioId, IFormFile file)
        {
            string folderName = "Upload";
            string webRootPath = _hostingEnvironment.WebRootPath;
            string defaultPath = Path.Combine(webRootPath, folderName);

            var testFolderName = $"Test_{testScenarioId}";
            var newPath = Path.Combine(defaultPath, testFolderName);
            var uploadedFile = new TestAttachmentFile();

            if (!Directory.Exists(newPath))
            {
                Directory.CreateDirectory(newPath);
            }

            if (file.Length > 0)
            {
                var fileId = Guid.NewGuid();
                string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim()
                    .Value;
                var fileExtension = fileName.Split('.', StringSplitOptions.None).Last();

                uploadedFile = new TestAttachmentFile
                {
                    TestAttachmentFileUID = fileId,
                    TestAttachmentFileName = fileName,
                    TestAttachmentFileSize = file.Length,
                    TestScenarioId = testScenarioId
                };

                string fullPath = Path.Combine(newPath, fileId.ToString() + '.' + fileExtension);
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }
            }

            return uploadedFile;
        }

        public IActionResult DeleteTestAttachment(string key, long testScenarioId)
        {
            var fileUID = Guid.Parse(key);

            //Delete DB Record
            new _5groutesBussiness().DeleteTestAttachmentPerFileId(fileUID);

            //Delete File on the server
            string rootUploadFilePath = Path.Combine(_hostingEnvironment.WebRootPath, "Upload");

            var testFolderName = $"Test_{testScenarioId}";
            var downloadFilePath = Path.Combine(rootUploadFilePath, testFolderName);

            try
            {
                if (Directory.Exists(downloadFilePath))
                {
                    var uploadFolderInfos = new DirectoryInfo(downloadFilePath);

                    FileInfo[] localfiles = uploadFolderInfos.GetFiles("*");

                    foreach (var file in localfiles)
                    {
                        var fileName = file.Name.Split('.', StringSplitOptions.None).First();
                        if (fileName.Equals(key))
                        {
                            file.Delete();
                        }
                    }
                }

                return Json(null);
            }
            catch (Exception e)
            {
                return Json(e.Message);
            }
        }

        public IActionResult RetrieveTestAttachmentFiles(long testScenarioId)
        {
            //Fetch all files in the Folder (Directory).
            string rootUploadFilePath = Path.Combine(_hostingEnvironment.WebRootPath, "Upload");

            var testFolderName = $"Test_{testScenarioId}";
            var downloadFilePath = Path.Combine(rootUploadFilePath, testFolderName);

            if (Directory.Exists(downloadFilePath))
            {
                var uploadFolderInfos = new DirectoryInfo(downloadFilePath);

                FileInfo[] localfiles = uploadFolderInfos.GetFiles("*");

                var uploadedFiles = new List<TestAttachmentFile>();

                foreach (var file in localfiles)
                {
                    var fileName = file.Name.Split('.', StringSplitOptions.None).First();
                    var fileInfo = RetrieveTestAttachementPerFileId(Guid.Parse(fileName));
                    uploadedFiles.Add(fileInfo);
                }

                return Json(uploadedFiles);
            }
            else return Json(null);
        }

        private TestAttachmentFile RetrieveTestAttachementPerFileId(Guid fileUid)
        {
            var res = new _5groutesBussiness().RetrieveTestAttachementPerFileId(fileUid);
            return JsonConvert.DeserializeObject<TestAttachmentFile>(res.Result);
        }

        private void SaveTestAttachmentUpload(TestAttachmentFile uploadedFile)
        {
            new _5groutesBussiness().AddTestAttachment(uploadedFile);
        }

        public List<TestAttachmentFile> RetrieveTestAttachmentFilesPerTest(long testId)
        {
            return JsonConvert.DeserializeObject<List<TestAttachmentFile>>(new _5groutesBussiness()
                .RetrieveTestAttachmentFilesPerTest(testId).Result);
        }

        public IActionResult RetrieveAllArtefactTypes()
        {
            return Json(new _5groutesBussiness().RetrieveAllArtefactTypes());
        }

        [RequestSizeLimit(268435456)] //250 MB for Kestrel Servers
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadArtefactFile(string username, string artefactType)
        {
            var datas = Request.Form.Files;

            string? status = null;
            int code = 0;
            string fileName = string.Empty;

            try
            {
                var uc_LeaderName =
                    JsonConvert.DeserializeObject<string>(new _5groutesBussiness().RetrieveLeaderName(username).Result);

                string folderName = Path.Combine("Artefacts", "UC_" + uc_LeaderName.ToUpper().Trim());
                string webRootPath = _hostingEnvironment.WebRootPath;
                string fullPath = Path.Combine(webRootPath, folderName);

                if (!Directory.Exists(fullPath))
                {
                    Directory.CreateDirectory(fullPath);
                }

                foreach (IFormFile file in Request.Form.Files)
                {
                    //Make the filename to be a guid
                    //fileName = $"({artefactType})" + file.FileName;
                    fileName = file.FileName;

                    string extension = Path.GetExtension(file.FileName).Replace(".", "");
                    if (extension == "gz" || extension == "tgz")
                    {
                        try
                        {
                            //Making the API call here first
                            var response = await OnboardNetworkArtefactFile(artefactType, file);
                            if (response.StatusCode == HttpStatusCode.OK)
                            {
                                code = 200;
                            }
                            else
                            {
                                code = (int)response.StatusCode;
                                throw new Exception(await response.Content.ReadAsStringAsync());
                            }
                        }
                        finally
                        {
                            //If the above try worked fine, Now make a backup of the file
                            if (code == 200)
                            {
                                fullPath = Path.Combine(fullPath, fileName);

                                using (Stream fileStream = new FileStream(fullPath, FileMode.Create))
                                {
                                    await file.CopyToAsync(fileStream);
                                }

                                status = "SUCCESS";
                            }
                            
                        }
                    }
                    else
                        status = "Invalid file type. Please select a .tar.gz or .tgz file";

                }
            }
            catch (Exception e)
            {
                status = "FAILED! " + e.Message;
            }

            return Json(new
            {
                fileId = fileName,
                onboard_code = code,
                status = status
            });
        }

        private async Task<HttpResponseMessage> OnboardNetworkArtefactFile(string artefactType, IFormFile file)
        {
            var url = _5GRoutesApiUrlRootManager.CamRepoUrl + "/onboard/?nfv_level=" + artefactType;

            using (var httpClient = new HttpClient())
            {
                var requestContent = new MultipartFormDataContent();
                var fileContent = new StreamContent(file.OpenReadStream());
                fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse(file.ContentType);
                requestContent.Add(fileContent, "file", file.FileName);

                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri(url),
                    Content = requestContent
                };

                try
                {
                   // var data= await httpClient.SendAsync(request);
                    return await httpClient.SendAsync(request);
                }
                catch (Exception e)
                {
                    throw;
                }
            }
        }
        [RequestSizeLimit(268435456)] //250 MB for Kestrel Servers
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadYamlFile(string username, string artefactType)
        {
            var datas = Request.Form.Files;

            string? status = null;
            int code = 0;
            string fileName = string.Empty;

            try
            {
                var uc_LeaderName =
                    JsonConvert.DeserializeObject<string>(new _5groutesBussiness().RetrieveLeaderName(username).Result);

                string folderName = Path.Combine("MQTT", "UC_" + uc_LeaderName.ToUpper().Trim());
                string webRootPath = _hostingEnvironment.WebRootPath;
                string fullPath = Path.Combine(webRootPath, folderName);

                if (!Directory.Exists(fullPath))
                {
                    Directory.CreateDirectory(fullPath);
                }

                foreach (IFormFile file in Request.Form.Files)
                {
                    //Make the filename to be a guid
                    //fileName = $"({artefactType})" + file.FileName;
                    fileName = file.FileName;

                    string extension = Path.GetExtension(file.FileName).Replace(".", "");
                    if (extension == "yaml")
                    {
                        code = 200;

                        fullPath = Path.Combine(fullPath, fileName);

                        using (Stream fileStream = new FileStream(fullPath, FileMode.Create))
                        {
                            await file.CopyToAsync(fileStream);
                        }

                        status = "SUCCESS";

                    }
                    else
                        status = "Invalid file type. Please select a .tar.gz or .tgz file";

                }
            }
            catch (Exception e)
            {
                status = "FAILED! " + e.Message;
            }

            return Json(new
            {
                fileId = fileName,
                onboard_code = code,
                status = status
            });
        }
        public IActionResult DeleteUploadedYamlFile(string key, string username, string artefactFileName)
        {
            //Delete File on the server
            var uc_LeaderName =
                JsonConvert.DeserializeObject<string>(new _5groutesBussiness().RetrieveLeaderName(username).Result);

            string folderName = Path.Combine("MQTT", "UC_" + uc_LeaderName.ToUpper().Trim());
            string webRootPath = _hostingEnvironment.WebRootPath;
            string fullPath = Path.Combine(webRootPath, folderName);

            string response = "";

            if (Directory.Exists(fullPath))
            {
                var uploadFolderInfos = new DirectoryInfo(fullPath);

                FileInfo[] localfiles = uploadFolderInfos.GetFiles("*");

                foreach (var file in localfiles)
                {
                    if (file.Name.Equals(artefactFileName))
                    {
                        file.Delete();
                        response = "SUCCESS";
                    }
                }
            }
            else response = "FAILED";
            return Json(response);
        }

        public IActionResult Retrieve5GroutesArtefacts(string username)
        {
            var uc_LeaderName =
                JsonConvert.DeserializeObject<string>(new _5groutesBussiness().RetrieveLeaderName(username).Result);

            return Json(new _5groutesBussiness().Retrieve5GroutesArtefacts(uc_LeaderName));
        }

        public IActionResult SaveArtefact(long artefactTypeId, string username, string filename, string artefactTypeName)
        {
            try
            {
                var uc_LeaderName =
                    JsonConvert.DeserializeObject<string>(new _5groutesBussiness().RetrieveLeaderName(username).Result);

                string folderName = Path.Combine("Artefacts", "UC_" + uc_LeaderName.ToUpper().Trim());
                string webRootPath = _hostingEnvironment.WebRootPath;
                string fullPath = Path.Combine(webRootPath, folderName);
                string filePath = Path.Combine(webRootPath, Path.Combine(folderName,filename));

                if (Directory.Exists(fullPath))
                {
                    var uploadFolderInfos = new DirectoryInfo(fullPath);

                    FileInfo[] localfiles = uploadFolderInfos.GetFiles("*");

                    var uploadedFile = localfiles.FirstOrDefault(f => f.Name.Equals(filename));
                    if (uploadedFile is null)
                    {
                        throw new Exception("File non existing");
                    }

                    var artefactInfos = new Artefact
                    {
                        ArtefactFileName = filename,
                        ArtefactFilePath = filePath,
                        ArtefactTypeId = artefactTypeId,
                        ArtefactTypeName = artefactTypeName,
                        ArtefactFileSize = uploadedFile.Length.ToString(),
                    };

                   // var res = new _5groutesBussiness().SaveArtefact(uc_LeaderName, artefactInfos, username).Result;
                    var res = new _5groutesBussiness().SaveArtefact(uc_LeaderName, artefactInfos);
                   // if(res.Result != "Finished after synchronization ok")
                   // throw new Exception(res.Result);

                    return Json(res);
                }
                else
                {   
                    throw new Exception("File non existing");
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        public IActionResult DeleteUcNetworkArtefact(long networkArtefactId)
        {
            return Json(new _5groutesBussiness().DeleteUcNetworkArtefact(networkArtefactId));
        }

        public IActionResult DeleteUploadedArtefactFile(string key, string username, string artefactFileName)
        {
            //Delete File on the server
            var uc_LeaderName =
                JsonConvert.DeserializeObject<string>(new _5groutesBussiness().RetrieveLeaderName(username).Result);

            string folderName = Path.Combine("Artefacts", "UC_" + uc_LeaderName.ToUpper().Trim());
            string webRootPath = _hostingEnvironment.WebRootPath;
            string fullPath = Path.Combine(webRootPath, folderName);

            string response = "";

            if (Directory.Exists(fullPath))
            {
                var uploadFolderInfos = new DirectoryInfo(fullPath);

                FileInfo[] localfiles = uploadFolderInfos.GetFiles("*");

                foreach (var file in localfiles)
                {
                    if (file.Name.Equals(artefactFileName))
                    {
                        file.Delete();
                        response = "SUCCESS";
                    }
                }
            }
            else response = "FAILED";
            return Json(response);
        }

        public IActionResult RetrieveCompositeKPIsPerProject(long projectId)
        {
            return Json(new _5groutesBussiness().RetrieveCompositeKPIsPerProject(projectId));
        }

        public IActionResult RetrieveUseCases(long userid, string username)
        {
            return Json(new _5groutesBussiness().RetrieveUseCases(userid, username));
        }

        public IActionResult RetrieveKPITypes()
        {
            return Json(new _5groutesBussiness().RetrieveKPITypes());
        }

        public IActionResult RetrieveMeasurementValuesPerKpi(long kpiSubTypeId)
        {
            return Json(new _5groutesBussiness().RetrieveMeasurementValuesPerKpi(kpiSubTypeId));
        }

        public IActionResult RetrieveKPIThresholdPerUseCase(long usecaseId)
        {
            return Json(new _5groutesBussiness().RetrieveKPIThresholdPerUseCase(usecaseId));
        }

        public IActionResult RetrieveSingleExperimentResultsEvaluation(long id)
        {
            return Json(new _5groutesBussiness().RetrieveSingleExperimentResultsEvaluation(id));
        }

        public IActionResult RetrieveExperimentResultsEvaluationPerTestID(long testId)
        {
            return Json(new _5groutesBussiness().RetrieveExperimentResultsEvaluationPerTestID(testId));
        }

        public IActionResult RetrieveUCGeneralInfo(long usecase_id)
        {
            return Json(new _5groutesBussiness().RetrieveUCGeneralInfo(usecase_id));
        }

        public IActionResult RetrieveScenarioPerUseCase(long usecase_id)
        {
            return Json(new _5groutesBussiness().RetrieveScenarioPerUseCase(usecase_id));

        }

        public IActionResult RetrieveMeasurementValuesPerTestAndKpiType(long testId, long subtypeKpiId)
        {
            return Json(new _5groutesBussiness().RetrieveMeasurementValuesPerTestAndKpiType(testId, subtypeKpiId));
        }

        public IActionResult RetrieveKPIs(long scenario_id)
        {
            return Json(new _5groutesBussiness().RetrieveKPIs(scenario_id));

        }

        public IActionResult RetrieveScenarioPerId(long scenarioId)
        {
            return Json(new _5groutesBussiness().RetrieveScenarioPerId(scenarioId));
        }

        public IActionResult RetrieveTestScenariosPerScenario(long scenario_Id)
        {
            return Json(new _5groutesBussiness().RetrieveTestScenariosPerScenario(scenario_Id));
        }

        public IActionResult RetrieveTestScenarioMeasurementPerUseCase(long usecase_Id)
        {
            return Json(new _5groutesBussiness().RetrieveTestScenarioMeasurementPerUseCase(usecase_Id));
        }

        public IActionResult RetrieveUnits()
        {
            return Json(new _5groutesBussiness().RetrieveUnits());
        }

        public IActionResult RetrieveTestScenarioPerId(long testScenarioid)
        {
            return Json(new _5groutesBussiness().RetrieveTestScenarioPerId(testScenarioid));
        }

        public IActionResult DeleteTestScenario(long testScenarioId)
        {
            return Json(new _5groutesBussiness().DeleteTestScenario(testScenarioId));
        }

        public IActionResult RetrieveKPI(long kpiid)
        {
            return Json(new _5groutesBussiness().RetrieveKPI(kpiid));
        }

        public IActionResult AddKPI(long usecaseid, long typeid, string picode, long subtypeid, string name,
            string highvalue, long highoperatorid, string lowvalue, long lowoperatorid, long unitid)
        {
            return Json(new _5groutesBussiness().AddKPI(usecaseid, typeid, null, subtypeid, name, highvalue,
                highoperatorid, lowvalue, lowoperatorid, unitid));
        }

        public IActionResult DeleteKPI(long kpiid)
        {
            return Json(new _5groutesBussiness().DeleteKPI(kpiid));
        }

        public IActionResult EditKPI(long selectedkpi, long typeid, string picode, long subtypeid, string name,
            string highvalue, long highoperatorid, string lowvalue, long lowoperatorid, long unitid)
        {
            return Json(new _5groutesBussiness().EditKPI(selectedkpi, typeid, picode, subtypeid, name, highvalue,
                highoperatorid, lowvalue, lowoperatorid, unitid));
        }

        public IActionResult EditUseCase(long UseCaseID, string UseCaseCode, string CaseDescription, string Responsible, string Contact,
            DateTime Date)
        {
            return Json(new _5groutesBussiness().EditUseCase(UseCaseID, UseCaseCode, CaseDescription, Responsible, Contact, Date));
        }

        public IActionResult DuplicateScenario(long scenarioid)
        {
            return Json(new _5groutesBussiness().DuplicateScenario(scenarioid));
        }

        public IActionResult ScenarioOverWrite(long scenario_id_from, long scenario_id_to)
        {
            return Json(new _5groutesBussiness().ScenarioOverWrite(scenario_id_from, scenario_id_to));
        }

        public IActionResult RetrieveOperators()
        {
            return Json(new _5groutesBussiness().RetrieveOperators());
        }

        public IActionResult AddNewScenario(long usecase_id, string usecasedescription, string usecasetrialtype)
        {
            return Json(new _5groutesBussiness().AddNewScenario(usecase_id, usecasedescription, usecasetrialtype));
        }

        public IActionResult EditScenario(long scenario_id, string usecasedescription, string usecasetrialtype)
        {
            return Json(new _5groutesBussiness().EditScenario(scenario_id, usecasedescription, usecasetrialtype));
        }

        public IActionResult DeleteScenario(long scenario_id)
        {
            return Json(new _5groutesBussiness().DeleteScenario(scenario_id));
        }

        public IActionResult EditTestScenario(long testId, string? testName, string? testDescription)
        {
            return Json(new _5groutesBussiness().EditTestScenario(testId, testName, testDescription));
        }

        public IActionResult RetrieveTestDetailsPerId(long testId)
        {
            return Json(new _5groutesBussiness().RetrieveTestDetailsPerId(testId));
        }

        public IActionResult DeleteExperimentResults(long ExperimentResultsEvaluationId)
        {
            return Json(new _5groutesBussiness().DeleteExperimentResults(ExperimentResultsEvaluationId));
        }

        public IActionResult RetrieveLeaderName(string username)
        {
            return Json(new _5groutesBussiness().RetrieveLeaderName(username));
        }

        public IActionResult AddTestScenario(long scenarioId, string testName, string NS, int domainId, string coordinate,string yaml)
        {
            string folderPath = Path.Combine("MQTT","UC_EDI");
            string webRootPath = _hostingEnvironment.WebRootPath;
            string fullPath = Path.Combine(webRootPath, Path.Combine(folderPath, yaml));

            var customResponseModel = StartTestScenario(scenarioId, testName, NS, domainId, coordinate, fullPath);
            return Json(customResponseModel);
        }

        private CustomResponseModel StartTestScenario(long scenarioId, string testName,string  NS, int domainId, string coordinate,string yamlFileUrl) 
        {
            var randomTestColor = $"#{new Random().Next(0x1000000):X6}"; //Generated random HEX Color
            CustomResponseModel customResponse = new CustomResponseModel();
            var TestScenario = new _5groutesBussiness().AddTestScenario(scenarioId, testName, randomTestColor);

            var jsonTestScenario = JsonConvert.DeserializeObject(TestScenario.Result);
            
            // read domain based on id
            var domain = new _5groutesBussiness().RetrieveDomain(domainId);

            customResponse = _5groutesMQTTClient.MQTTClient(TestScenario, NS, domain, false, coordinate, yamlFileUrl);
           
            //customResponse.Result = jsonTestScenario.ToString();

            return customResponse;
        }

        public IActionResult RetrieveLastestTestScenarioMeasureValue(long testScenarioId, long measureId)
        {
            return Json(new _5groutesBussiness().RetrieveLastestTestScenarioMeasureValue(testScenarioId, measureId));
        }

        public IActionResult RetrieveDetailedTestMeasurmentValues(long testScenarioId)
        {
            var res = JsonConvert.DeserializeObject<List<DetailedScenarioMeasurementValue>>(new _5groutesBussiness()
                .RetrieveAllTestMeasurementValuesPerTest(testScenarioId).Result);
            return Json(res);
        }

        public IActionResult RetrieveAllTestMeasurementValuesPerTest(long testScenarioId)
        {
            var res = JsonConvert.DeserializeObject<List<DetailedScenarioMeasurementValue>>(new _5groutesBussiness()
                .RetrieveAllTestMeasurementValuesPerTest(testScenarioId).Result);

            var groupedValues = res.GroupBy(i => i.KpiSubTypeId)
                .Select(g => GetGroupedMeasurementValue(g));

            return Json(JsonConvert.SerializeObject(groupedValues));
        }

        private CompositePiValue GetGroupedMeasurementValue(IGrouping<long, DetailedScenarioMeasurementValue> g)
        {
            var validGroupItems = g.Where(v => v.SatisfactoryLevelType != SatisfactoryLevelTypes.None);
            var nbrOfValidGroupItems = (g.Count(v => v.SatisfactoryLevelType != SatisfactoryLevelTypes.None) == 0)
                ? 1
                : g.Count(v => v.SatisfactoryLevelType != SatisfactoryLevelTypes.None);
            var res = new CompositePiValue
            {
                KpiSubTypeId = g.Key,
                KpiSubTypeCode = g.Select(v => v.KpiSubTypeCode).First(),
                PercentageValue = validGroupItems.Select(v => v.SatisfactoryPercentageValue).Sum() /
                                  nbrOfValidGroupItems
            };
            return res;
        }

        public IActionResult RetrieveMeasurementValuesPerScenarioAndKpiSubtypeId(long scenarioId, long subtypeKpiId)
        {
            return Json(
                new _5groutesBussiness().RetrieveMeasurementValuesPerScenarioAndKpiSubtypeId(scenarioId, subtypeKpiId));
        }

        public IActionResult AddIndividualTestScenarioMeasureValue(long testScenarioId, long measurementId,
            decimal? measurementValue)
        {
            var measurementValueObj = GetScenarioMeasurementValue(testScenarioId, measurementId, measurementValue);

            return AddTestScenarioMeasureValue(measurementValueObj);
        }

        private ScenarioMeasurementValue GetScenarioMeasurementValue(long testScenarioId, long measurementId,
            decimal? measurementValue)
        {
            var testScenarioMeasurement = RetrieveTestScenarioMeasurementPerId(measurementId);
            var measurementValueObj =
                TestMeasurementCalculator.GetMeasurementValue(testScenarioMeasurement, measurementValue);

            measurementValueObj.TestScenarioId = testScenarioId;
            return measurementValueObj;
        }

        public IActionResult EvaluateScenarioMeasurementSatifactoryLevel(long testScenarioId, long measurementId,
            decimal? measurementValue)
        {
            var scenarioMeasurementValue = GetScenarioMeasurementValue(testScenarioId, measurementId, measurementValue);
            if (scenarioMeasurementValue.SatisfactoryLevelType.Equals(SatisfactoryLevelTypes.Acceptable))
            {
                scenarioMeasurementValue.SatisfactoryPercentageValue = 50;
            }
            else if (scenarioMeasurementValue.SatisfactoryLevelType.Equals(SatisfactoryLevelTypes.Bad))
            {
                scenarioMeasurementValue.SatisfactoryPercentageValue = 0;
            }
            else if (scenarioMeasurementValue.SatisfactoryLevelType.Equals(SatisfactoryLevelTypes.Good))
            {
                scenarioMeasurementValue.SatisfactoryPercentageValue = 100;
            }
            return Json(scenarioMeasurementValue);
        }

        private IActionResult AddTestScenarioMeasureValue(ScenarioMeasurementValue measurementValueObj)
        {
            return Json(new _5groutesBussiness().AddTestScenarioMeasureValue(measurementValueObj));
        }

        private ScenarioMeasurement RetrieveTestScenarioMeasurementPerId(long measurementId)
        {
            var response = new _5groutesBussiness().RetrieveTestScenarioMeasurementPerId(measurementId);
            if (response.Result == null) return new ScenarioMeasurement();

            return JsonConvert.DeserializeObject<ScenarioMeasurement>(response.Result);
        }
        public ExperimentResultsErrorHandle ConvertExceltoDataTable(ExperimentResultsErrorHandle experimentresultsrrrorhandle)
        {
            try
            {
                using (var stream = System.IO.File.Open(experimentresultsrrrorhandle.excelFilePath, FileMode.Open, FileAccess.Read))
                {
                    using (var excelDataReader = ExcelReaderFactory.CreateReader(stream))
                    {
                        var result = excelDataReader.AsDataSet(new ExcelDataSetConfiguration()
                        {
                            ConfigureDataTable = (_) => new ExcelDataTableConfiguration()
                            {
                                UseHeaderRow = true
                            }
                        });
                        
                        excelDataReader.Close();

                        DataTable dt = result.Tables[0];

                        if (dt.Rows.Count > 0)
                        {
                            experimentresultsrrrorhandle.data = dt;
                        }
                        else
                        {
                            experimentresultsrrrorhandle.Status = "FAIL";
                            experimentresultsrrrorhandle.Message = "The workbook has no worksheets.";

                        }
                        
                    }
                }
            }
            catch (Exception e)
            {
                experimentresultsrrrorhandle.Status = "FAIL";
                experimentresultsrrrorhandle.Message = e.Message;

            }

            return experimentresultsrrrorhandle;
        }
        public ExperimentResultsErrorHandle ConvertCSVtoDataTable(ExperimentResultsErrorHandle experimentresultsrrrorhandle)
        {
            try
            {
                string strFilePath = experimentresultsrrrorhandle.excelFilePath;
                StreamReader sr = new StreamReader(strFilePath);
                string[] headers = sr.ReadLine().Split(',');
                DataTable dt = new DataTable();
                foreach (string header in headers)
                {
                    dt.Columns.Add(header);
                }

                while (!sr.EndOfStream)
                {
                    string[] rows = Regex.Split(sr.ReadLine(), ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
                    DataRow dr = dt.NewRow();
                    for (int i = 0; i < headers.Length; i++)
                    {
                        dr[i] = rows[i];
                    }

                    dt.Rows.Add(dr);
                }

                experimentresultsrrrorhandle.data = dt;
            }
            catch (Exception e)
            {
                experimentresultsrrrorhandle.Status = "FAIL";
                experimentresultsrrrorhandle.Message = e.Message;

            }

            return experimentresultsrrrorhandle;
        }

        public ExperimentResultsErrorHandle ReadExcel(string excelFilePath, string? workSheetName = null)
        {
            ExperimentResultsErrorHandle experimentresultsrrrorhandle = new ExperimentResultsErrorHandle();
            try
            {
                experimentresultsrrrorhandle.excelFilePath = excelFilePath;
                DataSet dsWorkbook = new DataSet();
                //XDocument doc = XDocument.Load(excelFilePath);
                //XmlDocument xdoc = new XmlDocument();
                //xdoc.Load(excelFilePath);
                //xdoc.Save(Console.Out);

                //XmlDocument doc = new XmlDocument();
                //doc.Load(excelFilePath);
                //XmlNodeReader reader = new XmlNodeReader(doc);
                //DataSet ds = new DataSet();
                //ds.ReadXml(reader);
                //reader.Close();

            

                string connectionString = string.Empty;
                switch (Path.GetExtension(excelFilePath).ToUpperInvariant())
                {
                    case ".XLS":
                        ConvertExceltoDataTable(experimentresultsrrrorhandle);
                        break;

                    case ".XLSX":
                        ConvertExceltoDataTable(experimentresultsrrrorhandle);
                        //connectionString =
                        //    string.Format(
                        //        "Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0}; Extended Properties=Excel 12.0;",
                        //        excelFilePath);
                        break;
                    case ".CSV":
                        ConvertCSVtoDataTable(experimentresultsrrrorhandle);
                        break;
                    case ".XML":
                        dsWorkbook.ReadXml(excelFilePath);
                        experimentresultsrrrorhandle.data = dsWorkbook.Tables[0];
                        break;
                }

                //if (!String.IsNullOrEmpty(connectionString))
                //{
                //    if (workSheetName == null)
                //    {
                //        experimentresultsrrrorhandle = GetSheetName(experimentresultsrrrorhandle);
                //        workSheetName = experimentresultsrrrorhandle.Sheetname;
                //    }

                //    if (experimentresultsrrrorhandle.Status != "FAIL")
                //    {
                //        string selectStatement = string.Format("SELECT * FROM [{0}]", workSheetName);

                //        using (OleDbDataAdapter adapter = new OleDbDataAdapter(selectStatement, connectionString))
                //        {
                //            adapter.Fill(dsWorkbook, workSheetName);
                //        }

                //        DataTable dt = dsWorkbook.Tables[0];
                //        experimentresultsrrrorhandle.data = dt;
                //    }
                //}
            }
            catch (Exception e)
            {
                experimentresultsrrrorhandle.Status = "FAIL";
                experimentresultsrrrorhandle.Message = e.Message;

            }

            return experimentresultsrrrorhandle;

        }

        public ExperimentResultsErrorHandle GetSheetName(ExperimentResultsErrorHandle experimentresultsrrrorhandle)
        {
            string excelFilePath = experimentresultsrrrorhandle.excelFilePath;
            try
            {
                string connectionString = string.Empty;

                switch (Path.GetExtension(excelFilePath).ToUpperInvariant())
                {
                    case ".XLS":
                        connectionString =
                            string.Format(
                                "Provider=Microsoft.Jet.OLEDB.4.0; Data Source={0}; Extended Properties=Excel 8.0;",
                                excelFilePath);
                        break;

                    case ".XLSX":
                        connectionString =
                            string.Format(
                                "Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0}; Extended Properties=Excel 12.0;",
                                excelFilePath);
                        break;

                    case ".CSV":
                        connectionString =
                            string.Format(
                                "Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0}; Extended Properties=Excel 12.0;",
                                excelFilePath);
                        break;
                    case ".XML":
                        connectionString =
                            string.Format(
                                "Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0}; Extended Properties=Excel 12.0;",
                                excelFilePath);
                        break;

                        //case ".CSV":
                        //do csv function
                }

                OleDbConnection connection = new OleDbConnection(connectionString);
                connection.Open();
                DataTable tables = connection.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                if (tables.Rows.Count > 0)
                {
                    DataRow table = tables.Rows[0];
                    string name = table["TABLE_NAME"].ToString();
                    Console.WriteLine("Sheet 1 is: {0}", name);
                    experimentresultsrrrorhandle.Sheetname = name;
                }
                else
                {
                    experimentresultsrrrorhandle.Status = "FAIL";
                    experimentresultsrrrorhandle.Message = "The workbook has no worksheets.";

                }

                connection.Close();
            }
            catch (Exception ex)
            {
                experimentresultsrrrorhandle.Status = "FAIL";
                experimentresultsrrrorhandle.Message = ex.Message;
            }

            return experimentresultsrrrorhandle;
        }
        public async Task<IActionResult> UpdateUserTableSettings(string id, tableSettingUpdate setting)
        {
            var data = await new _5groutesBussiness().UpdateUserTableSettings(id, setting);

            return Ok(data);
        }
        [HttpPost]
        public async Task<IActionResult> UploadTestResultFile(long testResultId)
        {
            string? status = null;
            string fileName = string.Empty;
            try
            {
                string folderName = "Test-Result-Upload";
                string webRootPath = _hostingEnvironment.WebRootPath;
                string fullPath = Path.Combine(webRootPath, folderName);

                if (!Directory.Exists(fullPath))
                {
                    Directory.CreateDirectory(fullPath);
                }
                foreach (IFormFile file in Request.Form.Files)
                {
                    //Make the filename to be a guid
                    fileName = Guid.NewGuid().ToString();
                    string extension = Path.GetExtension(file.FileName).Replace(".", "");
                    if (extension == "xlsx" || extension == "Xlsx" || extension == "XLSX" || extension == "csv" ||
                        extension == "Csv" || extension == "CSV"|| extension=="xml"||extension=="XML"||extension=="xml")
                    {
                        fullPath = Path.Combine(fullPath, fileName + "." + extension);
                        using (Stream fileStream = new FileStream(fullPath, FileMode.Create))
                        {
                            await file.CopyToAsync(fileStream);
                        }

                        status = "SUCCESS";
                    }
                    else
                        status = "Invalid file type. Please select a valid excel (xlsx/csv) file";

                }
            }
            catch (Exception ex)
            {
                status = "FAIL | " + ex.Message;
            }

            return Json(new
            {
                fileId = fileName,
                status = status
            });
        }
       /// <summary>
       /// 
       /// </summary>   
       /// <param name="ExperimentResultsName"></param>
       /// <param name="excelfile"></param>
       /// <param name="testId"></param>
       /// <param name="fileUID"></param>
       /// <returns></returns>
        public IActionResult AddExperimentResults(string ExperimentResultsName, string excelfile, long testId, string fileUID)
        {
            CustomResponseModel resp = new CustomResponseModel();
            ExperimentResultsErrorHandle experimentresultsrrrorhandle = new ExperimentResultsErrorHandle();
            try
            {
                string folderName = "Test-Result-Upload";
                string webRootPath = _hostingEnvironment.WebRootPath;
                string folderPath = Path.Combine(webRootPath, folderName);
                //string excel_fullpath = folderPath + excelfile;

                var ext = excelfile.Split('.').Last();

                string excel_fullpath = Path.Combine(folderPath, fileUID + "." + ext);

                experimentresultsrrrorhandle.excelFilePath = excel_fullpath;
                experimentresultsrrrorhandle = ReadExcel(excel_fullpath);

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                if (experimentresultsrrrorhandle.Status != "FAIL")
                {
                    DataTable? dt = experimentresultsrrrorhandle.data;
                    string data;
                    data = JsonConvert.SerializeObject(dt);
                    if (data != "[]")
                    {
                        var fileId = Guid.Parse(fileUID);
                        _5groutesBussiness bussines = new _5groutesBussiness();
                        resp = bussines.AddExperimentResults(ExperimentResultsName, excelfile, testId, data , fileId);
                        experimentresultsrrrorhandle.NewExperimentResultsId =
                            JsonConvert.DeserializeObject<long>(resp.Result);
                    }
                    else
                    {
                        experimentresultsrrrorhandle.Status = "FAIL";
                        experimentresultsrrrorhandle.Message = "Invalid excel file";
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message, "5groutes/DeleteScenario");
                experimentresultsrrrorhandle.Status = "FAIL";
                experimentresultsrrrorhandle.Message = ex.Message;
            }

            experimentresultsrrrorhandle.data = null;
            return Json(experimentresultsrrrorhandle);
        }

        public IActionResult DeleteUploadedTestResultFile(long testResultId)
        {
            string status;
            try
            {
                string folderName = "Test-Result-Upload";
                string webRootPath = _hostingEnvironment.WebRootPath;
                string path = Path.Combine(webRootPath, folderName);
                //String path = Directory.GetCurrentDirectory() + "\\wwwroot\\eu_projects\\5groutes\\UploadManagement\\";

                var testResult = JsonConvert.DeserializeObject<ExperimentResultsEvaluation>(new _5groutesBussiness()
                    .RetrieveSingleExperimentResultsEvaluation(testResultId).Result);

                if (Directory.Exists(path))
                {
                    System.IO.DirectoryInfo di = new DirectoryInfo(path);
                    foreach (FileInfo file in di.GetFiles())
                    {
                        if (file.Name.ToLower().Equals(testResult.UniqueResultId.ToString().ToLower()))
                        {
                            try
                            {
                                file.Delete();
                            }
                            catch (Exception ex)
                            {
                                status = "FAIL | " + ex.Message;
                            }
                        }
                    }
                }

                status = "SUCCESS";
            }
            catch (Exception ex)
            {
                status = "FAIL | " + ex.Message;

            }

            return Json(status);
        }

        public IActionResult StopTestScenario(long testId,string testScenarioId, int domainId,string clientId, string reqTpye)
        {
            // read domain based on id
            var domain = new _5groutesBussiness().RetrieveDomain(domainId);

          var data =  _5groutesMQTTClient.StopMqttTest(domain, testId.ToString(), testScenarioId, clientId, reqTpye);
            var TestScenario = new _5groutesBussiness().StopTestScenario(testId);
            return Json(data);
            // return Json(new _5groutesBussiness().StopTestScenario(testId));
        }
        //public IActionResult StopRunningTestScenario(long testId)
        //{
        //    return //Json(new _5groutesBussiness().StopTestScenario(testId));
        //}

        public IActionResult ValidatePiCode(long useCaseId, string piCode, long? piid)
        {
            var isValid = IsPiCodeValid(useCaseId, piCode, piid);
            return Json(isValid);
        }
        public IActionResult ValidateUseCaseCode(string code, long? useCaseId)
        {
            var isValid = IsUseCodeValid(code, useCaseId);
            return Json(isValid);
        }

        private bool IsUseCodeValid(string code, long? useCaseId)
        {
            var res = new _5groutesBussiness().RetrieveUseCaseCodes(useCaseId.GetValueOrDefault());
            bool isValid;

            if (res is null)
            {
                isValid = true;
                return isValid;
            }

            var ucCodes = JsonConvert.DeserializeObject<IEnumerable<string>>(res.Result);
            isValid = (ucCodes.Count(c => c.Trim().ToLower().Equals(code.ToLower())) == 0);

            return isValid;
        }

        private bool IsPiCodeValid(long useCaseId, string piCode, long? piid)
        {
            var result = new _5groutesBussiness().RetrievePIsCodes(useCaseId, piid.GetValueOrDefault()).Result;
            bool isValid;

            if (result is null)
            {
                isValid = true;
                return isValid;
            }

            var uniqueCodes =
                JsonConvert.DeserializeObject<IEnumerable<string>>(result);
            isValid = (uniqueCodes.Where(c => c is not null).Count(c => c.ToLower().Equals(piCode.ToLower())) == 0);
            return isValid;
        }

        private decimal GetMeasurementPercentage(long testId, long kpiSubTypeId)
        {
            var res = JsonConvert.DeserializeObject<List<DetailedScenarioMeasurementValue>>(new _5groutesBussiness()
                .RetrieveAllTestMeasurementValuesPerTest(testId).Result);

            var groupedValues = res
                .Where(t => t.KpiSubTypeId == kpiSubTypeId)
                .GroupBy(i => i.KpiSubTypeId)
                .Select(g => GetGroupedMeasurementValue(g));

            var value = groupedValues.FirstOrDefault();

            return (value is null) ? 0 : value.PercentageValue;
        }

        private List<Object> GetStatusPIsWithEvaluation(long useCaseId, long kpiTypeId, TestScenario test)
        {
            var groutesBussiness = new _5groutesBussiness();
            var result = groutesBussiness.RetrieveKPIThresholdPerUseCase(useCaseId);
            var kpi_thresholds = JsonConvert.DeserializeObject<IEnumerable<KPIs>>(result.Result);
            var objectResults = new List<Object>();

            foreach (var threshold in kpi_thresholds.Where(k => k.KPISubTypeId == kpiTypeId))
            {
                var piEvaluated = JsonConvert.DeserializeObject<ScenarioMeasurementValue>(groutesBussiness
                    .RetrieveLastestTestScenarioMeasureValue(test.TestScenarioId, threshold.MeasurementId).Result);

                if (piEvaluated is null) piEvaluated = new ScenarioMeasurementValue();

                objectResults.Add(new
                {
                    description = threshold.ShortDescription,
                    code = threshold.PICode,
                    value = piEvaluated.MeasurementValue,
                    evaluation = piEvaluated.SatisfactoryLevelType.ToString()
                });
            }

            return objectResults;
        }

        private Users GetCurrentUser()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity != null)
            {
                var userClaims = identity.Claims;
                return new Users
                {
                    Fullname = userClaims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value,
                    userId = long.Parse(userClaims.FirstOrDefault(c => c.Type == ClaimTypes.Sid)?.Value),
                    LeaderName = userClaims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value,
                    Username = userClaims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value,
                    ProjectId = long.Parse(userClaims.FirstOrDefault(c => c.Type == ClaimTypes.System)?.Value)
                };
            }

            return null;
        }

        private IEnumerable<UseCaseCategory> RetrieveUseCaseCategories()
        {
            var res = new _5groutesBussiness().RetrieveUseCaseCategories();
            return JsonConvert.DeserializeObject<IEnumerable<UseCaseCategory>>(res.Result);
        }

        private IEnumerable<Leader> Retrieve5GroutesLeaders()
        {
            return JsonConvert.DeserializeObject<IEnumerable<Leader>>(new _5groutesBussiness()
                .Retrieve5GRoutesLeaders().Result);
        }

        public IActionResult GetTestResultFile(long testResultId)
        {
            string folderName = "Test-Result-Upload";
            string webRootPath = _hostingEnvironment.WebRootPath;
            string fulpath = Path.Combine(webRootPath, folderName);
            var baseURL = Request.Host;
            var protocol = (Request.IsHttps) ? "https://" : "http://";
            try
            {
                var testResult = JsonConvert.DeserializeObject<ExperimentResultsEvaluation>(new _5groutesBussiness()
                    .RetrieveSingleExperimentResultsEvaluation(testResultId).Result);

                var downloadLink = protocol + baseURL.ToUriComponent() + "/" + folderName + "/" +
                                   testResult.UniqueResultId.ToString() + "." +
                                   testResult.ExcelFileName.Split('.').Last();
                return Json(new
                {
                    Status = "Success",
                    url = downloadLink
                });
            }
            catch (Exception e)
            {
                return Json(new
                {
                    Status = "Failed",
                    url = ""
                });
            }
        }

        /*API DEFINITIONS*/

        #region API DEFINITIONS

        #region Authentication

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
                    MakePreviousUserTokensInvalid(_user.userId);

                    var newTokenObj = GenerateUserApiToken(_user.userId, null);
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


        #endregion
        

        #region UseCases Bloc

        [HttpPost]
        [Route("[controller]/usecases/create")]
        [Authorize(Roles = nameof(UserRoles.ADSF))]
        public IActionResult CreateUseCases([FromBody] Object useCase)
        {
            try
            {
                var useCaseInfos = JsonConvert.DeserializeObject<UseCaseJobject>(useCase.ToString());
                var allCategories = RetrieveUseCaseCategories();
                var useCaseCategory = allCategories
                    .FirstOrDefault(c => c.CategoryCode.ToLower().Equals(useCaseInfos.category.ToLower()));

                if (useCaseCategory is null)
                {
                    return BadRequest(new
                    {
                        ErrorMessage = "Insertion Failed! Please enter one of valid categories",
                        ValidCategories = allCategories.Select(c => c.CategoryCode)
                    });
                }
                else
                {
                    if (IsUseCodeValid(useCaseInfos.code, null) == false)
                    {
                        return BadRequest(new
                        { ErrorMessage = "Use Case Code already in use. Please provide another one" });
                    }

                    useCaseInfos.leader = (useCaseInfos.leader is null || useCaseInfos.leader == string.Empty)
                        ? nameof(UserRoles.ADSF)
                        : useCaseInfos.leader;

                    var leaders = Retrieve5GroutesLeaders();
                    var leaderId =
                        leaders.First(l => l.LeaderName.Trim().ToUpper().Equals(useCaseInfos.leader.ToUpper()))
                            .LeaderId;

                    var res = new _5groutesBussiness().InsertUseCase(useCaseInfos.code, useCaseInfos.description,
                        useCaseCategory.CategoryId, leaderId, useCaseInfos.responsible, useCaseInfos.contact);
                    var newUseCaseId = long.Parse(res.Result);
                    return Ok(new { id = newUseCaseId });
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpGet]
        [Authorize]
        public IActionResult UseCases()
        {
            var user = GetCurrentUser();
            var res = new _5groutesBussiness().RetrieveUseCases(user.userId, user.Username);
            var useCases = JsonConvert.DeserializeObject<List<UseCases>>(res.Result);
            var formattedUseCases = new List<Object>();

            foreach (var u in useCases)
            {
                var useCase = new
                {
                    use_case_id = u.UseCaseId,
                    code = u.UCID.Trim(),
                    category = u.CategoryName,
                    contact = u.ContactPerson,
                    description = u.UseCaseName,
                    responsible = u.ResponsiblePerson,
                    updated_date = u.LastUpdated
                };

                formattedUseCases.Add(useCase);
            }

            return Ok(formattedUseCases);
        }

        [HttpPut]
        [Route("[controller]/usecases/update/{id:long}")]
        [Authorize]
        public IActionResult UpdateUseCase(long id, [FromBody] Object useCase)
        {
            try
            {
                var useCaseInfos = JsonConvert.DeserializeObject<UseCaseJobject>(useCase.ToString());
                var allCategories = RetrieveUseCaseCategories();
                var useCaseCategory = allCategories
                    .FirstOrDefault(c => c.CategoryCode.ToLower().Equals(useCaseInfos.category.ToLower()));

                if (useCaseCategory is null)
                {
                    return BadRequest(new
                    {
                        ErrorMessage = "Edition Failed! Please enter one of valid categories",
                        ValidCategories = allCategories.Select(c => c.CategoryCode)
                    });
                }
                else
                {
                    if (IsUseCodeValid(useCaseInfos.code, id) == false)
                    {
                        return BadRequest(new
                        { ErrorMessage = "Use Case Code already in use. Please provide another one" });
                    }
                    useCaseInfos.leader = (useCaseInfos.leader is null || useCaseInfos.leader == string.Empty)
                        ? nameof(UserRoles.ADSF)
                        : useCaseInfos.leader;

                    var leaders = Retrieve5GroutesLeaders();
                    var leaderId =
                        leaders.First(l => l.LeaderName.Trim().ToUpper().Equals(useCaseInfos.leader.ToUpper()))
                            .LeaderId;

                    var res = new _5groutesBussiness().EditUseCaseNew(id, useCaseInfos.code, useCaseInfos.description,
                        useCaseCategory.CategoryId, leaderId, useCaseInfos.responsible, useCaseInfos.contact);
                    return Ok(new { id = long.Parse(res.Result) });
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpDelete]
        [Route("[controller]/usecases/delete/{id:long}")]
        [Authorize(Roles = nameof(UserRoles.ADSF))]
        public IActionResult DeleteUseCase(long id)
        {
            try
            {
                var res = new _5groutesBussiness().DeleteUseCase(id);
                return Ok();
            }
            catch (Exception e)
            {

                return StatusCode(500, e.Message);
            }
        }


        #endregion


        #region Status PIs Bloc

        [HttpPost]
        [Route("[controller]/usecases/{useCaseId:long}/status_pi/create")]
        [Authorize]
        public IActionResult CreateStatusPi(long useCaseId, [FromBody] Object pi)
        {
            try
            {
                var currentUser = GetCurrentUser();
                var piInfos = JsonConvert.DeserializeObject<PiJobject>(pi.ToString());
                var operators =
                    JsonConvert.DeserializeObject<IEnumerable<Operators>>(new _5groutesBussiness().RetrieveOperators()
                        .Result);
                var kpiTypes =
                    JsonConvert.DeserializeObject<IEnumerable<KpiType>>(new _5groutesBussiness()
                        .RetrieveKPITypes().Result);

                var subTypes = JsonConvert.DeserializeObject<IEnumerable<CompositeKpiType>>(new _5groutesBussiness()
                    .RetrieveCompositeKPIsPerProject(currentUser.ProjectId).Result);


                var units = JsonConvert.DeserializeObject<List<Units>>(new _5groutesBussiness()
                    .RetrieveUnits().Result);
                var kpiSubType = new CompositeKpiType();

                var chosenUnit = units.First(u => u.Name is not null && u.Name.Trim().ToLower().Equals(piInfos.unit.Trim().ToLower()));

                if (piInfos.composite_kpi is null)
                {
                    return BadRequest("composite_kpi parameter cannot be null");
                }
                else
                {
                    kpiSubType = subTypes.FirstOrDefault(t =>
                        t.KpiSubTypeCode.ToLower().Equals(piInfos.composite_kpi.ToLower()));

                    if (kpiSubType is null)
                    {
                        return BadRequest(new
                        {
                            ErrorMessage = "Insertion Failed! Please enter one of valid composite Kpi name",
                            ValidCompositeKpis = subTypes.Select(k => k.KpiSubTypeCode)
                        });
                    }

                    if (piInfos.code is null || piInfos.code == string.Empty)
                    {
                        return BadRequest(
                            new
                            {
                                ErrorMessage = "Insertion Failed! code parameter cannot be null"
                            });
                    }
                }

                if (piInfos.red_threshold_operator is not null && piInfos.green_threshold_operator is not null)
                {
                    var lowOperator = operators.Where(o => o.Name is not null).FirstOrDefault(o =>
                        o.Name.Trim().ToLower().Equals(piInfos.red_threshold_operator.ToLower()));

                    var highOperator = operators.Where(o => o.Name is not null).FirstOrDefault(o =>
                        o.Name.Trim().ToLower().Equals(piInfos.green_threshold_operator.ToLower()));

                    if (lowOperator is null || highOperator is null)
                    {
                        return BadRequest(new
                        {
                            ErrorMessage = "Insertion Failed! Please enter one of valid operators",
                            ValidOperators = operators.Select(o => o.Name.Trim())
                        });
                    }
                    else
                    {
                        if (IsPiCodeValid(useCaseId, piInfos.code, null) == false)
                        {
                            return BadRequest(
                                "Invalid PI Code! The code provided is already used by another status PI");
                        }

                        var res = new _5groutesBussiness().AddKPI(useCaseId, kpiTypes.First().KpiTypeId, piInfos.code,
                            kpiSubType.KpiSubTypeID, piInfos.name, piInfos.green_threshold.ToString(),
                            highOperator.OperatorId,
                            piInfos.red_threshold.ToString(), lowOperator.OperatorId, chosenUnit.UnitId);
                        return Ok(new { id = long.Parse(res.Result) });
                    }
                }
                else
                {
                    return BadRequest("operators parameters cannot be null");
                }

            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpPut]
        [Route("[controller]/usecases/{useCaseId:long}/status_pi/update/{status_pi_id:long}")]
        [Authorize]
        public IActionResult EditStatusPi(long useCaseId, long status_pi_id, [FromBody] Object pi)
        {
            try
            {
                var currentUser = GetCurrentUser();
                var piInfos = JsonConvert.DeserializeObject<PiJobject>(pi.ToString());
                var operators =
                    JsonConvert.DeserializeObject<IEnumerable<Operators>>(new _5groutesBussiness().RetrieveOperators()
                        .Result);
                var kpiTypes =
                    JsonConvert.DeserializeObject<IEnumerable<KpiType>>(new _5groutesBussiness()
                        .RetrieveKPITypes().Result);

                var subTypes = JsonConvert.DeserializeObject<IEnumerable<CompositeKpiType>>(new _5groutesBussiness()
                    .RetrieveCompositeKPIsPerProject(currentUser.ProjectId).Result);


                var units = JsonConvert.DeserializeObject<List<Units>>(new _5groutesBussiness()
                    .RetrieveUnits().Result);
                var kpiSubType = new CompositeKpiType();

                var chosenUnit = units.First(u => u.Name is not null && u.Name.Trim().ToLower().Equals(piInfos.unit.Trim().ToLower()));

                if (piInfos.composite_kpi is null)
                {
                    return BadRequest("composite_kpi parameter cannot be null");
                }
                else
                {
                    kpiSubType = subTypes.FirstOrDefault(t =>
                        t.KpiSubTypeCode.ToLower().Equals(piInfos.composite_kpi.ToLower()));

                    if (kpiSubType is null)
                    {
                        return BadRequest(new
                        {
                            ErrorMessage = "Insertion Failed! Please enter one of valid composite Kpi name",
                            ValidCompositeKpis = subTypes.Select(k => k.KpiSubTypeCode)
                        });
                    }

                    if (piInfos.code is null || piInfos.code == string.Empty)
                    {
                        return BadRequest(
                        new
                        {
                            ErrorMessage = "Insertion Failed! code parameter cannot be null"
                        });
                    }
                }

                if (piInfos.red_threshold_operator is not null && piInfos.green_threshold_operator is not null)
                {
                    var lowOperator = operators.Where(o => o.Name is not null).FirstOrDefault(o =>
                        o.Name.Trim().ToLower().Equals(piInfos.red_threshold_operator.ToLower()));

                    var highOperator = operators.Where(o => o.Name is not null).FirstOrDefault(o =>
                        o.Name.Trim().ToLower().Equals(piInfos.green_threshold_operator.ToLower()));



                    if (lowOperator is null || highOperator is null)
                    {
                        return BadRequest(new
                        {
                            ErrorMessage = "Edition Failed! Please enter one of valid operators",
                            ValidOperators = operators.Select(o => o.Name.Trim())
                        });
                    }
                    else
                    {
                        if (IsPiCodeValid(useCaseId, piInfos.code, status_pi_id) == false)
                        {
                            return BadRequest(
                                "Invalid PI Code! The code provided is already used by another status PI");
                        }

                        var res = new _5groutesBussiness().EditKPI(status_pi_id, kpiTypes.First().KpiTypeId, piInfos.code,
                            kpiSubType.KpiSubTypeID, piInfos.name, piInfos.green_threshold.ToString(),
                            highOperator.OperatorId,
                            piInfos.red_threshold.ToString(), lowOperator.OperatorId, chosenUnit.UnitId);
                        return Ok(new { id = status_pi_id });
                    }
                }
                else
                {
                    return BadRequest("operators parameters cannot be null");
                }

            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpGet]
        [Route("[controller]/usecases/{useCaseId:long}/status_pi")]
        [Authorize]
        public IActionResult GetStatusPis(long useCaseId, string? composite_kpi)
        {
            try
            {
                var projectBussinessLayer = new _5groutesBussiness();
                var currentUser = GetCurrentUser();
                var result = projectBussinessLayer
                    .RetrieveCompositeKPIsPerProject(currentUser.ProjectId).Result;

                var compositeKpiTypes = new List<CompositeKpiType>();
                if (result != null)
                {
                    compositeKpiTypes = JsonConvert.DeserializeObject<List<CompositeKpiType>>(result);
                }

                if (composite_kpi is null || composite_kpi.Equals(string.Empty) ||
                    !compositeKpiTypes.Any(c => c.KpiSubTypeCode.ToLower().Equals(composite_kpi.ToLower())))
                {
                    //Invalid or no parameter provided
                    var res = projectBussinessLayer.RetrieveKPIThresholdPerUseCase(useCaseId);
                    var kpi_threshold_values = JsonConvert.DeserializeObject<IEnumerable<KPIs>>(res.Result);
                    var objectResults = new List<Object>();

                    foreach (var v in kpi_threshold_values)
                    {
                        var obj = new
                        {
                            status_pi_id = v.PIId,
                            composite_kpi = v.KPISubType,
                            name = v.ShortDescription,
                            code = v.PICode,
                            unit = v.Unit,
                            red_threshold = v.LowValue,
                            green_threshold = v.HighValue,
                            red_threshold_operator = v.LowOperator.Trim(),
                            green_threshold_operator = v.HighOperator.Trim()
                        };

                        objectResults.Add(obj);
                    }

                    return Ok(objectResults);
                }
                else
                {
                    var compositeKpi =
                        compositeKpiTypes.First(c => c.KpiSubTypeCode.ToLower().Equals(composite_kpi.ToLower()));

                    var res = projectBussinessLayer.RetrieveKPIThresholdPerUseCase(useCaseId);
                    var kpi_threshold_values = JsonConvert.DeserializeObject<IEnumerable<KPIs>>(res.Result)
                        .Where(k => k.KPISubTypeId == compositeKpi.KpiSubTypeID);

                    var objectResults = new List<Object>();

                    foreach (var v in kpi_threshold_values)
                    {
                        var obj = new
                        {
                            composite_kpi = v.KPISubType,
                            name = v.ShortDescription,
                            code = v.PICode,
                            unit = v.Unit,
                            red_threshold = v.LowValue,
                            green_threshold = v.HighValue,
                            red_threshold_operator = v.LowOperator.Trim(),
                            green_threshold_operator = v.HighOperator.Trim()
                        };

                        objectResults.Add(obj);
                    }

                    return Ok(objectResults);
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpDelete]
        [Route("[controller]/usecases/{useCaseId:long}/status_pi/delete/{status_pi_id:long}")]
        [Authorize]
        public IActionResult DeleteStatusPi(long useCaseId, long status_pi_id)
        {
            try
            {
                new _5groutesBussiness().DeleteKPI(status_pi_id);
                return Ok();
            }
            catch (Exception e)
            {

                return StatusCode(500, e.Message);
            }
        }


        #endregion
        

        #region Scenarios Bloc

        [HttpPost]
        [Route("[controller]/usecases/{useCaseId:long}/scenario/create")]
        [Authorize]
        public IActionResult CreateTestScenario(long useCaseId, [FromBody] Object scenario)
        {
            var providedScenario = JsonConvert.DeserializeObject<ScenarioJobject>(scenario.ToString());

            if (providedScenario.description is null || providedScenario.description.Equals(string.Empty))
            {
                return BadRequest("Test Scenario name or description cannot be null");
            }

            if (providedScenario.type.ToLower().Equals(nameof(ScenarioTypes.FIELD).ToLower()))
            {
                providedScenario.type = "Field Trial";
            }
            else if (providedScenario.type.ToLower().Equals(nameof(ScenarioTypes.LAB).ToLower()))
            {
                providedScenario.type = "Lab Trial";
            }
            else
            {
                return BadRequest("Invalid Test Scenario Type");
            }

            try
            {
                var res = new _5groutesBussiness().AddNewScenario(useCaseId, providedScenario.description,
                    providedScenario.type);
                return Ok(new { id = long.Parse(res.Result) });
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }


        [HttpPut]
        [Route("[controller]/usecases/{useCaseId:long}/scenario/{testScenarioId:long}/update")]
        [Authorize]
        public IActionResult UpdateTestScenario(long useCaseId, long testScenarioId, [FromBody] Object scenario)
        {
            var providedScenario = JsonConvert.DeserializeObject<ScenarioJobject>(scenario.ToString());

            if (providedScenario.description is null || providedScenario.description.Equals(string.Empty))
            {
                return BadRequest("Test Scenario name or description cannot be null");
            }

            if (providedScenario.type.ToLower().Equals(nameof(ScenarioTypes.FIELD).ToLower()))
            {
                providedScenario.type = "Field Trial";
            }
            else if (providedScenario.type.ToLower().Equals(nameof(ScenarioTypes.LAB).ToLower()))
            {
                providedScenario.type = "Lab Trial";
            }
            else
            {
                return BadRequest("Invalid Test Scenario Type");
            }

            try
            {
                var res = new _5groutesBussiness().EditScenario(testScenarioId, providedScenario.description,
                    providedScenario.type);
                return Ok(new { id = testScenarioId });
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }


        [HttpGet]
        [Route("[controller]/usecases/{useCaseId:long}/scenario")]
        [Authorize]
        public IActionResult GetTestScenarios(long useCaseId)
        {
            try
            {
                var scenarios =
                    JsonConvert.DeserializeObject<IEnumerable<UseCaseScenario>>(new _5groutesBussiness()
                        .RetrieveScenarioPerUseCase(useCaseId).Result);

                var objResults = new List<Object>();
                foreach (var s in scenarios)
                {
                    objResults.Add(new
                    {
                        id = s.UseCaseScenarioId,
                        description = s.UseCaseScenarioDescription,
                        type = s.UseCaseScenarioTrialType
                    });
                }

                return Ok(objResults);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpDelete]
        [Route("[controller]/usecases/{useCaseId:long}/scenario/{testScenarioId:long}/delete")]
        [Authorize]
        public IActionResult DeleteTestScenario(long useCaseId, long testScenarioId)
        {
            try
            {
                new _5groutesBussiness().DeleteScenario(testScenarioId);
                return Ok();
            }
            catch (Exception e)
            {

                return StatusCode(500, e.Message);
            }
        }


        #endregion
        

        #region Tests Bloc

        [HttpPost]
        [Route("[controller]/usecases/{useCaseId:long}/scenario/{scenarioId:long}/test/start")]
        [Authorize]
        public IActionResult StartTest(long useCaseId, long scenarioId)
        {
            try
            {
                var groutesBussiness = new _5groutesBussiness();
                var usecaseDetails =
                    JsonConvert.DeserializeObject<UseCases>(groutesBussiness.RetrieveUCGeneralInfo(useCaseId).Result);
                var scenarioDetails =
                    JsonConvert.DeserializeObject<UseCaseScenario>(groutesBussiness
                        .RetrieveScenarioPerId(scenarioId).Result);
                var type = string.Empty;

                if (scenarioDetails.UseCaseScenarioTrialType.ToLower().Equals("Field Trial".ToLower()))
                {
                    type = "FT";
                }
                else if (scenarioDetails.UseCaseScenarioTrialType.ToLower().Equals("Lab Trial".ToLower()))
                {
                    type = "LT";
                }

                var testname = "UC" + usecaseDetails.UCID.Trim() + "SC" + scenarioId + type + "_T";
                var res = StartTestScenario(scenarioId, testname, "", 0,"","");

                var uniqueTestKeyName = JsonConvert.DeserializeObject<TestScenario>(res.Result).TestScenarioName;

                return Ok(new { test_unique_key = uniqueTestKeyName });
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpPost]
        [Route("[controller]/usecases/{useCaseId:long}/scenario/{scenarioId:long}/test/{test_unique_key}/stop")]
        [Authorize]
        public IActionResult StopTest(long useCaseId, long scenarioId, string test_unique_key)
        {
            try
            {
                var groutesBussiness = new _5groutesBussiness();
                var result = groutesBussiness.FindTestPerTestKey(test_unique_key)
                    .Result;
                var test = JsonConvert.DeserializeObject<TestScenario>(result);
                if (test is null)
                {
                    return BadRequest("Invalid test key! Enter a valid test key");
                }
                else
                {
                    var res = groutesBussiness.StopTestScenario(test.TestScenarioId);

                    return Ok(new { test_unique_key = test_unique_key });
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }

        }

        [HttpPut]
        [Route("[controller]/usecases/{useCaseId:long}/scenario/{scenarioId:long}/test/{test_unique_key}/update")]
        [Authorize]
        public IActionResult UpdateTest(long useCaseId, long scenarioId, string test_unique_key, [FromBody] Object obj)
        {
            try
            {
                var groutesBussiness = new _5groutesBussiness();
                var result = groutesBussiness.FindTestPerTestKey(test_unique_key)
                    .Result;
                var test = JsonConvert.DeserializeObject<TestScenario>(result);
                if (test is null)
                {
                    return BadRequest("Invalid test key! Enter a valid test key");
                }
                else
                {
                    var description = JsonConvert.DeserializeObject<Dictionary<string, string>>(obj.ToString()).First().Value;
                    var res = groutesBussiness.EditTestScenario(test.TestScenarioId, test_unique_key, description);

                    return Ok(new { testUniqueKey = test_unique_key });
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpDelete]
        [Route("[controller]/usecases/{useCaseId:long}/scenario/{scenarioId:long}/test/{test_unique_key}/delete")]
        [Authorize]
        public IActionResult DeleteTest(long useCaseId, long scenarioId, string test_unique_key)
        {
            try
            {
                var bussiness = new _5groutesBussiness();
                var test = JsonConvert.DeserializeObject<TestScenario>(bussiness.FindTestPerTestKey(test_unique_key).Result);
                bussiness.DeleteTestScenario(test.TestScenarioId);
                return Ok();
            }
            catch (Exception e)
            {

                return StatusCode(500, e.Message);
            }
        }

        [HttpGet]
        [Route("[controller]/usecases/{useCaseId:long}/scenario/{scenarioId:long}/test")]
        [Authorize]
        public IActionResult GetTests(long useCaseId, long scenarioId)
        {
            try
            {
                var res = new _5groutesBussiness().RetrieveTestScenariosPerScenario(scenarioId);
                var tests = JsonConvert.DeserializeObject<IEnumerable<TestScenario>>(res.Result);
                var objectResults = new List<Object>();

                foreach (var t in tests)
                {
                    objectResults.Add(new
                    {
                        test_unique_key = t.TestScenarioName,
                        description = t.TestScenarioDescription
                    });
                }

                return Ok(objectResults);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }


        #endregion


        #region Test Measurements Bloc

        [HttpPost]
        [Route("[controller]/usecases/{useCaseId:long}/scenario/{scenarioId:long}/test/{test_unique_key}")]
        [Authorize]
        public IActionResult SetTestMeasurement(long useCaseId, long scenarioId, string test_unique_key, [FromBody] Object obj)
        {
            var providedValues = JsonConvert.DeserializeObject<IEnumerable<TestMeasurementJobject>>(obj.ToString());
            if (providedValues.Any(v => v.status_pi_code is null || v.status_pi_code == String.Empty))
            {
                return BadRequest("status_pi_code cannot be null");
            }

            try
            {
                var groutesBussiness = new _5groutesBussiness();
                var res = groutesBussiness.RetrieveKPIThresholdPerUseCase(useCaseId);
                var kpi_thresholds = JsonConvert.DeserializeObject<IEnumerable<KPIs>>(res.Result);
                var test = JsonConvert.DeserializeObject<TestScenario>(groutesBussiness.FindTestPerTestKey(test_unique_key).Result);

                if (test is null)
                {
                    return BadRequest("Invalid test key! Enter a valid test key");
                }

                var i = 0;

                foreach (var v in providedValues)
                {
                    var compositePiCodeDetails =
                        kpi_thresholds.FirstOrDefault(k => k.PICode.ToLower().Equals(v.status_pi_code.ToLower()));

                    if (compositePiCodeDetails is not null)
                    {
                        var measuementValueObj = this.GetScenarioMeasurementValue(test.TestScenarioId, compositePiCodeDetails.MeasurementId,
                            v.value);
                        groutesBussiness.AddTestScenarioMeasureValue(measuementValueObj);
                        i++;

                    }
                }

                if (i == providedValues.Count())
                {
                    return Ok(providedValues);
                }
                else
                {
                    return BadRequest("composite_kpi_code not found! Consider configuring your status pis before");
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpGet]
        [Route("[controller]/usecases/{useCaseId:long}/scenario/{scenarioId:long}/test/{test_unique_key}")]
        [Authorize]
        public IActionResult ListTestEvaluations(long useCaseId, long scenarioId, string test_unique_key)
        {
            try
            {
                var projectBussinessLayer = new _5groutesBussiness();
                var currentUser = GetCurrentUser();
                var result = projectBussinessLayer
                    .RetrieveCompositeKPIsPerProject(currentUser.ProjectId).Result;

                var compositeKpiTypes = new List<CompositeKpiType>();
                if (result != null)
                {
                    compositeKpiTypes = JsonConvert.DeserializeObject<List<CompositeKpiType>>(result);
                }

                var testresult = projectBussinessLayer.FindTestPerTestKey(test_unique_key)
                    .Result;
                var test = JsonConvert.DeserializeObject<TestScenario>(testresult);
                if (test is null)
                {
                    return BadRequest("Invalid test key! Enter a valid test key");
                }

                var objectResults = new List<Object>();

                foreach (var t in compositeKpiTypes)
                {
                    var compositeKpiDetails = new
                    {
                        composite_kpi = t.KpiSubTypeCode.ToUpper(),
                        composite_kpi_value = GetMeasurementPercentage(test.TestScenarioId, t.KpiSubTypeID),
                        status_pi = GetStatusPIsWithEvaluation(useCaseId, t.KpiSubTypeID, test),
                    };


                    objectResults.Add(compositeKpiDetails);
                }

                return Ok(objectResults);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }

        }


        #endregion
        

        #region Test Attachments Bloc

        [HttpPost]
        [Route("[controller]/usecases/{useCaseId:long}/scenario/{scenarioId:long}/test/{test_unique_key}/upload/files")]
        [Authorize]
        public IActionResult UploadFileSignature(long useCaseId, long scenarioId, string test_unique_key)
        {
            try
            {
                var file = Request.Form.Files[0];

                var test = JsonConvert.DeserializeObject<TestScenario>(new _5groutesBussiness().FindTestPerTestKey(test_unique_key).Result);

                if (test is null)
                {
                    return BadRequest("Invalid test key! Enter a valid test key");
                }

                var fileRecord = UploadTestFile(test.TestScenarioId, file);

                SaveTestAttachmentUpload(fileRecord);

                return Ok(new { id = fileRecord.TestAttachmentFileUID });
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpGet]
        [Route("[controller]/usecases/{useCaseId:long}/scenario/{scenarioId:long}/test/{test_unique_key}/files")]
        [Authorize]
        public IActionResult GetTestAttachmentFiles(long useCaseId, long scenarioId, string test_unique_key)
        {
            try
            {
                //Fetch all files in the Folder (Directory).
                string rootUploadFilePath = Path.Combine(_hostingEnvironment.WebRootPath, "Upload");
                var test = JsonConvert.DeserializeObject<TestScenario>(new _5groutesBussiness().FindTestPerTestKey(test_unique_key).Result);

                if (test is null)
                {
                    return BadRequest("Invalid test key! Enter a valid test key");
                }

                var testFolderName = $"Test_{test.TestScenarioId}";
                var downloadFilePath = Path.Combine(rootUploadFilePath, testFolderName);

                if (Directory.Exists(downloadFilePath))
                {
                    var uploadFolderInfos = new DirectoryInfo(downloadFilePath);

                    FileInfo[] localfiles = uploadFolderInfos.GetFiles("*");

                    var uploadedFiles = new List<Object>();
                    var baseURL = Request.Host;
                    var protocol = (Request.IsHttps) ? "https://" : "http://";

                    foreach (var file in localfiles)
                    {
                        var fileName = file.Name.Split('.', StringSplitOptions.None).First();
                        var fileInfo = RetrieveTestAttachementPerFileId(Guid.Parse(fileName));

                        uploadedFiles.Add(new
                        {
                            id = fileInfo.TestAttachmentFileUID,
                            mime = file.Extension,
                            name = fileInfo.TestAttachmentFileName,
                            url = protocol + baseURL.ToUriComponent() + "/Upload/" + testFolderName + "/" + fileInfo.TestAttachmentFileUID + file.Extension
                        });
                    }

                    return Ok(new
                    {
                        content = uploadedFiles
                    });
                }
                else return Ok("No fies were found!");
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpDelete]
        [Route("[controller]/usecases/{useCaseId:long}/scenario/{scenarioId:long}/test/{test_unique_key}/files/delete/{fileId}")]
        [Authorize]
        public IActionResult DeleteTestAttachmentFile(long useCaseId, long scenarioId, string test_unique_key, string fileId)
        {
            try
            {
                var test = JsonConvert.DeserializeObject<TestScenario>(new _5groutesBussiness().FindTestPerTestKey(test_unique_key).Result);

                if (test is null)
                {
                    return BadRequest("Invalid test key! Enter a valid test key");
                }

                var fileUID = Guid.Parse(fileId);

                //Delete DB Record
                new _5groutesBussiness().DeleteTestAttachmentPerFileId(fileUID);

                //Delete File on the server
                string rootUploadFilePath = Path.Combine(_hostingEnvironment.WebRootPath, "Upload");

                var testFolderName = $"Test_{test.TestScenarioId}";
                var downloadFilePath = Path.Combine(rootUploadFilePath, testFolderName);


                if (Directory.Exists(downloadFilePath))
                {
                    var uploadFolderInfos = new DirectoryInfo(downloadFilePath);

                    FileInfo[] localfiles = uploadFolderInfos.GetFiles("*");

                    foreach (var file in localfiles)
                    {
                        var fileName = file.Name.Split('.', StringSplitOptions.None).First();
                        if (fileName.Equals(fileId))
                        {
                            file.Delete();
                        }
                    }

                    return Ok();
                }
                else
                {
                    return BadRequest("No Attachments found for this specific test");
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpGet]
        [Route("[controller]/usecases/{useCaseId:long}/scenario/{scenarioId:long}/test/{test_unique_key}/files/{fileId}")]
        [Authorize]
        public IActionResult DownloadFile(long useCaseId, long scenarioId, string test_unique_key, string fileId)
        {
            try
            {
                var test = JsonConvert.DeserializeObject<TestScenario>(new _5groutesBussiness()
                    .FindTestPerTestKey(test_unique_key).Result);

                if (test is null)
                {
                    return BadRequest("Invalid test key! Enter a valid test key");
                }

                string rootUploadFilePath = Path.Combine(_hostingEnvironment.WebRootPath, "Upload");
                var testFolderName = $"Test_{test.TestScenarioId}";
                var downloadFilePath = Path.Combine(rootUploadFilePath, testFolderName);

                if (Directory.Exists(downloadFilePath))
                {
                    var uploadFolderInfos = new DirectoryInfo(downloadFilePath);

                    FileInfo[] localfiles = uploadFolderInfos.GetFiles("*");

                    var baseURL = Request.Host;
                    var protocol = (Request.IsHttps) ? "https://" : "http://";

                    var rawfileInfos = localfiles.FirstOrDefault(f => f.Name.Equals(Guid.Parse(fileId) + f.Extension));
                    if (rawfileInfos is null)
                    {
                        return BadRequest("Attachment file not found!");
                    }
                    else
                    {
                        var originalFileInfos =
                            JsonConvert.DeserializeObject<TestAttachmentFile>(new _5groutesBussiness().RetrieveTestAttachementPerFileId(Guid.Parse(fileId)).Result);

                        return Ok(new
                        {
                            id = originalFileInfos.TestAttachmentFileUID,
                            mime = rawfileInfos.Extension,
                            name = originalFileInfos.TestAttachmentFileName,
                            url = protocol + baseURL.ToUriComponent() + "/Upload/" + testFolderName + "/" +
                                  originalFileInfos.TestAttachmentFileUID + rawfileInfos.Extension
                        });
                    }
                }
                else
                {
                    return BadRequest("The Test is empty (Without attachments)");
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }


        #endregion

        
        #region Test Results Bloc

        [HttpGet]
        [Route("[controller]/usecases/{useCaseId:long}/scenario/{scenarioId:long}/test/{test_unique_key}/test_result")]
        [Authorize]
        public IActionResult GetTestResults(long useCaseId, long scenarioId, string test_unique_key)
        {
            try
            {
                var test = JsonConvert.DeserializeObject<TestScenario>(new _5groutesBussiness().FindTestPerTestKey(test_unique_key).Result);

                if (test is null)
                {
                    return BadRequest("Invalid test key! Enter a valid test key");
                }

                var testResults = JsonConvert.DeserializeObject<IEnumerable<ExperimentResultsEvaluation>>(new _5groutesBussiness()
                    .RetrieveExperimentResultsEvaluationPerTestID(test.TestScenarioId).Result);

                var resultObjects = new List<Object>();
                var foldername = "Test-Result-Upload";
                var baseURL = Request.Host;
                var protocol = (Request.IsHttps) ? "https://" : "http://";

                foreach (var result in testResults)
                {
                    var ext = "." + result.ExcelFileName.Split('.').Last();
                    resultObjects.Add(new
                    {
                        test_result_name = result.Name,
                        id = result.ExperimentResultsEvaluationId,
                        mime = ext,
                        name = result.ExcelFileName,
                        url = protocol + baseURL.ToUriComponent() + "/" + foldername + "/" + result.UniqueResultId + ext
                    });
                }

                return Ok(resultObjects);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }


        [HttpPost]
        [Route("[controller]/usecases/{useCaseId:long}/scenario/{scenarioId:long}/test/{test_unique_key}/test_result/upload")]
        [Authorize]
        public IActionResult UploadTestResult(long useCaseId, long scenarioId, string test_unique_key, string test_result_name)
        {
            try
            {
                var file = Request.Form.Files[0];

                string folderName = "Test-Result-Upload";
                string webRootPath = _hostingEnvironment.WebRootPath;
                string defaultPath = Path.Combine(webRootPath, folderName);

                var uid = Guid.NewGuid();
                var newfilename = uid.ToString() + "." + file.FileName.Split('.').Last();
                string excel_fullpath = Path.Combine(defaultPath, newfilename);

                if (!Directory.Exists(defaultPath))
                {
                    Directory.CreateDirectory(defaultPath);
                }

                //Upload file first
                using (var stream = new FileStream(excel_fullpath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                //Record the test result with file in the DB

                var test = JsonConvert.DeserializeObject<TestScenario>(new _5groutesBussiness().FindTestPerTestKey(test_unique_key).Result);
                ExperimentResultsErrorHandle experimentresultsrrrorhandle = new ExperimentResultsErrorHandle();

                if (test is null)
                {
                    return BadRequest("Invalid test key! Enter a valid test key");
                }

                if (test_result_name is null || test_result_name.Equals(string.Empty))
                {
                    return BadRequest("Test result name cannot be empty");
                }

                experimentresultsrrrorhandle.excelFilePath = excel_fullpath;
                experimentresultsrrrorhandle = ReadExcel(excel_fullpath);

                if (!Directory.Exists(defaultPath))
                {
                    Directory.CreateDirectory(defaultPath);
                }

                if (experimentresultsrrrorhandle.Status != "FAIL")
                {
                    DataTable? dt = experimentresultsrrrorhandle.data;
                    string data;
                    data = JsonConvert.SerializeObject(dt);
                    if (data != "[]")
                    {
                        _5groutesBussiness bussines = new _5groutesBussiness();
                        var resp = bussines.AddExperimentResults(test_result_name, file.FileName, test.TestScenarioId, data, uid);
                        experimentresultsrrrorhandle.NewExperimentResultsId =
                            JsonConvert.DeserializeObject<long>(resp.Result);

                        return Ok(new { id = experimentresultsrrrorhandle.NewExperimentResultsId });
                    }
                    else
                    {
                        return BadRequest("Invalid Excel File!");
                    }
                }
                else
                {
                    return BadRequest(experimentresultsrrrorhandle.Message);
                }

            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpDelete]
        [Route("[controller]/usecases/{useCaseId:long}/scenario/{scenarioId:long}/test/{test_unique_key}/test_result/{test_result_id:long}/delete")]
        [Authorize]
        public IActionResult DeleteTestResult(long useCaseId, long scenarioId, string test_unique_key, long test_result_id)
        {
            try
            {
                var test = JsonConvert.DeserializeObject<TestScenario>(new _5groutesBussiness().FindTestPerTestKey(test_unique_key).Result);

                if (test is null)
                {
                    return BadRequest("Invalid test key! Enter a valid test key");
                }

                var result = new _5groutesBussiness().DeleteExperimentResults(test_result_id);
                return Ok();
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }


        #endregion
        
        #endregion

    }

    enum UserRoles
    {
        VTT = 1,
        EDI = 2,
        SWM = 3,
        TTU = 4,
        VED = 5,
        BRA = 6,
        VEDIA = 7,
        WINGS = 8,
        EVR = 9,
        ADSF = 10
    }

    enum ScenarioTypes
    {
        LAB,
        FIELD
    }

    public static class _5GRoutesApiUrlRootManager
    {
        public static string CamRepoUrl = "http://100.10.100.2:30500";
    }
}


