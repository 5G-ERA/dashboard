using eu_projects_main_platform.Business;
using eu_projects_main_platform.Models.Authentication;
using eu_projects_main_platform.Models.Planet;
using eu_projects_main_platform.Models.Planet.Auth;
using eu_projects_main_platform.Models.Planet.Constant;
using eu_projects_main_platform.Models.Planet.Extensions;
using eu_projects_main_platform.Models.Planet.SignalR;
using eu_projects_main_platform.Models.Planet.UserSettings.DTO;
using ExcelDataReader;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Dynamic;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using Confluent.Kafka;
using eu_projects_main_platform.Models.Common;
using eu_projects_main_platform.Models.Planet.Alerts;
using eu_projects_main_platform.Models.Planet.Background_jobs;
using eu_projects_main_platform.Models.Planet.Blockchain;
using eu_projects_main_platform.Models.Planet.GraphQL;
using eu_projects_main_platform.Models.Planet.Kafka;
using eu_projects_main_platform.Models.Planet.OptRoute;
using MongoDB.Bson;
using MongoDB.Driver;

using Syncfusion.EJ2.Spreadsheet;
using Syncfusion.XlsIO;
using ContentDispositionHeaderValue = Microsoft.Net.Http.Headers.ContentDispositionHeaderValue;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IHostingEnvironment;

namespace eu_projects_main_platform.Controllers
{
    public class PlanetController : Controller
    {
        private readonly IHubContext<PlanetHub> _planetHub;
        private readonly IMongoClient _mongoClient;
        private readonly IHostingEnvironment _hostingEnvironment;

