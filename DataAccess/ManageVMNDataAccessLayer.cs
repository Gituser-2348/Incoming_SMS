
using Microsoft.AspNetCore.WebUtilities;
using MySql.Data.MySqlClient;
using Mysqlx.Session;
using Newtonsoft.Json;
using Org.BouncyCastle.Ocsp;
using SMS.Controllers.api;
using SMS.Core;
using SMS.Helpers;
using SMS.Models;
using System.Data;
using System.Net.NetworkInformation;
using System.Threading;
using System.Xml.Linq;
using static Mysqlx.Expect.Open.Types.Condition.Types;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SMS.DataAccess
{
    public class ManageVMNDataAccessLayer : MysqlDataAccessLayer
    {
        private readonly string? _3DesKey;
        private readonly CryptoAlg cr = new CryptoAlg();
        private readonly Random _rnd = new Random();
        string? connectionString = "";
        private string? connectionkey;
        private string? formatchanger;
        private string? key;
        private string? connStr;
        private readonly ILogWriter _logWriter;

        CryptoAlg _EncDec = new CryptoAlg();

        public ManageVMNDataAccessLayer(
            IConfiguration configuration,
            IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
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
        public DataTable? GetVMNDropDown()
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("web_get_active_vmnlist_dropdown"))
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
            catch (Exception)
            {
                //_logger.LogInformation(")
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return null;
            }
        }
        public DataTable? GetVMNTable(string? VMN)
        {
           
            try
            {
                 //`web_get_active_configured_vmnlist`(in vmn varchar(20))
                using (MySqlCommand cmd = new MySqlCommand("web_get_active_configured_vmnlist"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@vmn", MySqlDbType.VarChar, 20).Value = VMN;
                    
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
        public DataTable? GetStatusRemarkable(string? VMN, out string? sts_out,out string? resp)
        {
            sts_out = "";resp = "";
            try
            {
               //`web_get_status_remark_tbl`(in vmn_id varchar(20),out n_status varchar(20),out response varchar(20))
                using (MySqlCommand cmd = new MySqlCommand("web_get_status_remark_tbl"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@vmn_id", MySqlDbType.VarChar, 20).Value = VMN;
                    cmd.Parameters.Add("@n_status", MySqlDbType.VarChar,20).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@response", MySqlDbType.VarChar,20).Direction = ParameterDirection.Output;
                    //if (status_out==1) { 

                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        // status_out = cmd.Parameters["status_out"].Value.ToString();
                        cmd.ExecuteNonQuery();
                        sts_out = cmd.Parameters["@n_status"].Value.ToString();
                        resp = cmd.Parameters["@response"].Value.ToString();
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
        public DataSet? GetStatusInfo(string? VMN)
        {
            string? sts_out = ""; string? resp = "";
            try
               // `web_vmn_status_change_info`(in lcsms_id varchar(20),out n_status varchar(20), out response varchar(20))
            {
                using (MySqlCommand cmd = new MySqlCommand("web_vmn_status_change_info"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@lcsms_id", MySqlDbType.VarChar, 20).Value = VMN;
                    cmd.Parameters.Add("@n_status", MySqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@response", MySqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
                    // cmd.Parameters.Add("@status_out", MySqlDbType.Int32).Value = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        // status_out = cmd.Parameters["status_out"].Value.ToString();
                        cmd.ExecuteNonQuery();
                        sts_out = cmd.Parameters["@n_status"].Value.ToString();
                        resp = cmd.Parameters["@response"].Value.ToString();
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
        public string? VMNStatusChange(VMNChangeStatusModel model, out string? response)
        {
            string? sts_out = "";  response = "";
            try
            // `web_vmn_staus_change`(in user_id varchar(20),
//in lcsms_id varchar(20),
//in v_status varchar(20),
//in remarks text,
//out n_status varchar(20),
//out response varchar(200))
            {
                using (MySqlCommand cmd = new MySqlCommand("web_vmn_status_change"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@user_id", MySqlDbType.VarChar, 20).Value = model.user_id;
                    cmd.Parameters.Add("@lcsms_id", MySqlDbType.VarChar, 20).Value = model.lcsms_id;
                    cmd.Parameters.Add("@v_status", MySqlDbType.VarChar, 20).Value = model.status;
                    cmd.Parameters.Add("@remarks", MySqlDbType.VarChar, 20).Value = model.remark;


                    cmd.Parameters.Add("@n_status", MySqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@response", MySqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
                    // cmd.Parameters.Add("@status_out", MySqlDbType.Int32).Value = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        // status_out = cmd.Parameters["status_out"].Value.ToString();
                        cmd.ExecuteNonQuery();
                        sts_out = cmd.Parameters["@n_status"].Value.ToString();
                        response = cmd.Parameters["@response"].Value.ToString();
                       

                        return sts_out;
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
        public DataTable? GetUrlChangeInfo(string? VMN, out string? sts_out, out string? resp)
        {
            sts_out = ""; resp = "";
            try
            {
  //              PROCEDURE `web_vmn_url_change_info`(in lcsms_id varchar(20), 
  //OUT n_status INT,
  //OUT response VARCHAR(100))
                using (MySqlCommand cmd = new MySqlCommand("web_vmn_url_change_info"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@lcsms_id", MySqlDbType.VarChar, 20).Value = VMN;
                    cmd.Parameters.Add("@n_status", MySqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@response", MySqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
                    //if (status_out==1) { 

                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        // status_out = cmd.Parameters["status_out"].Value.ToString();
                        cmd.ExecuteNonQuery();
                        sts_out = cmd.Parameters["@n_status"].Value.ToString();
                        resp = cmd.Parameters["@response"].Value.ToString();
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
        public string? UrlChange(ConfigureModel model, out string? response)
        {
            var JSONresult = JsonConvert.SerializeObject(model);
            string? sts_out = ""; response = "";
            try
//            `web_vmn_url_change`(IN icsms_id VARCHAR(20),
//in account_id varchar(20),
//  IN customer_url TEXT,
//  IN method VARCHAR(20),
//  IN date_format VARCHAR(40),
//  IN content_type VARCHAR(20),
//  IN proxy_configure VARCHAR(20),
//  IN header_keys TEXT,

            //  IN request_parameters TEXT,
            //  IN success_response TEXT,
            //  IN failure_response TEXT,
            //  IN time_out VARCHAR(20),
            //  in authentication varchar(20),
            //  IN retry_count VARCHAR(20),
            //   IN vmn_length_flag varchar(20),
            //  IN short_code_flag varchar(20),
            //  IN unicode_flag varchar(20),
            //  IN header_key_flag varchar(20), IN Bearer_token varchar(400),
            // IN Basic_auth varchar(400),
            //  OUT n_status INT,
            //  OUT response VARCHAR(100))

  //              `web_vmn_url_change`(IN v_data_in longtext,

  //OUT n_status INT,
  //OUT response VARCHAR(100))


            {
                using (MySqlCommand cmd = new MySqlCommand("web_vmn_url_change"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@v_data_in", MySqlDbType.LongText).Value = JSONresult;
                   
                    cmd.Parameters.Add("@n_status", MySqlDbType.Int32);
                    cmd.Parameters["@n_status"].Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@response", MySqlDbType.VarChar, 100);
                    cmd.Parameters["@response"].Direction = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        // status_out = cmd.Parameters["status_out"].Value.ToString();
                        cmd.ExecuteNonQuery();
                        sts_out = cmd.Parameters["@n_status"].Value.ToString();
                        response = cmd.Parameters["@response"].Value.ToString();


                        return sts_out;
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
        public string? UrlChangeTestInsert(ConfigureModel model, out string? response, out string? url_id)
        {
            var JSONresult = JsonConvert.SerializeObject(model);
            string? sts_out = ""; response = "";url_id = "";
            try
//`web_insert_change_url_test_details`( in lcsms_id varchar(20),
//in account_id varchar(20),
//IN customer_url TEXT,
//  IN method VARCHAR(20),
//  IN date_format VARCHAR(40),
//  IN content_type VARCHAR(20),
//  IN proxy_configure VARCHAR(20),
//  in header varchar(20),
//  IN header_keys TEXT,
//  IN request_parameters TEXT,
//  in authentication varchar(20),
//  in bearer_token text,
//  in basic_key text,
//  in success text,
//  in failure text,
//  in retry_count varchar(20),
//  in time_out varchar(20),
//  IN vmn_length_flag varchar(20),
//  IN short_code_flag varchar(20),
//  IN unicode_flag varchar(20),
//  IN header_key_flag varchar(20),
//  out url_id varchar(20),
//  OUT n_status INT,
//  OUT response VARCHAR(100))
       {
                using (MySqlCommand cmd = new MySqlCommand("web_insert_change_url_test_details"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@v_data_in", MySqlDbType.LongText).Value = JSONresult;
                    //cmd.Parameters.Add("@account_id", MySqlDbType.VarChar, 20).Value = model.VMN;
                    //cmd.Parameters.Add("@customer_url", MySqlDbType.Text).Value = model.url;
                    //cmd.Parameters.Add("@method", MySqlDbType.VarChar, 20).Value = model.method;
                    //cmd.Parameters.Add("@date_format", MySqlDbType.VarChar, 30).Value = model.date_format;
                    //cmd.Parameters.Add("@content_type", MySqlDbType.VarChar, 20).Value = model.content_type;
                    //cmd.Parameters.Add("@proxy_configure", MySqlDbType.VarChar, 20).Value = model.proxy;
                    //cmd.Parameters.Add("@header", MySqlDbType.VarChar, 20).Value = model.header;
                    //cmd.Parameters.Add("@header_keys", MySqlDbType.Text).Value = JsonConvert.SerializeObject(model.header_keys);
                    //cmd.Parameters.Add("@request_parameters", MySqlDbType.Text).Value = JsonConvert.SerializeObject(model.parameters_keys);
                    //cmd.Parameters.Add("@authentication", MySqlDbType.VarChar, 20).Value = model.authentication;
                    //cmd.Parameters.Add("@bearer_token", MySqlDbType.Text).Value = model.token;

                    //cmd.Parameters.Add("@basic_key", MySqlDbType.Text).Value = model.basic;
                    //cmd.Parameters.Add("@success", MySqlDbType.Text).Value = model.success_response;
                    //cmd.Parameters.Add("@failure", MySqlDbType.Text).Value = model.failure_response;
                    //cmd.Parameters.Add("@retry_count", MySqlDbType.VarChar, 20).Value = model.retry_count;
                    //cmd.Parameters.Add("@time_out", MySqlDbType.VarChar, 20).Value = model.timeout;
                    //cmd.Parameters.Add("@vmn_length_flag", MySqlDbType.VarChar, 20).Value = model.VMN_length_flag;
                    //cmd.Parameters.Add("@short_code_flag", MySqlDbType.VarChar, 20).Value = model.Shortcode_flag;
                    //cmd.Parameters.Add("@unicode_flag", MySqlDbType.VarChar, 20).Value = model.Unicode_flag;
                    //cmd.Parameters.Add("@header_key_flag", MySqlDbType.VarChar, 20).Value = model.header;
                    cmd.Parameters.Add("@url_id", MySqlDbType.VarChar,20);
                    cmd.Parameters["@url_id"].Direction = ParameterDirection.Output;

                    cmd.Parameters.Add("@n_status", MySqlDbType.Int32);
                    cmd.Parameters["@n_status"].Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@response", MySqlDbType.VarChar, 100);
                    cmd.Parameters["@response"].Direction = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        // status_out = cmd.Parameters["status_out"].Value.ToString();
                        cmd.ExecuteNonQuery();
                        sts_out = cmd.Parameters["@n_status"].Value.ToString();
                        response = cmd.Parameters["@response"].Value.ToString();
                        url_id= cmd.Parameters["@url_id"].Value.ToString();

                        return sts_out;
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
        public DataTable? GetUrlTestInfo(string? url_id, out string? sts_out, out string? resp)
        {
            sts_out = ""; resp = "";
            try
            {
               
                using (MySqlCommand cmd = new MySqlCommand("web_get_test_url_details"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@url_id", MySqlDbType.VarChar, 20).Value = url_id;
                    cmd.Parameters.Add("@n_status", MySqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@response", MySqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
                    //if (status_out==1) { 

                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        // status_out = cmd.Parameters["status_out"].Value.ToString();
                        cmd.ExecuteNonQuery();
                        sts_out = cmd.Parameters["@n_status"].Value.ToString();
                        resp = cmd.Parameters["@response"].Value.ToString();
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

        public string? InsertTestUrlDetails(string? data,string? url_id,string? parameters, out string? resp, out string? url_status, out string? url_response,out string? urlcaller_urlid)
        {
          string?  sts_out = ""; resp = ""; url_status=""; url_response = "";  urlcaller_urlid = "";
            try
            {
                //            `web_url_test_insert_parameters`(in url_id varchar(20),
                //in parameters text, in n_data text,
                //out n_status varchar(20),out n_response varchar(20),out urlcaller_urlid varchar(20)
                //)
                using (MySqlCommand cmd = new MySqlCommand("web_url_test_insert_parameters"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@url_id", MySqlDbType.VarChar, 20).Value = url_id;
                    cmd.Parameters.Add("@parameters", MySqlDbType.Text).Value = parameters;
                    cmd.Parameters.Add("@n_data", MySqlDbType.Text).Value = data;
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
                        // status_out = cmd.Parameters["status_out"].Value.ToString();
                        cmd.ExecuteNonQuery();
                        sts_out = cmd.Parameters["@n_status"].Value.ToString();
                        resp = cmd.Parameters["@n_response"].Value.ToString();
                        urlcaller_urlid = cmd.Parameters["@n_response"].Value.ToString();



                        if (sts_out == "1") {
                            //GetUrlResponse(url_id, out string n_status, out string n_response, out  url_status, out  url_response);
                            GetUrlResponse(urlcaller_urlid, out string? n_status, out string? n_response, out url_status, out url_response);

                        }

                        return sts_out;
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

        public string? GetUrlResponse(string? url_id,out string? sts_out,out string? resp, out string? url_status,out string? url_response)
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

                        return sts_out;
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

    }
}
