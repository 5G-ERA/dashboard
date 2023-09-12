using eu_projects_main_platform.Data;
using eu_projects_main_platform.Models.DatabaseHandler;
using eu_projects_main_platform.Models.Inspectr;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace eu_projects_main_platform.Business
{
    public class InspectrBussiness
    {

        public List<RulesInspectr>? RetrieveRules()
        {
            return new InspectrData().RetrieveRules();
        }
        public List<EvidenceType>? RetriveEvidenceTypes()
        {
            return new InspectrData().RetrieveEvidenceType();
        }
        public List<EvidenceSource>? RetriveEvidenceSource()
        {
            return new InspectrData().RetrieveEvidenceSource();
        }
        public List<CrimeCase>? RetrieveCrimeCases()
        {
            return new InspectrData().RetrieveCrimeCases();
        }
        public List<CrimeLevel>? RetrieveCrimeLevel()
        {
            return new InspectrData().RetrieveCrimeLevel();
        }

        public List<CrimeType>? RetrieveCrimeType()
        {
            return new InspectrData().RetrieveCrimeType();
        }
        public List<RequestJurisdiction>? RetrieveRequestJurisdiction()
        {
            return new InspectrData().RetrieveRequestJurisdiction();
        }
        public List<RequestType>? RetrieveRequestTypes()
        {
            return new InspectrData().RetrieveRequestTypes();
        }
        public List<Countries>? RetrieveCountries()
        {
            return new InspectrData().RetrieveCountries();
        }
        public List<Member>? RetrieveMembers()
        {
            return new InspectrData().RetrieveMembers();
        }
        public List<Response>? RetrieveResponses()
        {
            return new InspectrData().RetrieveResponses();
        }
        public List<Status>? RetrieveStatuses()
        {
            return new InspectrData().RetrieveStatuses();
        }
        public long SaveRule(string ruleObject)
        {
            RuleWrapper? ruleWrapper = JsonConvert.DeserializeObject<RuleWrapper>(ruleObject);
            if (ruleWrapper == null)
            {
                return 0;
            }

            return InsertUpdateRule(ruleWrapper);
        }
        public long InsertUpdateRule(RuleWrapper ruleWrapper)
        { 
            if (ruleWrapper.RuleInspectr!=null && ruleWrapper.RuleInspectr.RuleID == 0)
            {
                ruleWrapper.RuleInspectr.RuleID = new InspectrData().InsertRule(ruleWrapper);
            }
            else
            {
                //Delete all old connections 
                if (ruleWrapper.RuleInspectr != null)
                {
                    bool delere = new InspectrData().DeleteAllRuleConnections(ruleWrapper.RuleInspectr.RuleID);
                    bool update = new InspectrData().UpdateRuleInspectr(ruleWrapper.RuleInspectr);

                }
            }
            InsertRequestorCountries(ruleWrapper);
            InsertRequestorMembers(ruleWrapper);
            InsertRequestTypes(ruleWrapper);
            InsertRequestJurisdictions(ruleWrapper);
            InsertCrimeTypes(ruleWrapper);
            InsertCrimeCountries(ruleWrapper);
            InsertCrimeLevels(ruleWrapper);
            InsertCrimeCases(ruleWrapper);
            InsertEvidenceSourses(ruleWrapper);
            InsertEvidenceTypes(ruleWrapper);
            return ruleWrapper.RuleInspectr.RuleID;
        }
        public void InsertRequestorCountries(RuleWrapper ruleWrapper)
        {
            if (ruleWrapper.RequestorCountries != null)
            {
                foreach (var requestorCountry in ruleWrapper.RequestorCountries)
                {
                    new InspectrData().InsertlRequestorCountry(ruleWrapper.RuleInspectr.RuleID, requestorCountry);
                }
            }
        }
        public void InsertRequestorMembers(RuleWrapper ruleWrapper)
        {
            if (ruleWrapper.RequestorMembers != null)
            {
                foreach (var requestorMember in ruleWrapper.RequestorMembers)
                {
                    new InspectrData().InsertRequestorMembers(ruleWrapper.RuleInspectr.RuleID, requestorMember);
                }
            }
        }
        public void InsertRequestTypes(RuleWrapper ruleWrapper)
        {
            if (ruleWrapper.RequestTypes != null)
            {
                foreach (var requestType in ruleWrapper.RequestTypes)
                {
                    new InspectrData().InsertRequestTypes(ruleWrapper.RuleInspectr.RuleID, requestType);
                }
            }
        }
        public void InsertRequestJurisdictions(RuleWrapper ruleWrapper)
        {
            if (ruleWrapper.RequestJurisdictions != null)
            {
                foreach (var requestJurisdiction in ruleWrapper.RequestJurisdictions)
                {
                    new InspectrData().InsertRequestJurisdictions(ruleWrapper.RuleInspectr.RuleID, requestJurisdiction);
                }
            }
        }
        public void InsertCrimeTypes(RuleWrapper ruleWrapper)
        {
            if (ruleWrapper.CrimeTypes != null)
            {
                foreach (var crimeType in ruleWrapper.CrimeTypes)
                {
                    new InspectrData().InsertCrimeType(ruleWrapper.RuleInspectr.RuleID, crimeType);
                }
            }
        }
        public void InsertCrimeCountries(RuleWrapper ruleWrapper)
        {
            if (ruleWrapper.CrimeCountries != null)
            {
                foreach (var crimeCountry in ruleWrapper.CrimeCountries)
                {
                    new InspectrData().InsertCrimeCountrie(ruleWrapper.RuleInspectr.RuleID, crimeCountry);
                }
            }
        }
        public void InsertCrimeLevels(RuleWrapper ruleWrapper)
        {
            if (ruleWrapper.CrimeLevels != null)
            {
                foreach (var crimeLevel in ruleWrapper.CrimeLevels)
                {
                    new InspectrData().InsertCrimeLevel(ruleWrapper.RuleInspectr.RuleID, crimeLevel);
                }
            }
        }
        public void InsertCrimeCases(RuleWrapper ruleWrapper)
        {
            if (ruleWrapper.CrimeCases != null)
            {
                foreach (var crimeCase in ruleWrapper.CrimeCases)
                {
                    new InspectrData().InsertCrimeCase(ruleWrapper.RuleInspectr.RuleID, crimeCase);
                }
            }
        }
        public void InsertEvidenceSourses(RuleWrapper ruleWrapper)
        {
            if (ruleWrapper.EvidenceSources != null)
            {
                foreach (var evindenceSource in ruleWrapper.EvidenceSources)
                {
                    new InspectrData().InsertEvidenceSource(ruleWrapper.RuleInspectr.RuleID, evindenceSource);
                }
            }
        }
        public void InsertEvidenceTypes(RuleWrapper ruleWrapper)
        {
            if (ruleWrapper.EvidenceTypes != null)
            {
                foreach (var evidenceType in ruleWrapper.EvidenceTypes)
                {
                    new InspectrData().InsertEvidenceType(ruleWrapper.RuleInspectr.RuleID, evidenceType);
                }
            }
        }
        public RuleWrapper? GetRuleData(long ruleID)
        {
            RuleWrapper ruleWrapper=new RuleWrapper();
            List <Countries>? requestorCountries = new InspectrData().GetRequestorCountriesByRuleID(ruleID);
            if (requestorCountries != null)
            {
                ruleWrapper.RequestorCountries = requestorCountries.ConvertAll<long>(a => a.countryID);
            }
            List<Member>? requestorMembers = new InspectrData().GetRequestorMembersByRuleID(ruleID);
            if (requestorMembers != null)
            {
                ruleWrapper.RequestorMembers = requestorMembers.ConvertAll<long>(a => a.RequestorMemberID);
            }
            List<RequestType>? requestTypes = new InspectrData().GetRequestTypesByRuleID(ruleID);
            if (requestTypes != null)
            {
                ruleWrapper.RequestTypes = requestTypes.ConvertAll<long>(a => a.RequestTypeID);
            }
            List<RequestJurisdiction>? requestJurisdictions= new InspectrData().GetRequestJurisdictionsByRuleID(ruleID); 
            if (requestJurisdictions != null)
            {
                ruleWrapper.RequestJurisdictions = requestJurisdictions.ConvertAll<long>(a => a.RequestJurisdictionID);
            }
            List<CrimeType>? crimeTypes = new InspectrData().GetCrimeTypesByRuleID(ruleID);
            if (crimeTypes != null)
            {
                ruleWrapper.CrimeTypes=crimeTypes.ConvertAll<long>(a => a.CrimeTypeID);
            }
            List<CrimeCountry>? crimeCountries= new InspectrData().GetCrimeCountriesByRuleID(ruleID);
            if (crimeCountries != null)
            {
                ruleWrapper.CrimeCountries=crimeCountries.ConvertAll<long>(a => a.CrimeCountryID);
            }
            List<CrimeLevel>? crimeLevels= new InspectrData().GetCrimeLevelsByRuleID(ruleID);
            if (crimeLevels != null)
            {
                ruleWrapper.CrimeLevels=crimeLevels.ConvertAll<long>(a => a.CrimeLevelID);
            }
            List<CrimeCase>? crimeCases=new InspectrData().GetCrimeCasesByRuleID(ruleID);
            if (crimeCases != null)
            {
                ruleWrapper.CrimeCases=crimeCases.ConvertAll<long>(a => a.CrimeCaseID);
            }
            List<EvidenceSource>? evidenceSources=new InspectrData().GetEvidenceSourcesByRuleID(ruleID);
            if (evidenceSources != null)
            {
                ruleWrapper.EvidenceSources=evidenceSources.ConvertAll<long>(a => a.EvidenceSourceID);
            }
            List<EvidenceType>? evidenceTypes=new InspectrData().GetEvidenceTypesByRuleID(ruleID);
            if (evidenceTypes != null)
            {
                ruleWrapper.EvidenceTypes=evidenceTypes.ConvertAll<long>(a => a.EvidenceTypeID);
            }
            RuleInspectr? ruleInspectr=new InspectrData().GetRuleInspectrByRuleID(ruleID);
            if (ruleInspectr != null)
            {
                ruleWrapper.RuleInspectr = ruleInspectr;
            }
            

            return ruleWrapper;
        }
        public bool DeleteRuleInspectr(long ruleID)
        {
          return  new InspectrData().DeleteRuleInspectr(ruleID);
        }

        public CustomResponseModel? AddEmptyRule(string ruleName, long ruleStatus, string query, string sqlQuery, string apiRuleObject)
        {
            var customResponseModel = new InspectrData().AddEmptyRule(ruleName, ruleStatus, query, sqlQuery,apiRuleObject);
            return customResponseModel;
        }

        public CustomResponseModel RetrieveLookupRules()
        {
            return new InspectrData().RetrieveLookupRules();
        }

        public CustomResponseModel RetrieveRuleDetailsPerId(long ruleId)
        {
            return new InspectrData().RetrieveRuleDetailsPerId(ruleId);
        }

        public CustomResponseModel EditInspectRuleDetails(long ruleId, string ruleName, long ruleStatus, string ruleQuery, string sqlQuery, string apiObjectString)
        {
            return new InspectrData().EditInspectRuleDetails(ruleId, ruleName, ruleStatus, ruleQuery, sqlQuery, apiObjectString);

        }

        public CustomResponseModel SetRuleAppreciationResult(long ruleId, long responseId, long statusId)
        {
            return new InspectrData().SetRuleAppreciationResult(ruleId, responseId, statusId);
        }

        public CustomResponseModel DuplicateInspectRule(long sourceRuleId, string newRuleName)
        {
            return new InspectrData().DuplicateInspectRule(sourceRuleId, newRuleName);
        }

        public CustomResponseModel SaveIncomingInspectRule(RequestInspectRule requestObj)
        {
            return new InspectrData().SaveIncomingInspectRule(requestObj);
        }

        public CustomResponseModel RecordUserApiToken(UserApiToken userToken)
        {
            return new InspectrData().RecordUserApiToken(userToken);
        }

        public CustomResponseModel EvaluateRequest(long formatedRequestRequestRuleId, string? ruleSqlQuery)
        {
            return new InspectrData().EvaluateRequest(formatedRequestRequestRuleId, ruleSqlQuery);
        }

        public CustomResponseModel RetrieveLookupRequests()
        {
            return new InspectrData().RetrieveLookupRequests();
        }

        public CustomResponseModel UpdateRequestResponse(long requestId, long responseId)
        {
            return new InspectrData().UpdateRequestResponse(requestId, responseId);
        }

        public CustomResponseModel RetrieveRequestDetails(long requestId)
        {
            return new InspectrData().RetrieveRequestDetails(requestId);
        }
    }
}