        public PlanetController(IHubContext<PlanetHub> planetHub, IMongoClient mongoClient, IHostingEnvironment hostingEnvironment)
        {
            _planetHub = planetHub;
            _mongoClient = mongoClient;
            _hostingEnvironment = hostingEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult loadMenu(string menuName)
        {
            if (menuName == "Home")
                return PartialView("HomeMenu");
            if (menuName == "EGTNL")
                return PartialView("EgtnLogisticMenu");
            if (menuName == "EGTNI")
                return PartialView("EgtnInfrastructureMenu");
            if (menuName == "Docs")
                return PartialView("ViewDocsMenu");
            if (menuName == "physicalInternet")
                return PartialView("PhysicalInternetMenu");
            if (menuName == "forecast")
                return PartialView("ForecastsMenu");
            //default
            return PartialView("HomeMenu");
        }

        public IActionResult loadPartial(string viewName)
        {
            if (viewName == "EGTN-Netowrk")
                return PartialView("./EGTN - Logistics Information/EgtnNetwork");
            if (viewName == "DSS:Last mile")
                return PartialView("./Physical Internet Services/DssLastMile");
            if (viewName == "OptRoute")
                return PartialView("Physical Internet Services/DssOptRoute");
            if (viewName == "digiport")
                return PartialView("./Physical Internet Services/Digiport");
            if (viewName == "Resources")
                return PartialView("./Forecasts/Resources");
            if (viewName == "PT-Models")
            {
                return PartialView("./Forecasts/PredictiveModels");
            }
            if (viewName == "alerts")
                return PartialView("AlertsView");
            if (viewName == "OtherPage")
                return PartialView("Other");
            if (viewName == "EGTN-node")
                return PartialView("./EGTN - Infrastructure Observatory/EgtnNode");
            if (viewName == "CorridorRouteIndex")
                return PartialView("./EGTN - Infrastructure Observatory/CorridorRouteIndex");
            if (viewName == "CO2emissions")
                return PartialView("./EGTN - Infrastructure Observatory/CO2emissions");
            if (viewName == "EgtnBlockchain")
                return PartialView("./EGTN - Infrastructure Observatory/EgtnBlockchain");
            if (viewName == "ShippingAgent")
                return PartialView("./View Documents/ShippingAgent");

            if (viewName == "Regulatory")
                return PartialView("./EGTN - Logistics Information/Regulatory");
            if (viewName == "Political")
                return PartialView("./EGTN - Logistics Information/Political");
            if (viewName == "Financial")
                return PartialView("./EGTN - Logistics Information/Financial");
            if (viewName == "Economic")
                return PartialView("./EGTN - Logistics Information/Economic");
            if (viewName == "Legal")
                return PartialView("./EGTN - Logistics Information/Legal");
            if (viewName == "Environmental")
                return PartialView("./EGTN - Logistics Information/Environmental");
            if (viewName == "Governance")
                return PartialView("./EGTN - Logistics Information/Governance");



            //default
            return PartialView("HomeMenu");
        }

        #region project data

        public IActionResult retrieveTrackAndTraceView()
        {
            return PartialView("TrackAndTrace");
        }

        public IActionResult retrieveRouteNodeSelectionView()
        {
            return PartialView("Nodes");
        }

        public IActionResult retrieveForecastView()
        {
            return PartialView("Forecasts");
        }

        public IActionResult RetrieveContainerID()
        {
            return Json(new PlanetBusiness().RetrieveContainerID());
        }

        public IActionResult RetrieveTrackTrace(string ContainerID)
        {
            return Json(new PlanetBusiness().RetrieveTrackTrace(ContainerID));
        }

        #endregion

        #region documents methods

        public IActionResult getExcelFile(string fileName)
        {
            var path = $"{Directory.GetCurrentDirectory()}{@"\wwwroot\eu_projects\planet\assets\" + fileName}";
            int cells = 0;
            var data = new List<List<string>>();

            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
            using (var stream = System.IO.File.Open(path, FileMode.Open, FileAccess.Read))
            {
                using (var reader = ExcelReaderFactory.CreateReader(stream))
                {
                    while (reader.Read())
                    {
                        cells = 0;
                        var dataToAdd = new List<string>();
                        try
                        {
                            while (true)
                            {
                                var val = reader.GetValue(cells).ToString();
                                dataToAdd.Add(val.ToString());
                                cells++;
                            }
                        }
                        catch (Exception ex)
                        {
                            if (dataToAdd.Count > 0)
                                data.Add(dataToAdd);
                        }
                    }
                }
            }

            return Json(data);
        }

        public IActionResult getExcelFileObject(string fileName)
        {

            var path = $"{Directory.GetCurrentDirectory()}{@"\wwwroot\eu_projects\planet\assets\" + fileName}";
            int cells = 0;
            List<string> headers = new List<string>();
            List<string> data = new List<string>();

            var datas = "[";

            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
            using (var stream = System.IO.File.Open(path, FileMode.Open, FileAccess.Read))
            {
                using (var reader = ExcelReaderFactory.CreateReader(stream))
                {
                    while (reader.Read())
                    {
                        if (cells == 0)
                        {
                            try
                            {
                                while (true)
                                {
                                    var val = reader.GetValue(cells);
                                    headers.Add(val.ToString());
                                    cells++;
                                }
                            }
                            catch (Exception ex)
                            {
                                cells--;
                            }
                        }
                        else
                        {
                            try
                            {
                                data.Clear();
                                var data2 = new Dictionary<string, string>();
                                for (int i = 0; i <= cells; i++)
                                {
                                    var val = reader.GetValue(i);
                                    var stringVal = "";
                                    try
                                    {
                                        stringVal = (val is null) ? String.Empty : val.ToString();
                                    }
                                    catch (Exception ex)
                                    {

                                    }

                                    if (i == cells)
                                        data.Add("\"" + headers[i] + "\"" + ":\"" + stringVal + "\"");
                                    else
                                        data.Add("\"" + headers[i] + "\"" + ":\"" + stringVal + "\",");
                                }

                                var dataToPush = "{";
                                for (int i = 0; i <= cells; i++)
                                {
                                    dataToPush += data[i];
                                }

                                dataToPush += "},";
                                //datas.Add(dataToPush);
                                datas = datas + dataToPush;

                            }
                            catch (Exception ex)
                            {
                                break;
                            }
                        }
                    }
                }
            }

            datas = datas.Remove(datas.Length - 1, 1);
            datas += "]";
            return Json(datas);
        }

        public string getExcelFileObjectString(string fileName)
        {

            var path = $"{Directory.GetCurrentDirectory()}{@"\wwwroot\eu_projects\planet\assets\" + fileName}";
            int cells = 0;
            List<string> headers = new List<string>();
            List<string> data = new List<string>();

            var datas = "[";

            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
            using (var stream = System.IO.File.Open(path, FileMode.Open, FileAccess.Read))
            {
                using (var reader = ExcelReaderFactory.CreateReader(stream))
                {
                    while (reader.Read())
                    {
                        if (cells == 0)
                        {
                            try
                            {
                                while (true)
                                {
                                    var val = reader.GetValue(cells);
                                    headers.Add(val.ToString());
                                    cells++;
                                }
                            }
                            catch (Exception ex)
                            {
                                cells--;
                            }
                        }
                        else
                        {
                            try
                            {
                                data.Clear();
                                var data2 = new Dictionary<string, string>();
                                for (int i = 0; i <= cells; i++)
                                {
                                    var val = reader.GetValue(i);
                                    var stringVal = "";
                                    try
                                    {
                                        stringVal = val.ToString();
                                    }
                                    catch (Exception ex)
                                    {

                                    }

                                    if (i == cells)
                                        data.Add("\"" + headers[i] + "\"" + ":\"" + stringVal + "\"");
                                    else
                                        data.Add("\"" + headers[i] + "\"" + ":\"" + stringVal + "\",");
                                }

                                var dataToPush = "{";
                                for (int i = 0; i <= cells; i++)
                                {
                                    dataToPush += data[i];
                                }

                                dataToPush += "},";
                                //datas.Add(dataToPush);
                                datas = datas + dataToPush;

                            }
                            catch (Exception ex)
                            {
                                break;
                            }
                        }
                    }
                }
            }

            datas = datas.Remove(datas.Length - 1, 1);
            datas += "]";



            return datas;
        }

        public IActionResult downloadExcelFile(string fileName)
        {
            var path = $"{Directory.GetCurrentDirectory()}{@"\wwwroot\eu_projects\planet\assets\" + fileName}";

            return File(System.IO.File.ReadAllBytes(path), "application/xls", fileName);
        }

        public IActionResult getXmlFile(string fileName)
        {
            var path = $"{Directory.GetCurrentDirectory()}{@"\wwwroot\eu_projects\planet\assets\" + fileName}";

            string xmlString = System.IO.File.ReadAllText(path);

            if (xmlString.StartsWith("<?xml"))
            {
                xmlString = xmlString.Substring(xmlString.IndexOf("?>") + 1).Trim();
                //xmlString = xmlString.Substring(xmlString.IndexOf("\\r\\n") + 4).Trim();
                if (!xmlString.StartsWith("<"))
                {
                    xmlString = xmlString.Substring(xmlString.IndexOf("<")).Trim();
                }
            }

            if (xmlString.StartsWith("<!DOCTYPE"))
            {
                xmlString = xmlString.Substring(xmlString.IndexOf(">") + 1).Trim();
                if (!xmlString.StartsWith("<"))
                {
                    xmlString = xmlString.Substring(xmlString.IndexOf("<")).Trim();
                }
            }

            return Json(xmlString);
        }

        public IActionResult getJsonFile(string fileName)
        {
            var path = $"{Directory.GetCurrentDirectory()}{@"\wwwroot\eu_projects\planet\assets\" + fileName}";

            string jsonContent = System.IO.File.ReadAllText(path);

            return Json(jsonContent);
        }

        #endregion

        public IActionResult loadProjectFiles()
        {
            return PartialView("projectFilesLib");
        }

        public IActionResult getUserToken()
        {
            dynamic token = new System.Dynamic.ExpandoObject();

            token.Id = "628f1eeafc59b78d0ca96243";
            token.username = "user";
            token.role = "admin";

            return Ok(token);
        }


        #region API requests

        [Produces("application/json")]
        [HttpPost(PlanetAPIRoutes.PlanetRoutes.Auth)]
        [ProducesResponseType(typeof(PlanetAuthResponse), StatusCodes.Status200OK)]
        public IActionResult Auth([FromBody] LoginViewModel login_details)
        {
            var user = new AuthenticationBusiness().LoginAuthentication(login_details.Username, login_details.Password);
            if (user == null)
            {
                return BadRequest(
                    "Something went wrong during the authentication process. Please contact with administrator");
            }
            else if (!String.IsNullOrEmpty(user.authentication_error))
                return BadRequest(user.authentication_error);
            else
            {
                try
                {
                    var tokenResp = new PlanetBusiness().GenerateToken(user);
                    tokenResp.Success = tokenResp.Token != "";

                    return Ok(tokenResp);
                }
                catch (Exception e)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
                }
            }

        }

