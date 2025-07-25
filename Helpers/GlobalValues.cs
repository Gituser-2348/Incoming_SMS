//using Templateprj.DataAccess;
using SMS.Helpers;
using SMS.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
//using ConfigurationManager = System.Configuration.ConfigurationManager;

namespace Templateprj.Helpers
{
    public class GlobalValues
    {
        private readonly IConfiguration _configuration;
        string? connectionkey = "";
        string? formatchanger = "";
        string? MySQlConnnectionStr = "";
        private static string? key = "";
        private static  string? connStr = "";
        static CryptoAlg EncDec = new CryptoAlg();
        public GlobalValues(IConfiguration configuration)
        {
            connectionkey = configuration["connectionkey"];
            formatchanger = configuration["formatchanger"];
            MySQlConnnectionStr = configuration.GetConnectionString("MySQlConnnectionStr");
            key = EncDec.DecryptDes(connectionkey, formatchanger);
         connStr = EncDec.DecryptDes(MySQlConnnectionStr, key);
        // _configuration = configuration;
    }
        #region ApplicationId
        // private static int appId = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["AppId"].ToString());
        //public static int AppId
        //{
        //    get { return appId; }
        //}
        #endregion

        #region ApplicationName
        //private static string appName = System.Configuration.ConfigurationManager.AppSettings["AppName"].ToString();
        //public static string AppName
        //{
        //    get { return appName; }
        //}
        #endregion
        #region Application name-template maanger
        //private static string appName1 = System.Configuration.ConfigurationManager.AppSettings["MailSubject"].ToString();
        //public static string AppName1
        //{
        //    get { return appName1; }
        //}

        #endregion
        #region Key
       // private static  string connformchangerey = _configuration["formatchanger"].ToString();
       // private string connkey = System.Configuration.ConfigurationManager.AppSettings["connectionkey"].ToString();
        
        public static string Key
        {
            get
            {
                return key;
            }
        }
        #endregion

        #region Connection String
        //private static readonly string connStr = EncDec.DecryptDes(System.Configuration.ConfigurationManager.ConnectionStrings["MySQlConnnectionStr"].ToString(), GlobalValues.Key);
        public static string ConnStr
        {
            get
            {
                return connStr;
            }
        }

        

        //private static List<DBConnection> locationDbs = null;
        //public static List<DBConnection> LocationDBs
        //{
        //    get
        //    {
        //        if (locationDbs == null)
        //        {
        //            string[] locations = ConfigurationManager.AppSettings["LocationDBs"].Split(',');
        //            locationDbs = new List<DBConnection>();
        //            string conStr;
        //            foreach (string location in locations)
        //            {
        //                try
        //                {
        //                    conStr = EncDec.DecryptDes(ConfigurationManager.ConnectionStrings[location + "_CStr"].ToString(), GlobalValues.Key);
        //                    locationDbs.Add(new DBConnection { ConStr = conStr, Locatn = location });
        //                }
        //                catch (Exception ex)
        //                {
        //                    LogWriter.Write("GlobalValues.LocationDB :: Can not extract location db connection string, Location: " + location + "\n :: Exception :: " + ex.Message);
        //                    locationDbs = new List<DBConnection>();
        //                    break;
        //                }
        //            }
        //        }
        //        return locationDbs;
        //    }
        //}

        #endregion
        //#region DBPATH
        //private static string dbflag = EncDec.DecryptDes(ConfigurationManager.AppSettings["DBflag"].ToString(), GlobalValues.Key);
        //public static string DBflag
        //{
        //    get { return dbflag; }
        //}
        //#endregion

        //#region LogPath
        //private static string logPath = EncDec.DecryptDes(System.Configuration.ConfigurationManager.AppSettings["LogPath"].ToString(), GlobalValues.Key);
        //public static string LogPath
        //{
        //    get { return logPath; }
        //}
        //#endregion

        ////#region DocPath
        ////private static string docPath = EncDec.DecryptDes(ConfigurationManager.AppSettings["DocPath"].ToString(), GlobalValues.Key);
        ////public static string DocPath
        ////{
        ////    get { return docPath; }
        ////}
        ////#endregion

        //#region Mail Server Details
        ////private static MailServerModel mailServerDetails = null;
        ////public static MailServerModel MailServerDetails
        ////{
        ////    get
        ////    {
        ////        if (mailServerDetails == null)
        ////        {
        ////            mailServerDetails = (new AccountDbPrcs()).GetMailServerDetails();
        ////        }
        ////        return mailServerDetails;
        ////    }
        ////}
        //#endregion

        //#region Session AlertTime
        //private static int sessionAlertTime = -1;
        //public static int SessionAlertTime
        //{
        //    get
        //    {
        //        if (sessionAlertTime == -1)
        //        {
        //            try
        //            {
        //                sessionAlertTime = Convert.ToInt32((System.Configuration.ConfigurationManager.AppSettings["SessionAlertTime"].ToString()));
        //                sessionAlertTime = sessionAlertTime * 60000;
        //            }
        //            catch
        //            {
        //                sessionAlertTime = 60000;
        //            }

        //        }
        //        return sessionAlertTime;
        //    }
        //}
        //#endregion

        //#region AbsoluteUri
        //private static string absoluteUri = System.Configuration.ConfigurationManager.AppSettings["AbsoluteUri"].ToString();
        //public static string AbsoluteUri
        //{
        //    get { return absoluteUri; }
        //}
        //#endregion

        //#region AbsoluteUri
        //private static int maxReportPeriod = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["MaxReportPeriod"]);
        //public static int MaxReportPeriod
        //{
        //    get { return maxReportPeriod; }
        //}
        //#endregion
        //#region BulkPath
        //private static string bulkPath = EncDec.DecryptDes(System.Configuration.ConfigurationManager.AppSettings["BULKPath"].ToString(), GlobalValues.Key);
        //public static string BULKPath
        //{
        //    get { return bulkPath; }
        //}
        //#endregion
    }
}