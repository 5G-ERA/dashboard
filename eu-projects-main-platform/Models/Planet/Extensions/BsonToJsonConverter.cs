using MongoDB.Bson;
using Newtonsoft.Json;

namespace eu_projects_main_platform.Models.Planet.Extensions
{
    public static class BsonToJsonConverter
    {
        public static string getJson(this BsonDocument bson)
        {
            if (bson == null)
            {
                return "";
            }
            var dotNetData = BsonTypeMapper.MapToDotNetValue(bson);
            var json = JsonConvert.SerializeObject(dotNetData, Formatting.Indented);
            return json;
        }
        public static string getJson(this List<BsonDocument> bson)
        {
            if (bson == null)
            {
                return "[]";
            }
            var dotNetData = bson.ConvertAll(BsonTypeMapper.MapToDotNetValue);
            var json = JsonConvert.SerializeObject(dotNetData, Formatting.Indented);
            return json;
        }
    }

}
