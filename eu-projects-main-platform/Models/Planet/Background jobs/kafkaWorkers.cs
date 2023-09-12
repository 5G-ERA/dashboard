using Confluent.Kafka;
using eu_projects_main_platform.Models.Planet.Kafka;
using Newtonsoft.Json;

namespace eu_projects_main_platform.Models.Planet.Background_jobs
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
        private readonly IServiceProvider _serviceProvider;

        public kafkaWorkers(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
            KafkaRecords.BcEvents = new List<BlockchainEvent>();
        }

        public async Task Bc_Events(CancellationToken token)
        {
            while (!token.IsCancellationRequested)
            {
                var config = new ConsumerConfig
                {
                    GroupId = "planet_bc_events_consumer_1",
                    BootstrapServers = "135.181.213.112:9092",
                    AutoOffsetReset = AutoOffsetReset.Earliest,
                    SecurityProtocol = SecurityProtocol.SaslPlaintext,
                    SaslMechanism = SaslMechanism.Plain,
                    SaslUsername = "ebos",
                    SaslPassword = "6eDO0@7&KoY6"
                };

                using (var consumer = new ConsumerBuilder<Ignore, string>(config).Build())
                {
                    try
                    {
                        var topicPartition = new TopicPartitionOffset("bc-events", new Partition(0), Offset.Beginning);
                        consumer.Assign(topicPartition);
                        //consumer.Subscribe("bc-events");
                        while (true)
                        {
                            var cr = consumer.Consume();
                            var data = JsonConvert.DeserializeObject<BlockchainEvent>(cr.Message.Value);
                            KafkaRecords.BcEvents.Add(data);
                        }
                    }
                    catch (OperationCanceledException)
                    {
                        consumer.Close();
                        consumer.Unsubscribe();
                    }
                    finally
                    {
                        consumer.Close();
                    }
                }
            }
        }

        public async Task dhl_metrics(CancellationToken token)
        {
            while (!token.IsCancellationRequested)
            {
                try
                {
                    var config = new ConsumerConfig
                    {
                        GroupId = "dashboardGUI",
                        BootstrapServers = "135.181.213.112:9092",
                        SecurityProtocol = SecurityProtocol.SaslPlaintext,
                        SaslMechanism = SaslMechanism.Plain,
                        SaslUsername = "ebos",
                        SaslPassword = "6eDO0@7&KoY6"
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

                                //var scope = _serviceProvider.CreateScope();
                                //var planetService = scope.ServiceProvider.GetRequiredService<IPlanetService>();
                            }
                        }
                        catch (OperationCanceledException)
                        {
                            // Ctrl-C was pressed.
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
                        BootstrapServers = "135.181.213.112:9092",
                        SecurityProtocol = SecurityProtocol.SaslPlaintext,
                        SaslMechanism = SaslMechanism.Plain,
                        SaslUsername = "ebos",
                        SaslPassword = "6eDO0@7&KoY6"
                    };

                    using (var consumer = new ConsumerBuilder<Null, string>(config).Build())
                    {
                        try
                        {
                            consumer.Subscribe("citylogin-deliveries");
                            while (true)
                            {
                                var cr = consumer.Consume();

                                //var scope = _serviceProvider.CreateScope();
                                //var planetService = scope.ServiceProvider.GetRequiredService<IPlanetService>();

                            }
                        }
                        catch (OperationCanceledException)
                        {
                            // Ctrl-C was pressed.
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
                        BootstrapServers = "135.181.213.112:9092",
                        SecurityProtocol = SecurityProtocol.SaslPlaintext,
                        SaslMechanism = SaslMechanism.Plain,
                        SaslUsername = "ebos",
                        SaslPassword = "6eDO0@7&KoY6"
                    };

                    using (var consumer = new ConsumerBuilder<Null, string>(config).Build())
                    {
                        try
                        {
                            consumer.Subscribe("ll1-iot");
                            while (true)
                            {
                                var cr = consumer.Consume();

                                //var scope = _serviceProvider.CreateScope();
                                //var planetService = scope.ServiceProvider.GetRequiredService<IPlanetService>();

                            }
                        }
                        catch (OperationCanceledException)
                        {
                            // Ctrl-C was pressed.
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

                                //var scope = _serviceProvider.CreateScope();
                                //var planetService = scope.ServiceProvider.GetRequiredService<IPlanetService>();

                            }
                        }
                        catch (OperationCanceledException)
                        {
                            // Ctrl-C was pressed.
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
                        BootstrapServers = "135.181.213.112:9092",
                        SecurityProtocol = SecurityProtocol.SaslPlaintext,
                        SaslMechanism = SaslMechanism.Plain,
                        SaslUsername = "ebos",
                        SaslPassword = "6eDO0@7&KoY6"
                    };

                    using (var consumer = new ConsumerBuilder<Null, string>(config).Build())
                    {
                        try
                        {
                            consumer.Subscribe("UnifiedInlandTransportDocument");
                            while (true)
                            {
                                var cr = consumer.Consume();

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

    public static class KafkaRecords
    {
        public static List<BlockchainEvent> BcEvents { get; set; }
    }
}