        [Produces("application/json")]
        [HttpPost(PlanetAPIRoutes.PlanetRoutes.RefreshToken)]
        [ProducesResponseType(typeof(PlanetAuthResponse), StatusCodes.Status200OK)]
        public IActionResult RefreshToken([FromBody] RefreshTokenRequest refreshRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var tokenResult = new PlanetBusiness().GetTokenInfo(refreshRequest);
            var tokenInfo = JsonConvert.DeserializeObject<UserToken>(tokenResult.Result);
            if (tokenInfo == null)
            {
                return BadRequest();
            }

            var token = new PlanetBusiness().getJWTToken(tokenInfo.TokenKey);
            var user = new AuthenticationBusiness().RetrieveUserPerId(tokenInfo.UserID);
            if (user == null)
            {
                return BadRequest();
            }


            try
            {
                var tokenResp = new PlanetBusiness().CreateNewToken(tokenInfo, user, refreshRequest);
                if (tokenResp == null)
                {
                    return BadRequest();
                }

                tokenResp.Success = tokenResp.Token != "";

                return Ok(tokenResp);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Authorize]
        [HttpPost(PlanetAPIRoutes.PlanetRoutes.updateSimulation)]
        //[ProducesResponseType(typeof(PlanetAuthResponse), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateSimulation(SimulationUpdate fileObj)
        {
            if (fileObj.files == null || fileObj.files.Length < 0)
            {
                return BadRequest();
            }


            var path = $"{Directory.GetCurrentDirectory()}{@"\wwwroot\eu_projects\planet\assets\simulation.xlsx"}";
            var path2 = $"{Directory.GetCurrentDirectory()}{@"\wwwroot\eu_projects\planet\assets\Other\params.json"}";

            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
            using (var stream = System.IO.File.Create(path))
            {
                fileObj.files.CopyTo(stream);
                stream.Flush();
            }

            var newData = getExcelFileObjectString("simulation.xlsx");

            //string json = JsonConvert.SerializeObject(_data.ToArray());

            //write string to file
            System.IO.File.WriteAllText(path2, newData);

            return Ok();
        }

        [Authorize]
        //[Produces("application/json")]
        [HttpGet(PlanetAPIRoutes.PlanetRoutes.testAlert)]
        //[ProducesResponseType(typeof(PlanetAuthResponse), StatusCodes.Status200OK)]
        public async Task<IActionResult> testAlerts()
        {
            var noti = new PlanetNotification
            {
                Title = "Test - realtime",
                Message = "This alert from real time data",
                AlertId = "22222"
            };
            await new PlanetBusiness().SendNotification(noti, "planet", _planetHub);
            return Ok();
        }


        public IActionResult GenerateCurrentUserToken(int id)
        {
            var user = new AuthenticationBusiness().RetrieveUserPerId(id);
            var tokenResp = new PlanetBusiness().GenerateToken(user);
            tokenResp.Success = tokenResp.Token != "";

            return Ok(tokenResp);
        }

        #endregion

        #region Mongo Old

        //[HttpGet(PlanetAPIRoutes.MongoRoutes.Collections)]
        public List<string> GetCollectionList([FromRoute] string database)
        {
            var collections = new PlanetBusiness().GetCollections(database);
            return collections;
        }

        //[Produces("application/json")]
        //[HttpGet(PlanetAPIRoutes.MongoRoutes.Get)]
        public async Task<IActionResult> GetCollectionData(string database, string collection)
        {
            var dataList = await new PlanetBusiness().getMongoList(database, collection);
            var jsonData = dataList.getJson();
            var dataToSend = JsonConvert.DeserializeObject<List<ExpandoObject>>(jsonData, new ExpandoObjectConverter());

            return Ok(dataToSend);
        }

        //[Produces("application/json")]
        //[HttpGet(PlanetAPIRoutes.MongoRoutes.GetById)]
        public async Task<IActionResult> GetCollectionDataById(string database, string collection, string id)
        {
            var data = await new PlanetBusiness().getMongoDataById(database, collection, id);
            var jsonData = data.getJson();

            var dataToSend = JsonConvert.DeserializeObject<ExpandoObject>(jsonData, new ExpandoObjectConverter());

            return Ok(dataToSend);
        }

        #endregion

        #region user settings

        //[Produces("application/json")]
        //[HttpGet(PlanetAPIRoutes.MongoRoutes.GetUserSettings)]
        //[ProducesResponseType(typeof(userSettings), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUserSettings(string id)
        {
            var data = await new PlanetBusiness().getUserSetting(id);

            return Ok(data);
        }

        public async Task<IActionResult> UpdateUserTableSettings(string id, tableSettingUpdate setting)
        {
            var data = await new PlanetBusiness().UpdateUserTableSettings(id, setting);

            return Ok(data);
        }

        public async Task<IActionResult> UpdateUserGridSettings(string id, gridSettingUpdate setting)
        {
            var data = await new PlanetBusiness().UpdateUserGridSettings(id, setting);

            return Ok(data);
        }

        public async Task<IActionResult> UpdateUserSavedTableSearch(string id, tableSettingUpdate setting)
        {
            var data = await new PlanetBusiness().UpdateUserSearchesSettings(id, setting);

            return Ok(data);
        }

        public async Task<IActionResult> DeleteUserSavedSearch(string id, DeleteUserSearch setting)
        {
            var data = await new PlanetBusiness().DeleteUserSearch(id, setting);

            return Ok(data);
        }

        #endregion

        #region Alerts

        public IActionResult AddUserAlerts(PlanetAlert alert)
        {
            //TODO: 

            return Ok(alert);
        }

        public IActionResult LoadDssTableUserAlerts(long userId)
        {
            var type = "DSS Table";
            var allAlerts =
                JsonConvert.DeserializeObject<IEnumerable<PlanetUserAlert>>(new PlanetBusiness()
                    .RetrieveUserAlertsPerType(userId, type).Result);

            if (allAlerts.Count() == 0)
            {
                var newAlerts = GenerateNewAlertsFromUserTreshold(userId, type);
                return Json(newAlerts);
            }

            return Json(allAlerts);
        }

        public IActionResult LoadTrackAndTraceUserAlerts(long userId)
        {
            var type = "T&T Table";
            var allAlerts =
                JsonConvert.DeserializeObject<IEnumerable<PlanetUserAlert>>(new PlanetBusiness()
                    .RetrieveUserAlertsPerType(userId, type).Result);

            if (allAlerts.Count() == 0)
            {
                var newAlerts = GenerateNewAlertsFromUserTreshold(userId, type);
                return Json(newAlerts);
            }

            return Json(allAlerts);
        }

        private List<PlanetUserAlert> GenerateNewAlertsFromUserTreshold(long userId, string type)
        {
            var trackAndTraceTable = "T&T Table";
            var dssTable = "DSS Table";
            var thresholds =
                JsonConvert.DeserializeObject<List<AlertThreshold>>(new PlanetBusiness().RetrieveAlertThresholds(userId)
                    .Result).Where(t => t.AlertThresholdTable.ToLower().Equals(type.ToLower()) && t.IsActive == true);

            if (type.ToLower().Equals(dssTable.ToLower()))
            {
                var dssFileDataPath = @"Other\dsslastmiledata.json";
                var path = $"{Directory.GetCurrentDirectory()}{@"\wwwroot\eu_projects\planet\assets\" + dssFileDataPath}";

                string jsonContent = System.IO.File.ReadAllText(path);
                var dssData = JsonConvert.DeserializeObject<DssLastMileObjectData>(jsonContent);

                var alerts = PlanetAlertManager.GetAlertFromDssTable(thresholds, dssData);
                var newAlerts = new List<PlanetUserAlert>();

                foreach (var a in alerts)
                {
                    a.UserId = userId;

                    newAlerts.Add(JsonConvert.DeserializeObject<PlanetUserAlert>(new PlanetBusiness().InsertNewAlert(a).Result));
                }

                return newAlerts;
            }
            else
            {
                var allShipmentRecords = GetAllShipmentRecords();

                var alerts = PlanetAlertManager.GetAlertFromTrackAndTraceTable(thresholds, allShipmentRecords);
                var newAlerts = new List<PlanetUserAlert>();

                foreach (var alert in alerts)
                {
                    alert.UserId = userId;
                    newAlerts.Add(JsonConvert.DeserializeObject<PlanetUserAlert>(new PlanetBusiness().InsertNewAlert(alert).Result));
                }

                return newAlerts;
            }
        }

        private List<TrackAndTraceRecordItem> GetAllShipmentRecords()
        {
            var url = PlanetDefaultUrlManager.defaultNgsIotUrl;
            var query = "query getAllShipments {shipment {id logisticUnits {id}}}";

            using (var httpClient = new HttpClient())
            {
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri(url),
                    Content = new StringContent(query, Encoding.UTF8, "application/graphql")
                };

                var response = httpClient.Send(request);
                var allShipmentDetails = JsonConvert
                    .DeserializeObject<ShipmentSetWrapper>(response.Content.ReadAsStringAsync().Result)?.data.shipment;

                var allData = new List<TrackAndTraceRecordItem>();

                var startDate = $"{new DateTime(2022, 1, 1).Date:yyyy-MM-dd}";
                var endDate = $"{DateTime.Now.Date:yyyy-MM-dd}";
                foreach (var shipment in allShipmentDetails)
                {
                    var gsin = shipment.id;
                    var subquery =
                        $"query getShipmentDetailsPerId {{ shipment(ID: \"{gsin}\") {{id logisticUnits {{ id sensors {{id name ... on IoTDevice {{id name hosts {{id observations(filter: {{ start: \"{startDate}\", end: \"{endDate} \"}}) {{time value timestamp}}}}}}}}}}}} }}";

                    var request1 = new HttpRequestMessage
                    {
                        Method = HttpMethod.Post,
                        RequestUri = new Uri(url),
                        Content = new StringContent(subquery, Encoding.UTF8, "application/graphql")
                    };

                    using (var client1 = new HttpClient())
                    {
                        var res = client1.Send(request1);

                        var shipmentRawData = JsonConvert
                            .DeserializeObject<DetailedShipmentSetWrapper>(res.Content.ReadAsStringAsync().Result);

                        if (shipmentRawData?.data is not null)
                        {
                            var shipmentData = GetFormatedShipmentData(shipmentRawData.data.shipment);
                            allData.AddRange(shipmentData);
                        }
                    }
                    
                }

                return allData;
            }
            
        }

