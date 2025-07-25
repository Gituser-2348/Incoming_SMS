using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SMS.Core;
using SMS.DataAccess;
using SMS.Helpers;
using SMS.Models;
using System.Data;
using System.Net;
using System.Net.NetworkInformation;
using System.Text;
using System.Text.Json;
using Templateprj.Helpers;
using static SMS.Helpers.MailSender;

namespace SMS.Controllers.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigurationController : ControllerBase
    {
        private readonly ConfigurationDataAccessLayer dal;
        MailSender mailSender;string? abs_url = ""; private readonly ILogWriter _logWriter; private readonly string? Logpath;
        public ConfigurationController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            Logpath = configuration["LogPath"];
            abs_url = configuration["MailInfo:AbsoluteUri"];
            mailSender = new MailSender(configuration, httpContextAccessor);
            dal = new ConfigurationDataAccessLayer(configuration, httpContextAccessor);
        }

        [AllowAnonymous]
        [HttpPost("InitialRequest")]
        public IActionResult InitialRequest([FromBody] JsonElement json_data)
        {
            //var customer_name = json_data.Customer;
            JObject? jsonObject = JsonConvert.DeserializeObject<JObject>(json_data.ToString());

            // Extract the value of the "Customer" field
            string? customerName = jsonObject?["Customer"]?.ToString();
            if (customerName!= null&& (customerName.Trim() == "" || customerName.Length > 35)) {
                return BadRequest("Please add valid customer name(customer name cannot be empty & length should not exceed 35)");
              //  GetString406ResponsewithMsg("Invalid customer name");
            }
            LogWriter.Write("InitialRequest",Logpath);
          //  _logWriter.Write("InitialRequest");
            var response = dal.GetInitialRequest(json_data.ToString(),out string? resp,out string? request_id); ;

            //var JSONresult = JsonConvert.SerializeObject(response);
            if (response == "1")
            {
                LogWriter.Write("GetInitialRequestresponse == \"1\" " , Logpath);
                //response = "" + resp + ". Request ID is :" + request_id + "";
                //// return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(resp, System.Text.Encoding.UTF8, "application/json") };
                //string resp_ = "{\"message\": \"" + resp + "\"}";

                //var response_ = new HttpResponseMessage(HttpStatusCode.OK)
                //{
                //    Content = new StringContent(resp, Encoding.UTF8, "application/json")
                //};

                //return response_;
                return Ok(resp);


            }
            else if (response == "9") {
                return BadRequest(resp);

                //  return new HttpResponseMessage(HttpStatusCode.NotAcceptable) { Content = new StringContent(resp, System.Text.Encoding.UTF8, "application/json") };
            }
            else
            {
                return BadRequest("failed");
                // return new HttpResponseMessage(HttpStatusCode.NotAcceptable) { Content = new StringContent(response, System.Text.Encoding.UTF8, "application/json") };

            }
           
        }
        private HttpResponseMessage GetString406ResponsewithMsg(string errordata)
        {


            return new HttpResponseMessage(HttpStatusCode.NotAcceptable) { Content = new StringContent(errordata, System.Text.Encoding.UTF8, "application/json") };

        }

        [AllowAnonymous]
        [HttpPost("RequestTable")]
        public IActionResult RequestTable([FromBody] ConfigurationModel model)
        {
            var response = dal.GetRequestTable(model.ReqID);

            var JSONresult = JsonConvert.SerializeObject(response);
            return Ok(JSONresult);
        }

        [AllowAnonymous]
        [HttpPost("InfoTable")]
        public IActionResult InfoTable([FromBody] ConfigurationModel model)
        {
            var response = dal.GetInfoTable(model.ReqID);

            var JSONresult = JsonConvert.SerializeObject(response);
            return Ok(JSONresult);
        }

        [AllowAnonymous]
        [HttpPost("NumberTable")]
        public IActionResult NumberTable([FromBody] ConfigurationModel model)
        {
            var response = dal.GetNumberTable(model.ReqID);

            var JSONresult = JsonConvert.SerializeObject(response);
            return Ok(JSONresult);
        }

        [AllowAnonymous]
        [HttpPost("UrlDropDown")]
        public IActionResult UrlDropDown()
        {
            DataSet? dt;


            DataTable? dt1, dt2, dt3, dt4,dt5,dt6;

             dt = dal.GetUrlDropDown();
            var JSONresult="";

            if (dt != null && dt.Tables.Count > 0)
            {

                dt1 = dt.Tables[0];
                dt2 = dt.Tables[1];
                dt3 = dt.Tables[2];
                dt4 = dt.Tables[3];
                dt5 = dt.Tables[4];
                dt6 = dt.Tables[5];

                //Dictionary<string, object> jsonDict = new Dictionary<string, object>();
                //jsonDict["table1"] = dt1;
                //jsonDict["table2"] = dt2;

                //string json = JsonConvert.SerializeObject(jsonDict, Formatting.Indented);
                //string json_ = JsonConvert.SerializeObject(dt1.AsEnumerable(), Formatting.Indented);

                // Serialize lists to JSON
                string json1 = JsonConvert.SerializeObject(dt1);
                string json2 = JsonConvert.SerializeObject(dt2);
                string json3 = JsonConvert.SerializeObject(dt3);
                string json4 = JsonConvert.SerializeObject(dt4);
                string json5=JsonConvert.SerializeObject(dt5);
                string json6 = JsonConvert.SerializeObject(dt6);


                JSONresult = "[{\"table1\":" + json1 + ",\"table2\":" + json2 + ",\"table3\":"+json3+",\"table4\":"+json4+",\"table5\":"+json5+ ",\"table6\":"+json6+"}]";


                //JSONresult = "[{\"table1\":\"" + json1 + "\",\"table2\":\"" + json2 + "\"}]";
            }
            else
            {
                JSONresult = "[{\"table1\":\"No Data Available\",\"table2\":\"No Data Available\"}]";
            }

            return Ok(JSONresult);
        }

        [AllowAnonymous]
        [HttpPost("UrlConfigure")]
        public IActionResult UrlConfigure([FromBody] ConfigureModel model)
        {
            var sts = dal.UrlConfigure(model, out string? resp);

            var JSONresult = "[{\"status\":\"" + sts + "\",\"response\":\"" + resp + "\"}]";
            return Ok(JSONresult);
        }

        [AllowAnonymous]
        [HttpPost("CustomerDropdown")]
        public IActionResult CustomerDropdown()
        {

            DataTable? dt;
            dt = dal.GetCustomerDropDown();
            var JSONresult = "";
            if (dt != null)
            {
                JSONresult = JsonConvert.SerializeObject(dt);
            }
            else
            {
                JSONresult = "[{\"response\":\"No Data Available\"}]";
            }

            return Ok(JSONresult);
        }
        [AllowAnonymous]
        [HttpPost("AddUserCustomerDropdown")]
        public IActionResult AddUserCustomerDropdown()
        {

            DataSet? dt;DataTable? dt1, dt2;
            dt = dal.GetAddUserCustomerDropDown();


            var JSONresult = "";

            if (dt != null && dt.Tables.Count > 0)
            {

                dt1 = dt.Tables[0];
                dt2 = dt.Tables[1];
               

                string json1 = JsonConvert.SerializeObject(dt1);
                string json2 = JsonConvert.SerializeObject(dt2);
               


                JSONresult = "[{\"table1\":" + json1 + ",\"table2\":" + json2 + "}]";


               
            }
            else
            {
                JSONresult = "[{\"table1\":\"No Data Available\",\"table2\":\"No Data Available\"}]";
            }




            

            return Ok(JSONresult);
        }
        [AllowAnonymous]
        [HttpPost("AddUser")]
        public IActionResult AddUser([FromBody] Adduser model)
        {
            var JSONresult = "";
            var sts = dal.AddUser(model, out string? resp, out string? email, out string? username, out string? password);
            if (sts == '0' || sts == 0|| sts == '5' || sts == 5)
            {
                JSONresult = "[{\"status\":\"" + sts + "\",\"response\":\"" + resp + "\"}]";

            }
            else {
                string mailBody = mailSender.ComposeMailBody_c(MailType.CreateNewWebUser, email, username, password, model.CustomerName = "", abs_url);
                if (mailSender.SendEmail(1, email, "- Account Creation - First time Login", mailBody))
                {
                    resp = "Login credentials has sent to your contact " + email;
                    JSONresult = "[{\"status\":\"" + sts + "\",\"response\":\"" + resp + "\"}]";
                }
                else
                {
                    resp = "Could not send Login credentials, Mail Send failed";
                    JSONresult = "[{\"status\":\"2\",\"response\":\"" + resp + "\"}]";
                }

            }
           
           
            return Ok(JSONresult);
        }

        [AllowAnonymous]
        [HttpPost("NewRequestDropdown")]
        public IActionResult NewRequestDropdown()
        {
            DataSet? dt;
            DataTable? dt1, dt2, dt3, dt4, dt5;
            dt = dal.NewRequestDropdown();
            var JSONresult = "";
            if (dt != null && dt.Tables.Count > 0)
            {

                dt1 = dt.Tables[0];
                dt2 = dt.Tables[1];
                dt3 = dt.Tables[2];
                dt4 = dt.Tables[3];

                //Dictionary<string, object> jsonDict = new Dictionary<string, object>();
                //jsonDict["table1"] = dt1;
                //jsonDict["table2"] = dt2;

                //string json = JsonConvert.SerializeObject(jsonDict, Formatting.Indented);
                //string json_ = JsonConvert.SerializeObject(dt1.AsEnumerable(), Formatting.Indented);

                // Serialize lists to JSON
                string json1 = JsonConvert.SerializeObject(dt1);
                string json2 = JsonConvert.SerializeObject(dt2);
                string json3 = JsonConvert.SerializeObject(dt3);
                string json4 = JsonConvert.SerializeObject(dt4);


                JSONresult = "[{\"table1\":" + json1 + ",\"table2\":" + json2 + ",\"table3\":" + json3 + ",\"table4\":" + json4 + "}]";

                //JSONresult = "[{\"table1\":\"" + json1 + "\",\"table2\":\"" + json2 + "\"}]";
            }
            else
            {
                JSONresult = "[{\"table1\":\"No Data Available\",\"table2\":\"No Data Available\"}]";
            }

            return Ok(JSONresult);
        }

        [AllowAnonymous]
        [HttpPost("CreateNewRequest")]
        public IActionResult CreateNewRequest([FromBody] CreateNewRequestModel model) 
        { 
        
            var sts = dal.CreateNewRequest(model, out string? resp);
            var JSONresult = "[{\"status\":\"" + sts + "\",\"response\":\"" + resp + "\"}]";
            return Ok(JSONresult);
        }

        [AllowAnonymous]
        [HttpPost("AddNewVmn")]
        public IActionResult AddNewVmn([FromBody] AddVmnModel model)
        {
            var sts = dal.AddVmn(model, out string? resp);

            var JSONresult = new {
                status = sts,
                response = resp
            };


            var JSONresult1 = "[{\"status\":\"" + sts + "\",\"response\":\"" + resp + "\"}]";
            return Ok(JsonConvert.SerializeObject(JSONresult));
        }

        [HttpPost("UrlTest")]
        public IActionResult UrlTest([FromBody] UrlTestModel model)
        {
            string? resp;
            string? urlID = dal.GetUrlTest(model, out resp, out int status_out);
            var _JSONresult = new
            {
                status = status_out,
                response = resp,
                UrlID = urlID
            };
            if (!string.IsNullOrEmpty(urlID))
            {
                DataTable? dt;
                dt = dal.GetUrlTestResponse(urlID, out string? response);
                var JSONresult = "";
                if (dt != null)
                {
                    var result = JsonConvert.SerializeObject(dt);
                    JSONresult = "[{\"response\":" + result + ",\"urlID\":\""+ urlID +"\"}]";
                }
                else
                {
                    JSONresult = "[{\"response\":\"" + response + "\"}]";
                }
                return Ok(JSONresult);
            }

            return Ok(_JSONresult);
        }

        [AllowAnonymous]
        [HttpPost("UrlTestResponse")]
        public IActionResult UrlTestResponse([FromBody] UrlTestModel model)
        {

            var sts = dal.UrlTestResponse(model, out string? resp ,out string? urlcaller_urlid);
            //if (url_resp.Trim().ToString() == "") {
            //    url_resp = "service unavailable";
           
            if (sts == 1)
            {
                //GetUrlResponse(model.UrlID , out string n_status, out string n_response, out  urlstat, out  url_resp);
                dal.GetUrlResponse(urlcaller_urlid, out string? n_status, out string? n_response, out string? urlstat, out string? url_resp);

                if (n_status.Trim().ToString() == "1")
                {
                    var JSONresult = "[{\"status\":\"" + n_status + "\",\"url_status\":\"" + urlstat + "\",\"url_response\":\"" + url_resp + "\",\"urlcaller_urlid\":\"" + urlcaller_urlid + "\"}]";
                    return Ok(JSONresult);


                }
                else {
                   
                     var JSONresult = "[{\"status\":\"" + n_status + "\",\"response\":\"" + n_response + "\",\"urlcaller_urlid\":\"" + urlcaller_urlid + "\"}]";
                    return Ok(JSONresult);
                }
                //if (sts == 1)
                //{
                //    var JSONresult = "[{\"status\":\"" + urlstat + "\",\"response\":\"" + url_resp + "\",\"urlcaller_urlid\":\"" + urlcaller_urlid + "\"}]";
                //    return Ok(JSONresult);
                //}

            }

            //}
           
            else
            {
                var JSONresult = "[{\"status\":\"" + sts + "\",\"response\":\"" + resp + "\",\"urlcaller_urlid\":\"0\"}]";
                return Ok(JSONresult);
            }
        }
        [AllowAnonymous]
        [HttpPost("APITestResponse")]
        public IActionResult APITestResponse([FromBody] UrlTestModel model)
        {
            var sts = dal.GetUrlResponse(model.UrlID,out string? n_sts, out string? resp, out string? urlstat, out string? url_resp);
            //if (n_sts == "1")
            //{
            //    var JSONresult = "[{\"status\":\"" + urlstat + "\",\"response\":\"" + url_resp + "\"}]";
            //    return Ok(JSONresult);
            //}
            //else
            //{
            //    var JSONresult = "[{\"response\":\"" + resp + "\"}]";
            //    return Ok(JSONresult);
            //}

            if (n_sts.Trim().ToString() == "1")
            {
                var _JSONresult = new
                {
                    status = n_sts,
                    url_status = urlstat,
                    url_response = url_resp,
                    urlcaller_urlid = model.UrlID
                };
                // var JSONresult = "[{\"status\":\"" + n_sts + "\",\"url_status\":\"" + urlstat + "\",\"url_response\":\"" + url_resp + "\",\"urlcaller_urlid\":\"" + model.UrlID + "\"}]";
                return Ok(_JSONresult);


            }
            else
            {

                var JSONresult = "[{\"status\":\"" + n_sts + "\",\"response\":\"" + url_resp + "\",\"urlcaller_urlid\":\"" + model.UrlID + "\"}]";
                return Ok(JSONresult);
            }
        }
        [AllowAnonymous]
        [HttpPost("ViewAccountDetails")]
        public IActionResult ViewAccountDetails([FromBody] ConfigurationModel model)
        {
            var response = dal.ViewAccountDetails(model.ReqID);

            var JSONresult = JsonConvert.SerializeObject(response);
            return Ok(JSONresult);
        }

    }
}
