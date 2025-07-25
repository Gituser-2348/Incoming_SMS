using System.Security.Claims;

namespace SMS.Authentication
{
    public static class MyClaimTypes
    {
        public const string Username = "http://schemas.ideareceiptionist.com/2017/09/identity/claims/Username";
        public const string LoginId = "http://schemas.ideareceiptionist.com/2017/09/identity/claims/LoginId";
        public const string UserId = "http://schemas.ideareceiptionist.com/2017/09/identity/claims/UserId";
        public const string Email = ClaimTypes.Email;
        public const string RoleId = "http://schemas.ideareceiptionist.com/2017/09/identity/claims/RoleId";
        public const string Role = ClaimTypes.Role;
        public const string AccountId = "http://schemas.ideareceiptionist.com/2017/09/identity/claims/AccountId";
        public const string Account = "http://schemas.ideareceiptionist.com/2017/09/identity/claims/Account";
        public const string Circle = ClaimTypes.StateOrProvince;
        public const string PasswordStatus = "http://schemas.ideareceiptionist.com/2017/09/identity/claims/PasswordStatus";
        public const string AgentId = "http://schemas.ideareceiptionist.com/2017/09/identity/claims/AgentId";
        public const string AccunaccountId = "http://schemas.ideareceiptionist.com/2017/09/identity/claims/Username/AccunaccountId";//account under service belongs
        public const string WtReport = "http://schemas.ideareceiptionist.com/2017/09/identity/claims/WtReport";
        public const string ConnectToCrm = "http://schemas.ideareceiptionist.com/2017/09/identity/claims/ConnectToCrm";
        public const string CustomerCallRpt = "http://schemas.ideareceiptionist.com/2017/09/identity/claims/CustomerCallRpt";
        public const string AgentCallRpt = "http://schemas.ideareceiptionist.com/2017/09/identity/claims/AgentCallRpt";
        public const string SmsRpt = "http://schemas.ideareceiptionist.com/2017/09/identity/claims/SmsRpt";
    }
}
