using MySql.Data.MySqlClient;
using SMS.Core;
using SMS.Helpers;
using SMS.Models;
using System.Data;
using static Mysqlx.Expect.Open.Types.Condition.Types;

namespace SMS.DataAccess
{
    public class DashboardDataAccessLayer: MysqlDataAccessLayer
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

        public DashboardDataAccessLayer(
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
        public DashboardModel? GetDashboardCount()
        {
//          `web_get_dashboard_count`(out total_vmn_count bigint,out active_vmn_cnt bigint,
//out inactive_vmn_count bigint,out total_configured_vmn bigint, out total_terminated_vmn int,
//out today_cnt bigint,out last_day_cnt bigint,out this_week_cnt bigint, out last_week_cnt bigint,out this_month_cnt bigint,out last_month_cnt bigint)
               DashboardModel model = new DashboardModel();
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("web_get_dashboard_count"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                  
                         cmd.Parameters.Add("@total_vmn_count", MySqlDbType.Int64).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@active_vmn_cnt", MySqlDbType.Int64).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@inactive_vmn_count", MySqlDbType.Int64).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@total_configured_vmn", MySqlDbType.Int64).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@total_terminated_vmn", MySqlDbType.Int16).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@today_cnt", MySqlDbType.Int64).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@last_day_cnt", MySqlDbType.Int64).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@this_week_cnt", MySqlDbType.Int64).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@last_week_cnt", MySqlDbType.Int64).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@this_month_cnt", MySqlDbType.Int64).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("@last_month_cnt", MySqlDbType.Int64).Direction = ParameterDirection.Output;
                    //if (status_out==1) { 


                    //}
                    using (MySqlConnection con = new MySqlConnection(connStr))
                    {
                       
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                       model.total_vmn = cmd.Parameters["@total_vmn_count"].Value.ToString();
                        model.active_vmn = cmd.Parameters["@active_vmn_cnt"].Value.ToString();
                        model.inactive_vmn = cmd.Parameters["@inactive_vmn_count"].Value.ToString();
                        model.config_vmn = cmd.Parameters["@total_configured_vmn"].Value.ToString();
                        model.terminated_vmn = cmd.Parameters["@total_terminated_vmn"].Value.ToString();
                        model.today_cnt = cmd.Parameters["@today_cnt"].Value.ToString();
                        model.last_day_cnt = cmd.Parameters["@last_day_cnt"].Value.ToString();
                        model.this_week_cnt = cmd.Parameters["@this_week_cnt"].Value.ToString();
                        model.last_week_cnt = cmd.Parameters["@last_week_cnt"].Value.ToString();
                        model.this_month_cnt = cmd.Parameters["@this_month_cnt"].Value.ToString();
                        model.last_month_cnt = cmd.Parameters["@last_month_cnt"].Value.ToString();
                        return model;
                    }
                }
            }
            catch (Exception x)
            {
                //_logger.LogInformation(")
                // _logWriter.Write("CampaignDataAccessLayer.GetTemplates :: Exception :: " + ex.Message);
                return null;
            }
        }
    }
}
