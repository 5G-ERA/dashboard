using Confluent.Kafka;
using eu_projects_main_platform.Business;
using eu_projects_main_platform.Models.Planet.Interfaces;
using eu_projects_main_platform.Models.Planet.Kafka;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eu_projects_main_platform.Models.Planet.Background_jobs
{
    public class PlanetNewKafkaConsumer : IHostedService
    {
        private readonly string topic = "bc-events";
        private readonly string groupId = "bc_consumer_group_4";
        private readonly string bootstrapServers = "135.181.213.112:9092";
        //private Timer timer;

        public Task StartAsync(CancellationToken cancellationToken)
        {
            var config = new ConsumerConfig()
            {
                GroupId = groupId,
                BootstrapServers = bootstrapServers,
                AutoOffsetReset = AutoOffsetReset.Earliest,
                SecurityProtocol = SecurityProtocol.SaslPlaintext,
                SaslMechanism = SaslMechanism.Plain,
                SaslUsername = "ebos",
                SaslPassword = "6eDO0@7&KoY6"
            };

            var objects = new List<KafkaResultObject>();

            try
            {
                using (var consumerBuilder = new ConsumerBuilder<Ignore, string>(config).Build())
                {
                    consumerBuilder.Subscribe(topic);
                    var cancelToken = new CancellationTokenSource();

                    try
                    {
                        while (true)
                        {
                            var consumer = consumerBuilder.Consume(cancelToken.Token);
                            objects.Add(new KafkaResultObject
                            {
                                Key = null,
                                Obj = JsonConvert.SerializeObject(JsonConvert.DeserializeObject<BlockchainEvent>(consumer.Message.Value))
                            });
                        }
                    }
                    catch (Exception e)
                    {

                    }
                    finally
                    {
                        consumerBuilder.Close();
                    }
                }
            }
            catch (OperationCanceledException e)
            {
                //throw e;
            }

            if (objects.Count > 0)
            {
                RecordKafkaObjectPerType(PlanetKafkaTopicType.bc_events, objects);
            }

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        private void RecordKafkaObjectPerType(PlanetKafkaTopicType type, List<KafkaResultObject> objects)
        {
            new PlanetBusiness().RecordKafkaObjectsPerType(type.ToString(), objects);
        }


    }

    public class KafkaResultObject
    {
        public string Key { get; set; }
        public string Obj { get; set; }
    }

    public enum PlanetKafkaTopicType
    {
        ll1_iot,
        ll2_iot,
        ll3_iot,
        bc_events
    }
}
