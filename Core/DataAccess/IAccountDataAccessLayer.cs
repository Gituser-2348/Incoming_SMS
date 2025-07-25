using Microsoft.AspNetCore.Mvc.Rendering;
using SMS.Authentication;
using SMS.Models;

namespace SMS.Core.DataAccess
{
    public interface IAccountDataAccessLayer
    {
        Task<PasswordStatus> LoginAsync(LoginModel model);
        Task<bool> LogoutAsync();
        //Task<ReferenceMail> FirstTimeChangePasswordAsync(FirstTimeLoginModel model);
        //Task<int> VerifySecurityAnswerAsync(VerifySecurityQnModel model);
        //Task<ReferenceMail> AuthChangePasswordAsync(AuthenticateUserModel model);
        //Task<ReferenceMail> ChangePasswordAsync(ChangePasswordModel model);
        SelectList GetAllSecurityQuestions();
        Task<(byte[] LogoBytes, string ContentType)> GetAccountLogo();
    }
}