        private List<TrackAndTraceRecordItem> GetFormatedShipmentData(IEnumerable<DetailedShipment> shipmentRawData)
        {
            var data = new List<TrackAndTraceRecordItem>();

            foreach (var shipment in shipmentRawData)
            {
                foreach (var logisticUnit in shipment.LogisticUnits)
                {
                    foreach (var sensor in logisticUnit.sensors)
                    {
                        for (int l = 0; l < sensor.hosts.First().observations.ToArray().Length; l++)
                        {
                            var item = new TrackAndTraceRecordItem(GSIN: shipment.id.Replace("https://id.gs1.org/", ""),
                                SSCC: logisticUnit.id.Replace("https://id.gs1.org/", ""), MacAddress: sensor.name,
                                TimeStamp: sensor.hosts.First().observations.ElementAt(l).time,
                                Latitude: ExtractIotDataPerType("Latitude", sensor.hosts, l),
                                Longitude: ExtractIotDataPerType("Longitude", sensor.hosts, l),
                                Temperature: ExtractIotDataPerType("Temperature", sensor.hosts, l),
                                Humidity: ExtractIotDataPerType("RelativeHumidity", sensor.hosts, l),
                                AccelerometerX: ExtractIotDataPerType("Acceleration/Comp-x", sensor.hosts, l),
                                AccelerometerY: ExtractIotDataPerType("Acceleration/Comp-y", sensor.hosts, l),
                                AccelerometerZ: ExtractIotDataPerType("Acceleration/Comp-z", sensor.hosts, l),
                                Luminance: ExtractIotDataPerType("Luminance", sensor.hosts, l),
                                Battery: ExtractIotDataPerType("Battery", sensor.hosts, l),
                                UID: shipment.id.Replace("https://id.gs1.org/", "") + '-' +
                                     logisticUnit.id.Replace("https://id.gs1.org/", "") + '-' + sensor.name + '-' +
                                     sensor.hosts.First().observations.ElementAt(l).timestamp);

                            data.Add(item);
                        }
                    }
                }
            }

            return data;
        }

