namespace eu_projects_main_platform.Models.Astep
{
    public class MandrekasResult
    {
        public DateTime Date { get; set; }
        //public float Time { get; set; }
        public float WindSpeed { get; set; }
        public float WindDirectionAv { get; set; }
        public float AmbientTemperature { get; set; }
        public float AtmosphericPressure { get; set; }
        public float WindDirectionO { get; set; }
        public float WindDirectionDegrees { get; set; }
        public int Experiment_id { get; set; }
    }
}
