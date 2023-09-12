using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using eu_projects_main_platform.Business;
using eu_projects_main_platform.Models.Enums;
using eu_projects_main_platform.Models.Inspectr;
using eu_projects_main_platform.Models.Inspectr.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace eu_projects_main_platform.Controllers
{
    public class InspectrController : Controller
    {
        private IConfiguration _configuration;
        public InspectrController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public IActionResult RetrieveRulesView()
        {
                 return PartialView("Rules");
        }

        public IActionResult VisualizeRulesView()
        {
            return PartialView("VisualiseRules");
        }

        public IActionResult VisualizeRequestsView()
        {
            return PartialView("Requests");
        }

        public IActionResult RetrieveRequestDetails(long requestId)
        {
            return Json(new InspectrBussiness().RetrieveRequestDetails(requestId));
        }

        public IActionResult AddInspectRule(string ruleName, long ruleStatus, string ruleConditions, string sqlQuery)
        {
            var inspectrBussiness = new InspectrBussiness();

            var countries = inspectrBussiness.RetrieveCountries();
            var requestorMembers = inspectrBussiness.RetrieveMembers();
            var requestTypes = inspectrBussiness.RetrieveRequestTypes();
            var jurisdictions = inspectrBussiness.RetrieveRequestJurisdiction();
            var crimeTypes = inspectrBussiness.RetrieveCrimeType();
            var crimecases = inspectrBussiness.RetrieveCrimeCases();
            var crimeLevels = inspectrBussiness.RetrieveCrimeLevel();
            var evidenceSources = inspectrBussiness.RetriveEvidenceSource();
            var evidenceTypes = inspectrBussiness.RetriveEvidenceTypes();
            var statuses = inspectrBussiness.RetrieveStatuses();

            try
            {
                var apiRuleObj = GetApiRuleObj(ruleConditions, countries, requestorMembers, requestTypes, jurisdictions, crimeTypes,
                    crimecases, evidenceSources, evidenceTypes, crimeLevels);

                var apiRuleString = JsonConvert.SerializeObject(apiRuleObj);

                var ruleId = AddEmptyInspectRule(ruleName, ruleStatus, ruleConditions, sqlQuery, apiRuleString);

                var result = new
                {
                    status = "success",
                    content = ruleId
                };

                return Json(result);
            }
            catch (Exception e)
            {
                var result = new
                {
                    status = "failed",
                    content = e.Message
                };
                return Json(result);
            }
        }

        public IActionResult RetrieveLookupRules()
        {
            return Json(new InspectrBussiness().RetrieveLookupRules());
        }

        public IActionResult RetrieveLookupRequests()
        {
            return Json(new InspectrBussiness().RetrieveLookupRequests());
        }

        public IActionResult RetrieveRuleDetailsPerId(long ruleId)
        {
            return Json(new InspectrBussiness().RetrieveRuleDetailsPerId(ruleId));
        }
        public long AddEmptyInspectRule(string ruleName, long ruleStatus, string ruleQuery, string sqlQuery, string apiObjectString)
        {
            var res = new InspectrBussiness().AddEmptyRule(ruleName, ruleStatus, ruleQuery, sqlQuery, apiObjectString);
            return long.Parse(res.Result);
        }

        public IActionResult EditInspectRuleDetails(long ruleId, string ruleName, long ruleStatus, string ruleQuery, string sqlQuery, string apiObjectString)
        {
            return Json(new InspectrBussiness().EditInspectRuleDetails(ruleId, ruleName, ruleStatus, ruleQuery, sqlQuery, apiObjectString));
        }

        public IActionResult SetRuleAppreciationResult(long ruleId, long responseId, long statusId)
        {
            return Json(new InspectrBussiness().SetRuleAppreciationResult(ruleId, responseId, statusId));
        }

        public IActionResult DuplicateInspectRule(long sourceRuleId, string newRuleName)
        {
            return Json(new InspectrBussiness().DuplicateInspectRule(sourceRuleId, newRuleName));
        }

        //[HttpPost]
        //public IActionResult SaveIncomingInspectRule(JObject jsonRequestRule)
        //{
        //    var requestObj = JsonConvert.DeserializeObject<RequestInspectRule>(jsonRequestRule.ToString());
        //    var requestResponse = new InspectrBussiness().SaveIncomingInspectRule(requestObj);
        //    return Json(requestResponse.Result);
        //}

        [HttpPost]
        public IActionResult RetrieveRules()
        {
            return Json(new InspectrBussiness().RetrieveRules());
        }
        [HttpPost]
        public IActionResult RetrieveEvidenceTypes()
        {
            return Json(new InspectrBussiness().RetriveEvidenceTypes());
        }
        [HttpPost]
        public IActionResult RetrieveEvidenceSource()
        {
            return Json(new InspectrBussiness().RetriveEvidenceSource());
        }
        [HttpPost]
        public IActionResult RetrieveCrimeCases()
        {
            return Json(new InspectrBussiness().RetrieveCrimeCases());
        }
        [HttpPost]
        public IActionResult RetrieveCrimeLevel()
        {
            return Json(new InspectrBussiness().RetrieveCrimeLevel());
        }
        [HttpPost]
        public IActionResult RetrieveRequestJurisdiction()
        {
            return Json(new InspectrBussiness().RetrieveRequestJurisdiction());
        }
        [HttpPost]
        public IActionResult RetrieveRequestTypes()
        {
            return Json(new InspectrBussiness().RetrieveRequestTypes());
        }
        [HttpPost]
        public IActionResult RetrieveCountries()
        {
            return Json(new InspectrBussiness().RetrieveCountries());
        }
        [HttpPost]
        public IActionResult RetrieveMembers()
        {
            return Json(new InspectrBussiness().RetrieveMembers());
        }
        [HttpPost]
        public IActionResult RetrieveResponses()
        {
            return Json(new InspectrBussiness().RetrieveResponses());
        }
        [HttpPost]
        public IActionResult RetrieveStatuses()
        {
            return Json(new InspectrBussiness().RetrieveStatuses());
        }
        [HttpPost]
        public IActionResult RetrieveCrimeType()
        {
            return Json(new InspectrBussiness().RetrieveCrimeType());
        }
        [HttpPost]
        public IActionResult SaveRule(string ruleObject)
        {
            return Json(new InspectrBussiness().SaveRule(ruleObject));
        }
        [HttpPost]
        public IActionResult GetRuleData(long ruleID)
        {
            return Json(new InspectrBussiness().GetRuleData(ruleID));
        }
        [HttpPost]
        public IActionResult DeleteRuleInspectr(long ruleID)
        {
            return Json(new InspectrBussiness().DeleteRuleInspectr(ruleID));
        }


        private void MakePreviousUserTokensInvalid(long userId)
        {
            new _5ghubBusiness().MakePreviousUserTokensInvalid(userId);
        }

        private UserApiToken GenerateUserApiToken(long userId, string? tokenNote)
        {
            var user = new AuthenticationBusiness().RetrieveUserPerId(userId);

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration.GetSection("JwtToken").Value));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Fullname),
                new Claim(ClaimTypes.Role, "Admin"),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Sid, user.userId.ToString()),
                new Claim(ClaimTypes.System, user.ProjectId.ToString()) //Hiding project Id
            };

            var tokenExpiryDate = DateTime.Now.AddHours(3);
            var token = new JwtSecurityToken(claims: claims, expires: tokenExpiryDate,
                signingCredentials: credentials);

            var userToken = new UserApiToken
            {
                TokenKey = new JwtSecurityTokenHandler().WriteToken(token),
                UserID = userId,
                Note = tokenNote,
                ExpiryDate = tokenExpiryDate
            };
            return JsonConvert.DeserializeObject<UserApiToken>(new InspectrBussiness().RecordUserApiToken(userToken)
                .Result);
        }


        private Object BuildQueryRules(List<Countries> countries, List<Member> requestorMembers,
            List<RequestType> requestTypes, List<RequestJurisdiction> jurisdictions, List<CrimeType> crimeTypes,
            List<CrimeCase> crimecases, List<EvidenceSource> evidenceSources, List<EvidenceType> evidenceTypes, List<CrimeLevel> crimeLevels, string rootCondition,
            List<JsonRuleItem> rules)
        {
            var ruleList = new List<Object>();
            var rootRule = new JsonRule
            {
                condition = rootCondition,
                inner_rules = rules,
                rules = new List<Object>()
            };

            StringBuilder sql = new StringBuilder();

            string table = "[tblRequestRules_Inspectr].";

            foreach (var rule in rules)
            {
                long? requestorCountryId;
                long? requestorMemberId;
                long? requestTypeId;
                long? requestJurisdictionId;
                long? crimeTypeId;
                long? crimeCountryId;
                long? crimeCaseId;
                long? crimeLevelId;
                long? evidenceSourceId;
                long? evidenceTypeId;

                if (rule?.requestor is not null)
                {
                    if (rule.requestor?.country is not null)
                    {
                        requestorCountryId = countries
                            .FirstOrDefault(c => c.Code.ToLower().Equals(rule.requestor.country.ToLower()) || c.CountryName.ToLower().Equals(rule.requestor.country.ToLower()))?.countryID;

                        if (requestorCountryId.HasValue)
                        {
                            var newRule = GenerateRuleObject("requestor_country", requestorCountryId);
                            ruleList.Add(newRule);

                            if (sql.Equals(String.Empty))
                            {
                                sql.Append(table + "[RequestorCountryID] = '" + requestorCountryId + "' ");
                            }
                            else
                            {
                                sql.Append(rootRule.condition + " " + table + "[RequestorCountryID] = '" + requestorCountryId + "' ");
                            }
                        }
                        else
                        {
                            return new
                            {
                                message = "Operation Aborted! Invalid Requestor Country, See list of supported country codes",
                                countries = countries.Select(c => c.FullCountry.ToUpper())
                            };
                        }
                    }

                    if (rule.requestor?.member is not null)
                    {
                        requestorMemberId = requestorMembers
                            .FirstOrDefault(
                                m => m.RequestorMemberName.ToLower().Equals(rule.requestor.member.ToLower()))
                            ?.RequestorMemberID;

                        if (requestorMemberId.HasValue)
                        {
                            var newRule = GenerateRuleObject("requestor_member", requestorMemberId);
                            ruleList.Add(newRule);

                            if (sql.Equals(String.Empty))
                            {
                                sql.Append(table + "[RequestorMemberID] = '" + requestorMemberId + "' ");
                            }
                            else
                            {
                                sql.Append(rootRule.condition + " " + table + "[RequestorMemberID] = '" + requestorMemberId + "' ");
                            }
                        }
                        else
                        {
                            return new
                            {
                                message = "Operation Aborted! Invalid Requestor Member, See list of supported requestor members",
                                members = requestorMembers.Select(c => c.RequestorMemberName.ToUpper())
                            };
                        }
                    }
                }

                if (rule?.request is not null)
                {
                    if (rule.request?.type is not null)
                    {
                        requestTypeId = requestTypes
                            .FirstOrDefault(t => t.RequestTypeName.ToLower().Equals(rule.request.type.ToLower()))?.RequestTypeID;

                        if (requestTypeId.HasValue)
                        {
                            var newRule = GenerateRuleObject("requestType", requestTypeId);
                            ruleList.Add(newRule);

                            if (sql.Equals(String.Empty))
                            {
                                sql.Append(table + "[RequestTypeID] = '" + requestTypeId + "' ");
                            }
                            else
                            {
                                sql.Append(rootRule.condition + " " + table + "[RequestTypeID] = '" + requestTypeId + "' ");
                            }
                        }
                        else
                        {
                            return new
                            {
                                message = "Operation Aborted! Invalid Request Type, See list of supported request types",
                                types = requestTypes.Select(c => c.RequestTypeName.ToUpper())
                            };
                        }

                    }

                    if (rule.request?.jurisdiction is not null)
                    {
                        requestJurisdictionId = jurisdictions.FirstOrDefault(j =>
                                j.RequestJurisdictionName.ToLower().Equals(rule.request.jurisdiction.ToLower()))
                            ?.RequestJurisdictionID;

                        if (requestJurisdictionId.HasValue)
                        {
                            var newRule = GenerateRuleObject("request_jurisdiction", requestJurisdictionId);
                            ruleList.Add(newRule);

                            if (sql.Equals(String.Empty))
                            {
                                sql.Append(table + "[RequestJurisdictionID] = '" + requestJurisdictionId + "' ");
                            }
                            else
                            {
                                sql.Append(rootRule.condition + " " + table + "[RequestJurisdictionID] = '" + requestJurisdictionId + "' ");
                            }
                        }

                        else
                        {
                            return new
                            {
                                message = "Operation Aborted! Invalid Juridiction, See list of supported juridictions",
                                juridictions = jurisdictions.Select(c => c.RequestJurisdictionName.ToUpper())
                            };
                        }
                    }
                }

                if (rule?.crime is not null)
                {
                    if (rule.crime?.type is not null)
                    {
                        crimeTypeId = crimeTypes
                            .FirstOrDefault(t => t.CrimeTypeName.ToLower().Equals(rule.crime.type.ToLower()))
                            ?.CrimeTypeID;

                        if (crimeTypeId.HasValue)
                        {
                            var newRule = GenerateRuleObject("crime_type", crimeTypeId);
                            ruleList.Add(newRule);

                            if (sql.Equals(String.Empty))
                            {
                                sql.Append(table + "[CrimeTypeID] = '" + crimeTypeId + "' ");
                            }
                            else
                            {
                                sql.Append(rootRule.condition + " " + table + "[CrimeTypeID] = '" + crimeTypeId + "' ");
                            }
                        }
                        else
                        {
                            return new
                            {
                                message = "Operation Aborted! Invalid Crime Type, See list of supported crime types",
                                types = crimeTypes.Select(c => c.CrimeTypeName.ToUpper())
                            };
                        }
                    }

                    if (rule.crime?.Case is not null)
                    {
                        crimeCaseId = crimecases
                            .FirstOrDefault(c => c.CrimeCaseName.ToLower().Equals(rule.crime.Case.ToLower()))
                            ?.CrimeCaseID;

                        if (crimeCaseId.HasValue)
                        {
                            var newRule = GenerateRuleObject("crime_case", crimeCaseId);
                            ruleList.Add(newRule);

                            if (sql.Equals(String.Empty))
                            {
                                sql.Append(table + "[CrimeCaseID] = '" + crimeCaseId + "' ");
                            }
                            else
                            {
                                sql.Append(rootRule.condition + " " + table + "[CrimeCaseID] = '" + crimeCaseId + "' ");
                            }
                        }
                        else
                        {
                            return new
                            {
                                message = "Operation Aborted! Invalid Crime Case, See list of supported crime cases",
                                cases = crimecases.Select(c => c.CrimeCaseName.ToUpper())
                            };
                        }

                    }

                    if (rule.crime?.country is not null)
                    {
                        crimeCountryId = countries
                            .FirstOrDefault(c => c.Code.ToLower().Equals(rule.crime.country.ToLower()) || c.CountryName.ToLower().Equals(rule.crime.country.ToLower()))?.countryID;

                        if (crimeCountryId.HasValue)
                        {
                            var newRule = GenerateRuleObject("crime_country", crimeCountryId);
                            ruleList.Add(newRule);

                            if (sql.Equals(String.Empty))
                            {
                                sql.Append(table + "[CrimeCountryID] = '" + crimeCountryId + "' ");
                            }
                            else
                            {
                                sql.Append(rootRule.condition + " " + table + "[CrimeCountryID] = '" + crimeCountryId + "' ");
                            }
                        }
                        else
                        {
                            return new
                            {
                                message = "Operation Aborted! Invalid Crime Country, See list of supported country codes",
                                countries = countries.Select(c => c.FullCountry.ToUpper())
                            };
                        }
                    }

                    if (rule.crime?.level is not null)
                    {
                        crimeLevelId= crimeLevels
                            .FirstOrDefault(l => l.CrimeLevelName.ToLower().Equals(rule.crime.level.ToLower()) || l.CrimeLevelName.ToLower().Equals(rule.crime.level.ToLower()))?.CrimeLevelID;

                        if (crimeLevelId.HasValue)
                        {
                            var newRule = GenerateRuleObject("crime_level", crimeLevelId);
                            ruleList.Add(newRule);

                            if (sql.Equals(String.Empty))
                            {
                                sql.Append(table + "[CrimeLevelID] = '" + crimeLevelId + "' ");
                            }
                            else
                            {
                                sql.Append(rootRule.condition + " " + table + "[CrimeLevelID] = '" + crimeLevelId + "' ");
                            }
                        }
                        else
                        {
                            return new
                            {
                                message = "Operation Aborted! Invalid Crime Level, See list of supported crime levels",
                                levels = crimeLevels.Select(l => l.CrimeLevelName.ToUpper())
                            };
                        }
                    }
                }

                if (rule?.evidence is not null)
                {
                    if (rule.evidence?.type is not null)
                    {
                        evidenceTypeId = evidenceTypes
                            .FirstOrDefault(t => t.EvidenceTypeName.ToLower().Equals(rule.evidence.type.ToLower()))
                            ?.EvidenceTypeID;

                        if (evidenceTypeId.HasValue)
                        {
                            var newRule = GenerateRuleObject("evidenceType", evidenceTypeId);
                            ruleList.Add(newRule);

                            if (sql.Equals(String.Empty))
                            {
                                sql.Append(table + "[EvidenceTypeID] = '" + evidenceTypeId + "' ");
                            }
                            else
                            {
                                sql.Append(rootRule.condition + " " + table + "[EvidenceTypeID] = '" + evidenceTypeId + "' ");
                            }
                        }
                        else
                        {
                            return new
                            {
                                message = "Operation Aborted! Invalid Evidence Type, See list of supported evidence types",
                                types = evidenceTypes.Select(c => c.EvidenceTypeName.ToUpper())
                            };
                        }
                    }

                    if (rule.evidence?.source is not null)
                    {
                        evidenceSourceId = evidenceSources
                            .FirstOrDefault(s => s.EvidenceSourceName.ToLower().Equals(rule.evidence.source.ToLower()))
                            ?.EvidenceSourceID;

                        if (evidenceSourceId.HasValue)
                        {
                            var newRule = GenerateRuleObject("evidence_source", evidenceSourceId);
                            ruleList.Add(newRule);

                            if (sql.Equals(String.Empty))
                            {
                                sql.Append(table + "[EvidenceSourceID] = '" + evidenceSourceId + "' ");
                            }
                            else
                            {
                                sql.Append(rootRule.condition + " " + table + "[EvidenceSourceID] = '" + evidenceSourceId + "' ");
                            }
                        }
                        else
                        {
                            return new
                            {
                                message = "Operation Aborted! Invalid Evidence Type, See list of supported evidence types",
                                sources = evidenceSources.Select(c => c.EvidenceSourceName.ToUpper())
                            };
                        }
                    }
                }

                if (rule?.condition is not null && rule.inner_rules.Count > 0)
                {
                    sql.Append(rootRule.condition + " (");
                    var res = BuildQueryRules(countries, requestorMembers, requestTypes, jurisdictions,
                        crimeTypes, crimecases, evidenceSources, evidenceTypes, crimeLevels, rule.condition, rule.inner_rules);
                    

                    var subConditionRule = res as JsonRule;
                    if (subConditionRule is not null)
                    {
                        sql.Append(subConditionRule.sqlQuery);
                    }
                    sql.Append(")");
                    ruleList.Add(subConditionRule);
                }

                rootRule.sqlQuery = sql.ToString();
            }

            rootRule.rules.AddRange(ruleList);
            return rootRule;
        }

        private Object GenerateRuleObject(string id, long? requestorCountryId)
        {
            var newRule = new
            {
                id = id,
                field = id,
                type = "string",
                input = "select",
                Operator = "equal",
                value = requestorCountryId.ToString()
            };
            return newRule;
        }

        private Object GetApiRuleObj(string jsonQuery, List<Countries> countries, List<Member> requestorMembers,
            List<RequestType> requestTypes, List<RequestJurisdiction> jurisdictions, List<CrimeType> crimeTypes,
            List<CrimeCase> crimecases, List<EvidenceSource> evidenceSources, List<EvidenceType> evidenceTypes, List<CrimeLevel> crimeLevels)
        {
            try
            {
                var rule = JsonConvert.DeserializeObject<RuleObjectParent>(jsonQuery);

                var parentRule = new JsonRule()
                {
                    condition = rule.condition,
                    inner_rules = new List<JsonRuleItem>(),
                    rules = new List<object>()
                };

                var ruleItem = new JsonRuleItem()
                {
                    crime = new JsonCrime(),
                    evidence = new JsonEvidence(),
                    requestor = new JsonRequestor(),
                    request = new JsonRequest()
                };

                foreach (var r in rule.rules)
                {
                    if (r.condition is null && r.id.ToLower().Equals("requestor_country"))
                    {
                        var requestorCountry = countries.FirstOrDefault(c => c.countryID == long.Parse(r.value));
                        ruleItem.requestor.country = requestorCountry.FullCountry;
                    }

                    if (r.condition is null && r.id.ToLower().Equals("requestor_member"))
                    {
                        var member = requestorMembers.FirstOrDefault(m => m.RequestorMemberID == long.Parse(r.value));
                        ruleItem.requestor.member = member.RequestorMemberName;
                    }

                    if (r.condition is null && r.id.ToLower().Equals("requestType".ToLower()))
                    {
                        var requestType = requestTypes.FirstOrDefault(t => t.RequestTypeID == long.Parse(r.value));
                        ruleItem.request.type = requestType.RequestTypeName;
                    }

                    if (r.condition is null && r.id.ToLower().Equals("request_jusrisdiction"))
                    {
                        var jurisdiction =
                            jurisdictions.FirstOrDefault(j => j.RequestJurisdictionID == long.Parse(r.value));
                        ruleItem.request.jurisdiction = jurisdiction.RequestJurisdictionName;
                    }

                    if (r.condition is null && r.id.ToLower().Equals("crime_type"))
                    {
                        var crimeType = crimeTypes.FirstOrDefault(t => t.CrimeTypeID == long.Parse(r.value));
                        ruleItem.crime.type = crimeType.CrimeTypeName;
                    }

                    if (r.condition is null && r.id.ToLower().Equals("crime_case"))
                    {
                        var crimeCase = crimecases.FirstOrDefault(c => c.CrimeCaseID == long.Parse(r.value));
                        ruleItem.crime.Case = crimeCase.CrimeCaseName;
                    }

                    if (r.condition is null && r.id.ToLower().Equals("crime_country"))
                    {
                        var crimeCountry = countries.FirstOrDefault(c => c.countryID == long.Parse(r.value));
                        ruleItem.crime.country = crimeCountry.FullCountry;
                    }

                    if (r.condition is null && r.id.ToLower().Equals("crime_level"))
                    {
                        var crimeLevel = crimeLevels.FirstOrDefault(c => c.CrimeLevelID == long.Parse(r.value));
                        ruleItem.crime.level = crimeLevel.CrimeLevelName;
                    }

                    if (r.condition is null && r.id.ToLower().Equals("evidence_source"))
                    {
                        var evidenceSource = evidenceSources.FirstOrDefault(s => s.EvidenceSourceID == long.Parse(r.value));
                        ruleItem.evidence.source = evidenceSource.EvidenceSourceName;
                    }

                    if (r.condition is null && r.id.ToLower().Equals("evidenceType".ToLower()))
                    {
                        var evidenceType = evidenceTypes.FirstOrDefault(t => t.EvidenceTypeID == long.Parse(r.value));
                        ruleItem.evidence.type = evidenceType.EvidenceTypeName;
                    }

                    if (r.condition is not null)
                    {
                        var rs = new
                        {
                            condition = r.condition,
                            rules = r.rules
                        };

                        var subRuleString = JsonConvert.SerializeObject(rs);
                        var newSubRuleObj = this.GetApiRuleObj(subRuleString, countries, requestorMembers, requestTypes,
                            jurisdictions, crimeTypes, crimecases, evidenceSources, evidenceTypes, crimeLevels);
                        //parentRule.inner_rules.Add(newSubRuleObj);
                        parentRule.rules.Add(newSubRuleObj);
                    }
                }

                parentRule.inner_rules.Add(ruleItem);

                return parentRule;
            }
            catch (Exception e)
            {
                throw;
            }
        }

        private ValidatedRequestObject ValidateRequestObject(InspectrBussiness inspectrBussiness, RuleIncomingRequest request)
        {
            var validatedObj = new ValidatedRequestObject
            {
                Messages = new List<object>(),
                RequestInspectRule = new RequestInspectRule()
            };

            if (request is null)
            {
                validatedObj.Messages.Add("Invalid Request Object. Cannot send empty object");
                return validatedObj;
            }

            var countries = inspectrBussiness.RetrieveCountries();

            if (request.requestor is not null)
            {
                if (request.requestor.country is not null)
                {
                    var countryPerCode = countries.FirstOrDefault(c =>
                        c.Code.ToLower().Equals(request.requestor.country.ToLower()));

                    var countryPerName = countries.FirstOrDefault(c =>
                        c.CountryName.ToLower().Equals(request.requestor.country.ToLower()));

                    if (countryPerCode is null && countryPerName is null)
                    {
                        validatedObj.IsValid = false;
                        validatedObj.Messages.Add(new
                        {
                            error_message =
                                "Invalid Requestor Country Name or Code Please see list of available countries and codes",
                            countries = countries.OrderBy(c => c.CountryName).Select(c => c.FullCountry.ToUpper())
                        });
                    }
                    else
                    {
                        var country = (countryPerName is null) ? countryPerCode : countryPerName;
                        validatedObj.RequestInspectRule.RequestorCountryID = country.countryID;
                    }
                }

                if (request.requestor.member is not null)
                {
                    var requestorMembers = inspectrBussiness.RetrieveMembers();
                    var member = requestorMembers.FirstOrDefault(m =>
                        m.RequestorMemberName.ToLower().Equals(request.requestor.member.ToLower()));

                    if (member is null)
                    {
                        validatedObj.IsValid = false;
                        validatedObj.Messages.Add(new
                        {
                            error_message = "Invalid Requestor Member Name. Please see list of supported members",
                            members = requestorMembers.Select(m => m.RequestorMemberName.ToUpper())
                        });
                    }
                    else
                    {
                        validatedObj.RequestInspectRule.RequestorMemberID = member.RequestorMemberID;
                    }

                }
            }

            if (request.request is not null)
            {
                if (request.request.jurisdiction is not null)
                {
                    var jurisdictions = inspectrBussiness.RetrieveRequestJurisdiction();
                    var jurisdiction = jurisdictions.FirstOrDefault(j =>
                        j.RequestJurisdictionName.ToLower().Equals(request.request.jurisdiction.ToLower()));

                    if (jurisdiction is null)
                    {
                        validatedObj.IsValid = false;
                        validatedObj.Messages.Add(new
                        {
                            error_message = "Invalid Request Jurisdiction Name. Please see list of supported jurisdictions",
                            jurisdictions = jurisdictions.Select(j => j.RequestJurisdictionName.ToUpper())
                        });
                    }
                    else
                    {
                        validatedObj.RequestInspectRule.RequestJurisdictionID = jurisdiction.RequestJurisdictionID;
                    }
                }

                if (request.request.type is not null)
                {
                    var requestTypes = inspectrBussiness.RetrieveRequestTypes();
                    var requestType = requestTypes.FirstOrDefault(t =>
                        t.RequestTypeName.ToLower().Equals(request.request.type.ToLower()));

                    if (requestType is null)
                    {
                        validatedObj.IsValid = false;
                        validatedObj.Messages.Add(new
                        {
                            error_message = "Invalid Request Type Name. Please see list of supported types",
                            types = requestTypes.Select(t => t.RequestTypeName.ToUpper())
                        });
                    }
                    else
                    {
                        validatedObj.RequestInspectRule.RequestTypeID = requestType.RequestTypeID;
                    }
                }
            }

            if (request.evidence is not null)
            {
                if (request.evidence.source is not null)
                {
                    var evidenceSources = inspectrBussiness.RetriveEvidenceSource();
                    var evidenceSource = evidenceSources.FirstOrDefault(e =>
                        e.EvidenceSourceNameFormatted.ToLower().Equals(request.evidence.source.ToLower()));

                    if (evidenceSource is null)
                    {
                        validatedObj.IsValid = false;
                        validatedObj.Messages.Add(new
                        {
                            error_message = "Invalid Evidence Source. Please see list of supported evidence sources",
                            sources = evidenceSources.Select(s => s.EvidenceSourceNameFormatted.ToUpper())
                        });
                    }
                    else
                    {
                        validatedObj.RequestInspectRule.EvidenceSourceID = evidenceSource.EvidenceSourceID;
                    }
                }

                if (request.evidence.type is not null)
                {
                    var evidenceTypes = inspectrBussiness.RetriveEvidenceTypes();
                    var evidenceType = evidenceTypes.FirstOrDefault(t =>
                        t.EvidenceTypeName.ToLower().Equals(request.evidence.type.ToLower()));

                    if (evidenceType is null)
                    {
                        validatedObj.IsValid = false;
                        validatedObj.Messages.Add(new
                        {
                            error_message = "Invalid Evidence Type Name. Please see list of supported types",
                            types = evidenceTypes.Select(t => t.EvidenceTypeName.ToUpper())
                        });
                    }
                    else
                    {
                        validatedObj.RequestInspectRule.EvidenceTypeID = evidenceType.EvidenceTypeID;
                    }
                }
            }

            if (request.crime is not null)
            {
                if (request.crime.origin_country is not null)
                {
                    var countryPerCode = countries.FirstOrDefault(c =>
                        c.Code.ToLower().Equals(request.crime.origin_country.ToLower()));

                    var countryPerName = countries.FirstOrDefault(c =>
                        c.CountryName.ToLower().Equals(request.crime.origin_country.ToLower()));

                    if (countryPerCode is null && countryPerName is null)
                    {
                        validatedObj.IsValid = false;
                        validatedObj.Messages.Add(new
                        {
                            error_message = "Invalid Crime Country Name or Code Please see list of available countries and codes",
                            countries = countries.OrderBy(c => c.CountryName).Select(c => c.FullCountry.ToUpper())
                        });
                    }
                    else
                    {
                        var country = (countryPerName is null) ? countryPerCode : countryPerName;
                        validatedObj.RequestInspectRule.CrimeCountryID = country.countryID;
                    }
                }

                if (request.crime.level is not null)
                {
                    var crimeLevels = inspectrBussiness.RetrieveCrimeLevel();
                    var level = crimeLevels.FirstOrDefault(l =>
                        l.CrimeLevelName.ToLower().Equals(request.crime.level.ToLower()));

                    if (level is null)
                    {
                        validatedObj.IsValid = false;
                        validatedObj.Messages.Add(new
                        {
                            error_message = "Invalid Crime Level Name. Please see list of supported Crime Levels",
                            levels = crimeLevels.Select(l => l.CrimeLevelName.ToUpper())
                        });
                    }
                    else
                    {
                        validatedObj.RequestInspectRule.CrimeLevelID = level.CrimeLevelID;
                    }
                }

                if (request.crime.type is not null)
                {
                    var crimeTypes = inspectrBussiness.RetrieveCrimeType();
                    var crimeType = crimeTypes.FirstOrDefault(t =>
                        t.CrimeTypeName.ToLower().Equals(request.crime.type.ToLower()));

                    if (crimeType is null)
                    {
                        validatedObj.IsValid = false;
                        validatedObj.Messages.Add(new
                        {
                            error_message = "Invalid Crime Type Name. Please see list of supported types",
                            types = crimeTypes.Select(t => t.CrimeTypeName.ToUpper())
                        });
                    }
                    else
                    {
                        validatedObj.RequestInspectRule.CrimeTypeID = crimeType.CrimeTypeID;
                    }
                }

                if (request.crime.case_status is not null)
                {
                    var crimecases = inspectrBussiness.RetrieveCrimeCases();
                    var crimeCase = crimecases.FirstOrDefault(c =>
                        c.CrimeCaseName.ToLower().Equals(request.crime.case_status.ToLower()));
                    if (crimeCase is null)
                    {
                        validatedObj.IsValid = false;
                        validatedObj.Messages.Add(new
                        {
                            error_message = "Invalid Crime Status Name. Please see list of supported Crime Case Status",
                            cases = crimecases.Select(c => c.CrimeCaseName.ToUpper())
                        });
                    }
                    else
                    {
                        validatedObj.RequestInspectRule.CrimeCaseID = crimeCase.CrimeCaseID;
                    }
                }
            }

            validatedObj.IsValid = (validatedObj.Messages.Count == 0);

            return validatedObj;
        }


        #region API

        #region Api Token

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GenerateToken([FromHeader] string username, [FromHeader] string password)
        {
            var _user = new AuthenticationBusiness().LoginAuthentication(username, password);
            if (_user == null)
                return BadRequest(
                    "Something went wrong during the authentication process. Please contact with administrator");
            else if (!String.IsNullOrEmpty(_user.authentication_error))
                return BadRequest(_user.authentication_error);
            else
            {
                try
                {
                    MakePreviousUserTokensInvalid(_user.userId);

                    var newTokenObj = GenerateUserApiToken(_user.userId, null);
                    var resp = new
                    {
                        Token = newTokenObj.TokenKey,
                        Expirationdate_utc = $"{DateTime.Now.Add(newTokenObj.RemainingTime):F}"
                    };
                    return Ok(resp);
                }
                catch (Exception e)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
                }
            }
        }

        #endregion

        #region Rules

        [HttpPost]
        [Route("[controller]/rules/create")]
        [Authorize]
        public IActionResult CreateRule([FromBody] Object rule)
        {
            try
            {
                var formattedRule = JsonConvert.DeserializeObject<JsonRuleWrapper>(rule.ToString());

                var ruleDefinition = formattedRule?.rule;

                var inspectrBussiness = new InspectrBussiness();

                var countries = inspectrBussiness.RetrieveCountries();
                var requestorMembers = inspectrBussiness.RetrieveMembers();
                var requestTypes = inspectrBussiness.RetrieveRequestTypes();
                var jurisdictions = inspectrBussiness.RetrieveRequestJurisdiction();
                var crimeTypes = inspectrBussiness.RetrieveCrimeType();
                var crimecases = inspectrBussiness.RetrieveCrimeCases();
                var crimeLevels = inspectrBussiness.RetrieveCrimeLevel();
                var evidenceSources = inspectrBussiness.RetriveEvidenceSource();
                var evidenceTypes = inspectrBussiness.RetriveEvidenceTypes();
                var statuses = inspectrBussiness.RetrieveStatuses();


                if (formattedRule.name is null || formattedRule.name.Equals(String.Empty))
                {
                    return BadRequest("Operation Aborted! Rule name cannot be null or empty");
                }

                var defaultRuleStatus = "Active";

                if (formattedRule.status.Equals(String.Empty))
                {
                    formattedRule.status = defaultRuleStatus;
                }

                var status = statuses.FirstOrDefault(s => s.StatusName.ToLower().Equals(formattedRule.status.ToLower()));

                if (status is null)
                {
                    return BadRequest(new
                    {
                        message = "Invalid Status! Optional Parameter (default: Active)",
                        status = statuses.Select(s => s.StatusName.ToUpper())
                    });
                }


                var jsonQuery = BuildQueryRules(countries, requestorMembers, requestTypes, jurisdictions, crimeTypes,
                    crimecases,
                    evidenceSources, evidenceTypes, crimeLevels , ruleDefinition.condition,ruleDefinition.inner_rules);

                var castedJsonQuery = jsonQuery as JsonRule;
                string sqlQuery;

                if (castedJsonQuery is null)
                {
                    return BadRequest(jsonQuery);
                }

                sqlQuery = castedJsonQuery.sqlQuery;

                var serializedRuleDef = JsonConvert.SerializeObject(ruleDefinition);

                var serializedJsonQuery = JsonConvert.SerializeObject(jsonQuery);
                var ruleId = this.AddEmptyInspectRule(formattedRule.name, status.StatusID, serializedJsonQuery, sqlQuery, serializedJsonQuery);

                return Ok(new
                {
                    id = ruleId
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpDelete]
        [Route("[controller]/rules/{ruleId:long}/delete")]
        [Authorize]
        public IActionResult DeleteRule(long ruleId)
        {
            try
            {
                var isDeleted = new InspectrBussiness().DeleteRuleInspectr(ruleId);
                if (isDeleted)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest("Invalid Rule Id");
                }
            }
            catch (Exception e)
            {
                return StatusCode(500,e.Message);
            }
        }
        
        [HttpGet]
        [Route("[controller]/rules")]
        [Authorize]
        public IActionResult ListRules()
        {
            try
            {
                var rules = JsonConvert.DeserializeObject<List<DetailedRuleInspectr>>(new InspectrBussiness().RetrieveLookupRules().Result);
                var objRules = new List<Object>();
                var deserializeSetting = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore
                };

                foreach (var rule in rules)
                {
                    string? query;
                    
                    query = (rule.ApiRuleQueryString is null)? rule.Query : rule.ApiRuleQueryString;

                    var r = JsonConvert.DeserializeObject<JsonRuleItem>(query, deserializeSetting);
                    objRules.Add(new
                    {
                        id = rule.RuleID,
                        name = rule.RuleName,
                        status = rule.Status,
                        rule = new
                        {
                            condition = r.condition,
                            rule = r.inner_rules,
                            sql_query = r.sqlQuery
                        }
                    });
                }
                return Ok(objRules);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpGet]
        [Route("[controller]/rules/{ruleId:long}")]
        [Authorize]
        public IActionResult GetRule(long ruleId)
        {
            try
            {
                var rule = JsonConvert.DeserializeObject<DetailedRuleInspectr>(new InspectrBussiness().RetrieveRuleDetailsPerId(ruleId).Result);
                var deserializeSetting = new JsonSerializerSettings()
                {
                    NullValueHandling = NullValueHandling.Ignore,
                };
                var r = JsonConvert.DeserializeObject<JsonRuleItem>(rule.ApiRuleQueryString, deserializeSetting);
                return Ok(new
                {
                    id = rule.RuleID,
                    name = rule.RuleName,
                    status = rule.Status,
                    rule = new
                    {
                        condition = r.condition,
                        rule = r.inner_rules,
                        sql_query = r.sqlQuery
                    }
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpPut]
        [Route("[controller]/rules/{ruleId:long}/edit")]
        [Authorize]
        public IActionResult EditRule(long ruleId, [FromBody] Object rule)
        {
            try
            {
                var formattedRule = JsonConvert.DeserializeObject<JsonRuleWrapper>(rule.ToString());

                var ruleDefinition = formattedRule?.rule;

                var inspectrBussiness = new InspectrBussiness();

                var countries = inspectrBussiness.RetrieveCountries();
                var requestorMembers = inspectrBussiness.RetrieveMembers();
                var requestTypes = inspectrBussiness.RetrieveRequestTypes();
                var jurisdictions = inspectrBussiness.RetrieveRequestJurisdiction();
                var crimeTypes = inspectrBussiness.RetrieveCrimeType();
                var crimecases = inspectrBussiness.RetrieveCrimeCases();
                var crimeLevels = inspectrBussiness.RetrieveCrimeLevel();
                var evidenceSources = inspectrBussiness.RetriveEvidenceSource();
                var evidenceTypes = inspectrBussiness.RetriveEvidenceTypes();
                var statuses = inspectrBussiness.RetrieveStatuses();

                if (formattedRule.name is null || formattedRule.name.Equals(String.Empty))
                {
                    return BadRequest("Operation Aborted! Rule name cannot be null or empty");
                }

                var defaultRuleStatus = "Active";

                if (formattedRule.status.Equals(String.Empty))
                {
                    formattedRule.status = defaultRuleStatus;
                }

                var status = statuses.FirstOrDefault(s => s.StatusName.ToLower().Equals(formattedRule.status.ToLower()));

                if (status is null)
                {
                    return BadRequest(new
                    {
                        message = "Invalid Status! Optional Parameter (default: Active)",
                        status = statuses.Select(s => s.StatusName.ToUpper())
                    });
                }


                var jsonQuery = BuildQueryRules(countries, requestorMembers, requestTypes, jurisdictions, crimeTypes,
                    crimecases,
                    evidenceSources, evidenceTypes, crimeLevels, ruleDefinition.condition, ruleDefinition.inner_rules);

                var castedJsonQuery = jsonQuery as JsonRule;
                string sqlQuery;

                if (castedJsonQuery is null)
                {
                    return BadRequest(jsonQuery);
                }

                sqlQuery = castedJsonQuery.sqlQuery;
                var serializedRuleDef = JsonConvert.SerializeObject(ruleDefinition);

                var serializedJsonQuery = JsonConvert.SerializeObject(jsonQuery);
                var oldruleId = this.EditInspectRuleDetails(ruleId, formattedRule.name, status.StatusID, serializedJsonQuery, sqlQuery, serializedRuleDef);

                return Ok(new
                {
                    id = ruleId
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }
        #endregion

        #region Requests

        [HttpPost]
        [ApiKeyAuth]
        [Route("[controller]/requests/create")]
        public IActionResult EvaluateSingleRequest([FromBody]Object requestObject)
        {
            try
            {
                var request = JsonConvert.DeserializeObject<RuleIncomingRequest>(requestObject.ToString());
                var inspectrBussiness = new InspectrBussiness();

                //if (!Guid.TryParse(request.reference_id, out var referenceId))
                //{
                //    var msg = $"Invalid reference_id value! Format should be {Guid.Empty:D}";
                //    return BadRequest(msg);
                //}

                if (request.reference_id is null || request.reference_id.Equals(string.Empty))
                {
                    var msg = $"Invalid reference_id value! Cannot be null or empty";
                    return BadRequest(msg);
                }

                //if (!Guid.TryParse(request.case_id, out var caseId))
                //{
                //    var msg = $"Invalid case_id value! Format should be {Guid.Empty:D}";
                //    return BadRequest(msg);
                //}

                if (request.evidence is null && request.request is null && request.requestor is null && request.crime is null)
                {
                    var msg = $"Error! Evidence, Request, Requestor and Crime Objects cannot be all empty";
                    return BadRequest(msg);
                }

                //if (request.evidence is not null && !Guid.TryParse(request.evidence.observable_id, out var observableId))
                //{
                //    var msg = $"Invalid observable_id value! Format should be {Guid.Empty:D}";
                //    return BadRequest(msg);
                //}

                var validatedRequestObject = ValidateRequestObject(inspectrBussiness, request);

                if (!validatedRequestObject.IsValid)
                {
                    return BadRequest(new
                    {
                        msg = "Validation Failed! Operation Aborted",
                        error_list = validatedRequestObject.Messages
                    });
                }

                validatedRequestObject.RequestInspectRule.ReferenceID = request.reference_id;

                var jsonRule = PrepareRequestQuery(validatedRequestObject.RequestInspectRule);
                validatedRequestObject.RequestInspectRule.RequestQuery = JsonConvert.SerializeObject(jsonRule);

                var savedRequest = inspectrBussiness.SaveIncomingInspectRule(validatedRequestObject.RequestInspectRule);

                if (savedRequest.Message.ToLower().Equals("success"))
                {
                    var formatedRequest = JsonConvert.DeserializeObject<RequestInspectRule>(savedRequest.Result);
                    var savedRules =
                        JsonConvert.DeserializeObject<IEnumerable<DetailedRuleInspectr>>(inspectrBussiness.RetrieveLookupRules().Result);

                    var evaluationResult = this.EvaluateSavedRequest(formatedRequest, savedRules);
                    
                    return Ok(evaluationResult);
                }
                else
                {
                    throw new SyntaxErrorException();
                }
                

            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        private JsonRule PrepareRequestQuery(RequestInspectRule? formatedRequest)
        {
            var jsonRule = new JsonRule()
            {
                condition = "AND",
                inner_rules = new List<JsonRuleItem>(),
                rules = new List<object>()
            };

            if (formatedRequest.RequestorCountryID.HasValue)
            {
                var newRule = GenerateRuleObject("requestor_country", formatedRequest.RequestorCountryID);
                jsonRule.rules.Add(newRule);
            }

            if (formatedRequest.RequestorMemberID.HasValue)
            {
                var newRule = GenerateRuleObject("requestor_member", formatedRequest.RequestorMemberID);
                jsonRule.rules.Add(newRule);
            }

            if (formatedRequest.RequestTypeID.HasValue)
            {
                var newRule = GenerateRuleObject("requestType", formatedRequest.RequestTypeID);
                jsonRule.rules.Add(newRule);
            }

            if (formatedRequest.RequestJurisdictionID.HasValue)
            {
                var newRule = GenerateRuleObject("request_jurisdiction", formatedRequest.RequestJurisdictionID);
                jsonRule.rules.Add(newRule);
            }

            if (formatedRequest.CrimeTypeID.HasValue)
            {
                var newRule = GenerateRuleObject("crime_type", formatedRequest.CrimeTypeID);
                jsonRule.rules.Add(newRule);
            }

            if (formatedRequest.CrimeCountryID.HasValue)
            {
                var newRule = GenerateRuleObject("crime_country", formatedRequest.CrimeCountryID);
                jsonRule.rules.Add(newRule);
            }

            if (formatedRequest.CrimeCaseID.HasValue)
            {
                var newRule = GenerateRuleObject("crime_case", formatedRequest.CrimeCaseID);
                jsonRule.rules.Add(newRule);
            }

            if (formatedRequest.CrimeLevelID.HasValue)
            {
                var newRule = GenerateRuleObject("crime_level", formatedRequest.CrimeLevelID);
                jsonRule.rules.Add(newRule);
            }

            if (formatedRequest.EvidenceSourceID.HasValue)
            {
                var newRule = GenerateRuleObject("evidence_source", formatedRequest.EvidenceSourceID);
                jsonRule.rules.Add(newRule);
            }

            if (formatedRequest.EvidenceTypeID.HasValue)
            {
                var newRule = GenerateRuleObject("evidenceType", formatedRequest.EvidenceTypeID);
                jsonRule.rules.Add(newRule);
            }

            return jsonRule;
        }

        private object EvaluateSavedRequest(RequestInspectRule formatedRequest, IEnumerable<DetailedRuleInspectr> savedRules)
        {
            var resultList = new List<bool>();
            var inspectrBusiness = new InspectrBussiness();
            var responses = inspectrBusiness.RetrieveResponses();

            foreach (var rule in savedRules.Where(r => r.Status.ToLower().Equals("active")))
            {
                var rs = inspectrBusiness.EvaluateRequest(formatedRequest.RequestRuleID, rule.SqlQuery);
                if (rs.Message.ToLower().Equals("SUCCESS".ToLower()))
                {
                    var result = JsonConvert.DeserializeObject<bool>(rs.Result);
                    resultList.Add(result);
                }
            }

            Object finalResultObj;
            long responseId;

            if (resultList.Count(r => r == true) > 0)
            {
                var response = "GREEN";
                responseId = responses.FirstOrDefault(r => r.ResponseName.ToLower().Equals(response.ToLower())).ResponseID;
                finalResultObj = new
                {
                    id = formatedRequest.RequestRuleUniqueID,
                    reference_id = formatedRequest.ReferenceID,
                    evaluation = response,
                    evaluation_code = (int)EvaluationCode.GREEN
                };
            }
            else
            {
                var response = "RED";
                responseId = responses.FirstOrDefault(r => r.ResponseName.ToLower().Equals(response.ToLower())).ResponseID;

                finalResultObj = new
                {
                    id = formatedRequest.RequestRuleUniqueID,
                    reference_id = formatedRequest.ReferenceID,
                    evaluation = response,
                    evaluation_code = (int)EvaluationCode.RED
                };
            }

            var r = inspectrBusiness.UpdateRequestResponse(formatedRequest.RequestRuleID, responseId);

            return finalResultObj;
        }

        #endregion

        #endregion
    }

    enum EvaluationCode
    {
        GREEN=1,
        RED=3
    }
}
