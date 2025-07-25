using Google.Protobuf.WellKnownTypes;
using MySql.Data.MySqlClient;
using SMS.Core;
using System.Data;
using System.Reflection.Metadata;
using System.Security.Claims;

namespace SMS.DataAccess
{
    public class MysqlDataAccessLayer
    {
        
        private const string CentralDbStr = "CentralDb";

        protected readonly IConfiguration Configuration;
        protected readonly IHttpContextAccessor HttpContextAccessor;
       // protected readonly ILogWriter LogWriter;
        protected ClaimsPrincipal LogedInUser => HttpContextAccessor.HttpContext.User;


        protected MysqlDataAccessLayer(IConfiguration configuration, IHttpContextAccessor httpContextAccessor//, ILogWriter logWriter
            )
        {
            Configuration = configuration;
            HttpContextAccessor = httpContextAccessor;
            //LogWriter = logWriter;
            string? ss = configuration.GetConnectionString(CentralDbStr);
        }

        #region Execute reader
        protected MySqlDataReader ExecuteReader(MySqlCommand cmd, MySqlConnection connection)
        {
            if (connection.State == ConnectionState.Closed)
                connection.Open();

            cmd.Connection = connection;
            return cmd.ExecuteReader();
        }

        protected async Task<System.Data.Common.DbDataReader> ExecuteReaderAsync(MySqlCommand cmd, MySqlConnection connection)
        {
            if (connection.State == ConnectionState.Closed)
                connection.Open();

            cmd.Connection = connection;
            return await cmd.ExecuteReaderAsync();
        }

        #endregion

    }
}
