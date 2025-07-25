//using Microsoft.AspNetCore.Mvc.Rendering;
using MySql.Data.MySqlClient;
using SMS.Core;
using SMS.Helpers;
using SMS.Models;
using System.Configuration;
using System.Data;
using System.Collections.Generic;
using Templateprj.Helpers;
using static Mysqlx.Expect.Open.Types.Condition.Types;

namespace SMS.DataAccess
{


    //string connectionkey = "";
    //string formatchanger = "";
    //string MySQlConnnectionStr = "";
    //private static string key = "";
    //private static string connStr = "";
    //static CryptoAlg EncDec = new CryptoAlg();
    //public GlobalValues(IConfiguration configuration)
    //{
    //    connectionkey = configuration["connectionkey"];
    //    formatchanger = configuration["formatchanger"];
    //    MySQlConnnectionStr = configuration["MySQlConnnectionStr"];
    //    key = EncDec.DecryptDes(connectionkey, formatchanger);
    //    connStr = EncDec.DecryptDes(MySQlConnnectionStr, key);
    //    // _configuration = configuration;
    //}
    public class LoginDataAccessLayer :MysqlDataAccessLayer
    {

        string? connectionkey = "";
        string? formatchanger = "";
        string ?  MySQlConnnectionStr = "";
          string? key = "";
          string? connStr = "";
        private readonly string? _3DesKey;
        private readonly CryptoAlg cr = new CryptoAlg();
        private readonly Random _rnd = new Random();
        string? connectionString = "";
        private readonly ILogWriter _logWriter;

        CryptoAlg _EncDec = new CryptoAlg();

        public LoginDataAccessLayer(
            IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
            _3DesKey = configuration["Key"];
            connectionString = configuration.GetConnectionString("MySQlConnnectionStr");
            connectionkey = configuration["connectionkey"];
            formatchanger = configuration["formatchanger"];
           // MySQlConnnectionStr = configuration["MySQlConnnectionStr"];
            key = _EncDec.DecryptDes(connectionkey, formatchanger);
            connStr = _EncDec.DecryptDes(connectionString, key);
        }


        public int Logout(int mode, int loginID, int userid)
        {

            if (loginID == null)
                loginID = 0;
            if (userid == null)
                userid =0;

            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Sec_Logout"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@n_Login_Id_In", MySqlDbType.Int32).Value = loginID;
                    cmd.Parameters.Add("@n_Mode_In", MySqlDbType.Int32).Value = mode;
                    //cmd.Parameters.Add("@n_User_In", MySqlDbType.VarChar).Value = userid;
                    cmd.Parameters.Add("@n_Status_Out", MySqlDbType.Int16).Direction = ParameterDirection.Output;

                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                    }

                    return Convert.ToInt32(cmd.Parameters["@n_Status_Out"].Value.ToString());
                }
            }
            catch (Exception )
            {
                //LogWriter.Write("DataAccess.AccountDb.Logout :: Exception :: " + ex.Message);
                return -1;
            }
        }


        public object? SignIn(LoginModel model, string? DLTFlag)
        {
            LoginRespModel respModel = new();
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Sec_Login_new"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@v_Username_In", MySqlDbType.VarChar, 5000).Value = model.Username?.Trim().ToLower();
                    cmd.Parameters.Add("@v_Password_In", MySqlDbType.VarChar, 5000).Value = model.Password?.Trim();// _EncDec.GetHashSha1(model.Password.Trim());
                    cmd.Parameters.Add("@n_Appln_Id_In", MySqlDbType.Int32).Value = 1;
                    cmd.Parameters.Add("@v_Appln_Name_In", MySqlDbType.VarChar, 1000).Value = "";
                    cmd.Parameters.Add("@v_Circle_Out", MySqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_Userid_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_Pwd_Required_Out", MySqlDbType.Int16).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_Loginid_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_Roleid_Out", MySqlDbType.Int16).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@v_Rolename_Out", MySqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@v_Email_Out", MySqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@d_Started_Out", MySqlDbType.Date).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_Status_Out", MySqlDbType.Int16).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@v_comapny_out", MySqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@v_Status_out", MySqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@v_acc_id", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@V_Vendor", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    //using (MySqlConnection con = new MySqlConnection(connectionString))
                    //{
                    using (MySqlConnection con = new MySqlConnection(connStr)) { 
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                    }
                    int status = Convert.ToInt32(cmd.Parameters["@n_Status_Out"].Value.ToString());

                    respModel.userId = cmd.Parameters["@n_Userid_Out"].Value.ToString();
                    respModel.accountId = cmd.Parameters["@v_acc_id"].Value.ToString();
                    respModel.PwdRequired = cmd.Parameters["@n_Pwd_Required_Out"].Value.ToString();
                    respModel.LoginId = cmd.Parameters["@n_Loginid_Out"].Value.ToString();
                    respModel.RoleId = cmd.Parameters["@n_Roleid_Out"].Value.ToString();
                    respModel.RoleName = cmd.Parameters["@v_Rolename_Out"].Value.ToString();
                    respModel.Email = cmd.Parameters["@v_Email_Out"].Value.ToString();
                    respModel.Flag = cmd.Parameters["@d_Started_Out"].Value.ToString();
                    respModel.Status = cmd.Parameters["@n_Status_out"].Value.ToString();
                    respModel.UserName = model.Username?.Trim().ToLower();
                    respModel.DLTFlag = DLTFlag;
                   

