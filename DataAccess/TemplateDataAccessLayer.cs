using MySql.Data.MySqlClient;
using SMS.Helpers;
using System.Data;

namespace SMS.DataAccess
{
    public class TemplateDataAccessLayer:MysqlDataAccessLayer
    {

        private readonly string _3DesKey;
        private readonly CryptoAlg cr = new CryptoAlg();
        private readonly Random _rnd = new Random();
        string connectionString = "";

        CryptoAlg _EncDec = new CryptoAlg();
        public TemplateDataAccessLayer(IConfiguration configuration, IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
            _3DesKey = configuration["Key"];
            connectionString = configuration.GetConnectionString("MySQlConnnectionStr");
        }

        public Tuple<DataTable, string> GetAllTemplates()
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand(""))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@n_Userid_In", MySqlDbType.Int32).Value = 1;
                    cmd.Parameters.Add("@n_Questid_Out", MySqlDbType.Int32).Direction = ParameterDirection.Output;
                    using (MySqlConnection con = new MySqlConnection(connectionString))
                    {
                        con.Open();
                        cmd.Connection = con;
                        MySqlDataAdapter da = new MySqlDataAdapter("", con);
                        DataTable dtsecQs = new DataTable();
                        da.SelectCommand = cmd;
                        da.Fill(dtsecQs);

                        string selectedQnId = cmd.Parameters["@n_Questid_Out"].Value.ToString();
                        return Tuple.Create(dtsecQs, selectedQnId);
                    }
                }
            }
            catch (Exception ex)
            {
                LogWriter.Write("DataAccess.AccountDb.GetSecurityQuestion :: Exception :: " + ex.Message);
                return null;
            }
        }

    }
}
