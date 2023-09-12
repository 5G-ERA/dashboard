using eu_projects_main_platform.Business;
using eu_projects_main_platform.Models.DatabaseHandler;
using eu_projects_main_platform.Models.Enums;
using eu_projects_main_platform.Models.Inspectr;
using Newtonsoft.Json;

namespace eu_projects_main_platform.Data
{
    public class InspectrData
    {
        String _controller_name = "InspectrData";
        public List<RulesInspectr>? RetrieveRules()
        {
            List<RulesInspectr>? rules = new List<RulesInspectr>();
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RulesInspectr>(_controller_name, "RetrieveRules").CallDatabase("SP_Retrieve_Rules", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    rules = JsonConvert.DeserializeObject<List<RulesInspectr>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "RetrieveRules", ex.Message, ex.StackTrace);
            }
            return rules;
        }

        public List<EvidenceType>? RetrieveEvidenceType()
        {
            List<EvidenceType>? evidenceTypes = new List<EvidenceType>();
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<EvidenceType>(_controller_name, "RetriveEvidenceType").CallDatabase("SP_Retrieve_Evidence_type", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    evidenceTypes = JsonConvert.DeserializeObject<List<EvidenceType>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "RetrieveEvidenceType", ex.Message, ex.StackTrace);
            }
            return evidenceTypes;
        }
        public List<EvidenceSource>? RetrieveEvidenceSource()
        {
            List<EvidenceSource>? evidenceSource = new List<EvidenceSource>();
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<EvidenceSource>(_controller_name, "RetrieveEvidenceSource").CallDatabase("SP_Retrieve_Evidence_Source", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    evidenceSource = JsonConvert.DeserializeObject<List<EvidenceSource>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "RetrieveEvidenceSource", ex.Message, ex.StackTrace);
            }
            return evidenceSource;
        }
        public List<CrimeCase>? RetrieveCrimeCases()
        {
            List<CrimeCase>? crimeCases = new List<CrimeCase>();
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<CrimeCase>(_controller_name, "RetrieveCrimeCases").CallDatabase("SP_Retrieve_Crime_Case", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    crimeCases = JsonConvert.DeserializeObject<List<CrimeCase>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "RetrieveCrimeCases", ex.Message, ex.StackTrace);
            }
            return crimeCases;
        }
        public List<CrimeLevel>? RetrieveCrimeLevel()
        {
            List<CrimeLevel>? crimeLevels = new List<CrimeLevel>();
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<CrimeLevel>(_controller_name, "RetrieveCrimeLevel").CallDatabase("SP_Retrieve_Crime_Level", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    crimeLevels = JsonConvert.DeserializeObject<List<CrimeLevel>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "RetrieveCrimeLevel", ex.Message, ex.StackTrace);
            }
            return crimeLevels;
        }
        public List<CrimeType>? RetrieveCrimeType()
        {
            List<CrimeType>? crimeType = new List<CrimeType>();
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<CrimeType>(_controller_name, "RetrieveCrimeType").CallDatabase("SP_Retrieve_Crime_Type", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    crimeType = JsonConvert.DeserializeObject<List<CrimeType>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "RetrieveCrimeType", ex.Message, ex.StackTrace);
            }
            return crimeType;
        }
        public List<RequestJurisdiction>? RetrieveRequestJurisdiction()
        {
            List<RequestJurisdiction>? requestJurisdiction = new List<RequestJurisdiction>();
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RequestJurisdiction>(_controller_name, "RetrieveRequestJurisdiction").CallDatabase("SP_Retrieve_Request_Jurisdiction", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    requestJurisdiction = JsonConvert.DeserializeObject<List<RequestJurisdiction>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "RetrieveRequestJurisdiction", ex.Message, ex.StackTrace);
            }
            return requestJurisdiction;
        }
        public List<RequestType>? RetrieveRequestTypes()
        {
            List<RequestType>? requestJurisdiction = new List<RequestType>();
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RequestType>(_controller_name, "RetrieveRequestTypes").CallDatabase("SP_Retrieve_Request_Type", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    requestJurisdiction = JsonConvert.DeserializeObject<List<RequestType>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "RetrieveRequestTypes", ex.Message, ex.StackTrace);
            }
            return requestJurisdiction;
        }
        public List<Countries>? RetrieveCountries()
        {
            List<Countries>? countries = new List<Countries>();
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<Countries>(_controller_name, "RetrieveCountries").CallDatabase("SP_Retrieve_Crime_Country", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    countries = JsonConvert.DeserializeObject<List<Countries>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "RetrieveCountries", ex.Message, ex.StackTrace);
            }
            return countries;
        }
        public List<Member>? RetrieveMembers()
        {
            List<Member>? members = new List<Member>();
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<Member>(_controller_name, "RetrieveMembers").CallDatabase("SP_RetrieveMember", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    members = JsonConvert.DeserializeObject<List<Member>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "RetrieveMembers", ex.Message, ex.StackTrace);
            }
            return members;
        }
        public List<Response>? RetrieveResponses()
        {
            List<Response>? responses = new List<Response>();
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<Response>(_controller_name, "RetrieveResponse").CallDatabase("SP_RetrieveResponseData", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    responses = JsonConvert.DeserializeObject<List<Response>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "RetrieveResponse", ex.Message, ex.StackTrace);
            }
            return responses;
        }
        public List<Status>? RetrieveStatuses()
        {
            List<Status>? statuses = new List<Status>();
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<Status>(_controller_name, "RetrieveStatuses").CallDatabase("SP_Retrieve_Status", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    statuses = JsonConvert.DeserializeObject<List<Status>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "RetrieveStatuses", ex.Message, ex.StackTrace);
            }
            return statuses;
        }
        public List<Status>? RetrievePriorities()
        {
            List<Status>? statuses = new List<Status>();
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<Status>(_controller_name, "RetrievePriorities").CallDatabase("SP_Retrieve_Priority", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    statuses = JsonConvert.DeserializeObject<List<Status>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "RetrievePriorities", ex.Message, ex.StackTrace);
            }
            return statuses;
        }
        public long InsertRule(RuleWrapper? ruleWrapper)
        {
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<long>(_controller_name, "InsertRule").CallDatabase("SP_InsertIntoRules", new { RuleName = ruleWrapper.RuleInspectr.RuleName, StatusName = ruleWrapper.RuleInspectr.Status, ResponseName = ruleWrapper.RuleInspectr.Response, PriorityRange = ruleWrapper.RuleInspectr.PriorityRange }, ResultType.Single, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    ruleWrapper.RuleInspectr.RuleID = JsonConvert.DeserializeObject<long>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "InsertRule", ex.Message, ex.StackTrace);
            }
            return ruleWrapper.RuleInspectr.RuleID;
        }
        public bool InsertlRequestorCountry(long ruleID, long Country_ID)
        {
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RuleWrapper>(_controller_name, "InsertlRequestorCountry").CallDatabase("tblRequestorCountry2Rule_INSERT", new { RuleID = ruleID, RequestorCountry = Country_ID }, ResultType.Single, ExecuteType.StoredProcedure);
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "InsertlRequestorCountry", ex.Message, ex.StackTrace);
                return false;
            }
            return true;
        }
        public bool InsertRequestorMembers(long ruleID, long requestorMember)
        {
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RuleWrapper>(_controller_name, "InsertRequestorMembers").CallDatabase("SP_Insert_Member", new { RuleID = ruleID, RequestorMember = requestorMember }, ResultType.Single, ExecuteType.StoredProcedure);
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "InsertRequestorMembers", ex.Message, ex.StackTrace);
                return false;
            }
            return true;
        }
        public bool InsertRequestTypes(long ruleID, long requestType)
        {
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RuleWrapper>(_controller_name, "InsertRequestTypes").CallDatabase("SP_Insert_RequestType", new { RuleID = ruleID, RequestType = requestType }, ResultType.Single, ExecuteType.StoredProcedure);
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "InsertRequestTypes", ex.Message, ex.StackTrace);
                return false;
            }
            return true;
        }
        public bool InsertRequestJurisdictions(long ruleID, long requestJurisdiction)
        {
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RuleWrapper>(_controller_name, "InsertRequestJurisdictions").CallDatabase("SP_Insert_RequestJuri", new { RuleID = ruleID, RequestJuri = requestJurisdiction }, ResultType.Single, ExecuteType.StoredProcedure);
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "InsertRequestJurisdictions", ex.Message, ex.StackTrace);
                return false;
            }
            return true;
        }
        public bool InsertCrimeType(long ruleID, long crimeType)
        {
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RuleWrapper>(_controller_name, "InsertCrimeTypes").CallDatabase("SP_Insert_CrimeType", new { RuleID = ruleID, CrimeType = crimeType }, ResultType.Single, ExecuteType.StoredProcedure);
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "InsertCrimeTypes", ex.Message, ex.StackTrace);
                return false;
            }
            return true;
        }
        public bool InsertCrimeCountrie(long ruleID, long crimeCountry)
        {
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RuleWrapper>(_controller_name, "InsertCrimeCountries").CallDatabase("SP_Insert_CrimeCountry", new { RuleID = ruleID, CrimeCountry = crimeCountry }, ResultType.Single, ExecuteType.StoredProcedure);
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "InsertCrimeCountries", ex.Message, ex.StackTrace);
                return false;
            }
            return true;
        }
        public bool InsertCrimeLevel(long ruleID, long crimeLevel)
        {
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RuleWrapper>(_controller_name, "InsertCrimeLevels").CallDatabase("SP_Insert_CrimeLevel", new { RuleID = ruleID, CrimeLevel = crimeLevel }, ResultType.Single, ExecuteType.StoredProcedure);
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "InsertCrimeLevels", ex.Message, ex.StackTrace);
                return false;
            }
            return true;
        }
        public bool InsertCrimeCase(long ruleID, long crimeCase)
        {
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RuleWrapper>(_controller_name, "InsertCrimeCase").CallDatabase("SP_Insert_CrimeCase", new { RuleID = ruleID, CrimeCase = crimeCase }, ResultType.Single, ExecuteType.StoredProcedure);
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "InsertCrimeCase", ex.Message, ex.StackTrace);
                return false;
            }
            return true;
        }
        public bool InsertEvidenceSource(long ruleID, long evidenceSource)
        {
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RuleWrapper>(_controller_name, "InsertEvidenceSource").CallDatabase("SP_Insert_EvidenceSource", new { RuleID = ruleID, EvidenceSource = evidenceSource }, ResultType.Single, ExecuteType.StoredProcedure);
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "InsertEvidenceSource", ex.Message, ex.StackTrace);
                return false;
            }
            return true;
        }
        public bool InsertEvidenceType(long ruleID, long evidenceType)
        {
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RuleWrapper>(_controller_name, "InsertEvidenceType").CallDatabase("SP_Insert_EvidenceType", new { RuleID = ruleID, EvidenceType = evidenceType }, ResultType.Single, ExecuteType.StoredProcedure);
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "InsertEvidenceType", ex.Message, ex.StackTrace);
                return false;
            }
            return true;
        }
        public List<Countries>? GetRequestorCountriesByRuleID(long ruleID)
        {
            List<Countries>? requestorCountries = null;
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<Countries>(_controller_name, "GetRequestorCountriesByRuleID").CallDatabase("get_tblRequestorCountryByRuleID", new { RuleID = ruleID }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    requestorCountries = JsonConvert.DeserializeObject<List<Countries>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "GetRequestorCountriesByRuleID", ex.Message, ex.StackTrace);

            }
            return requestorCountries;
        }
        public List<Member>? GetRequestorMembersByRuleID(long ruleID)
        {
            List<Member>? requestorMembers = null;
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<Member>(_controller_name, "GetRequestorMembersByRuleID").CallDatabase("get_RequestorMembersByRuleID", new { RuleID = ruleID }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    requestorMembers = JsonConvert.DeserializeObject<List<Member>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "GetRequestorMembersByRuleID", ex.Message, ex.StackTrace);

            }
            return requestorMembers;
        }
        public List<RequestType>? GetRequestTypesByRuleID(long ruleID)
        {
            List<RequestType>? requestTypes = null;
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RequestType>(_controller_name, "GetRequestTypesByRuleID").CallDatabase("get_RequestTypesByRuleID", new { RuleID = ruleID }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    requestTypes = JsonConvert.DeserializeObject<List<RequestType>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "GetRequestTypesByRuleID", ex.Message, ex.StackTrace);

            }
            return requestTypes;
        }
        public List<RequestJurisdiction>? GetRequestJurisdictionsByRuleID(long ruleID)
        {
            List<RequestJurisdiction>? requestJurisdictions = null;
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RequestJurisdiction>(_controller_name, "GetRequestJurisdictionsByRuleID").CallDatabase("get_RequestJurisdictionsByRuleID", new { RuleID = ruleID }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    requestJurisdictions = JsonConvert.DeserializeObject<List<RequestJurisdiction>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "GetRequestJurisdictionsByRuleID", ex.Message, ex.StackTrace);

            }
            return requestJurisdictions;
        }
        public List<CrimeType>? GetCrimeTypesByRuleID(long ruleID)
        {
            List<CrimeType>? crimeTypes = null;
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<CrimeType>(_controller_name, "GetCrimeTypesByRuleID").CallDatabase("get_CrimeTypesByRuleID", new { RuleID = ruleID }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    crimeTypes = JsonConvert.DeserializeObject<List<CrimeType>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "GetCrimeTypesByRuleID", ex.Message, ex.StackTrace);

            }
            return crimeTypes;
        }
        public List<CrimeCountry>? GetCrimeCountriesByRuleID(long ruleID)
        {
            List<CrimeCountry>? crimeCountries = null;
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<CrimeCountry>(_controller_name, "GetCrimeCountriesByRuleID").CallDatabase("get_CrimeCountriesByRuleID", new { RuleID = ruleID }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    crimeCountries = JsonConvert.DeserializeObject<List<CrimeCountry>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "GetCrimeTypesByRuleID", ex.Message, ex.StackTrace);

            }
            return crimeCountries;
        }
        public List<CrimeLevel>? GetCrimeLevelsByRuleID(long ruleID)
        {
            List<CrimeLevel>? crimeLeves = null;
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<CrimeLevel>(_controller_name, "GetCrimeLevelsByRuleID").CallDatabase("get_CrimeLevesByRuleID", new { RuleID = ruleID }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    crimeLeves = JsonConvert.DeserializeObject<List<CrimeLevel>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "GetCrimeLevelsByRuleID", ex.Message, ex.StackTrace);

            }
            return crimeLeves;
        }

        public List<CrimeCase>? GetCrimeCasesByRuleID(long ruleID)
        {
            List<CrimeCase>? crimeCases = null;
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<CrimeCase>(_controller_name, "GetCrimeCasesByRuleID").CallDatabase("get_CrimeCasesByRuleID", new { RuleID = ruleID }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    crimeCases = JsonConvert.DeserializeObject<List<CrimeCase>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "GetCrimeCasesByRuleID", ex.Message, ex.StackTrace);

            }
            return crimeCases;
        }
        public List<EvidenceSource>? GetEvidenceSourcesByRuleID(long ruleID)
        {
            List<EvidenceSource>? evidenceSources = null;
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<EvidenceSource>(_controller_name, "GetEvidenceSourcesByRuleID").CallDatabase("get_EvidenceSourcesByRuleID", new { RuleID = ruleID }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    evidenceSources = JsonConvert.DeserializeObject<List<EvidenceSource>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "GetEvidenceSourcesByRuleID", ex.Message, ex.StackTrace);

            }
            return evidenceSources;
        }
        public List<EvidenceType>? GetEvidenceTypesByRuleID(long ruleID)
        {
            List<EvidenceType>? evidenceSources = null;
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<EvidenceType>(_controller_name, "GetEvidenceTypesByRuleID").CallDatabase("get_EvidenceTypesByRuleID", new { RuleID = ruleID }, ResultType.Multiple, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    evidenceSources = JsonConvert.DeserializeObject<List<EvidenceType>>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "GetEvidenceTypesByRuleID", ex.Message, ex.StackTrace);

            }
            return evidenceSources;
        }
        public RuleInspectr? GetRuleInspectrByRuleID(long ruleID)
        {
            RuleInspectr? ruleInspectr = null;   
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RuleInspectr>(_controller_name, "GetEvidenceTypesByRuleID").CallDatabase("get_RuleInspectrByRuleID", new { RuleID = ruleID }, ResultType.Single, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    ruleInspectr = JsonConvert.DeserializeObject<RuleInspectr>(resp.Result);
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "GetRuleInspectrByRuleID", ex.Message, ex.StackTrace);

            }
            return ruleInspectr;
        }
        public bool DeleteAllRuleConnections(long ruleID)
        {
            bool delete = false;
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<bool>(_controller_name, "DeleteAllRuleConnections").CallDatabase("DeleteAllRuleConnections_Inspectr", new { RuleID = ruleID }, ResultType.Single, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    delete= true;
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "GetRuleInspectrByRuleID", ex.Message, ex.StackTrace);
                delete = false;
            }
            return delete;
        }
        public bool UpdateRuleInspectr(RuleInspectr ruleInspectr)
        {
            bool update = true;
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RuleInspectr>(_controller_name, "UpdateRuleInspectr").CallDatabase("UpdateRuleInspectr", new { RuleID = ruleInspectr.RuleID, RuleName=ruleInspectr.RuleName, Status=ruleInspectr.Status, Response=ruleInspectr.Response, PriorityRange=ruleInspectr.PriorityRange }, ResultType.Single, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    update = true;
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "UpdateRuleInspectr", ex.Message, ex.StackTrace);
                update = false;
            }
            return update;
        }
        public bool DeleteRuleInspectr(long ruleID)
        {
            bool delete = true;
            try
            {
                CustomResponseModel resp = new MyDatabaseHandler<RuleInspectr>(_controller_name, "DeleteRuleInspectr").CallDatabase("SP_Delete_Rule_BY_ID", new { RuleID = ruleID }, ResultType.Single, ExecuteType.StoredProcedure);
                if (resp.Result != null && String.IsNullOrEmpty(resp.ExceptionMessage))
                {
                    delete = true;
                }
            }
            catch (Exception ex)
            {
                PlatformAudit.ERROR("InspectrData", "DeleteRuleInspectr", ex.Message, ex.StackTrace);
                delete = false;
            }
            return delete;
        }

        public CustomResponseModel AddEmptyRule(string ruleName, long ruleStatus, string query, string sql, string apiRuleObject)
        {
            return new MyDatabaseHandler<long>(_controller_name, "AddEmptyRule").CallDatabase("InsertRule",
                new { ruleName = ruleName , statusId = ruleStatus , query = query, sql = sql, apiRuleString= apiRuleObject}, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveLookupRules()
        {
            return new MyDatabaseHandler<DetailedRuleInspectr>(_controller_name, "RetrieveLookupRules").CallDatabase(
                "RetrieveLookupRules", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveRuleDetailsPerId(long ruleId)
        {
            return new MyDatabaseHandler<DetailedRuleInspectr>(_controller_name, "RetrieveRuleDetailsPerId")
                .CallDatabase("RetrieveRuleDetailsPerId", new { ruleId = ruleId }, ResultType.Single,
                    ExecuteType.StoredProcedure);
        }

        public CustomResponseModel EditInspectRuleDetails(long ruleId, string ruleName, long ruleStatus, string ruleQuery, string sql, string apiObjectString)
        {
            return new MyDatabaseHandler<RuleInspectr>(_controller_name, "EditInspectRuleDetails").CallDatabase(
                "EditInspectRuleDetails",
                new { ruleId = ruleId, ruleName = ruleName, statusId = ruleStatus, query = ruleQuery, sql = sql, apiRuleString = apiObjectString },
                ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel SetRuleAppreciationResult(long ruleId, long responseId, long statusId)
        {
            return new MyDatabaseHandler<DetailedRuleInspectr>(_controller_name, "SetRuleAppreciationResult")
                .CallDatabase("SetRuleAppreciationResult",
                    new { ruleId = ruleId, responseId = responseId, statusId = statusId }, ResultType.Single,
                    ExecuteType.StoredProcedure);
        }

        public CustomResponseModel DuplicateInspectRule(long sourceRuleId, string newRuleName)
        {
            return new MyDatabaseHandler<RuleInspectr>(_controller_name, "DuplicateInspectRule").CallDatabase(
                "DuplicateInspectRule", new { sourceRuleId = sourceRuleId, newRuleName = newRuleName },
                ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel SaveIncomingInspectRule(RequestInspectRule requestObj)
        {
            return new MyDatabaseHandler<RequestInspectRule>(_controller_name, "SaveIncomingInspectRule").CallDatabase(
                "SaveIncomingInspectRule", new
                {
                    referenceId = requestObj.ReferenceID,
                    requestCountryId = requestObj.RequestorCountryID,
                    requestMemberId = requestObj.RequestorMemberID,
                    requestTypeId = requestObj.RequestTypeID,
                    requestJurisdictionId = requestObj.RequestJurisdictionID,
                    crimeTypeId = requestObj.CrimeTypeID,
                    crimeCountryId = requestObj.CrimeCountryID,
                    crimeCaseId = requestObj.CrimeCaseID,
                    crimeLevelId = requestObj.CrimeLevelID,
                    evidenceTypeId = requestObj.EvidenceTypeID,
                    evidenceSourceId = requestObj.EvidenceSourceID,
                    query = requestObj.RequestQuery
                }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RecordUserApiToken(UserApiToken userToken)
        {
            return new MyDatabaseHandler<UserApiToken>(_controller_name, "RecordUserApiToken").CallDatabase(
                "InsertUserApiToken", new { userId = userToken.UserID, token = userToken.TokenKey, note = userToken.Note, expiryDate = userToken.ExpiryDate }, ResultType.Single,
                ExecuteType.StoredProcedure);
        }
        

        public CustomResponseModel EvaluateRequest(long requestRuleId, string? ruleSqlQuery)
        {
            return new MyDatabaseHandler<bool>(_controller_name, "EvaluateRequest").CallDatabase("EvaluateRequestRule",
                new { IDInserted = requestRuleId, query = ruleSqlQuery }, ResultType.Single,
                ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveLookupRequests()
        {
            return new MyDatabaseHandler<RequestResponse>(_controller_name, "RetrieveLookupRequests").CallDatabase(
                "RetrieveLookupRequests", new { }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel UpdateRequestResponse(long requestId, long responseId)
        {
            return new MyDatabaseHandler<long>(_controller_name, "UpdateRequestResponse").CallDatabase(
                "UpdateRequestResponse", new
                {
                    requestId = requestId,
                    responseId = responseId
                }, ResultType.Single, ExecuteType.StoredProcedure);
        }

        public CustomResponseModel RetrieveRequestDetails(long requestId)
        {
            return new MyDatabaseHandler<string>(_controller_name, "RetrieveRequestDetails").CallDatabase(
                "RetrieveRequestDetails", new { requestId = requestId }, ResultType.Single,
                ExecuteType.StoredProcedure);
        }
    }

}
