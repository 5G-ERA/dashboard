using System;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading;
using Bogus.DataSets;
using Confluent.Kafka;
using eu_projects_main_platform.Data;
using eu_projects_main_platform.Models._5groutes;
using eu_projects_main_platform.Models.DatabaseHandler;
using eu_projects_main_platform.Models.Inspectr;
using Microsoft.Extensions.Options;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Client.Connecting;
using MQTTnet.Client.Disconnecting;
using MQTTnet.Client.Options;
using MQTTnet.Client.Receiving;
using MQTTnet.Client.Subscribing;
using MQTTnet.Extensions.ManagedClient;
using MQTTnet.Protocol;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Serilog;
using SharpCompress.Common;

namespace eu_projects_main_platform.MQTT._5groutes
{
    public class _5groutesMQTTClient
    {
        static bool flag = false;
        static string response = "";

        #region
        public static CustomResponseModel MQTTClient(CustomResponseModel model, string networkService, CustomResponseModel domains, bool StopService, string coordinate, string yamlFileUrl)
        {
            var customResponse = new CustomResponseModel();

            dynamic jsonModel = JsonConvert.DeserializeObject(model.Result);

            var domain = JsonConvert.DeserializeObject<Domain>(domains.Result);
            try
            {
                string TestScenarioId = Convert.ToString(jsonModel.TestScenarioId);
                string TestScenarioDescription = jsonModel.TestScenarioDescription;
                string clientId = "Monika"+ Guid.NewGuid().ToString();

                var client = StartAsys(domain.ServerNetwork, 32612, clientId.ToString());//FIRST Call method to Connect to MQTT server

                SubscribeAsync(client, domain.SubscribeTopic);
                string domain_payload = GetPayload("inst", domain.DomainName, TestScenarioId, TestScenarioDescription, networkService, coordinate,yamlFileUrl);
                bool pub_result = PublishAsync(client, domain.PublishTopic, domain_payload);
                flag = true;
                string message = ApplicationMessageReceived(client);

                if (message != null)
                {
                    JObject json = JObject.Parse(message);
                    string value = json.SelectToken("status").Value<string>().ToUpper();

                    if (value.Contains("INSTANTIATED"))
                    {
                        customResponse.Result = message;
                        customResponse.Message = clientId.ToString();

                        string data_logging_topic = "data-logging/TWPsignalling";
                        flag = true;

                        SubscribeAsync(client, data_logging_topic);

                        string data_logging_payload = GetPayload("log", "", "", TestScenarioDescription, networkService, "","");
                        bool data_logging_result = PublishAsync(client, data_logging_topic, data_logging_payload);

                        var data = ApplicationMessageReceived(client);

                        #region // PRAE CROSS-BORDER MESSAGE

                        //if (data != null)
                        //{
                        //    string data_logging_CAMService_topic = "data-logging/CAMServiceSignalling";
                        //    flag = true;

                        //    SubscribeAsync(client, data_logging_CAMService_topic);


                        //    string data_logging_CAMService_payload = GetPayload("PRAE", domain.DomainName, TestScenarioId, TestScenarioDescription, networkService, coordinate,"");
                           
                        //    bool data_logging_CAMService_result = PublishAsync(client, data_logging_CAMService_topic, data_logging_CAMService_payload);

                        //    var data_CAMService = ApplicationMessageReceived(client);
                        //}
                        #endregion
                    }
                    else
                    {
                        customResponse.Result = message;
                    }

                }

            }
            catch (Exception ex)
            {
                customResponse.ExceptionMessage = ex.Message;
            }

            return customResponse;
        }

        private static void SubscribeAsync(IMqttClient client, string subTopic)
        {
            var topicFilter = new MqttTopicFilterBuilder().WithTopic(subTopic).Build();

            client.SubscribeAsync(new MqttClientSubscribeOptionsBuilder().WithTopicFilter(topicFilter).Build()).Wait();
        }
        private static IMqttClient StartAsys(string host, int port, string clientId)
        {
            var factory = new MqttFactory();
            MqttClient client = (MqttClient)factory.CreateMqttClient();

            var options = new MqttClientOptionsBuilder()
                    .WithTcpServer(host, port)
                    .WithClientId(clientId)
                    .Build();

            client.ConnectedHandler = new MqttClientConnectedHandlerDelegate(OnConnected);
            //client.DisconnectedHandler = new MqttClientDisconnectedHandlerDelegate(OnDisconnected);

            client.UseDisconnectedHandler(async e =>
            {
                await Task.Delay(TimeSpan.FromSeconds(5));
                try
                {
                    await client.ConnectAsync(options, CancellationToken.None);
                }
                catch (Exception ex)
                {
                    //customResponse.ExceptionMessage = ex.Message;
                }
            });

            client.ConnectAsync(options, CancellationToken.None).Wait();

            return client;
        }


