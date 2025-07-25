using MySql.Data.MySqlClient;
using MySqlX.XDevAPI;
using SMS.Helpers;
using SMS.Models;
using System.Data;
using System.Reflection.Metadata;

namespace SMS.DataAccess
{
    public class AccountDbPrcs
    {
        CryptoAlg _EncDec = new CryptoAlg();
        Random _rnd = new Random();
        public int Login(LoginModel model, out string response)
        {
            response = "";
           
            try
            {
                using (MySqlCommand cmd = new MySqlCommand("Sec_Login_new"))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@v_Username_In", MySqlDbType.VarChar, 5000).Value = model.Username.Trim().ToLower();
                    cmd.Parameters.Add("@v_Password_In", MySqlDbType.VarChar, 5000).Value = _EncDec.GetHashSha1(model.Password.Trim());
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

                    using (MySqlConnection con = new MySqlConnection(""))
                    {
                        con.Open();
                        cmd.Connection = con;
                        cmd.ExecuteNonQuery();
                    }
                    int status = Convert.ToInt32(cmd.Parameters["@n_Status_Out"].Value.ToString());
                    response = (cmd.Parameters["@v_Status_out"].Value.ToString());

                    if (status == 1)
                    {
                        int passFlag = Convert.ToInt32(cmd.Parameters["@n_Pwd_Required_Out"].Value.ToString());

                        
                        //HttpContext.Current.Session["Username"] = model.Username.Trim().ToLower();
                        //HttpContext.Current.Session["UserID"] = cmd.Parameters["@n_Userid_Out"].Value.ToString();
                        //HttpContext.Current.Session["PasswordFlag"] = passFlag;
                        //HttpContext.Current.Session["LoginID"] = cmd.Parameters["@n_Loginid_Out"].Value.ToString();
                        //HttpContext.Current.Session["RoleID"] = cmd.Parameters["@n_Roleid_Out"].Value.ToString();
                        //HttpContext.Current.Session["EmailID"] = cmd.Parameters["@v_Email_Out"].Value.ToString();
                        //HttpContext.Current.Session["RoleName"] = cmd.Parameters["@v_Rolename_Out"].Value.ToString();
                        //HttpContext.Current.Session["StartDate"] = cmd.Parameters["@d_Started_Out"].Value;
                        //HttpContext.Current.Session["AccountID"] = cmd.Parameters["@v_acc_id"].Value.ToString();
                        ////Administrator
                        //HttpContext.Current.Session["DBConString"] = GlobalValues.ConnStr;




                        return passFlag;
                    }
                    else
                    {
                        //LogWriter.Write("DataAccess.AccountDb.Login :: Login Failed :: StatusOut:" + status);
                        //HttpContext.Current.Session.Clear();
                        return -status;
                    }
                }
            }

            catch (Exception ex)
            {
                //LogWriter.Write("DataAccess.AccountDb.Login :: Exception :: " + ex.Message);
                //HttpContext.Current.Session.Clear();
                return -1;
            }

        }

    }
}
