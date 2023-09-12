using Dapper;
using eu_projects_main_platform.Models;
using eu_projects_main_platform.Models.DatabaseHandler;
using eu_projects_main_platform.Models.Enums;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System.Data;

namespace eu_projects_main_platform.Data
{
    public class MyDatabaseHandler<TEntity>
    {
        private String _controller { set; get; }
        private String _method { set; get; }
        public MyDatabaseHandler(String controller, String method)
        {
            _controller = controller;
            _method = method;
        }

        public CustomResponseModel CallDatabase(String StoredProcedure, Object ProcedureParameters, ResultType ResultType, ExecuteType ExecuteType)
        {
            CustomResponseModel resp = new CustomResponseModel()
            {
                Controller = _controller,
                Method = _method,
                Message = "SUCCESS"
            };
            try
            {
                using (IDbConnection db = new SqlConnection(AppSettings.connection_string))
                {
                    CommandType commandType = new CommandType();
                    if (ExecuteType.Equals(ExecuteType.StoredProcedure))
                        commandType = CommandType.StoredProcedure;
                    else
                        commandType = CommandType.Text;

                    if (ResultType.Equals(ResultType.Single))
                        resp.Result = JsonConvert.SerializeObject(db.Query<TEntity>(StoredProcedure, ProcedureParameters, commandType: commandType).FirstOrDefault());
                    else if (ResultType.Equals(ResultType.Multiple))
                        resp.Result = JsonConvert.SerializeObject(db.Query<TEntity>(StoredProcedure, ProcedureParameters, commandType: commandType));
                }
            }
            catch (Exception e)
            {
                resp.Message = "FAIL";
                resp.ExceptionMessage = e.Message;
            }
            return resp;
        }

        //public static DataSet ExecuteQueryDataSet(string query, ref string message)
        //{
        //    try
        //    {
        //        DataSet ds = new DataSet();
        //        using (SqlConnection connection = new SqlConnection(AppSettings.connection_string))
        //        {
        //            connection.Open();
        //            using (SqlCommand command = new SqlCommand(query, connection))
        //            {
        //                command.CommandTimeout = 0;

        //                using (SqlDataAdapter da = new SqlDataAdapter(command))
        //                {
        //                    da.Fill(ds);
        //                    connection.Dispose();
        //                    connection.Close();
        //                    return ds;
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        //PlatformLogger.ERROR(LogGroups.DATABASE_HANDLER, _logFile, "ExecuteQueryDataSet|" + query, ex.Message, ex.StackTrace);
        //        throw ex;

        //    }
        //}
    }
}
