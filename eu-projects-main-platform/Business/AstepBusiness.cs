using eu_projects_main_platform.Models;
using eu_projects_main_platform.Models.Authentication;
using eu_projects_main_platform.Models.Common;
using eu_projects_main_platform.Models.DatabaseHandler;
using eu_projects_main_platform.Models.Astep;
using eu_projects_main_platform.Data;
using eu_projects_main_platform.Models.Astep.Auth;

namespace eu_projects_main_platform.Business
{
    public class AstepBusiness
    {
        public CustomResponseModel AddUserApiToken(UserApiToken userToken)
        {
            return new AstepData().AddUserApiToken(userToken);
        }
        public CustomResponseModel RetrieveUserApiToken(long userId)
        {
            return new AstepData().RetrieveUserApiToken(userId);
        }
        public CustomResponseModel DeleteUserApiToken(long tokenId)
        {
            return new AstepData().DeleteUserApiToken(tokenId);
        }
        public CustomResponseModel MakePreviousUserTokensInvalid(long userId)
        {
            return new AstepData().MakePreviousUserTokensInvalid(userId);
        }
        public CustomResponseModel RetrieveUseCases(long userid, string username)
        {
            return new AstepData().RetrieveUseCases(userid, username);
        }
        public CustomResponseModel RetrieveUCGeneralInfo(long usecase_id)
        {
            return new AstepData().RetrieveUCGeneralInfo(usecase_id);
        }
        public CustomResponseModel FillGrid_ExperimentResultsEvaluation(long usecase_id)
        {
            return new AstepData().FillGrid_ExperimentResultsEvaluation(usecase_id);
        }
    }
}