        private decimal ExtractIotDataPerType(string type, IEnumerable<DetailedWeatherHost> hosts, int index)
        {
            decimal data = 0;

            foreach (var host in hosts)
            {
                if (host.id.Contains(type))
                {
                    data = host.observations.ElementAt(index).value;
                }
            }

            return data;
        }

        public IActionResult SetAlertAsRead(string alertId)
        {
            Guid guid;
            if (Guid.TryParse(alertId, out guid))
            {
                return Json(new PlanetBusiness().MarkAsReadUserAlert(guid));
            }

            return Json(null);
        }

        public IActionResult SetAllAlertAsRead(long userId)
        {
            return Json(new PlanetBusiness().MarkAllUserAlertsAsRead(userId));
        }

        #endregion


        public async Task<IActionResult> KafkaConsumer()
        {
            //var config = new ConsumerConfig
            //{
            //    GroupId = "Blockchain-Consumer-bc-0",
            //    BootstrapServers = "135.181.213.112:9092",
            //    AutoOffsetReset = AutoOffsetReset.Earliest,
            //    SecurityProtocol = SecurityProtocol.SaslPlaintext,
            //    SaslMechanism = SaslMechanism.Plain,
            //    SaslUsername = "ebos",
            //    SaslPassword = "6eDO0@7&KoY6"

            //};

            //var objects = new List<Object>();

            //try
            //{
            //    using (var consumerBuilder = new ConsumerBuilder
            //               <Ignore, string>(config).Build())
            //    {
            //        //consumerBuilder.Subscribe("bc-events");
            //        var cancelToken = new CancellationTokenSource();
            //        consumerBuilder.Assign(new TopicPartitionOffset("bc-events", Partition.Any, Offset.Beginning));

            //        try
            //        {
            //            while (true)
            //            {
            //                var consumer = consumerBuilder.Consume();
            //                var obj = JsonConvert.SerializeObject(
            //                    JsonConvert.DeserializeObject<BlockchainEvent>(consumer.Message.Value));
            //                objects.Add(obj);
            //            }
            //        }
            //        catch (OperationCanceledException)
            //        {
            //            consumerBuilder.Close();
            //        }
            //        finally
            //        {
            //            consumerBuilder.Close();
            //        }
            //    }
            //}
            //catch (Exception ex)
            //{
            //    throw ex;
            //}

            //var bc_events = await Task.Run(async () =>
            //{
            //    var objects = new List<Object>();

            //    CancellationTokenSource cts = new CancellationTokenSource();

            //    using (var consumer = new ConsumerBuilder<string, string>(
            //               config.AsEnumerable()).Build())
            //    {
            //        consumer.Subscribe("bc-events");
            //        try
            //        {
            //            while (true)
            //            {
            //                var cr = consumer.Consume(cts.Token);
            //                //Console.WriteLine($"Consumed event from topic {topic} with key {cr.Message.Key,-10} and value {cr.Message.Value}");
            //                var msg = cr.Message.Value;
            //                objects.Add(msg);
            //            }
            //        }
            //        catch (OperationCanceledException)
            //        {
            //            // Ctrl-C was pressed.
            //        }
            //        finally
            //        {
            //            consumer.Close();
            //        }
            //    }

            //    return objects;
            //});


            //var objects = new PlanetNewKafkaConsumer().Objects;

            return Json(KafkaRecords.BcEvents);
        }

        public IActionResult RetrieveKafkaBcEvents()
        {
            if (KafkaRecords.BcEvents.Count == 0)
            {
                KafkaRecords.BcEvents.Add(new BlockchainEvent());
            }
            return Json(KafkaRecords.BcEvents);
        }



