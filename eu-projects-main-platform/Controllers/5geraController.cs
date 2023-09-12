using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mime;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading.Tasks;
using eu_projects_main_platform.Business;
using eu_projects_main_platform.Models._5gera.Auth;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Win32.SafeHandles;
using Newtonsoft.Json;
using NuGet.Common;
using eu_projects_main_platform.Models._5gera.Constant;
using eu_projects_main_platform.Models._5gera;
using Omu.AwesomeMvc;
using Bogus;
using System.Diagnostics.Metrics;
using Microsoft.EntityFrameworkCore;
using Syncfusion.EJ2.Grids;
using System.Net.Http.Headers;
using System.Collections;
using MongoDB.Bson;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http;
using Confluent.Kafka;

namespace eu_projects_main_platform.Controllers
{
    public class _5geraController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> retrieveHomeView()
        {
            var r= await _GridGetDataRobotTask();
            return PartialView("Home",DataContext.tasks);

        }
        public IActionResult retrievePortalView()
        {
            return PartialView("IFramePortal");
        }

        public IActionResult ShowConverterView()
        {
            return PartialView("Converter");
        }
        // onboard entity
        [HttpGet]
        public async Task<IActionResult> OnboardModel()
        {
            Entityfile file = new Entityfile();
            return View(file);
        }
        [HttpPost]
        public async Task<IActionResult> OnboardModel([FromForm] Entityfile file)
        {
            
            var X = file;
            Entityfile model = new Entityfile();
            try
            {

                if (file != null)
                {
                    model = file;
                    if (model.entity_type != null)
                    {
                        var token = (await this.GetApiTokenAuth()).token;
                        var url = $"http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/data/" + model.entity_type;

                        using (var httpClient = new HttpClient())
                        {
                            try
                            {
                                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                                var request = new HttpRequestMessage
                                {
                                    Method = HttpMethod.Post,
                                    RequestUri = new Uri(url),
                                    Content = new StringContent(JsonConvert.SerializeObject(model.file), Encoding.UTF8, "application/json")
                                };
                                //var response = await client.SendAsync(request).ConfigureAwait(false);
                                //return await response.Content.ReadAsStringAsync();
                            //};
                                var response = await httpClient.SendAsync(request);
                                return Json(new
                                {
                                    code = response.StatusCode,
                                    data = response.Content.ReadAsStringAsync()
                                });
                                //return PartialView(DataContext.policy);
                            }
                            catch (Exception ex)
                            {
                                return Json(ex);
                            }
                        }
                    }

                }
                //return Ok();
            }
            catch (Exception ex)
            {

                return Json(ex);
            }
            return Ok();
        }

