using eu_projects_main_platform.Models.Common;
using eu_projects_main_platform.Models.DatabaseHandler;
using eu_projects_main_platform.Models.Enums;
using eu_projects_main_platform.Models.Astep;
using eu_projects_main_platform.Models.Astep.Auth;
using Microsoft.AspNetCore.Mvc;

namespace eu_projects_main_platform.Data
{
    public class AstepData
    {
        private const string controller = "AstepData";

        public CustomResponseModel AddUserApiToken(UserApiToken userToken)
        {
            return new MyDatabaseHandler<UserApiToken>(controller, "AddUserApiToken").CallDatabase(
                "InsertUserApiToken", new { userId = userToken.UserID, token = userToken.TokenKey, note = userToken.Note, expiryDate = userToken.ExpiryDate },
                    ResultType.Single, ExecuteType.StoredProcedure);
        }
        public CustomResponseModel RetrieveUserApiToken(long userId)
        {
            return new MyDatabaseHandler<UserApiToken>(controller, "RetrieveUserApiToken").CallDatabase(
                "RetrieveUserApiTokenKeys", new { userId = userId }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }
        public CustomResponseModel DeleteUserApiToken(long tokenId)
        {
            return new
                MyDatabaseHandler<UserApiToken>(controller, "DeleteUserApiToken").CallDatabase(
                "DeleteUserApiToken", new { tokenId = tokenId }, ResultType.Single, ExecuteType.StoredProcedure);
        }
        public CustomResponseModel MakePreviousUserTokensInvalid(long userId)
        {
            return new MyDatabaseHandler<long>(controller, "MakePreviousUserTokensInvalid").CallDatabase(
                "MakePreviousUserTokensInvalid", new { userId = userId }, ResultType.Single,
                ExecuteType.StoredProcedure);
        }
        public CustomResponseModel RetrieveUseCases(long userid, string username)
        {
            return new MyDatabaseHandler<UseCases>(controller, "RetrieveUseCases").CallDatabase("RetrieveUseCasesAstep", new { userid = userid, username = username }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }
        public CustomResponseModel RetrieveUCGeneralInfo(long usecase_id)
        {
            return new MyDatabaseHandler<UseCases>(controller, "RetrieveUCGeneralInfo").CallDatabase("RetrieveUCGeneralInfoAstep", new { UseCase_Id = usecase_id, }, ResultType.Single, ExecuteType.StoredProcedure);
        }
        public CustomResponseModel FillGrid_ExperimentResultsEvaluation(long usecase_id)
        {
            return new MyDatabaseHandler<MandrekasResult>(controller, "FillGrid_ExperimentResultsEvaluation").CallDatabase("RetrieveMandrekasData", new { UseCase_Id = usecase_id, }, ResultType.Multiple, ExecuteType.StoredProcedure);
        }
    }
}
