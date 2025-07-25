using Microsoft.VisualBasic;
using System.Data;
using System.Net.Mail;
using System.Net;
using SMS.DataAccess;
using SMS.Models;
using Microsoft.AspNetCore.Hosting.Server;
using SMS.Core;
using static System.Net.WebRequestMethods;

namespace SMS.Helpers
{
    public class MailSender : MysqlDataAccessLayer
    {
        private readonly string? _3DesKey;
        private readonly CryptoAlg cr = new CryptoAlg();
        private readonly Random _rnd = new Random();
        string? connectionString = "";
        private readonly string? AbsoluteUri ;
        private readonly string? AppName ;
        public readonly string? DLTFlag ;
            MailServerModel? mailServerModel = new();

        CryptoAlg _EncDec = new CryptoAlg();
        private readonly LoginDataAccessLayer dal;
        public MailSender(IConfiguration configuration, IHttpContextAccessor httpContextAccessor ) : base(configuration, httpContextAccessor)
        {
            _3DesKey = configuration["Key"];
            connectionString = configuration.GetConnectionString("MySQlConnnectionStr");
            AbsoluteUri = configuration["MailInfo:AbsoluteUri"];
            AppName = configuration["MailInfo:AppName"];
            dal = new LoginDataAccessLayer(configuration, httpContextAccessor);
            mailServerModel = dal.GetMailServerDetails();
            //DLTFlag = mailServerModel.DLTFlag;
        }