        // create relationship between nodes int redis graph
        [HttpGet]
        public IActionResult GraphRelations()
        {

            GraphRelationship model = new GraphRelationship();
            return View(model);
        }
        [HttpPost]
        public async Task<IActionResult> GraphRelations(GraphRelationship relationship)
        {

            Relationship model = new Relationship();
            try
            {

                if (relationship != null)
                {
                    GraphRelationship rel = new GraphRelationship();
                    rel = relationship;
                    model.initiatesFrom.id = relationship.initiatesFromid;
                    model.initiatesFrom.type = relationship.initiatesFromtype;
                    //model.initiatesFrom.name = relationship.initiatesFromname;
                    model.relationName = relationship.relationName;
                    model.pointsTo.id = relationship.pointsToid;
                    model.pointsTo.type = relationship.pointsTotype;
                    model.pointsTo.name = relationship.pointsToname;

                    var token = (await this.GetApiTokenAuth()).token;
                    var url = $"http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/data/" + model.initiatesFrom.type.ToString() + "/addrelation";

                    using (var httpClient = new HttpClient())
                    {
                        try
                        {
                            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                            var request = new HttpRequestMessage
                            {
                                Method = HttpMethod.Post,
                                RequestUri = new Uri(url),
                                Content = new StringContent(model.ToString(), Encoding.UTF8, "application/json")
                            };
                            var response = await httpClient.SendAsync(request);
                            return Json(new
                            {
                                code = response.StatusCode,
                                data = response.Content.ReadAsStringAsync()
                            });
                            //return PartialView(DataContext.policy);
                        }
                        catch (Exception ex)
                        {
                            return Json(ex);
                        }
                    }

                }
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {

                return Json(ex);
            }
        }
        // robot-tasks
        GetRobotTask? tasks;
        IEnumerable<RobotTasks>? task_list;
        string? errorString;
        public async Task<IActionResult> _GridGetDataRobotTask()
        {
            var token = (await this.GetApiTokenAuth()).token;
            //var x = GetTokenInfo(token);
            var url = "http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/Data/Dashboard/tasks";

            try
            {
                using (var httpClient = new HttpClient())
                {
                    try
                    {

                        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);//.Add("Authorization", $"Bearer {token}");
                        // var obj = new { pageNumber = 1, pageSize = 10 };
                        var request = new HttpRequestMessage
                        {
                            Method = HttpMethod.Get,
                            RequestUri = new Uri(url),
                            // Content = new StringContent(obj.ToString(), Encoding.UTF8, "application/text"),
                        };

                        var response = await httpClient.SendAsync(request);
                        if (response.IsSuccessStatusCode)
                        {
                            tasks = await response.Content.ReadFromJsonAsync<GetRobotTask>();
                            if (tasks != null)
                            {
                                DataContext.tasks.Clear();
                                task_list = tasks.data;
                                for (int i = 0; i < tasks.data.Length; i++)
                                {
                                    DataContext.tasks.Add(task_list.ToList()[i]);

                                }

                            }
                        }
                        else
                        {
                            errorString = $"There was an error: {response.ReasonPhrase}";
                        }
                        DataContext.tasks.ToList();
                        //var model=  (new GridModelBuilder<Datum>(DataContext.rtask.AsQueryable(), g)
                        //{
                        //    KeyProp = o => o.name,// needed for Entity Framework | nesting | tree | api
                        //    Map = o => new
                        //    {
                        //        o.name,
                        //        o.isOnline,
                        //        o.isBusy,
                        //        o.numberOfRunningContainers,
                        //        o.status,
                        //        Date = o.lastUpdatedTime.ToShortDateString()
                        //    }
                        //}.Build());
                        return PartialView(DataContext.tasks);
                    }
                    catch (Exception ex)
                    {

                        return Json(ex);
                    }

                }
            }
            catch (Exception ex)
            {

                return Json(ex);
            }
            
        }
        public async Task<IActionResult> AddRobotTask(string id)
        {

            RobotTasks model = new RobotTasks();
            return PartialView("AddRobotTask", model);
        }
        [HttpGet]
        public async Task<IActionResult> EditRobotTask(string id)
        {
            EditTask model = new EditTask();
            if (!string.IsNullOrWhiteSpace(id))
            {
                var token = (await this.GetApiTokenAuth()).token;
                var url = $"http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/data/task/" + id;

                using (var httpClient = new HttpClient())
                {
                    try
                    {
                        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                        var request = new HttpRequestMessage
                        {
                            Method = HttpMethod.Get,
                            RequestUri = new Uri(url)
                        };
                        var response = await httpClient.SendAsync(request);
                        if (response.IsSuccessStatusCode)
                        {
                            var task = await response.Content.ReadFromJsonAsync<EditTask>();
                            if (task != null)
                            {
                                model = task;
                            }
                        }
                        else
                        {
                            errorString = $"There was an error: {response.ReasonPhrase}";
                        }
                    }
                    catch (Exception ex)
                    {
                        return View(ex);
                    }
                }

            }
            return View(model);
        }
        [HttpPatch]
        public async Task<IActionResult> EditRobotTask(EditTask model)
        {
            if (!string.IsNullOrWhiteSpace(model.Id))
            {
                var token = (await this.GetApiTokenAuth()).token;
                var url = $"http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/data/task/" + model.Id;

                using (var httpClient = new HttpClient())
                {
                    try
                    {
                        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                        var request = new HttpRequestMessage
                        {
                            Method = HttpMethod.Patch,
                            RequestUri = new Uri(url),
                            Content = new StringContent(model.ToString(), Encoding.UTF8, "application/text"),
                        };
                        var response = await httpClient.SendAsync(request);
                        if (response.IsSuccessStatusCode)
                        {
                            var task = await response.Content.ReadFromJsonAsync<EditTask>();
                            if (task != null)
                            {
                                model = task;
                            }
                        }
                        else
                        {
                            errorString = $"There was an error: {response.ReasonPhrase}";
                        }
                    }
                    catch (Exception ex)
                    {
                        return View(ex);
                    }
                }

            }
            return View(model);
        }
        //cloud
        GetCloud? clouds;
        IEnumerable<Datum>? clouds_list;
        public async Task<IActionResult> _GridGetDataCloud(){
            var token = (await this.GetApiTokenAuth()).token;
            var url = "http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/data/cloud/";
            try
            {
                using (var httpClient = new HttpClient())
                {
                    try
                    {

                        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);//.Add("Authorization", $"Bearer {token}");
                        var request = new HttpRequestMessage
                        {
                            Method = HttpMethod.Get,
                            RequestUri = new Uri(url),
                            //Content = new StringContent(obj.ToString(), Encoding.UTF8, "application/text"),
                        };

                        var response = await httpClient.SendAsync(request);
                        if (response.IsSuccessStatusCode)
                        {
                            var clouds = await response.Content.ReadFromJsonAsync<List<EditCloud>>();
                            DataContext.clouds.Clear();
                            if (clouds != null)
                            {
                                //clouds_list = clouds.data;
                                for (int i = 0; i < clouds.Count; i++)
                                {
                                    var x = clouds.ToList()[i].name;
                                    if (clouds.ToList()[i].name.ToLower().Contains("cloud"))
                                    {
                                        DataContext.clouds.Add(clouds.ToList()[i]);
                                    }
                                }

                            }
                        }
                        else
                        {
                            errorString = $"There was an error: {response.ReasonPhrase}";
                        }
                        DataContext.clouds.ToList();
                       
                        return PartialView(DataContext.clouds);
                    }
                    catch (Exception ex)
                    {

                        return Json(ex);
                    }

                }
            }
            catch (Exception ex)
            {

                return Json(ex);
            }
        }
        [HttpGet]
        public async Task<IActionResult> EditCloud(string id)
        {
            EditCloud model = new EditCloud();
            if (!string.IsNullOrWhiteSpace(id))
            {
                var token = (await this.GetApiTokenAuth()).token;
                var url = $"http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/data/cloud/" + id;

                using (var httpClient = new HttpClient())
                {
                    try
                    {
                        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                        var request = new HttpRequestMessage
                        {
                            Method = HttpMethod.Get,
                            RequestUri = new Uri(url)
                        };
                        var response = await httpClient.SendAsync(request);
                        if (response.IsSuccessStatusCode)
                        {
                            var task = await response.Content.ReadFromJsonAsync<EditCloud>();
                            if (task != null)
                            {
                                model = task;
                            }
                        }
                        else
                        {
                            errorString = $"There was an error: {response.ReasonPhrase}";
                        }
                    }
                    catch (Exception ex)
                    {
                        return View(ex);
                    }
                }

            }
            return View(model);
        }
        //edge
        GetCloud? edge;
        IEnumerable<Datum>? edge_list;
        public async Task<IActionResult> _GridGetDataEdge()
        {
            var token = (await this.GetApiTokenAuth()).token;
            var url = "http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/data/edge/";

            try
            {
                using (var httpClient = new HttpClient())
                {
                    try
                    {

                        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);//.Add("Authorization", $"Bearer {token}");
                        var request = new HttpRequestMessage
                        {
                            Method = HttpMethod.Get,
                            RequestUri = new Uri(url),
                        };

                        var response = await httpClient.SendAsync(request);
                        if (response.IsSuccessStatusCode)
                        {
                            var edges = await response.Content.ReadFromJsonAsync<List<EditEdge>>();
                            DataContext.edges.Clear();
                            if (edges != null)
                            {
                                //clouds_list = clouds.data;
                                for (int i = 0; i < edges.Count; i++)
                                {
                                    var x = edges.ToList()[i].name;
                                    if (edges.ToList()[i].name.ToLower().Contains("edge"))
                                    {
                                        DataContext.edges.Add(edges.ToList()[i]);
                                    }
                                }

                            }
                        }
                        else
                        {
                            errorString = $"There was an error: {response.ReasonPhrase}";
                        }
                        //DataContext.edge.ToList();
                        return PartialView(DataContext.edges);
                    }
                    catch (Exception ex)
                    {

                        return Json(ex);
                    }

                }
            }
            catch (Exception ex)
            {

                return Json(ex);
            }
        }
        [HttpGet]
        public async Task<IActionResult> EditEdge(string id)
        {
            EditEdge model = new EditEdge();
            if (!string.IsNullOrWhiteSpace(id))
            {
                var token = (await this.GetApiTokenAuth()).token;
                var url = $"http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/data/edge/" + id;

                using (var httpClient = new HttpClient())
                {
                    try
                    {
                        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                        var request = new HttpRequestMessage
                        {
                            Method = HttpMethod.Get,
                            RequestUri = new Uri(url)
                        };
                        var response = await httpClient.SendAsync(request);
                        if (response.IsSuccessStatusCode)
                        {
                            var task = await response.Content.ReadFromJsonAsync<EditEdge>();
                            if (task != null)
                            {
                                model = task;
                            }
                        }
                        else
                        {
                            errorString = $"There was an error: {response.ReasonPhrase}";
                        }
                    }
                    catch (Exception ex)
                    {
                        return View(ex);
                    }
                }

            }
            return View(model);
        }
        //action sequence
        //List<GetAction>? action;
        //IEnumerable<Datum>? edge_list;
        public async Task<IActionResult> _GridGetDataAction()
        {
            var token = (await this.GetApiTokenAuth()).token; 
            var url = "http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/data/action";

            using (var httpClient = new HttpClient())
            {
                try
                {

                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);//.Add("Authorization", $"Bearer {token}");
                    var request = new HttpRequestMessage
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri(url),
                    };

                    var response = await httpClient.SendAsync(request);
                    if (response.IsSuccessStatusCode)
                    {
                        var action = await response.Content.ReadFromJsonAsync<List<EditAction>>();
                        DataContext.action.Clear();
                        if (action != null)
                        {
                            for (int i = 0; i < action.Count; i++)
                            {
                                if (!string.IsNullOrWhiteSpace(action.ToList()[i].Name))
                                {
                                    DataContext.action.Add(action.ToList()[i]);
                                }
                            }
                            //DataContext.action = action;
                        }
                    }
                    else
                    {
                        errorString = $"There was an error: {response.ReasonPhrase}";
                    }
                    return PartialView(DataContext.action);
                }
                catch (Exception ex)
                {

                    return Json(ex);
                }

            }
        }
        [HttpGet]
        public async Task<IActionResult> EditAction(string id)
        {

            EditAction model = new EditAction();
            var token = (await this.GetApiTokenAuth()).token;
            var url = $"http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/data/action/" + id;
            using (var httpClient = new HttpClient())
            {
                try
                {
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    var request = new HttpRequestMessage
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri(url)
                    };
                    var response = await httpClient.SendAsync(request);
                    if (response.IsSuccessStatusCode)
                    {
                        var task = await response.Content.ReadFromJsonAsync<EditAction>();
                        if (task != null)
                        {
                            model = task;
                        }
                    }
                    else
                    {
                        errorString = $"There was an error: {response.ReasonPhrase}";
                    }
                }
                catch (Exception ex)
                {
                    return View(ex);
                }
            }
            return View(model); 
        }
        // Netapps
        EditNetApp? netApps;
        IEnumerable<EditNetApp>? netApps_list;
        public async Task<IActionResult> _GridGetDataNetApps()
        {
            var token = (await this.GetApiTokenAuth()).token;
            var url = "http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/data/instance";

            try
            {
                using (var httpClient = new HttpClient())
                {
                    try
                    {

                        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);//.Add("Authorization", $"Bearer {token}");
                        // var obj = new { pageNumber = 1, pageSize = 10 };
                        var request = new HttpRequestMessage
                        {
                            Method = HttpMethod.Get,
                            RequestUri = new Uri(url),
                            // Content = new StringContent(obj.ToString(), Encoding.UTF8, "application/text"),
                        };

                        var response = await httpClient.SendAsync(request);
                        if (response.IsSuccessStatusCode)
                        {
                            netApps_list = await response.Content.ReadFromJsonAsync<List<EditNetApp>>();
                            DataContext.netApp.Clear();
                            if (netApps_list != null)
                            {
                                //netApps_list = netApps;
                                for (int i=0; i < netApps_list.Count(); i++)
                                {
                                    if (!string.IsNullOrWhiteSpace(netApps_list.ToList()[i].name))
                                    {
                                        DataContext.netApp.Add(netApps_list.ToList()[i]);
                                    }
                                }

                            }
                        }
                        else
                        {
                            errorString = $"There was an error: {response.ReasonPhrase}";
                        }
                        return View(DataContext.netApp);
                    }
                    catch (Exception ex)
                    {

                        return View(ex);
                    }

                }
            }
            catch (Exception ex)
            {

                return View(ex);
            }
        }
        [HttpGet]
        public async Task<IActionResult> EditNetApp(string id)
        {

            EditNetApp model = new EditNetApp();
            var token = (await this.GetApiTokenAuth()).token;
            var url = $"http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/data/instance/" + id;
            using (var httpClient = new HttpClient())
            {
                try
                {
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    var request = new HttpRequestMessage
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri(url)
                    };
                    var response = await httpClient.SendAsync(request);
                    if (response.IsSuccessStatusCode)
                    {
                        var task = await response.Content.ReadFromJsonAsync<EditNetApp>();
                        if (task != null)
                        {
                            model = task;
                        }
                    }
                    else
                    {
                        errorString = $"There was an error: {response.ReasonPhrase}";
                    }
                }
                catch (Exception ex)
                {
                    return View(ex);
                }
            }
            return View(model);
        }
        // Robot
        getRobots? robots;
        IEnumerable<RobotData>? robots_list;
        public async Task<IActionResult> _GridGetDataRobots()
        {
            var token = (await this.GetApiTokenAuth()).token;
            var url = "http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/Data/Dashboard/Robots";

            try
            {
                using (var httpClient = new HttpClient())
                {
                    try
                    {

                        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);//.Add("Authorization", $"Bearer {token}");
                        // var obj = new { pageNumber = 1, pageSize = 10 };
                        var request = new HttpRequestMessage
                        {
                            Method = HttpMethod.Get,
                            RequestUri = new Uri(url),
                            // Content = new StringContent(obj.ToString(), Encoding.UTF8, "application/text"),
                        };

                        var response = await httpClient.SendAsync(request);
                        if (response.IsSuccessStatusCode)
                        {
                            robots = await response.Content.ReadFromJsonAsync<getRobots>();
                            DataContext.robot.Clear();
                            if (robots != null)
                            {
                                robots_list = robots.data;
                                for (int i = 0; i < robots.data.Length; i++) {
                                    if (!string.IsNullOrWhiteSpace(robots_list.ToList()[i].name))
                                    {
                                        DataContext.robot.Add(robots_list.ToList()[i]);
                                    }
                                }

                            }
                        }
                        else
                        {
                            errorString = $"There was an error: {response.ReasonPhrase}";
                        }
                        
                        return PartialView(DataContext.robot);
                    }
                    catch (Exception ex)
                    {

                        return Json(ex);
                    }

                }
            }
            catch (Exception ex)
            {

                return Json(ex);
            }
        }
        /* Middleware Policy*/
        public async Task<IActionResult> _GetMiddlewarePolicy()
        {
            var token = (await this.GetApiTokenAuth()).token;
            var url = "http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/data/policy";
            
            using(var httpClient = new HttpClient())
            {
                try
                {
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    var request = new HttpRequestMessage
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri(url)
                    };
                    var response = await httpClient.SendAsync(request);
                    if (response.IsSuccessStatusCode)
                    {
                        var policies = await response.Content.ReadFromJsonAsync<List<ActivePolicy>>();
                        DataContext.policy.Clear();
                        if(policies != null)
                        {
                            ViewBag.PolicyList = policies;
                            DataContext.policy = policies;
                        }
                    }
                    else
                    {
                        errorString = $"There was an error: {response.ReasonPhrase}";
                    }
                    return PartialView(DataContext.policy);
                }
                catch(Exception ex)
                {
                    return PartialView(ex);
                }
            }
        }
        [HttpPost]
        public async Task<IActionResult> MiddlewarePolicy(ActivePolicy model)
        {
            if (string.IsNullOrWhiteSpace(model.id))
            {
                //update
                var token = (await this.GetApiTokenAuth()).token;
                var url = "http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/data/policy";

                using (var httpClient = new HttpClient())
                {
                    try
                    {
                        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                        var request = new HttpRequestMessage
                        {
                            Method = HttpMethod.Post,
                            RequestUri = new Uri(url),
                            Content = new StringContent(model.ToJson().ToString(), Encoding.UTF8, "application/text"),
                        };
                        var response = await httpClient.SendAsync(request);
                        if (response.IsSuccessStatusCode)
                        {
                            var code = response.StatusCode;
                        }
                        else
                        {
                            errorString = $"There was an error: {response.ReasonPhrase}";
                        }
                        return PartialView(DataContext.policy);
                    }
                    catch (Exception ex)
                    {
                        return PartialView(ex);
                    }
                }


            }
            //else
            //{
            //    //Insert
            //    Employee emp = new Employee();
            //    emp.Address = model.Address;
            //    emp.Name = model.Name;
            //    emp.DepartmentId = model.DepartmentId;
            //    emp.IsDeleted = false;
            //    db.Employees.Add(emp);
            //    db.SaveChanges();

            //}
            return PartialView(model);

        }
        public async Task<IActionResult> AddMiddlewarePolicy(string id)
        {

            ActivePolicy model = new ActivePolicy();
            return PartialView("PolicyPartial", model);
        }
            public async Task<IActionResult> MiddlewarePolicyDetails(string id)
        {

            ActivePolicy model = new ActivePolicy();
            if (!string.IsNullOrWhiteSpace(id))
            {
                var token = (await this.GetApiTokenAuth()).token;
                var url = $"http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/data/policy/"+id;

                using (var httpClient = new HttpClient())
                {
                    try
                    {
                        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                        var request = new HttpRequestMessage
                        {
                            Method = HttpMethod.Get,
                            RequestUri = new Uri(url)
                        };
                        var response = await httpClient.SendAsync(request);
                        if (response.IsSuccessStatusCode)
                        {
                            var policies = await response.Content.ReadFromJsonAsync<ActivePolicy>();
                            if (policies != null)
                            {
                                model.name = policies.name;
                                model.type = policies.type;
                                model.description = policies.description;
                                model.isActive = policies.isActive;
                            }
                        }
                        else
                        {
                            errorString = $"There was an error: {response.ReasonPhrase}";
                        }
                    }
                    catch (Exception ex)
                    {
                        return PartialView(ex);
                    }
                }

            }
            return PartialView(model);
        }
        /* Entities*/
        public async Task<IActionResult> _GetEntities()
        {
            var token = (await this.GetApiTokenAuth()).token;
            var url = "http://a05a2dd79358f45d187669bd39d273f1-853731332.eu-west-1.elb.amazonaws.com/data/{entity}";

            using (var httpClient = new HttpClient())
            {
                try
                {
                    httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    var request = new HttpRequestMessage
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri(url)
                    };
                    var response = await httpClient.SendAsync(request);
                    if (response.IsSuccessStatusCode)
                    {
                        var policies = await response.Content.ReadFromJsonAsync<List<ActivePolicy>>();
                        DataContext.policy.Clear();
                        if (policies != null)
                        {
                            ViewBag.PolicyList = policies;
                            DataContext.policy = policies;
                        }
                    }
                    else
                    {
                        errorString = $"There was an error: {response.ReasonPhrase}";
                    }
                    return PartialView(DataContext.policy);
                }
                catch (Exception ex)
                {
                    return PartialView(ex);
                }
            }
        }
        public IActionResult GetNewGuid()
        {
            return Json(Guid.NewGuid());
        }

        public async void Store5GeraToken()
        {
            var tokenInfos = await GetApiTokenAuth();
            if (tokenInfos.token is null)
            {
                return;
            }

            HttpContext.Session.Set("5geraAPIAuthToken", EncryptionDecryption.EncryptString(JsonConvert.SerializeObject(tokenInfos)));
        }

        public async Task<IActionResult> ImportTask(string obj)
        {
            var token = (await this.GetApiTokenAuth()).token;
            var newurl = new _5GeraApiConfig().defaulUrl + "/Data/Task/ImportTask";
            var url = _5gEraAPIRoutes.DashboardAPIRoutes.get_robot_task;

            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri(url),
                    Content = new StringContent(obj, Encoding.UTF8, "application/json")
                };

                var response = await httpClient.SendAsync(request);

                return Json(new
                {
                    code = response.StatusCode,
                    data = response.Content.ReadAsStringAsync()
                });
            }
        }

        private async Task<TokenInfos> GetApiTokenAuth()
        {
            var res = await _5gEraApiTokenManager.GetToken();

            return JsonConvert.DeserializeObject<TokenInfos>(res);
        }
        protected Dictionary<string, string> GetTokenInfo(string token)
        {
            var TokenInfo = new Dictionary<string, string>();

            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);
            var to = jwtSecurityToken.Payload;
            var claims = jwtSecurityToken.Claims.ToList();

            foreach (var claim in claims)
            {
                TokenInfo.Add(claim.Type, claim.Value);

            }
            foreach (var item in jwtSecurityToken.Payload)
            {
                if (item.Key == "role")
                {
                    var t =(item.Value.ToString());
                }

                if (item.Key == "permissions")
                {
                    var t = (item.Value.ToString());
                }

                if (item.Key == "Username")
                {
                    var t= item.Value.ToString();
                }

                if (item.Key == "UserID")
                {
                    var t = item.Value.ToString();
                }

            }

            return TokenInfo;
        }
    }

    public static class _5gEraApiTokenManager
    {
        private static UserCredentials DefaultUserCredentials = new UserCredentials
        {
            id = Guid.Parse("176fab3e-7034-4bcf-99a7-168ff0ea6635"),
            UserName = "5g-era",
            password = "5g-era",
            salt = "string",
            relations = new List<object>()
        };

        public static async Task<string> GetToken()
        {
            var url = new _5GeraApiConfig().defaulUrl + "/login";
            var client = new HttpClient();

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(url),
                Content = new StringContent(JsonConvert.SerializeObject(DefaultUserCredentials), Encoding.UTF8, "application/json")
            };
            var response = await client.SendAsync(request).ConfigureAwait(false);
            return await response.Content.ReadAsStringAsync();
        }

        public static UserCredentials GetUserCredentials()
        {
            return DefaultUserCredentials;
        }
    }
}