var logText = $"[{DateTime.Now}] Login response  DATAACCESS: {status}  {connStr}";

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
                    return respModel;
                }
            }

            catch (Exception ex)
            {
var logText = $"[{DateTime.Now}] Login response  exception: {ex.Message} ";

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


               // LogWriter.Write("DataAccess.AccountDb.Login :: Exception :: " + ex.Message);
                //HttpContext.Current.Session.Clear();
                return null;
            }

        }

        public int FirstTimeChangePassword(FirstTimeLoginModel model, out string? mailID , out string? customer_name)
        {
            mailID = "";customer_name = "";

            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Sec_First_Time_Login"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@n_Userid_In", MySqlDbType.VarChar, 100).Value = model.userid;
                    cmd.Parameters.Add("@v_Newpswd_In", MySqlDbType.VarChar, 100).Value = model.newPassword;
                    cmd.Parameters.Add("@n_Questid_In", MySqlDbType.Int32).Value = model.securityQuestion;
                    cmd.Parameters.Add("@v_Answer_In", MySqlDbType.VarChar, 100).Value = _EncDec.EncryptDes(model.answer?.Trim().ToLower(), key);
                    cmd.Parameters.Add("@n_Appln_Id_In", MySqlDbType.Int32).Value = model.appid;

                    cmd.Parameters.Add("@v_Email_Out", MySqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_Mid_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_Status_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@customer_name", MySqlDbType.VarChar,200).Direction = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                    }
                    int status = Convert.ToInt32(cmd.Parameters["@n_Status_Out"].Value.ToString());
                    if (status == 1)
                    {
                        mailID = cmd.Parameters["@v_Email_Out"].Value.ToString();
                        customer_name = cmd.Parameters["@customer_name"].Value.ToString();
                        return Convert.ToInt32(cmd.Parameters["@n_Mid_Out"].Value.ToString());
                    }
                    else
                    {
                        return -status;
                    }
                }
            }
            catch (Exception )
            {
                //LogWriter.Write("DataAccess.AccountDb.FirstTimeChangePassword :: Exception :: " + ex.Message);
                return -1;
            }
        }


        public Tuple<DataTable, string> SecurityQuestions(int UserID=-1)
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Sec_Get_All_Question"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@n_Userid_In", MySqlDbType.Int32).Value = UserID;
                    cmd.Parameters.Add("@n_Questid_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        MySqlDataAdapter da = new MySqlDataAdapter("", con);
                        DataTable dtsecQs = new DataTable();
                        da.SelectCommand = cmd;
                        da.Fill(dtsecQs);

                        string? selectedQnId = cmd.Parameters["@n_Questid_Out"].Value.ToString();
                        return Tuple.Create(dtsecQs, selectedQnId);
                    }
                }
            }
            catch (Exception ex)
            {
                _logWriter.Write("DataAccess.AccountDb.GetSecurityQuestion :: Exception :: " + ex.Message);
                return null;
            }
        }

        public int VerifySecurityAns(VerifySecurityQnModel model, out string? response)
        {
            response = "";
           
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Sec_Verify_Answer"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@n_User_Id_In", MySqlDbType.Int32).Value = model.userid;
                    cmd.Parameters.Add("@n_Questid_In", MySqlDbType.Int32).Value = model.SecurityQuestion;
                    cmd.Parameters.Add("@v_Answer_In", MySqlDbType.VarChar, 100).Value =  _EncDec.EncryptDes(model.Answer?.Trim().ToLower(),key);
                    cmd.Parameters.Add("@n_Appln_Id_In", MySqlDbType.Int32).Value = model.appid;
                    cmd.Parameters.Add("@n_Status_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@V_statusOut", MySqlDbType.VarChar, 250).Direction = ParameterDirection.Output;

                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteScalar();
                    }
                    response = cmd.Parameters["@V_statusOut"].Value.ToString();
                    return Convert.ToInt32(cmd.Parameters["@n_Status_Out"].Value.ToString());
                }
            }
            catch (Exception ex)
            {
                //LogWriter.Write("DataAccess.AccountDb.VerifySecurityAns :: Exception :: " + ex.Message);
                return -1;
            }

        }

        public int AuthenticateUser(AuthenticateUserModel model, out string OTP, out int mid,out int userid, out string? mailId, out string? response, out string? customer_name)
        {
            //For Reset/Forgot password Step 1
            mailId = "";
            mid = 0;
            OTP = _rnd.Next(100000, 999999).ToString();
            response = "";customer_name = "";
            userid = 0;

            MySqlConnection? con = null;
            try
            {
                MySqlCommand cmd = new MySqlCommand();
                con = new MySqlConnection(connStr);
                con.Open();
                cmd.Connection = con;
                cmd.CommandText = "Sec_Authenticate_User";
                cmd.CommandType = CommandType.StoredProcedure;

                string? username;
                if (model.Username != null)
                {
                    username = model.Username.ToString();
                }
                else
                {
                    username = model.Username;
                }

                cmd.Parameters.Add("@v_username_In", MySqlDbType.VarChar).Value = username?.ToLower().Trim();
                cmd.Parameters.Add("@n_Questid_In", MySqlDbType.Int32).Value = model.SecurityQuestion;
                cmd.Parameters.Add("@v_Answer_In", MySqlDbType.VarChar).Value =_EncDec.EncryptDes(model.Answer.Trim().ToLower(), _3DesKey);
                if (string.IsNullOrWhiteSpace(model.oldpassword))
                    cmd.Parameters.Add("@v_Old_Pswd_In", MySqlDbType.VarChar).Value = DBNull.Value;
                else
                    cmd.Parameters.Add("@v_Old_Pswd_In", MySqlDbType.VarChar).Value =/* _EncDec.GetHashSha1*/(model.oldpassword.Trim());
                cmd.Parameters.Add("@v_Otp_In", MySqlDbType.VarChar).Value = OTP;
                cmd.Parameters.Add("@n_Appln_Id_In", MySqlDbType.Int32).Value = model.appid;
                cmd.Parameters.Add("@v_Appln_Name_In", MySqlDbType.VarChar).Value = model.appname;

                cmd.Parameters.Add("@v_Email_Out", MySqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("@n_Mid_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;

                cmd.Parameters.Add("@n_User_Id_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("@n_customer_name", MySqlDbType.VarChar,20).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("@n_Status_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("@V_response", MySqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                //cmd.Parameters.Add("@n_role_id", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                cmd.ExecuteNonQuery();
                con.Close();
                int status = Convert.ToInt32(cmd.Parameters["@n_Status_Out"].Value.ToString());
                response = cmd.Parameters["@V_response"].Value.ToString();

                if (status == 1)
                {
                    mid = Convert.ToInt32(cmd.Parameters["@n_Mid_Out"].Value.ToString());
                    mailId = cmd.Parameters["@v_Email_Out"].Value.ToString();

                    userid = Convert.ToInt32(cmd.Parameters["@n_User_Id_Out"].Value.ToString());
                    customer_name = cmd.Parameters["@n_customer_name"].Value.ToString();
                    //if (HttpContext.Current.Session["RoleID"] == null)
                    //{ //Forgot password case
                    //    HttpContext.Current.Session["RoleID"] = -1;
                    //    HttpContext.Current.Session["Username"] = username.ToTitleCase();
                    //}
                }
                return status;


            }
            catch (Exception )
            {
                //LogWriter.Write("DataAccess.AccountDb.AuthenticateUser :: Exception :: " + ex.Message);
                if (con != null)
                    con.Close();

                return -1;
            }

        }


        public int ChangePassword(ChangePasswordModel model,  out int mid, out string? mailID, out string? customer_name)
        {
           // send mail-
              mid = 0; customer_name = "";
             mailID = "";

            try
            {

//                PROCEDURE `sec_change_password`(IN n_userid_in int,
//IN v_otp_in varchar(100),
//IN v_newpswd_in varchar(100),
//IN n_appln_id_in int,
//IN v_appln_name_in varchar(100),
//OUT v_email_out varchar(200),
//OUT n_mid_out int,
//OUT n_status_out int,
//OUT n_user_name varchar(200))
                using (MySqlCommand cmd = new MySqlCommand("Sec_Change_Password"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@n_Userid_In", MySqlDbType.Int32).Value = model.userid;
                    cmd.Parameters.Add("@v_Otp_In", MySqlDbType.VarChar).Value = model.otp;
                    cmd.Parameters.Add("@v_Newpswd_In", MySqlDbType.VarChar).Value = model.newpassword?.Trim();
                    cmd.Parameters.Add("@n_Appln_Id_In", MySqlDbType.Int32).Value = model.appid;
                    cmd.Parameters.Add("@v_Appln_Name_In", MySqlDbType.VarChar).Value = model.appname;

                    cmd.Parameters.Add("@v_Email_Out", MySqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_Mid_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_Status_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_user_name", MySqlDbType.VarChar,200).Direction = ParameterDirection.Output;

                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                    }

                    int status = Convert.ToInt32(cmd.Parameters["@n_Status_Out"].Value.ToString());
                    if (status == 1)
                    {
                        mid = Convert.ToInt32(cmd.Parameters["@n_Mid_Out"].Value.ToString());
                        mailID = cmd.Parameters["@v_Email_Out"].Value.ToString();
                        customer_name = cmd.Parameters["@n_user_name"].Value.ToString();
                    }
                    return status;
                }
            }
            catch (Exception )
            {
                //LogWriter.Write("DataAccess.AccountDb.ChangePassword :: Exception :: " + ex.Message);
                return -1;
            }

        }

        public int ResendOTP(appUserModel model, out int mid, out string? mailId, out string? OTP,out string? user_name)
        {
            mid = 0;
            mailId = "";user_name = "";
            OTP = _rnd.Next(100000, 999999).ToString();

            try
            {

//                PROCEDURE `Sec_Resend_Otp`(IN n_Appln_Id_In int,
//IN n_User_Id_In int,
//IN v_Otp_In varchar(100),
//OUT n_Mid_Out int,
//OUT n_Status_Out int)
                using (MySqlCommand cmd = new MySqlCommand("Sec_Resend_Otp"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@n_Appln_Id_In", MySqlDbType.Int32).Value = model.appid;
                    cmd.Parameters.Add("@n_User_Id_In", MySqlDbType.Int32).Value = model.userid;
                    //cmd.Parameters.Add("@n_Type_In", MySqlDbType.Int32).Value = HttpContext.Current.Session["OTPMethod"] == null ? "1" : HttpContext.Current.Session["OTPMethod"].ToString();
                    cmd.Parameters.Add("@v_Otp_In", MySqlDbType.VarChar, 100).Value = OTP;
                    cmd.Parameters.Add("@n_Mid_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@v_To_Email", MySqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@user_name", MySqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_Status_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;

                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                    }

                    mid = Convert.ToInt32(cmd.Parameters["@n_Mid_Out"].Value.ToString());
                   mailId = cmd.Parameters["@v_To_Email"].Value.ToString();
                    user_name= cmd.Parameters["@user_name"].Value.ToString();

                    return Convert.ToInt32(cmd.Parameters["@n_Status_Out"].Value.ToString());
                }
            }

            catch (Exception )
            {
                //LogWriter.Write("DataAccess.AccountDb.ResendOTP :: Exception :: " + ex.Message);
                return -1;
            }


        }

        #region MAIL SERVER DETAILS

        public MailServerModel? GetMailServerDetails()
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Sec_Mail_Info"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@n_App_Id_In", MySqlDbType.Int32).Value = 1;

                    cmd.Parameters.Add("@v_Host_Ip_Out", MySqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@v_Port_Out", MySqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@v_Uname_Out", MySqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@v_Password_Out", MySqlDbType.VarChar, 100).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@v_From_Address_Out", MySqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@v_Display_Name_Out", MySqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_Otp_Expire_Time_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                   // cmd.Parameters.Add("@n_DLT_Flag_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_Status_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;

                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                    }
                    if (cmd.Parameters["@n_Status_Out"].Value.ToString() == "1")
                    {
                        MailServerModel model = new MailServerModel();
                        model.MailServerIP = _EncDec.DecryptDes( cmd.Parameters["@v_Host_Ip_Out"].Value.ToString(), _3DesKey);//_EncDec.DecryptDes(cmd.Parameters["@v_Host_Ip_Out"].Value.ToString());// 
                        model.Port =Convert.ToInt32(_EncDec.DecryptDes(cmd.Parameters["@v_Port_Out"].Value.ToString(), _3DesKey));// Convert.ToInt32(cmd.Parameters["@v_Port_Out"].Value.ToString());// 
                        model.UserName = cmd.Parameters["@v_Uname_Out"].Value.ToString();
                        model.Password = cmd.Parameters["@v_Password_Out"].Value.ToString();
                        model.FromAddress = cmd.Parameters["@v_From_Address_Out"].Value.ToString();
                        model.DisplayName = cmd.Parameters["@v_Display_Name_Out"].Value.ToString();
                        model.OTPExpireTime = Convert.ToInt32(cmd.Parameters["@n_Otp_Expire_Time_Out"].Value.ToString());
                        //model.DLTFlag = cmd.Parameters["@n_DLT_Flag_Out"].Value.ToString();
                        return model;
                    }
                }
            }
            catch (Exception)
            {
                
                
                //LogWriter.Write("DataAccess.AccountDb.getMailServerDetails :: Exception :: " + ex.Message);

            }
            return null;

        }

        #endregion


    }
}