        public async Task<IActionResult> RetrieveKafkaTopicObjectsPerType(string type)
        {
            var rawKafkaObjects =
                JsonConvert.DeserializeObject<List<RawKafkaObject>>(new PlanetBusiness()
                    .RetrieveKafkaTopicObjectsPerType(type).Result);
            

            if (type.ToLower().Equals(PlanetKafkaTopicType.ll1_iot.ToString()))
            {
                var ll1_iotData = new List<LL1_iot>();

                var gsinDummyList = new List<string>()
                {
                    "40212345678900001041",
                    "98016541097804605005",
                    "74561396385490565223"
                };

                foreach (var obj in rawKafkaObjects)
                {
                    var kafkaRecord = JsonConvert.DeserializeObject<LL1_iot>(obj.ObjectValue);

                    kafkaRecord.epcisBody.eventList[0].parentID = gsinDummyList[new Random().Next(0, 3)];

                    ll1_iotData.Add(kafkaRecord);
                }

                var groupedKafkaRecords = ll1_iotData
                    .GroupBy(e => e.epcisBody.eventList[0].parentID)
                    .Select(g => GetGroupedKafkaValues(g));

                return Json(groupedKafkaRecords);
            }
            else if (type.ToLower().Equals(PlanetKafkaTopicType.bc_events.ToString()))
            {
                var bc_eventData = new List<BlockchainEvent>();

                foreach (var obj in rawKafkaObjects)
                {
                    var kafkaRecord = JsonConvert.DeserializeObject<BlockchainEvent>(obj.ObjectValue);
                    bc_eventData.Add(kafkaRecord);
                }

                return Json(bc_eventData);
            }
            else
            {
                return Json("Unsupported topic type");
            }
        }

        private Object GetGroupedKafkaValues(IGrouping<string, LL1_iot> ll1Iots)
        {
            return new
            {
                GSIN = ll1Iots.Key,
                Values = ll1Iots.Where(l => l.epcisBody.eventList[0].parentID == ll1Iots.Key)
            };
        }


        #region Mongo New

        public async Task<IActionResult> RetrieveMongoCollectionData(string databaseName, string collectionName)
        {
            var database = _mongoClient.GetDatabase(databaseName);
            var collection = database.GetCollection<dynamic>(collectionName);
            return Json(await collection.Find(new BsonDocument()).ToListAsync());
        }

        public async Task<IActionResult> RetrieveMongoCollectionDataPerObjectId(string databaseName,
            string collectionName, string objectId)
        {
            var database = _mongoClient.GetDatabase(databaseName);
            var collection = database.GetCollection<dynamic>(collectionName);

            var filter = Builders<dynamic>.Filter.Eq("_id", ObjectId.Parse(objectId));

            return Json(await collection.Find(filter).FirstAsync());
        }

        public async Task<IActionResult> RetrieveMongoDatabaseCollections(string databaseName)
        {
            List<string> collections = new List<string>();
            var database = _mongoClient.GetDatabase(databaseName);

            foreach (BsonDocument collection in database.ListCollectionsAsync().Result.ToListAsync<BsonDocument>().Result)
            {
                string name = collection["name"].AsString;
                collections.Add(name);
            }

            return Json(collections);
        }

        #endregion

        #region Excel Files Reading (Syncfusion)

        [HttpPost]
        public IActionResult LoadExcel(string directory, string filename)
        {
            var rootPath = $"{Directory.GetCurrentDirectory()}{@"\wwwroot\eu_projects\planet\assets\"}";
            var completeRootPath = Path.Combine(rootPath, directory);
            try
            {
                if (Directory.Exists(completeRootPath))
                {
                    var completePath = Path.Combine(completeRootPath, filename);

                    ExcelEngine excelEngine = new ExcelEngine();
                    IApplication application = excelEngine.Excel;
                    OpenRequest open = new OpenRequest();

                    FileStream inputStream1 = new FileStream(completePath, FileMode.Open);
                    IFormFile formFile =
                        new FormFile(inputStream1, 0, inputStream1.Length, "",
                            filename + ".xlsx"); // converting MemoryStream to IFormFile 
                    open.File = formFile;
                    var content = Workbook.Open(open);
                    inputStream1.Close();
                    return Content(content);
                }
                else
                    return Json(null);
            }
            catch (Exception e)
            {
                return Json(e.Message);
            }
        }

        #endregion

        #region User Roles Management

        public IActionResult RetrievePlanetUserGroups()
        {
            return Json(new PlanetBusiness().RetrievePlanetUserGroups());
        }

        public IActionResult RetrievePlanetPermissionsPerDepartment(long departmentId)
        {
            return Json(new PlanetBusiness().RetrievePlanetPermissionsPerDepartment(departmentId));
        }

        public IActionResult RetrieveUserDetails(long userId)
        {
            return Json(new PlanetBusiness().RetrieveUserDetails(userId));
        }

        public IActionResult EditProjectUserDetails(long userId, string username, string fullname, string password)
        {
            return Json(new PlanetBusiness().EditProjectUserDetails(userId, username, fullname, password));
        }

        public IActionResult AddNewUserToDepartment(long projectId, long departmentId, string username, string password,
            string fullname)
        {
            return Json(
                new PlanetBusiness().AddNewUserToDepartment(projectId, departmentId, username, fullname, password));
        }

        public IActionResult RemoveUser2Department(long departmentId, long userId)
        {
            return Json(new PlanetBusiness().RemoveUser2Department(departmentId, userId));
        }

        public IActionResult AddExistingUser2Department(long departmentId, long userId)
        {
            return Json(new PlanetBusiness().AddExistingUser2Department(userId, departmentId));
        }

        public IActionResult RemoveOldDepartmentPermissions(long departmentId)
        {
            return Json(new PlanetBusiness().RemoveOldDepartmentPermissions(departmentId));
        }

        public IActionResult AddDepartmentPermission(long departmentId, long menuId, long projectId)
        {
            return Json(new PlanetBusiness().AddDepartmentPermission(departmentId, menuId, projectId));
        }

