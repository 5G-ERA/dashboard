namespace eu_projects_main_platform.Models.Planet.Background_jobs
{
    public class PlanetKafkaListener : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;
        private List<Task> workersToRun = new List<Task>();
        public PlanetKafkaListener(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }
        public Task StartAsync(CancellationToken cancellationToken)
        {

            try
            {
                //var w1 = new Worker1(_hub);
                //workersToRun.Add(Task.Run(async () => await w1.DoWork(cancellationToken)));

                var workers = new kafkaWorkers( _serviceProvider);
                workersToRun.Add(Task.Run(async () => await workers.Bc_Events(cancellationToken)));
                //workersToRun.Add(Task.Run(async () => await workers.citylogin_deliveries(cancellationToken)));
                //workersToRun.Add(Task.Run(async () => await workers.ll1_iot(cancellationToken)));
                //workersToRun.Add(Task.Run(async () => await workers.ll3_events(cancellationToken)));
                //workersToRun.Add(Task.Run(async () => await workers.UnifiedInlandTransportDocument(cancellationToken)));

                // no Task.WhenAll() here. If you do that, RunTasks() will be blocked until they complete!
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                return Task.CompletedTask;
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

    }

}
