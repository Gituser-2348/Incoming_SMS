using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using SMS.Core;
using SMS.DataAccess;
using SMS.Helpers;
using SMS.Models;
using System.Security.Cryptography;
using System.Text.Json;
using static SMS.Helpers.MailSender;
using Microsoft.AspNetCore.Hosting;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SMS.Controllers.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly LoginDataAccessLayer dal;
        private readonly ILogger<LoginController> _logger;
        MailSender mailSender;
        public LoginController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor,ILogger<LoginController> logger)
        {

            mailSender = new MailSender(configuration, httpContextAccessor);
            dal = new LoginDataAccessLayer(configuration, httpContextAccessor);
              _logger = logger;
        }

        [AllowAnonymous]
        [HttpGet("logout")]
        public IActionResult LogOut(int mode, int loginId)
        {

            var response = dal.Logout(mode, loginId, 0);
            return Ok(response);
        }

       [AllowAnonymous]
[HttpPost("signin")]
public IActionResult SignIn([FromBody] LoginModel model)
{
    var response = dal.SignIn(model, mailSender.DLTFlag);

    _logger.LogInformation("Login response: {@Response}", response);

    var logText = $"[{DateTime.Now}] Login response: {System.Text.Json.JsonSerializer.Serialize(response)}";

    // Define full path
    string logDirectory = @"C:\MyAppLogs";
    string logFilePath = Path.Combine(logDirectory, "LoginLogs.txt");

    // Create directory if not exists
    if (!Directory.Exists(logDirectory))
    {
        Directory.CreateDirectory(logDirectory);
    }

    // Write to file using fully-qualified name to avoid ControllerBase.File() collision
    System.IO.File.AppendAllText(logFilePath, logText + Environment.NewLine);

    if (response == null)
    {
        return NoContent();
    }

    return Ok(response);
}


        [AllowAnonymous]
        [HttpPost("firstTimeLogin")]
        public IActionResult FirstTimeLogin(FirstTimeLoginModel model)
        {
            string? mailId = "";string? customer_name = "";
            int mId = dal.FirstTimeChangePassword(model, out mailId, out customer_name);
            string? response = "";
            if (mId > 0)
            {
                //Success -- Send PWD Changed Mail
                string emailBody = mailSender.ComposeMailBody_welcome(MailType.FirstTime,customer_name);
                if (mailSender.SendEmail(mId, mailId, "- Welcome", emailBody))
                    response = "Your Credentials are succesfully changed. Please login again to continue";
                else
                    response = "Your Credentials are succesfully changed. Please login again to continue, Mail Send failed";
                // response = "Success!";
                mId = 1;
            }
            else if (mId == -9)
            {
                response = "User not found!";
            }
            else if (mId == -2)
            {
                response = "New and old passwords can not be same";
            }
            else
            {
                response = "Something went wrong";
            }

            return Ok("{ \"status\": " + Math.Abs(mId) + " , \"message\" : \"" + response + "\"}");
        }

        [HttpGet("securityQuestions/{mode}")]
        public IActionResult SecurityQuestions(int mode)
        {

            var response = dal.SecurityQuestions(mode);

            List<SelectListItem> customList = new List<SelectListItem>();
            customList.Add(new SelectListItem { Text = "-Security Question-" });

            string JSONresult;
            JSONresult = JsonConvert.SerializeObject(response.Item1);
            //Response.Write(JSONresult);

            //return response.Item1.ToSelectList(/*selectedQnId,*/ customList);
            return Ok("{ \"Qns\" : " + JSONresult + ", \"QnId\": " + response.Item2 + "}");
        }

        [AllowAnonymous]
        [HttpPost("verifySecurityAnswer")]
        public IActionResult verifySecurityAnswer(VerifySecurityQnModel model)
        {
            string? res = "";
            var status = dal.VerifySecurityAns(model, out res);
            return Ok("{ \"status\": " + status + " , \"message\" : \"" + res + "\"}");
        }

        [AllowAnonymous]
        [HttpPost("authenticateUser")]
        public IActionResult AuthenticateUser(AuthenticateUserModel model)
        {
            string? res = "";
            string? mailid = "";
            string? otp = "";
            int userid = 0;
            int mid = 0;
            int status = dal.AuthenticateUser(model, out otp, out mid, out userid, out mailid, out res,out string? customer_name);
            string? response = "";
            if (status == 1)
            {
              string  username = model.Username.ToString();
                string mailBody = mailSender.ComposeMailBody_f(MailType.ForgotPwdOTP, customer_name, otp);
                if (mailSender.SendEmail(mid, mailid, "- Forgot Password - OTP", mailBody))
                    response = "An OTP has sent to your contact " + mailid;
                else
                    response = "Could not send your OTP, Mail Send failed";

            }

            return Ok("{ \"status\": " + status + " ,\"userid\": \"" + userid + "\",\"mailid\": \"" + mailid + "\" , \"message\" : \"" + response + "\"}");
        }


        [AllowAnonymous]
        [HttpPost("changePassword")]
        public IActionResult changePassword(ChangePasswordModel model)
        {
            string? mailId = "";string? customer_name = "";
            int mId = 0;
            int status = dal.ChangePassword(model, out mId, out mailId,out customer_name);

            //1: success ; 5:OTP expired; 2:Invalid OTP; 9: Old and new passwords are same;
            if (status == 1)
            {
                string emailBody = mailSender.ComposeMailBody_change(MailType.PwdChanged, customer_name);
                if (mailSender.SendEmail(mId, mailId, "- Password Changed", emailBody))
                { }

            }
            return Ok("{ \"status\": " + status + "}");
        }

        [HttpPost("resendOtp")]
        //[AuthorizeUser]
        public IActionResult ResendOtp(appUserModel model)
        {
            int mid;
            string? OTP;
            string? mailID = "";
            int status = dal.ResendOTP(model, out mid, out mailID, out OTP,out string? user_name);
            if (status == 1)
            {
                // string emailBody = mailSender.ComposeMailBody(MailType.VerifyOTP, OTP);
                string emailBody = mailSender.ComposeMailBody_resend_otp(MailType.resend_otp, user_name,OTP);
                bool isSuccess = mailSender.SendEmail(mid, mailID, "- Resend OTP", emailBody);
                if (isSuccess)
                    return Ok("{ \"status\" : " + status + ", \"Msg\" : \"New OTP send to your mail id\", \"Head\" : \"Success\" }");
                else
                    return Ok("{ \"Msg\" : \"Unable to send mail. Please try again later.\", \"Head\" : \"Error\" }");
            }
            else if (status == 3)
            {

                return Ok("{ \"Msg\" : \"\"OTP has been sent too many times, please try after sometime.\", \"Head\" : \"Error\" }");
            }
            else
            {
                return Ok("{ \"Msg\" : \"\"Something went wrong\", \"Head\" : \"Error\" }");
            }
        }
    }
}
