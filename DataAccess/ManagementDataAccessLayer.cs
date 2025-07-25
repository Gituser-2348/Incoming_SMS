using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using SMS.Core;
using SMS.Helpers;
using System.Data;

namespace SMS.DataAccess
{
    public class ManagementDataAccessLayer : MysqlDataAccessLayer
    {
        private readonly string? _3DesKey;
        private readonly CryptoAlg cr = new CryptoAlg();
        private readonly Random _rnd = new Random();
        string? connectionString = "";

        CryptoAlg _EncDec = new CryptoAlg();

        public ManagementDataAccessLayer(IConfiguration configuration, IHttpContextAccessor httpContextAccessor) : base(configuration, httpContextAccessor)
        {
            _3DesKey = configuration["Key"];
            connectionString = configuration.GetConnectionString("MySQlConnnectionStr");
        }


        public string? GetAccount(int userid, int accountId)
        {
            //ManagementModel model = new ManagementModel();
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Web_Manage_Get_Account_Details"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@n_User_Id_In", MySqlDbType.Int32).Value = userid;
                    cmd.Parameters.Add("@n_Account_Id", MySqlDbType.Int32).Value = accountId;
                    cmd.Parameters.Add("@v_Data_Out", MySqlDbType.Text).Direction = ParameterDirection.Output;

                    DataTable dt = new DataTable();
                    using (MySqlConnection con = new MySqlConnection(connectionString))
                    {
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                    }
                    string? data = cmd.Parameters["@v_Data_Out"].Value.ToString();
                    return data;
                    //return (JsonConvert.DeserializeObject<List<ManagementModel>>(data)).FirstOrDefault();
                }
            }
            catch (Exception )
            {
              //LogWriter.Write("Repositories.Services.GetAccount :: Exception :: " + ex.Message);
            }
            return null;
        }

    }
}
