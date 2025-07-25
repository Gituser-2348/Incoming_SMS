using Microsoft.AspNetCore.Rewrite;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Ocsp;
using SMS.Controllers.api;
using SMS.Core;
using SMS.Helpers;
using SMS.Models;
using System.Data;

using System.Net.NetworkInformation;
using System.Numerics;

using System.Threading;
using System.Xml.Linq;
using Templateprj.Helpers;
using static Mysqlx.Expect.Open.Types.Condition.Types;

namespace SMS.DataAccess
{
    public class ConfigurationDataAccessLayer : MysqlDataAccessLayer
    {
        private readonly string? _3DesKey;
        private readonly string? Logpath;
        private readonly CryptoAlg cr = new CryptoAlg();
        private readonly Random _rnd = new Random();
        string? connectionString = "";
        private string? connectionkey ;
        private string? formatchanger ;
        private string?   key;
        private string? connStr;
        private readonly ILogWriter _logWriter;

        CryptoAlg _EncDec = new CryptoAlg();

        public ConfigurationDataAccessLayer(
            IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
            Logpath = configuration["LogPath"];
            _3DesKey = configuration["Key"];
            connectionString = configuration.GetConnectionString("MySQlConnnectionStr");
            _3DesKey = configuration["Key"];
            connectionString = configuration.GetConnectionString("MySQlConnnectionStr");
            connectionkey = configuration["connectionkey"];
            formatchanger = configuration["formatchanger"];
            // MySQlConnnectionStr = configuration["MySQlConnnectionStr"];
            key = _EncDec.DecryptDes(connectionkey, formatchanger);
            connStr = _EncDec.DecryptDes(connectionString, key);
        }