        public IActionResult AddNewGroup(string groupName)
        {
            return Json(new PlanetBusiness().AddNewGroup(groupName));
        }

        #endregion

        #region GrapQL

        public async Task<IActionResult> RetrieveWeatherStations()
        {
            var url = PlanetDefaultUrlManager.defaultNgsIotUrl;
            var query = "query WeatherStations {weatherStation {id rdfs_label}}";

            using (var httpClient = new HttpClient())
            {
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri(url),
                    Content = new StringContent(query, Encoding.UTF8, "application/graphql")
                };

                var response = await httpClient.SendAsync(request);
                return Json(new
                {
                    code = response.StatusCode,
                    data = JsonConvert.DeserializeObject<WeatherStations>(response.Content.ReadAsStringAsync().Result)
                });
            }
        }

        public async Task<IActionResult> RetrieveWeatherStationDataPerId(params string[] ids)
        {
            var result = new List<DetailedWeatherStationContent>();
            var error_code_msg = new List<String>();

            var url = PlanetDefaultUrlManager.defaultNgsIotUrl;

            foreach (var id in ids)
            {
                
                var query = "query WeatherStationObservations {weatherStation (ID: \"" + id +
                            "\") {id rdfs_label hosts {id observations(filter: {start: \" - 30d\", end: \"0d\"}) {time timestamp value}}}}";

                using (var httpClient = new HttpClient())
                {
                    var request = new HttpRequestMessage
                    {
                        Method = HttpMethod.Post,
                        RequestUri = new Uri(url),
                        Content = new StringContent(query, Encoding.UTF8, "application/graphql")
                    };

                    var response = await httpClient.SendAsync(request);

                    if (!response.StatusCode.Equals(HttpStatusCode.OK))
                    {
                        error_code_msg.Add(response.StatusCode.ToString());
                    }

                    var dataAsArray = JsonConvert
                        .DeserializeObject<DetailedWeatherStation>(response.Content.ReadAsStringAsync().Result)?.data
                        .weatherStation.FirstOrDefault();

                    result.Add(dataAsArray);
                }
            }

            return Json(new
            {
                code = (error_code_msg.Count == 0) ? HttpStatusCode.OK: HttpStatusCode.BadRequest,
                data = result
            });
        }

        #endregion

        #region Login Redirection

        [HttpGet]
        [Route("[controller]/login/")]
        public IActionResult Login([FromQuery] string username, [FromQuery] string password)
        {
            if (username != null || password != null)
            {
                var login = new LoginViewModel()
                {
                    Username = username,
                    Password = password
                };
                return AccountVerification(login);
            }
            @ViewBag.FatalError = String.Empty;
            @ViewBag.HostIdentifier = new AuthenticationBusiness().RetrieveHostIdentifier(Request);

            return Json(@ViewBag.FatalError);
        }

        public IActionResult AccountVerification(LoginViewModel login_details)
        {

            @ViewBag.FatalError = String.Empty;
            try
            {
                @ViewBag.HostIdentifier = new AuthenticationBusiness().RetrieveHostIdentifier(Request);
                Users? _user = new AuthenticationBusiness().LoginAuthentication(login_details.Username, login_details.Password);
                if (_user == null)
                    @ViewBag.FatalError = "Something went wrong during the authentication process. Please contact with administrator";
                else if (!String.IsNullOrEmpty(_user.authentication_error))
                    @ViewBag.FatalError = _user.authentication_error;
                else if (String.IsNullOrEmpty(_user.ProjectName))
                    @ViewBag.FatalError = "User is not authorized. Please contact with administrator";
                else
                {
                    String cipher = EncryptionDecryption.EncryptString(JsonConvert.SerializeObject(_user));
                    HttpContext.Session.Set<String>("_UserDetails", cipher);
                    return Redirect("~/Home/Index");
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("Authentication", "AccountVerification", ex.Message, ex.StackTrace);
                @ViewBag.FatalError = ex.Message;
            }
            return Json(@ViewBag.FatalError);
        }

        #endregion

        #region Blockchain

        public async Task<IActionResult> GetAllShipmentReferences()
        {
            var url = PlanetDefaultUrlManager.defaultBlockchainAssetUrl;
            url += "/v1/journey/starts";

            using (var httpClient = new HttpClient())
            {
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(url)
                };

                var response = await httpClient.SendAsync(request);

                return Json(new
                {
                    code = response.StatusCode,
                    data = JsonConvert.DeserializeObject<IEnumerable<BlockchainAssetDocumentItem>>(response.Content.ReadAsStringAsync().Result)
                });
            }
        }

