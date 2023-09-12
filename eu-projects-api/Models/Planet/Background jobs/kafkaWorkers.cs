using Confluent.Kafka;
using eu_projects_api.Models.Planet.Hubs;
using eu_projects_api.Models.Planet.kafka;
using eu_projects_api.Models.Planet.Services;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace eu_projects_api.Models.Planet.Background_jobs
{
    public interface IWorker
    {
        //Task DoWork(CancellationToken token);
        Task dhl_metrics(CancellationToken token);
        Task citylogin_deliveries(CancellationToken token);
        Task ll1_iot(CancellationToken token);
        Task ll3_events(CancellationToken token);
        Task UnifiedInlandTransportDocument(CancellationToken token);
    }
    
    public class kafkaWorkers : IWorker
    {
        private readonly IHubContext<PlanetHub> _hub;
        private readonly IServiceProvider _serviceProvider;

        public kafkaWorkers(IHubContext<PlanetHub> hub, IServiceProvider serviceProvider)
        {
            _hub = hub;
            _serviceProvider = serviceProvider;
        }
        public async Task dhl_metrics(CancellationToken token)
        {
            while (!token.IsCancellationRequested)
            {
                try
                {
                    var config = new ConsumerConfig
                    {
                        GroupId = "dashboardAPI",
                        BootstrapServers = "localhost:9092"
                    };

                    using (var consumer = new ConsumerBuilder<Null, string>(config).Build())
                    {
                        try
                        {
                            consumer.Subscribe("dhl-metrics");
                            while (true)
                            {
                                var cr = consumer.Consume();
                                var data = JsonConvert.DeserializeObject<DHL_metrics>(cr.Message.Value);

                                await Task.WhenAll(_hub.Clients.Group($"dhl-metrics-data").SendAsync("dhl-metrics", data));
                                
                                //var scope = _serviceProvider.CreateScope();
                                //var planetService = scope.ServiceProvider.GetRequiredService<IPlanetService>();
                            }
                        }
                        catch (OperationCanceledException)
                        {
                            // Ctrl-C was pressed.
                        }
                        catch (Exception ex)
                        {

                        }
                        finally
                        {
                            //consumer.Close();
                            //await Task.CompletedTask;
                        }
                    }
                }
                catch (TaskCanceledException)
                {
                    break;
                }

            }

        }
        public async Task citylogin_deliveries(CancellationToken token)
        {
            while (!token.IsCancellationRequested)
            {
                try
                {
                    var config = new ConsumerConfig
                    {
                        GroupId = "dashboardAPI",
                        BootstrapServers = "localhost:9092"
                    };

                    using (var consumer = new ConsumerBuilder<Null, string>(config).Build())
                    {
                        try
                        {
                            consumer.Subscribe("citylogin-deliveries");
                            while (true)
                            {
                                var cr = consumer.Consume();
                                await Task.WhenAll(_hub.Clients.Group($"citylogin-deliveries-data").SendAsync("citylogin-deliveries", cr.Message.Value));
                                
                                //var scope = _serviceProvider.CreateScope();
                                //var planetService = scope.ServiceProvider.GetRequiredService<IPlanetService>();

                            }
                        }
                        catch (OperationCanceledException)
                        {
                            // Ctrl-C was pressed.
                        }
                        catch (Exception ex)
                        {

                        }
                        finally
                        {
                            //consumer.Close();
                            //await Task.CompletedTask;
                        }
                    }
                }
                catch (TaskCanceledException)
                {
                    break;
                }

            }

        }
        public async Task ll1_iot(CancellationToken token)
        {
            while (!token.IsCancellationRequested)
            {
                try
                {
                    var config = new ConsumerConfig
                    {
                        GroupId = "dashboardAPI",
                        BootstrapServers = "localhost:9092"
                    };

                    using (var consumer = new ConsumerBuilder<Null, string>(config).Build())
                    {
                        try
                        {
                            consumer.Subscribe("ll1-iot");
                            while (true)
                            {
                                var cr = consumer.Consume();
                                await Task.WhenAll(_hub.Clients.Group($"ll1-iot-data").SendAsync("ll1-iot", cr.Message.Value));
                                
                                //var scope = _serviceProvider.CreateScope();
                                //var planetService = scope.ServiceProvider.GetRequiredService<IPlanetService>();

                            }
                        }
                        catch (OperationCanceledException)
                        {
                            // Ctrl-C was pressed.
                        }
                        catch (Exception ex)
                        {

                        }
                        finally
                        {
                            //consumer.Close();
                            //await Task.CompletedTask;
                        }
                    }
                }
                catch (TaskCanceledException)
                {
                    break;
                }

            }

        }
        public async Task ll3_events(CancellationToken token)
        {
            while (!token.IsCancellationRequested)
            {
                try
                {
                    var config = new ConsumerConfig
                    {
                        GroupId = "dashboardAPI",
                        BootstrapServers = "localhost:9092"
                    };

                    using (var consumer = new ConsumerBuilder<Null, string>(config).Build())
                    {
                        try
                        {
                            consumer.Subscribe("ll3-events");
                            while (true)
                            {
                                var cr = consumer.Consume();
                                await Task.WhenAll(_hub.Clients.Group($"ll3-events-data").SendAsync("ll3-events", cr.Message.Value));

                                //var scope = _serviceProvider.CreateScope();
                                //var planetService = scope.ServiceProvider.GetRequiredService<IPlanetService>();

                            }
                        }
                        catch (OperationCanceledException)
                        {
                            // Ctrl-C was pressed.
                        }
                        catch (Exception ex)
                        {

                        }
                        finally
                        {
                            //consumer.Close();
                            //await Task.CompletedTask;
                        }
                    }
                }
                catch (TaskCanceledException)
                {
                    break;
                }

            }

        }
        public async Task UnifiedInlandTransportDocument(CancellationToken token)
        {
            while (!token.IsCancellationRequested)
            {
                try
                {
                    var config = new ConsumerConfig
                    {
                        GroupId = "dashboardAPI",
                        BootstrapServers = "localhost:9092"
                    };

                    using (var consumer = new ConsumerBuilder<Null, string>(config).Build())
                    {
                        try
                        {
                            consumer.Subscribe("UnifiedInlandTransportDocument");
                            while (true)
                            {
                                var cr = consumer.Consume();
                                await Task.WhenAll(_hub.Clients.Group($"UnifiedInlandTransportDocument-data").SendAsync("UnifiedInlandTransportDocument", cr.Message.Value));

                                //var scope = _serviceProvider.CreateScope();
                                //var planetService = scope.ServiceProvider.GetRequiredService<IPlanetService>();

                            }
                        }
                        catch (OperationCanceledException)
                        {
                            // Ctrl-C was pressed.
                        }
                        catch (Exception ex)
                        {

                        }
                        finally
                        {
                            //consumer.Close();
                            //await Task.CompletedTask;
                        }
                    }
                }
                catch (TaskCanceledException)
                {
                    break;
                }

            }

        }

    }
}
