using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace SMS.Models
{
    public class LoginModel
    {
        public string? Username { get; set; }        
        public string? Password { get; set; }
    }
    public class LoginRespModel
    {
        public string? userId { get; set; }
        public string? accountId { get; set; }
        public string? DLTFlag { get; set; }
        public string? PwdRequired { get; set; }
        public string? LoginId { get; set; }
        public string? RoleId { get; set; }
        public string? RoleName { get; set; }
        public string? Email { get; set; }
        public string? Flag { get; set; }
        public string? Status { get; set; }
        public string? UserName { get; set; }
        public string? OTPType { get; set; }

    }
    public class FirstTimeLoginModel
    {      
        public int securityQuestion { get; set; }
        public string? answer { get; set; }
        public string? newPassword { get; set; }        
        public string? confirmPassword { get; set; }
        public int appid { get; set; }        
        public int userid { get; set; }
    }
    public class VerifySecurityQnModel
    {
        public int SecurityQuestion { get; set; }
        public string? Answer { get; set; }
        public int appid { get; set; }
        public string? userid { get; set; }      
}

    public class AuthenticateUserModel
    {      
        public string Username { get; set; }
        public int SecurityQuestion { get; set; }
        public string? Answer { get; set; }
        public string? oldpassword { get; set; }
        public string? appname { get; set; }
        public int appid { get; set; }

    }
    public class ChangePasswordModel
    {
        public string? otp { get; set; }
        public string? newpassword { get; set; }
        public string? confpassword { get; set; }
        public string? appname { get; set; }
        public int appid { get; set; }
        public int userid { get; set; }
       
    }

    public class appUserModel
    {
        public int appid { get; set; }
        public int userid { get; set; }
    }

public class MailServerModel
    {
        public string? MailServerIP { get; set; }
        public int Port { get; set; }
        public string? DLTFlag { get; set; }
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string? FromAddress { get; set; }
        public string? DisplayName { get; set; }
        public int OTPExpireTime { get; set; }
    }
}