        public async Task<IActionResult> RetrieveBlockchainDocument(string documentRefId)
        {
            try
            {
                var url = PlanetDefaultUrlManager.defaultBlockchainVaultUrl;
                //var doc = "0x9f44521aa79c2263538b3e738d1d111914923cb9a5c976a35f60c995b6280d47";

                if (!documentRefId.StartsWith("0x"))
                {
                    throw new Exception("Invalid document reference! Please select a valid logistic event");
                }

                var formattedDoc = documentRefId.Replace("0x", "");

                url += $"/vault/v2/assets/byDoctype/{formattedDoc}/0";

                using (var httpClient = new HttpClient())
                {
                    httpClient.DefaultRequestHeaders.Add("email", "user@egtn.com");
                    httpClient.DefaultRequestHeaders.Add("password", "pw");

                    var msg = new HttpRequestMessage
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri(url)
                    };

                    var res = await (await httpClient.SendAsync(msg)).Content.ReadAsStringAsync();

                    return Json(new
                    {
                        code = "SUCCESS",
                        content = res
                    });
                }
            }
            catch (Exception e)
            {
                return Json(new
                {
                    code = "FAIL",
                    msg = e.Message
                });
            }
        }

        #endregion

        #region ll1-iot GraphQL Endpoints

        public async Task<IActionResult> RetrieveLL1_AllLogisticUnits()
        {
            var url = PlanetDefaultUrlManager.defaultNgsIotUrl;
            var query = "query getLogisticUnits {logisticUnit {id status createdOn completedOn assets {id}}}";

            using (var httpClient = new HttpClient())
            {
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri(url),
                    Content = new StringContent(query, Encoding.UTF8, "application/graphql")
                };

                var response = await httpClient.SendAsync(request);
                return Json(new
                {
                    code = response.StatusCode,
                    result = JsonConvert.DeserializeObject<LogisticUnitSetWrapper>(response.Content.ReadAsStringAsync().Result)
                });
            }
        }

        public async Task<IActionResult> RetrieveLL1_AllShipments()
        {
            var url = PlanetDefaultUrlManager.defaultNgsIotUrl;
            var query = "query getAllShipments {shipment {id logisticUnits {id}}}";

            using (var httpClient = new HttpClient())
            {
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri(url),
                    Content = new StringContent(query, Encoding.UTF8, "application/graphql")
                };

                var response = await httpClient.SendAsync(request);
                return Json(new
                {
                    code = response.StatusCode,
                    result = JsonConvert.DeserializeObject<ShipmentSetWrapper>(response.Content.ReadAsStringAsync().Result)?.data.shipment
                });
            }
        }

        public async Task<IActionResult> RetrieveLl1_GsinDetails(string gsin)
        {
            var url = PlanetDefaultUrlManager.defaultNgsIotUrl;
            var startDate = $"{new DateTime(2022, 1, 1).Date:yyyy-MM-dd}";
            var endDate = $"{DateTime.Now.Date:yyyy-MM-dd}";

            var query =
                $"query getShipmentDetailsPerId {{ shipment(ID: \"{gsin}\") {{id logisticUnits {{ id sensors {{id name ... on IoTDevice {{id name hosts {{id observations(filter: {{ start: \"{startDate}\", end: \"{endDate} \"}}) {{time value timestamp}}}}}}}}}}}} }}";

            using (var httpClient = new HttpClient())
            {
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri(url),
                    Content = new StringContent(query, Encoding.UTF8, "application/graphql")
                };

                var response = await httpClient.SendAsync(request);
                return Json(new
                {
                    code = response.StatusCode,
                    result = JsonConvert.DeserializeObject<DetailedShipmentSetWrapper>(response.Content.ReadAsStringAsync().Result)
                });
            }
        }

        #endregion

        #region Dss Route Optimization

        public async Task<IActionResult> RetrieveAllRouteDates()
        {
            var url = PlanetDefaultUrlManager.defaultOptimizedRouteUrl + "/all_routes";

            using (var httpClient = new HttpClient())
            {
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(url)
                };

                var response = await httpClient.SendAsync(request);
                return Json(new
                {
                    code = response.StatusCode,
                    result = JsonConvert.DeserializeObject<IEnumerable<LookupOptimizeDateRoute>>(response.Content.ReadAsStringAsync().Result)
                });
            }
        }

        public async Task<IActionResult> RetrieveOptRoutePerDate(string date)
        {
            var url = PlanetDefaultUrlManager.defaultOptimizedRouteUrl + "/routes?date=" + date;

            using (var httpClient = new HttpClient())
            {
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(url)
                };

                var response = await httpClient.SendAsync(request);
                return Json(new
                {
                    code = response.StatusCode,
                    result = JsonConvert.DeserializeObject<IEnumerable<OptimizeDateRoute>>(response.Content.ReadAsStringAsync().Result)
                });
            }
        }


        public async Task<IActionResult> UploadRouteExcelRawDataFile(string target)
        {
            string folderName = "Upload";
            string webRootPath = _hostingEnvironment.WebRootPath;
            string defaultPath = Path.Combine(webRootPath, folderName);

            var testFolderName = "PLANET-Uploads";
            var newPath = Path.Combine(defaultPath, testFolderName);

            var file = Request.Form.Files[0];
            var url = PlanetDefaultUrlManager.defaultOptimizedRouteUrl + "/orders?operator=citylogin&optimization_target=" + target;

            if (!Directory.Exists(newPath))
            {
                Directory.CreateDirectory(newPath);
            }

            if (file.Length > 0)
            {
                string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim()
                    .Value;

                string fullPath = Path.Combine(newPath, fileName);
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);

                    using (var httpClient = new HttpClient())
                    {
                        var multipartContent = new MultipartFormDataContent();
                        multipartContent.Add(new StreamContent(stream), "file", fullPath);
                        multipartContent.Add(new StringContent(""), "remaining_driver_hours");

                        var request = new HttpRequestMessage
                        {
                            Method = HttpMethod.Post,
                            RequestUri = new Uri(url),
                            Content = multipartContent
                        };

                        var response = await httpClient.SendAsync(request);
                        return Json(new
                        {
                            code = response.StatusCode,
                            result = response.Content.ReadAsStringAsync().Result
                        });
                    }
                }
            }

            return Json(null);

        }
        #endregion
    }
    

    static class PlanetDefaultUrlManager
    {
        public static string defaultOptimizedRouteUrl = "http://127.0.0.1:5050";
        public static string defaultNgsIotUrl = "http://135.181.217.228:30580/graphql";
        public static string defaultBlockchainAssetUrl = "https://asset-service-r23jvjjtzq-ew.a.run.app";

        public static string defaultBlockchainVaultUrl = "https://vault-service-r23jvjjtzq-ew.a.run.app";
    }

    public record TrackAndTraceRecordItem(string GSIN, string SSCC, string MacAddress, string TimeStamp,
        decimal Latitude, decimal Longitude, decimal Temperature, decimal Humidity, decimal AccelerometerX,
        decimal AccelerometerY, decimal AccelerometerZ, decimal Luminance, decimal Battery, string UID);
}
