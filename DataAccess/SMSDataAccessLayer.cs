using MySql.Data.MySqlClient;
using SMS.Helpers;
using System.Data;

namespace SMS.DataAccess
{
    public class SMSDataAccessLayer: MysqlDataAccessLayer
    {
        private readonly string _3DesKey;
        private readonly CryptoAlg cr = new CryptoAlg();
        private readonly Random _rnd = new Random();
        string connectionString = "";

        CryptoAlg _EncDec = new CryptoAlg();
        public SMSDataAccessLayer(IConfiguration configuration,IHttpContextAccessor httpContextAccessor): base(configuration, httpContextAccessor)
        {
            _3DesKey = configuration["Key"];
            connectionString = configuration.GetConnectionString("MySQlConnnectionStr");
        }

        #region Master Data
        public DataTable GetSMSTypes()
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
                LogWriter.Write("SMSDataAccessLayer.GetSMSTypes :: Exception :: " + ex.Message);
                return null;
            }
        }
        #endregion

    }
}