        public string GetInitialRequest(string data, out string? response, out string? request_id)
        {
            LogWriter.Write("GetInitialRequest", Logpath);
            string? status_out = ""; response = ""; request_id = "";
            try
            {
//                PROCEDURE `Request_Initial`(IN v_data LONGTEXT, OUT status_out INT, OUT response_out varchar(200),OUT request_id_out varchar(20))
//BEGIN
                using (MySqlCommand cmd = new MySqlCommand("web_Request_Initial"))
                {
                    LogWriter.Write("GetInitialRequest new MySqlCommand(\"web_Request_Initial\"))", Logpath);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@data", MySqlDbType.VarChar, 5000).Value = data;
                    cmd.Parameters.Add("@status_out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@response_out", MySqlDbType.VarChar,200).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@request_id_out", MySqlDbType.VarChar,200).Direction = ParameterDirection.Output;
                   
                    //if (status_out==1) { 


                    //}
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        LogWriter.Write("GetInitialRequest  using (MySqlConnection con = new MySqlConnection(connectionString))", Logpath);
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                        status_out = cmd.Parameters["@status_out"].Value?.ToString();
                        response = cmd.Parameters["@response_out"].Value?.ToString();
                        request_id = cmd.Parameters["@request_id_out"].Value?.ToString();
                        LogWriter.Write("GetInitialRequest "+ status_out + response+ request_id, Logpath);
                        return status_out ?? "";

                    }
                }
            }
            catch (Exception ex)
            {
                LogWriter.Write("Exception e"+ex.Message, Logpath);
                //_logger.LogInformation(")
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return "";
            }
        }
        public DataTable? GetRequestTable(string? ReqID)
        {
           
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("web_fetch_rfp_request"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@req_id", MySqlDbType.VarChar,20).Value = ReqID;
                    
                    //}
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                       // status_out = cmd.Parameters["status_out"].Value.ToString();
                        MySqlDataAdapter da = new MySqlDataAdapter("", con);
                        DataTable dt = new DataTable();
                        da.SelectCommand = cmd;
                        da.Fill(dt);

                        return dt;
                    }
                }
            }
            catch (Exception )
            {
                //_logger.LogInformation(")
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return null;
            }
        }

        public DataTable? ViewAccountDetails(string? ReqID)
        {
           
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("web_get_user_account_dtl"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@req_id", MySqlDbType.VarChar, 20).Value = ReqID;

                    //}
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        // status_out = cmd.Parameters["status_out"].Value.ToString();
                        MySqlDataAdapter da = new MySqlDataAdapter("", con);
                        DataTable dt = new DataTable();
                        da.SelectCommand = cmd;
                        da.Fill(dt);

                        return dt;
                    }
                }
            }
            catch (Exception )
            {
                //_logger.LogInformation(")
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return null;
            }
        }

        public DataTable? GetNumberTable(string? ReqID)
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("web_fetch_numbers"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@req_id", MySqlDbType.VarChar, 20).Value = ReqID;
                    // cmd.Parameters.Add("@status_out", MySqlDbType.Int32).Value = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        MySqlDataAdapter da = new MySqlDataAdapter("", con);
                        DataTable dt = new DataTable();
                        da.SelectCommand = cmd;
                        da.Fill(dt);

                        return dt;
                    }
                }
            }
            catch (Exception )
            {
                //_logger.LogInformation(")
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return null;
            }
        }
        public DataTable? GetInfoTable(string? ReqID)
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("web_fetch_info"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@req_id", MySqlDbType.VarChar, 20).Value = ReqID;
                   // cmd.Parameters.Add("@status_out", MySqlDbType.Int32).Value = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        MySqlDataAdapter da = new MySqlDataAdapter("", con);
                        DataTable dt = new DataTable();
                        da.SelectCommand = cmd;
                        da.Fill(dt);

                        return dt;
                    }
                }
            }
            catch (Exception ex)
            {
                //_logger.LogInformation(")
                 _logWriter.Write("ConfigurationDataAccessLayer.web_fetch_info :: Exception :: " + ex.Message);
                return null;
            }
        }
        

            public DataSet? GetUrlDropDown()
            {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("web_get_url_dropdown"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    
                    // cmd.Parameters.Add("@status_out", MySqlDbType.Int32).Value = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        MySqlDataAdapter da = new MySqlDataAdapter("", con);
                        DataSet dt = new DataSet();
                        da.SelectCommand = cmd;
                        da.Fill(dt);

                        return dt;
                    }
                }
            }
            catch (Exception )
            {
                //_logger.LogInformation(")
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return null;
            }
        }
        public DataTable? GetCustomerDropDown()
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("web_get_customer_dropdown"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // cmd.Parameters.Add("@status_out", MySqlDbType.Int32).Value = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        MySqlDataAdapter da = new MySqlDataAdapter("", con);
                        DataTable dt = new DataTable();
                        da.SelectCommand = cmd;
                        da.Fill(dt);

                        return dt;
                    }
                }
            }
            catch (Exception )
            {
                //_logger.LogInformation(")
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return null;
            }
        }

        public DataSet? GetAddUserCustomerDropDown()
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("web_get_createuser_customer_dropdown"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // cmd.Parameters.Add("@status_out", MySqlDbType.Int32).Value = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        MySqlDataAdapter da = new MySqlDataAdapter("", con);
                        DataSet dt = new DataSet();
                        da.SelectCommand = cmd;
                        da.Fill(dt);

                        return dt;
                    }
                }
            }
            catch (Exception )
            {
                //_logger.LogInformation(")
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return null;
            }
        }

        public int UrlConfigure(ConfigureModel model,out string? resp)
        {
            resp = "";
            string? status_out = "";
          // `web_url_configure`(in v_data_in json, OUT v_status int, OUT v_response varchar(200) )
            var JSONresult = JsonConvert.SerializeObject(model);
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("web_url_configure"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    //cmd.Parameters.Add("@Req_id", MySqlDbType.VarChar, 20).Value = model.ReqID;
                    //cmd.Parameters.Add("@account_id", MySqlDbType.VarChar, 20).Value = model.Account_id;
                    //cmd.Parameters.Add("@customer_url", MySqlDbType.Text).Value =model.url ;
                    //cmd.Parameters.Add("@method", MySqlDbType.VarChar,20).Value =model.method ;
                    //cmd.Parameters.Add("@date_format", MySqlDbType.VarChar,30).Value = model.date_format;
                    //cmd.Parameters.Add("@content_type", MySqlDbType.VarChar, 20).Value = model.content_type;
                    //cmd.Parameters.Add("@proxy_configure", MySqlDbType.VarChar, 20).Value = model.proxy;
                    //cmd.Parameters.Add("@splitter", MySqlDbType.VarChar, 20).Value = model.splitter;
                    //cmd.Parameters.Add("@header_keys", MySqlDbType.Text).Value =JsonConvert.SerializeObject(model.header_keys );
                    //cmd.Parameters.Add("@request_parameters", MySqlDbType.Text).Value = JsonConvert.SerializeObject(model.parameters_keys);
                    //cmd.Parameters.Add("@success_response", MySqlDbType.Text).Value =model.success_response ;
                    //cmd.Parameters.Add("@failure_response", MySqlDbType.Text).Value =model.failure_response ;
                    //cmd.Parameters.Add("@Bearer_token", MySqlDbType.VarChar, 400).Value = model.token;
                    //cmd.Parameters.Add("@Basic_auth", MySqlDbType.VarChar, 400).Value = model.basic;
                    //cmd.Parameters.Add("@time_out", MySqlDbType.VarChar, 20).Value =model.timeout ;
                    //cmd.Parameters.Add("@authentication", MySqlDbType.VarChar, 20).Value = model.authentication;
                    //cmd.Parameters.Add("@retry_count", MySqlDbType.VarChar, 20).Value =model.retry_count ;
                    //cmd.Parameters.Add("@vmn_length_flag", MySqlDbType.VarChar, 20).Value = model.VMN;
                    //cmd.Parameters.Add("@short_code_flag", MySqlDbType.VarChar, 20).Value = model.Shortcode_flag;
                    //cmd.Parameters.Add("@v_data_in", MySqlDbType.VarChar, 20).Value = model.Unicode_flag;
                    cmd.Parameters.Add("@v_data_in", MySqlDbType.JSON).Value = JSONresult;
                    cmd.Parameters.Add("@n_status", MySqlDbType.Int32);
                    cmd.Parameters["@n_status"].Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@response", MySqlDbType.VarChar, 100);
                    cmd.Parameters["@response"].Direction = ParameterDirection.Output;

                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();

                        status_out = cmd.Parameters["@n_status"].Value.ToString();
                       



                        resp = cmd.Parameters["@response"].Value.ToString();
                        return Convert.ToInt32(status_out);
                    }
                    
                }
            }
            catch (Exception ex)
            {
                //_logger.LogInformation(")
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return 0;
            }
        }

        public string? GetUrlTest(UrlTestModel model, out string? resp, out int status_out)
        {
            resp = "";
            status_out=0;
            string? UrlID = "";
            //PROCEDURE `web_insert_url_test_details`( in Request_id varchar(20),IN customer_url TEXT,
              //IN method VARCHAR(20),
              //IN date_format VARCHAR(40),
              //IN content_type VARCHAR(20),
              //IN proxy_configure VARCHAR(20),
              //in header varchar(20),
              //IN header_keys TEXT,
              //IN request_parameters TEXT,
              //in authentication varchar(20),
              //in bearer_token text,
              //in basic_key text,
              //in success text,
              //in failure text,
              //in retry_count varchar(20),
              //in time_out varchar(20),
  
              //out url_id varchar(20),
              //OUT n_status INT,
              //OUT response VARCHAR(100))
            try
            {
                var JSONresult = JsonConvert.SerializeObject(model);
                using (MySqlCommand cmd = new MySqlCommand("web_insert_url_test_details"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@v_data_in", MySqlDbType.LongText).Value = JSONresult;
                    //cmd.Parameters.Add("@customer_url", MySqlDbType.Text).Value = model.url_b;
                    //cmd.Parameters.Add("@method", MySqlDbType.VarChar, 20).Value = model.method_b;
                    //cmd.Parameters.Add("@date_format", MySqlDbType.VarChar, 40).Value = model.date_format_b;
                    //cmd.Parameters.Add("@content_type", MySqlDbType.VarChar, 20).Value = model.content_type_b;
                    //cmd.Parameters.Add("@proxy_configure", MySqlDbType.VarChar, 20).Value = model.proxy_b;
                    //cmd.Parameters.Add("@header", MySqlDbType.VarChar, 20).Value = model.header_b;
                    //cmd.Parameters.Add("@header_keys", MySqlDbType.Text).Value = JsonConvert.SerializeObject(model.header_keys_b);
                    //cmd.Parameters.Add("@request_parameters", MySqlDbType.Text).Value = JsonConvert.SerializeObject(model.parameters_keys_b);
                    //cmd.Parameters.Add("@authentication", MySqlDbType.VarChar, 20).Value = model.authentication_b;
                    //cmd.Parameters.Add("@bearer_token", MySqlDbType.Text).Value = model.token_b;
                    //cmd.Parameters.Add("@basic_key", MySqlDbType.Text).Value = model.basic_b;
                    //cmd.Parameters.Add("@success", MySqlDbType.Text).Value = model.success_b;
                    //cmd.Parameters.Add("@failure", MySqlDbType.Text).Value = model.failure_b;
                    //cmd.Parameters.Add("@retry_count", MySqlDbType.VarChar, 20).Value = model.retry_count_b;
                    //cmd.Parameters.Add("@time_out", MySqlDbType.VarChar, 20).Value = model.timeout_b;
                    cmd.Parameters.Add("@url_id", MySqlDbType.VarChar, 20);
                    cmd.Parameters["@url_id"].Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_status", MySqlDbType.Int32);
                    cmd.Parameters["@n_status"].Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@response", MySqlDbType.VarChar, 100);
                    cmd.Parameters["@response"].Direction = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                        UrlID = cmd.Parameters["@url_id"].Value?.ToString();
                        status_out = Convert.ToInt32 (cmd.Parameters["@n_status"].Value.ToString());
                        resp = cmd.Parameters["@response"].Value.ToString();
                        return UrlID ?? "";
                    }
                }
                
            }
            catch (Exception )
            {
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return null;
            }
        }

        public DataTable? GetUrlTestResponse(string UrlID, out string? response)
        {
            response = "";
            string? status_out = "";
            // PROCEDURE `web_get_test_url_details`(in url_id varchar(20),
              //OUT n_status INT,
              //OUT response VARCHAR(100))
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("web_get_test_url_details"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@url_id", MySqlDbType.VarChar, 20).Value = UrlID;
                    cmd.Parameters.Add("@n_status", MySqlDbType.Int32);
                    cmd.Parameters["@n_status"].Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@response", MySqlDbType.VarChar, 100);
                    cmd.Parameters["@response"].Direction = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                        status_out = cmd.Parameters["@n_status"].Value.ToString();
                        response = cmd.Parameters["@response"].Value.ToString();
                        MySqlDataAdapter da = new MySqlDataAdapter("", con);
                        DataTable dt = new DataTable();
                        da.SelectCommand = cmd;
                        da.Fill(dt);

                        return dt;
                    }

                }
            }
            catch (Exception )
            {
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return null;
            }
        }

        public int UrlTestResponse(UrlTestModel model, out string? resp,out string? urlcaller_urlid)
        {
            resp = "";
            string? status_out = "";
          //  url_resp = "";
          //  urlstat = "";
            urlcaller_urlid = "";
//            `web_url_test_insert_parameters`(in url_id varchar(20),
//in parameters text, in n_data text,
//out n_status varchar(20),out n_response varchar(20),out urlcaller_urlid varchar(20)
//)
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("web_url_test_insert_parameters"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@url_id", MySqlDbType.VarChar, 20).Value = model.UrlID;
                    cmd.Parameters.Add("@parameters", MySqlDbType.Text).Value = model.parameters;
                    cmd.Parameters.Add("@n_data", MySqlDbType.Text).Value = model.data;
                    cmd.Parameters.Add("@n_status", MySqlDbType.VarChar, 20);
                    cmd.Parameters["@n_status"].Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_response", MySqlDbType.VarChar, 20);
                    cmd.Parameters["@n_response"].Direction = ParameterDirection.Output;
                        cmd.Parameters.Add("@urlcaller_urlid", MySqlDbType.VarChar, 20);
                    cmd.Parameters["@urlcaller_urlid"].Direction = ParameterDirection.Output;

                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                        status_out = cmd.Parameters["@n_status"].Value.ToString();
                        resp = cmd.Parameters["@n_response"].Value.ToString();
                        urlcaller_urlid  = cmd.Parameters["@urlcaller_urlid"].Value.ToString();

                       
                        
                        return Convert.ToInt32(status_out);
                    }

                }
            }
            catch (Exception )
            {
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return 0;
            }
        }
        public string? GetUrlResponse(string? url_id, out string? sts_out, out string? resp, out string? url_status, out string? url_response)
        {
            sts_out = ""; resp = ""; url_status = ""; url_response = "";
            try
            {
                //                PROCEDURE `web_fetch_url_caller_response`(in n_url_id varchar(200),
                //out url_status varchar(20),
                //out url_response varchar(200),
                //out n_status_out varchar(10),out n_response_out varchar(100))
                using (MySqlCommand cmd = new MySqlCommand("web_fetch_url_caller_response"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@n_url_id", MySqlDbType.VarChar, 200).Value = url_id;

                    cmd.Parameters.Add("@url_status", MySqlDbType.VarChar, 20);
                    cmd.Parameters["@url_status"].Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@url_response", MySqlDbType.VarChar, 2000);
                    cmd.Parameters["@url_response"].Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_status_out", MySqlDbType.VarChar, 10);
                    cmd.Parameters["@n_status_out"].Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_response_out", MySqlDbType.VarChar, 100);
                    cmd.Parameters["@n_response_out"].Direction = ParameterDirection.Output;

                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        // status_out = cmd.Parameters["status_out"].Value.ToString();
                        cmd.ExecuteNonQuery();
                        sts_out = cmd.Parameters["@n_status_out"].Value.ToString();
                        resp = cmd.Parameters["@n_response_out"].Value.ToString();
                        url_status = cmd.Parameters["@url_status"].Value.ToString();
                        url_response = cmd.Parameters["@url_response"].Value.ToString();

                        return sts_out ?? "";
                    }
                }
            }
            catch (Exception)
            {
                //_logger.LogInformation(")
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return null;
            }
        }
        public int AddUser(Adduser model, out string? resp, out string? email, out string? username, out string? password)
        {
            resp = "";
            string? status_out = ""; email = "";username = "";password = "";
//            `web_add_user`(IN Req_id varchar(20),in account_id varchar(20),
// IN V_User_name varchar(250),
//--IN V_password varchar(100),
// IN Customer_name varchar(200),
//IN mobile_number varchar(30),
//IN v_Email_In varchar(250),
//IN V_ADDRESS varchar(500),

//OUT N_Status int,
//OUT V_Status_out varchar(250),
//OUT email varchar(400), 
//OUT user_name varchar(200),
// OUT pass_word varchar(100))

            try
            {
                using (MySqlCommand cmd = new MySqlCommand("web_add_user"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@Req_id", MySqlDbType.VarChar, 20).Value = model.ReqID;
                    cmd.Parameters.Add("@account_id", MySqlDbType.VarChar, 20).Value = model.Account_id;
                    cmd.Parameters.Add("@V_User_name", MySqlDbType.VarChar, 250).Value = model.UserName;
                    
                    cmd.Parameters.Add("@Customer_name", MySqlDbType.VarChar, 200).Value = model.CustomerName;
                    cmd.Parameters.Add("@mobile_number", MySqlDbType.VarChar, 30).Value = model.MobileNumber;
                    cmd.Parameters.Add("@v_Email_In", MySqlDbType.VarChar, 250).Value = model.EmailId;
                    cmd.Parameters.Add("@V_ADDRESS", MySqlDbType.VarChar, 500).Value = model.Address;

                    cmd.Parameters.Add("@N_Status", MySqlDbType.Int32);
                    cmd.Parameters["@N_Status"].Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@V_Status_out", MySqlDbType.VarChar, 100);
                    cmd.Parameters["@V_Status_out"].Direction = ParameterDirection.Output;

                    cmd.Parameters.Add("@email", MySqlDbType.VarChar, 400);
                    cmd.Parameters["@email"].Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@user_name", MySqlDbType.VarChar, 200);
                    cmd.Parameters["@user_name"].Direction = ParameterDirection.Output;

                        cmd.Parameters.Add("@pass_word", MySqlDbType.VarChar, 100);
                    cmd.Parameters["@pass_word"].Direction = ParameterDirection.Output;

                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                        status_out = cmd.Parameters["@N_Status"].Value.ToString();
                        resp = cmd.Parameters["@V_Status_out"].Value.ToString();
                        email = cmd.Parameters["@email"].Value.ToString();
                        username = cmd.Parameters["@user_name"].Value.ToString();
                        password = cmd.Parameters["@pass_word"].Value.ToString();


                        return Convert.ToInt32(status_out);
                    }

                }
            }
            catch (Exception )
            {
                //_logger.LogInformation(")
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return 0;
            }
        }
        public DataSet? NewRequestDropdown()
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("web_get_create_new_request_dropdown"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // cmd.Parameters.Add("@status_out", MySqlDbType.Int32).Value = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        MySqlDataAdapter da = new MySqlDataAdapter("", con);
                        DataSet dt = new DataSet();
                        da.SelectCommand = cmd;
                        da.Fill(dt);

                        return dt;
                    }
                }
            }
            catch (Exception )
            {
                //_logger.LogInformation(")
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return null;
            }
        }
        public int CreateNewRequest(CreateNewRequestModel model, out string? resp)
        {
            resp = "";

//            `web_create_new_request`(in account_id varchar(20),
// in customer_name varchar(20),
//in plan varchar(20), 
//in circle varchar(20), 
//in services varchar(20), 
//platform varchar(20),
//out n_status varchar(20), 
//out response varchar(20))
            string? status_out = "";

            try
            {
                using (MySqlCommand cmd = new MySqlCommand("web_create_new_request"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@account_id", MySqlDbType.VarChar, 20).Value = model.account_id;
                    cmd.Parameters.Add("@customer_name", MySqlDbType.VarChar, 250).Value = model.customername;

                    //cmd.Parameters.Add("@Customer_name", MySqlDbType.VarChar, 200).Value = model.CustomerName;
                    cmd.Parameters.Add("@plan", MySqlDbType.VarChar, 30).Value = model.plan;
                    cmd.Parameters.Add("@circle", MySqlDbType.VarChar, 250).Value = model.circle;
                    cmd.Parameters.Add("@services", MySqlDbType.VarChar, 500).Value = model.service;
                    cmd.Parameters.Add("@platform", MySqlDbType.VarChar, 500).Value = model.platform;
                    cmd.Parameters.Add("@n_status", MySqlDbType.VarChar,20);
                    cmd.Parameters["@n_status"].Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@response", MySqlDbType.VarChar, 20);
                    cmd.Parameters["@response"].Direction = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                        status_out = cmd.Parameters["@n_status"].Value.ToString();
                        resp = cmd.Parameters["@response"].Value.ToString();
                        return Convert.ToInt32(status_out);
                    }

                }
            }
            catch (Exception )
            {
                //_logger.LogInformation(")
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return 0;
            }
        }
        public int AddVmn(AddVmnModel model, out string? resp)
        {
            resp = "";

//            PROCEDURE `web_add_vmn`(in req_id varchar(20),
//in v_data text, out n_status varchar(20), out response varchar(100))
            string? status_out = "";

            try
            {
                using (MySqlCommand cmd = new MySqlCommand("web_add_vmn"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@account_id", MySqlDbType.VarChar, 20).Value = model.account_id;
                    cmd.Parameters.Add("@req_id", MySqlDbType.VarChar, 250).Value = model.Request_id;

                    //cmd.Parameters.Add("@Customer_name", MySqlDbType.VarChar, 200).Value = model.CustomerName;
                    cmd.Parameters.Add("@v_data", MySqlDbType.Text).Value = JsonConvert.SerializeObject(model.vmnlist);
                   
                    cmd.Parameters.Add("@n_status", MySqlDbType.VarChar, 20);
                    cmd.Parameters["@n_status"].Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@response", MySqlDbType.VarChar, 1000);
                    cmd.Parameters["@response"].Direction = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                        status_out = cmd.Parameters["@n_status"].Value.ToString();
                        resp = cmd.Parameters["@response"].Value.ToString();
                        return Convert.ToInt32(status_out);
                    }

                }
            }
            catch (Exception )
            {
                //_logger.LogInformation(")
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return 0;
            }
        }


    }
}
