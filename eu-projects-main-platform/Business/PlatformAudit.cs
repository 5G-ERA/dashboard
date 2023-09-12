using eu_projects_main_platform.Models;

namespace eu_projects_main_platform.Business
{
    public static class PlatformAudit
    {
        public static void INFO(String Controller, String Method, String Message)
        {
            WriteToLog("INFO", Controller, Method, Message);
        }

        public static void ERROR(String Controller, String Method, String Message, String? StackTrace)
        {
            WriteToLog("ERROR", Controller, Method, Message, StackTrace);
        }

        private static void WriteToLog(String Type, String Controller, String Method, String Message, String? StackTrace = null)
        {
            try
            {
                string loggerPath_full = AppSettings.log_folder_path + Controller + ".txt";
                lock (loggerPath_full)
                    File.AppendAllText(loggerPath_full, DateTime.Now + ": **" + Type + "**:\t\t" + Method + ": " + Message + "||" + StackTrace);
            }
            catch (Exception){}
        }
    }
}
