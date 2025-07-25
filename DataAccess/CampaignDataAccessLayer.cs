using Google.Protobuf.WellKnownTypes;
using MySql.Data.MySqlClient;
using MySqlX.XDevAPI.Common;
using Newtonsoft.Json;
using SMS.Controllers.api;
using SMS.Core;
using SMS.Helpers;
using SMS.Models;
using System.Data;
using System.Reflection.Metadata;
using System.Security.Cryptography;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using static Mysqlx.Expect.Open.Types.Condition.Types;

namespace SMS.DataAccess
{
    public class CampaignDataAccessLayer : MysqlDataAccessLayer
    {
        private readonly string? _3DesKey;
        private readonly CryptoAlg cr = new CryptoAlg();
        private readonly Random _rnd = new Random();
        string? connectionString = "";
        string? downloadPath = "";


        public CampaignDataAccessLayer(IConfiguration configuration, IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
            _3DesKey = configuration["Key"];
            connectionString = configuration.GetConnectionString("MySQlConnnectionStr");
            downloadPath = configuration["DownloadPath"];
        }

        #region Master Data
        public DataTable? GetCampaignTypes()
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Web_Get_Campaign_Type"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    using (MySqlConnection con = new MySqlConnection(connectionString))
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
                // _logWriter.Write("CampaignDataAccessLayer.GetCampaignTypes :: Exception :: " + ex.Message);
                return null;
            }
        }
        public DataTable? GetSMSTypes()
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Web_Get_message_Type"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    using (MySqlConnection con = new MySqlConnection(connectionString))
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
                // _logWriter.Write("CampaignDataAccessLayer.GetSMSTypes :: Exception :: " + ex.Message);
                return null;
            }
        }
        public DataTable? GetTemplateypes()
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Web_Get_template_type"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    using (MySqlConnection con = new MySqlConnection(connectionString))
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
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplateypes :: Exception :: " + ex.Message);
                return null;
            }
        }
        #endregion

        #region Details List
        public DataTable? GetTemplates(TemplateFilter filter)
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Web_Get_Templates"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("v_template_Id", MySqlDbType.String).Value = filter.TemplateID;
                    cmd.Parameters.Add("v_template_name", MySqlDbType.String).Value = filter.TemplateName;
                    cmd.Parameters.Add("n_template_type", MySqlDbType.Int32).Value = filter.TemplateTypeId;
                    cmd.Parameters.Add("n_msg_type", MySqlDbType.Int32).Value = filter.MessageTypeId;
                    using (MySqlConnection con = new MySqlConnection(connectionString))
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
        public DataTable? GetTemplate(int templateId)
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Web_Get_Template"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("n_id_in", MySqlDbType.Int32).Value = templateId;
                    using (MySqlConnection con = new MySqlConnection(connectionString))
                    {
                        con.Open();
                        cmd.Connection = con;
                        MySqlDataAdapter da = new MySqlDataAdapter("", con);
                        DataTable dt = new DataTable();
                        da.SelectCommand = cmd;
                        da.Fill(dt);
                        if (dt != null)
                            if (dt.Rows.Count > 0)
                                return dt;
                    }
                }
            }
            catch (Exception )
            {
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplate :: Exception :: " + ex.Message);               
            }
            return null;
        }
        public string? GetCampaignTemplate(string campaignId)
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Web_Get_Campaign_template"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@n_Campaign_Id", MySqlDbType.String).Value = campaignId;
                    cmd.Parameters.Add("@v_data_out", MySqlDbType.String).Direction =ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connectionString))
                    {
                        con.Open();
                        cmd.Connection = con;cmd.ExecuteNonQuery();
                    }
                    return cmd.Parameters["@v_data_out"].Value.ToString();
                }
            }
            catch (Exception )
            {
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplate :: Exception :: " + ex.Message);               
            }
            return "";
        }
        public DataTable? GetCampaigns(CampaignFilter filter)
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Web_Get_Campaigns"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("n_user_id", MySqlDbType.Int32).Value = filter.UserId;
                    cmd.Parameters.Add("v_from_date", MySqlDbType.String).Value = filter.FromDate;
                    cmd.Parameters.Add("v_to_date", MySqlDbType.String).Value = filter.ToDate;
                    cmd.Parameters.Add("v_campaign_name", MySqlDbType.String).Value = filter.CampaignName;
                    cmd.Parameters.Add("n_template_type", MySqlDbType.Int32).Value = filter.TemplateTypeId;
                    cmd.Parameters.Add("n_message_type", MySqlDbType.Int32).Value = filter.MessageTypeId;
                    cmd.Parameters.Add("n_Campaign_Status", MySqlDbType.Int32).Value = filter.CampaignStatusId;
                    using (MySqlConnection con = new MySqlConnection(connectionString))
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
        public DataTable? GetCampaignsStatus(CampaignFilter filter)
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Web_Get_Campaign_Status_dtl"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("n_Acc_Id", MySqlDbType.Int32).Value = filter.UserId;
                    cmd.Parameters.Add("n_user_id", MySqlDbType.Int32).Value = filter.UserId;
                    cmd.Parameters.Add("v_from_date", MySqlDbType.String).Value = filter.FromDate;
                    cmd.Parameters.Add("v_to_date", MySqlDbType.String).Value = filter.ToDate;
                    cmd.Parameters.Add("v_campaign_name", MySqlDbType.String).Value = filter.CampaignName;
                    cmd.Parameters.Add("n_template_type", MySqlDbType.Int32).Value = filter.TemplateTypeId;
                    cmd.Parameters.Add("n_message_type", MySqlDbType.Int32).Value = filter.MessageTypeId;
                    cmd.Parameters.Add("n_Campaign_Status", MySqlDbType.Int32).Value = filter.CampaignStatusId;
                    using (MySqlConnection con = new MySqlConnection(connectionString))
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
        public DataTable? GetCampaignsSummary(CampaignFilter filter)
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Web_Get_Campaign_Summary_dtl"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("n_Acc_Id", MySqlDbType.Int32).Value = filter.UserId;
                    cmd.Parameters.Add("n_user_id", MySqlDbType.Int32).Value = filter.UserId;
                    cmd.Parameters.Add("v_from_date", MySqlDbType.String).Value = filter.FromDate;
                    cmd.Parameters.Add("v_to_date", MySqlDbType.String).Value = filter.ToDate;
                    cmd.Parameters.Add("v_campaign_name", MySqlDbType.String).Value = filter.CampaignName;
                    cmd.Parameters.Add("n_template_type", MySqlDbType.Int32).Value = filter.TemplateTypeId;
                    cmd.Parameters.Add("n_message_type", MySqlDbType.Int32).Value = filter.MessageTypeId;
                    cmd.Parameters.Add("n_Campaign_Status", MySqlDbType.Int32).Value = filter.CampaignStatusId;
                    using (MySqlConnection con = new MySqlConnection(connectionString))
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
        public int CreateCampaign(CampaignModel campaign, out string? response, out string? campaignId)
        {
            response = "";
            campaignId = "";
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Web_Create_Campaign"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@n_User_Id", MySqlDbType.Int32).Value = campaign.userId;
                    cmd.Parameters.Add("@n_Acc_id", MySqlDbType.Int32).Value = campaign.accountId;
                    cmd.Parameters.Add("@v_data", MySqlDbType.JSON).Value = Newtonsoft.Json.JsonConvert.SerializeObject(campaign.jsonData);
                    cmd.Parameters.Add("@n_Status", MySqlDbType.String).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@v_Response", MySqlDbType.String).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@v_camp_id", MySqlDbType.String).Direction = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connectionString))
                    {
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                    }

                    response = cmd.Parameters["@v_Response"].Value.ToString();
                    campaignId = cmd.Parameters["@v_camp_id"].Value.ToString();
                    return Convert.ToInt32(cmd.Parameters["@n_Status"].Value.ToString());
                }
            }
            catch (Exception )
            {
                return 0;
            }
        }


        public int CreateTemplate(TemplateModel model, out string? response, out string? campaignId)
        {
            response = "";
            campaignId = "";
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Web_Create_Campaign"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@n_User_Id", MySqlDbType.Int32).Value = model.userId;
                    cmd.Parameters.Add("@n_Acc_id", MySqlDbType.Int32).Value = model.accountId;
                    cmd.Parameters.Add("@v_data", MySqlDbType.JSON).Value = Newtonsoft.Json.JsonConvert.SerializeObject(model.jsonData);
                    cmd.Parameters.Add("@n_Status", MySqlDbType.String).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@v_Response", MySqlDbType.String).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@v_camp_id", MySqlDbType.String).Direction = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connectionString))
                    {
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                    }

                    response = cmd.Parameters["@v_Response"].Value.ToString();
                    campaignId = cmd.Parameters["@v_camp_id"].Value.ToString();
                    return Convert.ToInt32(cmd.Parameters["@n_Status"].Value.ToString());
                }
            }
            catch (Exception )
            {
                return 0;
            }
        }
        #endregion

        #region Download

        public DataTable? DownloadCampaignDetailReport(string id, out string? dwnloadPath)
        {
            dwnloadPath = downloadPath;
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Web_Get_SMS_detail_Report_download"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@n_Camp_name_Id", MySqlDbType.Int32).Value = id;
                    using (MySqlConnection con = new MySqlConnection(connectionString))
                    {
                        con.Open();
                        cmd.Connection = con;
                        MySqlDataAdapter da = new MySqlDataAdapter("", con);
                        DataTable dt = new DataTable();
                        da.SelectCommand = cmd;
                        da.Fill(dt);

                        string? data = "";

                        dt.Columns.Add("val", typeof(System.String));
                        int colCount = dt.Columns.Count;

                        foreach (DataRow row in dt.Rows)
                        {
                            string? unicodeStatus = row["UNICODE STATUS"].ToString();
                            string? message = row["MESSAGE"].ToString();
                            if (unicodeStatus == "8")
                            {
                                string?  str = message?.ToString();
                                if (message?.Trim() != "")
                                {
                                    string tempMessage = "\\u" + Regex.Replace(message, ".{4}", "$0\\u");
                                    data = Regex.Unescape(tempMessage.Substring(0, tempMessage.Length - 2));
                                }
                                row["MESSAGE"] = data.ToString();
                            }
                            else
                            {
                                data = message?.Replace("\r\n", "");
                                row["MESSAGE"] = data;
                            }
                            row["val"] = row[colCount - 5].ToString() + "," + row[colCount - 4].ToString() + "," + row[colCount - 3].ToString() + "," + row[colCount - 2].ToString();
                        }
                        dt.Columns.Remove("UNICODE STATUS");
                        dt.Columns.Remove("val");

                        return dt;
                    }
                }
            }
            catch (Exception )
            {
                return null;
            }
        }

        #endregion

    }
}
