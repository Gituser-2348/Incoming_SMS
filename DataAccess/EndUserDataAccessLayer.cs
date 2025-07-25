using MySql.Data.MySqlClient;
using Mysqlx.Crud;
using SMS.Controllers.api;
using SMS.Core;
using SMS.Helpers;
using SMS.Models;
using System.Data;
using System.Net.NetworkInformation;
using System.Text.RegularExpressions;
using static Mysqlx.Expect.Open.Types.Condition.Types;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SMS.DataAccess
{
    public class EndUserDataAccessLayer : MysqlDataAccessLayer
    {
        private readonly string? _3DesKey;
        private readonly CryptoAlg cr = new CryptoAlg();
        private readonly Random _rnd = new Random();
        string? connectionString = "";
        private string? connectionkey;
        private string? formatchanger;
        private string? key;
        private readonly ILogWriter _logWriter;

        CryptoAlg _EncDec = new CryptoAlg();
        private string? connStr;

        public EndUserDataAccessLayer(
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

        public DataTable? VMNReport(string? vmn, string? status, string? date, string? user_id)
        {
            string? sts_out = ""; string? resp = "";
            try
            {
//                PROCEDURE `web_get_vmn_rpt_end_user`(in lcsms_id varchar(20), 
//in v_status varchar(20), in created_date varchar(20),
//out n_status varchar(20), out response varchar(20))
                using (MySqlCommand cmd = new MySqlCommand("web_get_vmn_rpt_end_user"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@n_user_id", MySqlDbType.VarChar, 200).Value = user_id;
                    cmd.Parameters.Add("@lcsms_id", MySqlDbType.VarChar, 20).Value = vmn;
                    cmd.Parameters.Add("@v_status", MySqlDbType.VarChar, 20).Value = status;
                    cmd.Parameters.Add("@created_date", MySqlDbType.VarChar, 20).Value = date;
                   
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
                // _logWriter.Write("CampaignDataAccessLayer.GetCampaignTypes :: Exception :: " + ex.Message);
                return null;
            }
        }
        public EndUserSummaryResponseModal? SummaryReport(EndUserSummaryModal model)
        {
            EndUserSummaryResponseModal model1 = new EndUserSummaryResponseModal();
            
            try
            {
//                PROCEDURE `web_get_summary_rpt_end_user`(
//IN n_vmn VARCHAR(200), 
//IN n_date VARCHAR(200),
//OUT n_total_count BIGINT,
//OUT n_success_count BIGINT,
//OUT n_pending_count BIGINT,
//OUT n_failure_count BIGINT)
                using (MySqlCommand cmd = new MySqlCommand("web_get_summary_rpt_end_user"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@n_user_id", MySqlDbType.VarChar, 200).Value = model.user_id;
                    cmd.Parameters.Add("@n_vmn", MySqlDbType.VarChar, 200).Value = model.vmn;
                    cmd.Parameters.Add("@n_date", MySqlDbType.VarChar, 200).Value = model.date;
                    cmd.Parameters.Add("@n_total_count", MySqlDbType.Int64).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_single_part", MySqlDbType.Int64).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@n_multi_part", MySqlDbType.Int64).Direction = ParameterDirection.Output;
                  //  cmd.Parameters.Add("@n_failure_count", MySqlDbType.VarChar, 20).Direction = ParameterDirection.Output;

                    //if (status_out==1) { 

                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        // status_out = cmd.Parameters["status_out"].Value.ToString();
                        cmd.ExecuteNonQuery();
                        model1.Total_Count = cmd.Parameters["@n_total_count"].Value.ToString();
                        model1.single_part = cmd.Parameters["@n_single_part"].Value.ToString();
                        model1.multi_part = cmd.Parameters["@n_multi_part"].Value.ToString();
                       // model1.Failure_Count = cmd.Parameters["@n_failure_count"].Value.ToString();


                        return model1;
                    }
                }
            }
            catch (Exception )
            {
                // _logWriter.Write("CampaignDataAccessLayer.GetCampaignTypes :: Exception :: " + ex.Message);
                return null;
            }
        }
        public DataTable? DetailReport(string? user_id, string? vmn, string? date)
        {
            
            try
            {
//                PROCEDURE `web_get_detail_rpt_end_user`(
//in n_vmn varchar(200), in n_date varchar(200))
                using (MySqlCommand cmd = new MySqlCommand("web_get_detail_rpt_end_user"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@n_user_id", MySqlDbType.VarChar, 200).Value = user_id;
                    cmd.Parameters.Add("@n_vmn", MySqlDbType.VarChar, 20).Value = vmn;
                    cmd.Parameters.Add("@n_date", MySqlDbType.VarChar, 20).Value = date;
                    


                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                        con.Open();
                        cmd.Connection = con;
                        // status_out = cmd.Parameters["status_out"].Value.ToString();
                        cmd.ExecuteNonQuery();

                        MySqlDataAdapter da = new MySqlDataAdapter("", con);
                        DataTable dt = new DataTable();
                        da.SelectCommand = cmd;
                        da.Fill(dt);
                        string data = "";
                        foreach (DataRow row in dt.Rows)
                        {
                            string? unicodeStatus = row["EncodeFlag"].ToString();
                            string? message = row["Short Message"].ToString();
                            if (unicodeStatus == "8")
                            {
                                string? str = message.ToString();

                                if (message.Trim() != "")
                                {

                                    string? tempMessage = "\\u" + Regex.Replace(message, ".{4}", "$0\\u");
                                    data = Regex.Unescape(tempMessage.Substring(0, tempMessage.Length - 2));

                                    data = data.Replace("\n", "");
                                    data = data.Replace("\r\n", "");

                                }
                                row["Short Message"] = data.ToString();

                            }

                        }
                        dt.Columns.Remove("EncodeFlag");
                        return dt;
                    }
                }
            }
            catch (Exception x)
            {
                // _logWriter.Write("CampaignDataAccessLayer.GetCampaignTypes :: Exception :: " + ex.Message);
                return null;
            }
        }


        //   PROCEDURE `web_get_vmn_dropdown_enduser`(IN v_user_id varchar(200))
        public DataSet? EndUserVMNList(string? user_id)
        {
            try
            {
               // PROCEDURE `web_get_vmn_dropdown_enduser`(IN v_user_id varchar(200))
                using (MySqlCommand cmd = new MySqlCommand("web_get_vmn_dropdown_enduser"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@v_user_id", MySqlDbType.VarChar, 200).Value = user_id;
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
            catch (Exception x)
            {
                // _logWriter.Write("CampaignDataAccessLayer.GetCampaignTypes :: Exception :: " + ex.Message);
                return null;
            }
        }

    }
}
