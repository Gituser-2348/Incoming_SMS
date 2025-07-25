using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using SMS.Authentication;
using SMS.Core;
using SMS.Helpers;
using SMS.Models;
using System.Data;
using System.Security.Claims;
using MySql.Data.MySqlClient;

namespace SMS.DataAccess
{
    public class AccountDataAccessLayer:MysqlDataAccessLayer 
    {
        private readonly string _3DesKey;
        private readonly CryptoAlg cr = new CryptoAlg();
        private readonly Random _rnd = new Random();

        public AccountDataAccessLayer(
            IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor
           // ,
           // ILogWriter logWriter
            ) : base(configuration, httpContextAccessor
              //  , logWriter
              )
        {
            _3DesKey = configuration["Key"];
        }

        public async Task<PasswordStatus> LoginAsync(LoginModel model)
        {
            try
            {
                using (var command = new MySqlCommand("Vc_Login_Prc_V130"))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.Add("v_Uname_in", MySqlDbType.VarChar).Value = model.Username.Trim().ToLower();
                    command.Parameters.Add("v_psd_in", MySqlDbType.VarChar).Value =
                        cr.GetHashSha1(model.Password.Trim());

                    command.Parameters.Add("n_user_id_out", MySqlDbType.Int16).Direction = ParameterDirection.Output;
                    command.Parameters.Add("n_loginid_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    command.Parameters.Add("v_email_out", MySqlDbType.VarChar, 500).Direction =
                        ParameterDirection.Output;
                    command.Parameters.Add("n_role_type_out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    command.Parameters.Add("v_role_name_out", MySqlDbType.VarChar, 100).Direction =
                        ParameterDirection.Output;
                    command.Parameters.Add("n_account_id", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    command.Parameters.Add("n_Service_Id_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    command.Parameters.Add("v_account_name_out", MySqlDbType.VarChar, 500).Direction =
                        ParameterDirection.Output;
                    command.Parameters.Add("v_agent_id_out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    command.Parameters.Add("n_location_id_out", MySqlDbType.VarChar, 50).Direction =
                        ParameterDirection.Output;
                    command.Parameters.Add("n_status_Out", MySqlDbType.Int16).Direction = ParameterDirection.Output;
                    command.Parameters.Add("n_Connect_To_Crm_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    command.Parameters.Add("n_Cust_Call_Report_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    command.Parameters.Add("n_Agnt_Call_Report_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    command.Parameters.Add("n_Sms_Report_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    command.Parameters.Add("n_Whatsapp_Report_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;


                   // await ExecuteQueryOnCentralDbAsync(command);

                    var status = (PasswordStatus)Convert.ToInt32(command.Parameters["n_Status_Out"].Value.ToString());

                    var claims = new List<Claim>
                    {
                        new Claim(MyClaimTypes.PasswordStatus, command.Parameters["n_status_Out"].Value.ToString()),
                        new Claim(MyClaimTypes.UserId, command.Parameters["n_user_id_out"].Value.ToString()),
                        new Claim(MyClaimTypes.Username, model.Username.Trim().ToLower())
                    };

                    switch (status)
                    {

                        case PasswordStatus.Success:
                        case PasswordStatus.AlreadyLogedIn:
                        case PasswordStatus.PsdExpireToday:
                        case PasswordStatus.PsdExpiresTomorrow:
                        case PasswordStatus.PsdExpiresInTwoDays:
                        case PasswordStatus.PsdExpiresInThreeDays:

                            claims.Add(new Claim(MyClaimTypes.LoginId,
                                command.Parameters["n_loginid_Out"].Value.ToString()));
                            claims.Add(new Claim(MyClaimTypes.Email,
                                command.Parameters["v_email_out"].Value.ToString()));
                            claims.Add(new Claim(MyClaimTypes.Role,
                                command.Parameters["v_role_name_out"].Value.ToString()));
                            claims.Add(new Claim(MyClaimTypes.RoleId,
                                command.Parameters["n_role_type_out"].Value.ToString()));

                            claims.Add(new Claim(MyClaimTypes.AccunaccountId,
                                command.Parameters["n_account_id"].Value.ToString()));

                            claims.Add(new Claim(MyClaimTypes.AccountId,
                                command.Parameters["n_Service_Id_Out"].Value.ToString()));

                            claims.Add(new Claim(MyClaimTypes.Account,
                                command.Parameters["v_account_name_out"].Value.ToString()));

                            claims.Add(new Claim(MyClaimTypes.AgentId,
                                command.Parameters["v_agent_id_out"].Value.ToString()));

                            claims.Add(new Claim(MyClaimTypes.Circle,
                                command.Parameters["n_location_id_out"].Value.ToString()));
                            claims.Add(new Claim(MyClaimTypes.WtReport,
                               command.Parameters["n_Whatsapp_Report_Out"].Value.ToString()));
                            claims.Add(new Claim(MyClaimTypes.AgentCallRpt,
                               command.Parameters["n_Agnt_Call_Report_Out"].Value.ToString()));
                            claims.Add(new Claim(MyClaimTypes.ConnectToCrm,
                               command.Parameters["n_Connect_To_Crm_Out"].Value.ToString()));
                            claims.Add(new Claim(MyClaimTypes.CustomerCallRpt,
                               command.Parameters["n_Cust_Call_Report_Out"].Value.ToString()));
                            claims.Add(new Claim(MyClaimTypes.SmsRpt,
                               command.Parameters["n_Sms_Report_Out"].Value.ToString()));


                            Console.WriteLine(claims);
                            break;

                        case PasswordStatus.PsdExpired:
                        case PasswordStatus.FirstTimeLogin:
                            break;

                        case PasswordStatus.UsernameIncorrect:
                            return PasswordStatus.UsernameIncorrect;
                        case PasswordStatus.PasswordIncorrect:
                            return PasswordStatus.PasswordIncorrect;

                        default:
                            return PasswordStatus.UserNotFound;
                    }


                   // await HttpContextAccessor.HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claims.GetPrincipal());
                    if (command.Parameters["n_role_type_out"].Value.ToString() == "5")
                    {
                        //update agent login status
                      //  await AgentLoginUpdate(command.Parameters["v_agent_id_out"].Value.ToString(), command.Parameters["n_Service_Id_Out"].Value.ToString(), command.Parameters["n_location_id_out"].Value.ToString());
                    }
                    return status;
                }
            }
            catch (Exception ex)
            {
                //await LogWriter.WriteAsync("DataAccess.AccountDataAccessLayer.LoginAsync :: Exception :: " + ex);
                return PasswordStatus.Error;
            }
        }
    }
}