        private static bool PublishAsync(IMqttClient client, string pubTopic, string payload)
        {

            var applicationMessage = new MqttApplicationMessageBuilder().WithTopic(pubTopic)//publish
                                     .WithPayload(payload)
                                     .WithRetainFlag(false)
                                     .WithQualityOfServiceLevel(MqttQualityOfServiceLevel.AtMostOnce)
                                     .Build();

            var result = client.PublishAsync(applicationMessage, CancellationToken.None).GetAwaiter().GetResult();

            if (result.ReasonCode.ToString() == "Success")
            {
                return true;
            }
            return false;

        }
        private static string GetPayload(string reqType, string broker = "", string operationId = "", string nsId = "", string nsdId="", string coordinate = "", string yamlFilUrl="")
        {
            #region
            // create a dictionary 
            //Dictionary<string, string> message = new Dictionary<string, string>();

            //switch (reqType)
            //{
            //    case "INSTANTIATED":
            //        message.Add("operation", operation);
            //        message.Add("operationId", operationId);
            //        message.Add("brokerId", broker);
            //        message.Add("nsId", nsId);
            //        message.Add("nsdId", nsdId);
            //        message.Add("coordinates", coordinate);
            //        break;
            //    case "START":
            //        message.Add("operationId", operationId);
            //        message.Add("experimentId", nsId);
            //        message.Add("usecaseId", nsdId);
            //        break;
            //    case "STOP":
            //        message.Add("operationId", operationId);
            //        message.Add("experimentId", nsId);
            //        break;
            //    default:
            //        //TERMINATED
            //        message.Add("operation", operation);
            //        message.Add("operationId", operationId);
            //        message.Add("brokerId", broker);
            //        message.Add("nsdId", nsdId);
            //        break;
            //}
            #endregion.
            string payload = null;
            
            if (reqType == "inst")
            {
                string yamlFileData = System.IO.File.ReadAllText(yamlFilUrl);
                payload = JsonConvert.SerializeObject(
                new
                {
                    operation = "CreateNetworkServiceOperation",
                    operationId = operationId, //uuid4 id,​ (???)
                    brokerId = broker, //  (based on user selection)
                    nsId = nsId, //(generated by TWP)
                    nsdId = nsdId,//testid
                    coordinates = coordinate,
                    yamlFileData

                });
            }
            else if (reqType == "ter")
            {
                payload = JsonConvert.SerializeObject(
                new
                {
                    operation = "TerminateNetworkServiceOperation",
                    operationId = operationId, //uuid4 id,​ (???)
                    brokerId = broker, //  (based on user selection)
                    nsId = nsId, //(generated by TWP)
                });
            }
            else if (reqType == "log")
            {
                payload = JsonConvert.SerializeObject(
                                new
                                {
                                    operationId = "start-experiment",
                                    usecaseId = nsdId, //uuid4 id,​ (???)
                                    experimentId = nsId, //  (based on user selection
                                });
            }

            else if (reqType == "ter-log")
            {
                payload = JsonConvert.SerializeObject(
                                new
                                {
                                    operationId = "stop-experiment",
                                    experimentId = nsId,
                                });
            }
            else if (reqType == "PRAE")
            {
                payload = JsonConvert.SerializeObject(
                                new
                                {
                                    operationId = "cross-border",
                                    experimentId = nsId,
                                    destinationDomain = broker
                                });
            }
            return payload;
        }

        public static void OnConnected(MqttClientConnectedEventArgs obj)
        {
            Log.Logger.Information("Successfully connected.");
        }

        public static void OnConnectingFailed(ManagedProcessFailedEventArgs obj)
        {
            Log.Logger.Warning("Couldn't connect to broker.");
        }

        public static void OnDisconnected(MqttClientDisconnectedEventArgs obj)
        {
            Log.Logger.Information("Successfully disconnected.");
        }


        public static IMqttClient StartAscys()
        {
            var factory = new MqttFactory();
            var client = (MqttClient)factory.CreateMqttClient();

            string ipAddress = "100.10.100.2";

            var optionsBuilder = new MqttClientOptionsBuilder()
                .WithTcpServer(ipAddress, 32612)
                .WithClientId("Monika" + Guid.NewGuid())
                .WithCleanSession();

            MqttClientOptions options = (MqttClientOptions)optionsBuilder.Build();

            client.UseConnectedHandler(e =>
            {
                Console.WriteLine("Connected to MQTT broker.");
            });
            client.UseDisconnectedHandler(async e =>
            {
                Console.WriteLine("Disconnected from MQTT broker.");

                await Task.Delay(TimeSpan.FromSeconds(1));
                try
                {
                    await client.ConnectAsync(options, CancellationToken.None);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Reconnecting to MQTT broker failed.");
                }
            });

            client.ConnectAsync(options, CancellationToken.None).Wait();

            return client;
        }
        #endregion
        
        private static string ApplicationMessageReceived(IMqttClient client)
        {
            string message = string.Empty;
            //Read  message from MQTT broker
            client.UseApplicationMessageReceivedHandler(async e =>
            {
                message = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);

                HandleMessageReceived(e.ApplicationMessage);
            });
            //waiting for getting response(looping until get response)
            //while (string.IsNullOrEmpty(message))
            while (flag)
            {
                Task.Delay(1000).GetAwaiter().GetResult();
            }
            //handling received message
            void HandleMessageReceived(MqttApplicationMessage applicationMessage)
            {
                var topic = applicationMessage.Topic;

                if (string.IsNullOrWhiteSpace(topic) == false)
                {
                    flag = false;
                }
                // response = Encoding.UTF8.GetString(applicationMessage.Payload);
            }

            return message;
        }

        public static string StopMqttTest(CustomResponseModel domains,string testId, string TestScenarioId, string clientId, string reqTpye)
        {
            var domain = JsonConvert.DeserializeObject<Domain>(domains.Result);
            string data_logging_topic = "data-logging/TWPsignalling";

            var client = StartAsys(domain.ServerNetwork, 32612, clientId);

            if (reqTpye == "StopTWP")
            {
                SubscribeAsync(client, data_logging_topic);
                string payload = GetPayload("ter-log","", "", TestScenarioId, "", "","");//
                PublishAsync(client, data_logging_topic, payload);
                flag = false;
            }
            else
            {
                SubscribeAsync(client, domain.SubscribeTopic);
                string payload = GetPayload("ter", domain.DomainName, testId, TestScenarioId, "", "","");
                PublishAsync(client, domain.PublishTopic, payload);
                flag = false;
            }

            

            string message = ApplicationMessageReceived(client);

            if (message != null)
            {
                
            }

            return message;
        }
    }
}