        #region Send Email
        public bool SendEmail(int mID, string? MailTo, string Subject, string Emailbody)
        {          
            try
            {
                using (MailMessage Mail = new MailMessage())
                {
                    Mail.IsBodyHtml = true;
                    AlternateView htmlView = AlternateView.CreateAlternateViewFromString(Emailbody, null, "text/html");
                    LinkedResource prudentLogo = new LinkedResource("wwwroot/images/Etisalat Logo AI-01.png", "image/png");
                    prudentLogo.ContentId = "Logo";
                    htmlView.LinkedResources.Add(prudentLogo);

                    Mail.AlternateViews.Add(htmlView);
                    Mail.From = new MailAddress(mailServerModel.FromAddress, mailServerModel.DisplayName);

                    // Mail.From = new MailAddress("smsservice@prutech.org", "test");

                    if (MailTo.Contains(','))
                    {
                        foreach (string toMail in MailTo.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                        {
                            if (!string.IsNullOrWhiteSpace(toMail))
                                Mail.To.Add(toMail.Trim());
                        }
                    }
                    else
                    {
                        Mail.To.Add(MailTo.Trim());
                    }

                    Mail.Subject = AppName+ Subject;
                    using (SmtpClient smtp = new SmtpClient(mailServerModel.MailServerIP , mailServerModel.Port))
                    {
                        try
                        {

                            var basicCredential = new NetworkCredential(mailServerModel.UserName, mailServerModel.Password);
                            smtp.Credentials = basicCredential;
                            smtp.EnableSsl = true;
                            smtp.Send(Mail);

                        }
                        catch (Exception) { }

                    }


                    // Success Update in DB  
                   // if (mID != 0)                        dal.UpdateMailStatus(mID, 1);

                    // LogWriter.Write("SendEmail :: Info :: Mail Send Succesfully");
                }
                return true;
            }
            catch (Exception )
            {
                 //   dal.UpdateMailStatus(mID, 2);
                // LogWriter.Write("SendEmail :: Exception :: " + ex.Message);
                return false;//Mail error 
            }
        }

        //public bool SendEmailInc(int mID, string MailTo, string Subject, string Emailbody, string cc, byte[] file, HttpPostedFileBase fileUp)
        //{
        //    //AccountDbPrcs prc = new AccountDbPrcs();

        //    try
        //    {
        //        using (MailMessage Mail = new MailMessage())
        //        {
        //            Mail.IsBodyHtml = true;
        //            AlternateView htmlView = AlternateView.CreateAlternateViewFromString(Emailbody, null, "text/html");
        //            LinkedResource IdeaLogo = new LinkedResource(AppDomain.CurrentDomain.BaseDirectory + "Content/images/idea.png", "image/png");
        //            IdeaLogo.ContentId = "Logo";
        //            htmlView.LinkedResources.Add(IdeaLogo);

        //            Mail.AlternateViews.Add(htmlView);
        //            Mail.From = new MailAddress(mailServerModel.FromAddress, mailServerModel.DisplayName);
        //            Mail.CC.Add(cc);
        //            //Mail.Attachments.Add()
        //            //var attachment = new Attachment(System.Text.Encoding.UTF8.GetString(file), "abd");
        //            //Mail.Attachments.Add(attachment);   
        //            if (fileUp != null)
        //            {
        //                Attachment att = new Attachment(new MemoryStream(file), fileUp.FileName, fileUp.ContentType);

        //                Mail.Attachments.Add(att);
        //            }
        //            if (MailTo.Contains(','))
        //            {
        //                foreach (string toMail in MailTo.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
        //                {
        //                    if (!string.IsNullOrWhiteSpace(toMail))
        //                        Mail.To.Add(toMail.Trim());
        //                }
        //            }
        //            else
        //            {
        //                Mail.To.Add(MailTo.Trim());
        //            }

        //            Mail.Subject = Subject;
        //            using (SmtpClient smtp = new SmtpClient(mailServerModel.MailServerIP, mailServerModel.Port))
        //            {
        //                try// if any exception (any wrong mailid comes it will catch)
        //                {
        //                    smtp.Send(Mail);
        //                }
        //                catch { }
        //            }

        //            // Success Update in DB  
        //            if (mID != 0)
        //                prc.UpdateMailStatus(mID, 1);

        //            LogWriter.Write("SendEmail :: Info :: Mail Send Succesfully");
        //        }
        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        prc.UpdateMailStatus(mID, 2);
        //        LogWriter.Write("SendEmail :: Exception :: " + ex.Message);
        //        return false;//Mail error 
        //    }
        //}

        public bool SendEmail(string Subject, string Emailbody, params string[] MailTo)
        {
            //AccountDbPrcs prc = new AccountDbPrcs();

            try
            {
                using (MailMessage Mail = new MailMessage())
                {
                    Mail.IsBodyHtml = true;
                    AlternateView htmlView = AlternateView.CreateAlternateViewFromString(Emailbody, null, "text/html");
                    LinkedResource IdeaLogo = new LinkedResource(AppDomain.CurrentDomain.BaseDirectory + "Content/images/idea.png", "image/png");
                    IdeaLogo.ContentId = "Logo";
                    htmlView.LinkedResources.Add(IdeaLogo);

                    Mail.AlternateViews.Add(htmlView);
                    Mail.From = new MailAddress(mailServerModel.FromAddress, mailServerModel.DisplayName);

                    foreach (string toMail in MailTo)
                    {
                        if (!string.IsNullOrWhiteSpace(toMail))
                            Mail.To.Add(toMail.Trim());
                    }

                    Mail.Subject = Subject;
                    using (SmtpClient smtp = new SmtpClient(mailServerModel.MailServerIP, mailServerModel.Port))
                    {
                        smtp.Send(Mail);
                    }

                    // Success Update in DB  
                    //if (mID != 0)
                    //    prc.UpdateMailStatus(mID, 1);

                }
                return true;
            }
            catch (Exception )
            {
                // prc.UpdateMailStatus(mID, 2);
                //LogWriter.Write("SendEmail :: Exception :: " + ex.Message);
                return false;//Mail error 
            }
        }
        #endregion

        #region Compose Mail Body
        /// <summary>
        /// Construct Email Body 
        /// </summary>
        /// <param name="mtype">Type of Mail</param>
        /// <param name="otp">Optional, If Type is ForgotPwdOTP/PwdChangeOTP, then Value of Random Password</param>
        /// <param name="OtpExpireTime">Optional, If type is ForgotPwdOTP/PwdChangeOTP, then Random Password Expire Time</param>
        /// <returns></returns>
        /// 
        public enum MailType { FirstTime, PwdChanged, ForgotPwdOTP, ResetPwdOTP, Expired, VerifyOTP, NewTicketUser, NewTicketSupport, AckTicket, PendingTicket, ResolvedTicket, AccountCreated,CreateNewWebUser,resend_otp }

        public string ComposeMailBodyNew(MailType mtype, string agentname, string mailId, string agentrole, string password)
        {
            switch (mtype)
            {
                case MailType.AccountCreated:
                    return "Hi " + agentname + ",<br />" +
                                         "<p> You are assigned with a role of  <strong>" + agentrole.ToLower() + "</strong> in <a href=''>Customer Connect</a>. Please login with your Mobile Number : <strong>" + mailId + "</strong> and Password : <strong>" + password + "</strong> </p>" +
                                          "<p>Sincerly,<br />" +
                                          "Prudent Technologies.<br />" +
                                          "<img id='logo' alt='Prudent Technologies' src=cid:Logo width='auto' height='50px' /></p>";


                default: return "";
            }
        }
        public string ComposeMailBody_c(MailType mtype,string? email = "",string? username = "",string? password = "",string? CustomerName = "",string? Link = "" ,string otp = "")
        {
            switch (mtype)
            {
                case MailType.CreateNewWebUser:
                    return "Hi  " + username + ",<br /> <p>&ensp;&ensp;Your account for <span style='color:#0B6CDA;'><strong><em>" + AppName + "</em></strong></span> successfully registered.Please login with your credentials,<br /><p><div>&ensp;&ensp; Username :<strong style=color:black;>" + username + "</strong>    Password :<strong style=color:black;>" + password + "</strong>    <br /></div></p><p>&ensp;&ensp;<a href=\"" + Link + "\">Click here for first time login .</a><br /></p>" +
                                                    "<p>Sincerly,<br />" +
                                                   "<img id='logo' alt='VI' src=cid:Logo width='auto' height='50px' /></p>"
                    ;

                case MailType.ForgotPwdOTP:
                    return "Hi " + mailServerModel.UserName + ",<br />" +
                                                    "<p> You have requested to recover your password for <span style='color:#0B6CDA;'><strong><em>" + AppName + "</em></strong></span>. " +
                                                    "Please use following One Time Password to complete your request.</p>" +
                                                    "<span>&ensp;&ensp;&ensp;&ensp;&ensp;OTP:   <strong>" + otp + "</strong></span><br/>" +
                                                    "<p> This OTP is valid for next " + mailServerModel.OTPExpireTime + " minutes only." +
                                                    "<p>Sincerly,<br />" +
                                                   "<img id='logo' alt='VI' src=cid:Logo width='auto' height='50px' /></p>";

                default: return "";
            }

            }
        public string ComposeMailBody_f(MailType mtype, string? username = "", string otp = "")
        {
            switch (mtype)
            {
              

                case MailType.ForgotPwdOTP:
                    return "Hi " + username + ",<br />" +
                                                    "<p> You have requested to recover your password for <span style='color:#0B6CDA;'><strong><em>" + AppName + "</em></strong></span>. " +
                                                    "Please use following One Time Password to complete your request.</p>" +
                                                    "<span>&ensp;&ensp;&ensp;&ensp;&ensp;OTP:   <strong>" + otp + "</strong></span><br/>" +
                                                    "<p> This OTP is valid for next " + mailServerModel.OTPExpireTime + " minutes only." +
                                                   "<p>Sincerly,<br />"+
                                                   "<img id='logo' alt='etisalat' src=cid:Logo width='auto' height='50px' /></p>";

                default: return "";
            }
            
        }
        public string ComposeMailBody_change(MailType mtype, string? username = "")
        {
            switch (mtype)
            {


                case MailType.PwdChanged:
                    return "Hi " + username + ",<br />" +
                                            "<p> You have successfully changed password for <strong><em><a href='" + AbsoluteUri + "'>" + AppName + "</a></strong></em>.</p>" +
                                            "<p>Sincerly,<br />" +
                "<img id='logo' alt='VI' src=cid:Logo width='auto' height='50px' /></p>";

                default: return "";
            }

        }
        public string ComposeMailBody_welcome(MailType mtype, string? username = "")
        {
            switch (mtype)
            {


                case MailType.FirstTime:
                    return "Hi " + username + ",<br />" +
                                                "<p> Welcome to " + AppName + ". You have successfully logged into <strong><em><a href='" + AbsoluteUri + "'>" + AppName + "</a></strong></em> for first time" +
                                                " and you have changed your password</p>" +
                                                "<p>Sincerly,<br />" +
                                                "<img id='logo' alt='VI' src=cid:Logo width='auto' height='50px' /></p>";

                default: return "";
            }

        }
        public string ComposeMailBody_resend_otp(MailType mtype, string? username = "",string? otp = "")
        {
            switch (mtype)
            {


                case MailType.resend_otp:
                    return "Hi " + username + ",<br />" +
                                                         "Please use following One Time Password to complete verification.</p>" +
                                                         "<span>&ensp;&ensp;&ensp;&ensp;&ensp;OTP:   <strong>" + otp + "</strong></span><br/>" +
                                                         "<p> This OTP is valid for next " + mailServerModel.OTPExpireTime + " minutes only." +
                                                         "<p>Sincerly,<br />" +
                                                         "<img id='logo' alt='VI' src=cid:Logo width='auto' height='50px' /></p>";

                default: return "";
            }

        }
        public string ComposeMailBody(MailType mtype, string otp = "")
        {

            switch (mtype)
            {
                case MailType.FirstTime:
                    return "Hi " + mailServerModel.UserName + ",<br />" +
                                                "<p> Welcome to " + AppName + ". You have successfully logged into <strong><em><a href='" + AbsoluteUri + "'>" + AppName + "</a></strong></em> for first time" +
                                                " and you have changed your password</p>" +
                                                "<p>Sincerly,<br />" +
                                                "<img id='logo' alt='VI' src=cid:Logo width='auto' height='50px' /></p>";
                case MailType.PwdChanged:
                    return "Hi " + mailServerModel.UserName + ",<br />" +
                                            "<p> You have successfully changed password for <strong><em><a href='" + AbsoluteUri + "'>" + AppName + "</a></strong></em>.</p>" +
                                            "<p>Sincerly,<br />" +
                                           "<img id='logo' alt='VI' src=cid:Logo width='auto' height='50px' /></p>";
                case MailType.ForgotPwdOTP:
                    return "Hi " + mailServerModel.UserName + ",<br />" +
                                                    "<p> You have requested to recover your password for <span style='color:#0B6CDA;'><strong><em>" + AppName + "</em></strong></span>. " +
                                                    "Please use following One Time Password to complete your request.</p>" +
                                                    "<span>&ensp;&ensp;&ensp;&ensp;&ensp;OTP:   <strong>" + otp + "</strong></span><br/>" +
                                                    "<p> This OTP is valid for next " + mailServerModel.OTPExpireTime + " minutes only." +
                                                    "<p>Sincerly,<br />" +
                                                   "<img id='logo' alt='VI' src=cid:Logo width='auto' height='50px' /></p>";
                case MailType.ResetPwdOTP:
                    return "Hi " + mailServerModel.UserName + ",<br />" +
                                                        "<p> You have requested to change your password for <span style='color:#0B6CDA;'><strong><em>" + AppName + "</em></strong></span>. " +
                                                        "Please use following One Time Password to complete your request.</p>" +
                                                        "<span>&ensp;&ensp;&ensp;&ensp;&ensp;OTP:   <strong>" + otp + "</strong></span><br/>" +
                                                        "<p> This OTP is valid for next " + mailServerModel.OTPExpireTime + " minutes only." +
                                                        "<p>Sincerly,<br />" +
                                                        "<img id='logo' alt='VI' src=cid:Logo width='auto' height='50px' /></p>";
                case MailType.VerifyOTP:
                    return "Hi " + mailServerModel.UserName + ",<br />" +
                                                        "Please use following One Time Password to complete verification.</p>" +
                                                        "<span>&ensp;&ensp;&ensp;&ensp;&ensp;OTP:   <strong>" + otp + "</strong></span><br/>" +
                                                        "<p> This OTP is valid for next " + mailServerModel.OTPExpireTime + " minutes only." +
                                                        "<p>Sincerly,<br />" +
                                                        "<img id='logo' alt='VI' src=cid:Logo width='auto' height='50px' /></p>";
                case MailType.Expired:
                    return "Hi " + mailServerModel.UserName + ",<br />" +
                                                        "<p> Your password for <strong><em><a href='" + AbsoluteUri + "'>" + AppName + "</a></strong></em> has expired. Please login to reset it.</p>" +
                                                        "<p>Sincerly,<br />" +
                                                        "<img id='logo' alt='VI' src=cid:Logo width='auto' height='50px' /></p>";

                case MailType.AccountCreated:
                    return "Hi " + mailServerModel.UserName + ",<br />" +
                                                        "<p> Your mailServerModel.UserName and password for <strong><em><a href='" + AbsoluteUri + "'>" + AppName + "</a></strong></em> is expired. Please login to reset it.</p>" +
                                                        "<p>Sincerly,<br />" +
                                                       "<img id='logo' alt='VI' src=cid:Logo width='auto' height='50px' /></p>";

                case MailType.CreateNewWebUser:
                    return "Hi " + mailServerModel.UserName + ",<br />" +
                                                        "<p> Your mailServerModel.UserName and password for <strong><em><a href='" + AbsoluteUri + "'>" + AppName + "</a></strong></em> is expired. Please login to reset it.</p>" +
                                                        "<p>Sincerly,<br />" +
                                                       "<img id='logo' alt='VI' src=cid:Logo width='auto' height='50px' /></p>";

                    
                default: return "";
            }
        }


        //public string ComposeTicketNotificationMailBody(MailType mtype, TicketMailModel model)
        //{
        //    switch (mtype)
        //    {
        //        case MailType.NewTicketUser:
        //            return "Hi,<br />" +
        //                        "<p> We apologize for the inconvenience caused to you. Your concern has raised to our support.</p>" +

        //                        "<table>" +
        //                        "<tr><td>Ticket Number</td><td> : </td><td>" + model.TicketNum + "</td></tr>" +
        //                        "<tr><td>Severity</td><td> : </td><td>" + model.Severity + "</td></tr>" +
        //                        "<tr><td>Issue</td><td> : </td><td>" + model.Issue + "</td></tr>" +
        //                        "<tr><td>Comments</td><td> : </td><td>" + model.Comments + "</td></tr>" +
        //                        "<tr><td>Status</td><td> : </td><td>" + model.Status + "</td></tr>" +
        //                        "</table>" +

        //                        "<p>Sincerly,<br />" +
        //                        "Idea Cellular Ltd.<br />" +
        //                        "<img id='logo' alt='!dea' src=cid:Logo width='auto' height='auto' /></p>";

        //        case MailType.NewTicketSupport:
        //            return "Dear Team,<br />" +
        //                        "<p> New ticket has been raised by flipkart team. Please do needful.</p>" +

        //                        "<table>" +
        //                        "<tr><td>Ticket Number</td><td> : </td><td>" + model.TicketNum + "</td></tr>" +
        //                        "<tr><td>Severity</td><td> : </td><td>" + model.Severity + "</td></tr>" +
        //                        "<tr><td>Issue</td><td> : </td><td>" + model.Issue + "</td></tr>" +
        //                        "<tr><td>Comments</td><td> : </td><td>" + model.Comments + "</td></tr>" +
        //                        "<tr><td>Status</td><td> : </td><td>" + model.Status + "</td></tr>" +
        //                        "</table>" +

        //                        "<p>Click on below button to open ticket (Note: You must logged-in before click on the link)<br>" +
        //                        "<br/><a href=\"" + AbsoluteUri + "/Ticket/" + model.TicketID + "\" style=\"background-color:#EB7035;border:1px solid #EB7035;border-radius:3px;color:#ffffff;display:inline-block;font-size:16px;line-height:30px;text-align:center;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all;margin-left:100px;\">View Ticket &rarr;</a>" +
        //                        "<br/><br/><p>Sincerly,<br />" +
        //                        "Idea Cellular Ltd.<br />" +
        //                        "<img id='logo' alt='!dea' src=cid:Logo width='auto' height='auto' /></p>";


        //        case MailType.AckTicket:
        //            return "Hi,<br />" +
        //                        "<p> Your concern has been acknowledged by our support.</p>" +

        //                        "<table>" +
        //                        "<tr><td>Ticket Number</td><td> : </td><td>" + model.TicketNum + "</td></tr>" +
        //                        "<tr><td>Severity</td><td> : </td><td>" + model.Severity + "</td></tr>" +
        //                        "<tr><td>Issue</td><td> : </td><td>" + model.Issue + "</td></tr>" +
        //                        "<tr><td>Comments</td><td> : </td><td>" + model.Comments + "</td></tr>" +
        //                        "<tr><td>Status</td><td> : </td><td>Acknowledged by support</td></tr>" +
        //                        "</table>" +

        //                        "<p>Sincerly,<br />" +
        //                        "Idea Cellular Ltd.<br />" +
        //                        "<img id='logo' alt='!dea' src=cid:Logo width='auto' height='auto' /></p>";


        //        case MailType.PendingTicket:
        //            return "Hi,<br />" +
        //                            "<p> Your concern has been attended by our support, and it has been escalated to concerned team</p>" +

        //                            "<h4>Complaint Details</h4>" +
        //                            "<table>" +
        //                            "<tr><td>Ticket Number</td><td> : </td><td>" + model.TicketNum + "</td></tr>" +
        //                            "<tr><td>Severity</td><td> : </td><td>" + model.Severity + "</td></tr>" +
        //                            "<tr><td>Issue</td><td> : </td><td>" + model.Issue + "</td></tr>" +
        //                            "<tr><td>Comments</td><td> : </td><td>" + model.Comments + "</td></tr>" +
        //                            "<tr><td>Status</td><td> : </td><td>" + model.Status + "</td></tr>" +
        //                            "</table>" +

        //                            "<h4>Resolution Details</h4>" +
        //                            "<table>" +
        //                            "<tr><td>RCA</td><td> : </td><td>" + model.Rca + "</td></tr>" +
        //                            "<tr><td>ActionTaken</td><td> : </td><td>" + model.ActionTaken + "</td></tr>" +
        //                            "</table>" +

        //                            "<br /><p>Sincerly,<br />" +
        //                            "Idea Cellular Ltd.<br />" +
        //                            "<img id='logo' alt='!dea' src=cid:Logo width='auto' height='auto' /></p>";


        //        case MailType.ResolvedTicket:
        //            return "Hi,<br />" +
        //                               "<p> Your concern has been resolved by our support.</p>" +

        //                                "<h4>Complaint Details</h4>" +
        //                                "<table>" +
        //                                "<tr><td>Ticket Number</td><td> : </td><td>" + model.TicketNum + "</td></tr>" +
        //                                "<tr><td>Severity</td><td> : </td><td>" + model.Severity + "</td></tr>" +
        //                                "<tr><td>Issue</td><td> : </td><td>" + model.Issue + "</td></tr>" +
        //                                "<tr><td>Comments</td><td> : </td><td>" + model.Comments + "</td></tr>" +
        //                                "<tr><td>Status</td><td> : </td><td>" + model.Status + "</td></tr>" +
        //                                "</table>" +

        //                                "<h4>Resolution Details</h4>" +
        //                                "<table>" +
        //                                "<tr><td>RCA</td><td> : </td><td>" + model.Rca + "</td></tr>" +
        //                                "<tr><td>ActionTaken</td><td> : </td><td>" + model.ActionTaken + "</td></tr>" +
        //                                "</table>" +

        //                               "<br /><p>Sincerly,<br />" +
        //                               "Idea Cellular Ltd.<br />" +
        //                               "<img id='logo' alt='!dea' src=cid:Logo width='auto' height='auto' /></p>";

        //        default: return "";
        //    }
        //}


        public string ComposeIncidentMail(DataTable dt)
        {


            return "Dear All,<br />" +
                        "<h3><p> Description </p><h3>" +

                        "<table>" +
                        "<tr><td>Incident Id:</td><td> : </td><td>" + dt.Rows[0]["inc_id"] + "</td></tr>" +
                        "<tr><td>Impacted Circle:</td><td> : </td><td>" + dt.Rows[0]["location"] + "</td></tr>" +
                        "<tr><td>Impacted Service:</td><td> : </td><td>" + dt.Rows[0]["Impacted Service"] + "</td></tr>" +
                        "<tr><td>Incident Description:</td><td> : </td><td>" + dt.Rows[0]["Incident Description"] + "</td></tr>" +
                        "<tr><td>Impact Description</td><td> : </td><td>" + dt.Rows[0]["Impact Description"] + "</td></tr>" +
                         "<tr><td>Severity</td><td> : </td><td>" + dt.Rows[0]["severity"] + "</td></tr>" +
                         "<tr><td>Incident Occurred Time:</td><td> : </td><td>" + dt.Rows[0]["inc_date"] + "</td></tr>" +
                          "<tr><td>Resolution given</td><td> : </td><td>" + dt.Rows[0]["Resolution"] + "</td></tr>" +
                           "<tr><td>Root Cause:</td><td> : </td><td>" + dt.Rows[0]["Root Cause"] + "</td></tr>" +
                         "<tr><td>Preventive Action:</td><td> : </td><td>" + dt.Rows[0]["Preventive Action"] + "</td></tr>" +
                         "<tr><td>Resolution Time:</td><td> : </td><td>" + dt.Rows[0]["res_date"] + "</td></tr>" +
                         "<tr><td>Current Status:</td><td> : </td><td>" + dt.Rows[0]["status"] + "</td></tr>" +

                        "</table>" +


                       "<br /><p>With Best Regards,<br />" +
                               "Enterprise IVR Support<br />"
                               + "Mob#9562906395<br />";

        }

        #endregion

        public bool SendEmail(string Subject, string Emailbody, string[] MailTo, params string[] MailCC)
        {
            //AccountDbPrcs prc = new AccountDbPrcs();

            try
            {
                using (MailMessage Mail = new MailMessage())
                {
                    Mail.IsBodyHtml = true;
                    AlternateView htmlView = AlternateView.CreateAlternateViewFromString(Emailbody, null, "text/html");
                    LinkedResource IdeaLogo = new LinkedResource(AppDomain.CurrentDomain.BaseDirectory + "Content/images/idea.png", "image/png");
                    IdeaLogo.ContentId = "Logo";
                    htmlView.LinkedResources.Add(IdeaLogo);

                    Mail.AlternateViews.Add(htmlView);
                    Mail.From = new MailAddress(mailServerModel.FromAddress, mailServerModel.DisplayName);

                    foreach (string toMail in MailTo)
                    {
                        if (!string.IsNullOrWhiteSpace(toMail))
                            Mail.To.Add(toMail.Trim());
                    }

                    foreach (string ccMail in MailCC)
                    {
                        if (!string.IsNullOrWhiteSpace(ccMail))
                            Mail.CC.Add(ccMail.Trim());
                    }

                    Mail.Subject = Subject;
                    using (SmtpClient smtp = new SmtpClient(mailServerModel.MailServerIP, mailServerModel.Port))
                    {
                        smtp.Send(Mail);
                    }
                    // Success Update in DB  
                    //if (mID != 0)
                    //    prc.UpdateMailStatus(mID, 1);

                }
                return true;
            }
            catch (Exception ex)
            {
                // prc.UpdateMailStatus(mID, 2);
                // LogWriter.Write("SendEmail :: Exception :: " + ex.Message);
                return false;//Mail error 
            }
        }
    }
}
