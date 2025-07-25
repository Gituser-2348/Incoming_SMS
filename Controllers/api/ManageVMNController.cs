using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI.Common;
using Newtonsoft.Json;
using SMS.DataAccess;
using SMS.Helpers;
using SMS.Models;
using static SMS.Models.ConfigurationModel;
using static SMS.Helpers.MailSender;
using System.Text.Json;
using System.Data;
using Org.BouncyCastle.Asn1;

namespace SMS.Controllers.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManageVMNController : ControllerBase
    {
        private readonly ManageVMNDataAccessLayer dal;
        MailSender mailSender;
        public ManageVMNController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {

            mailSender = new MailSender(configuration, httpContextAccessor);
            dal = new ManageVMNDataAccessLayer(configuration, httpContextAccessor);
        }
        public IActionResult Index()
        {
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("VMNDropdown")]
        public IActionResult VMNDropdown()
        {

            DataTable? dt;
            dt = dal.GetVMNDropDown();
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
        [HttpPost("VMNTable")]
        public IActionResult VMNTable([FromBody] ManageVMNModel model)
        {
            var response = dal.GetVMNTable(model.VMN);

            var JSONresult = JsonConvert.SerializeObject(response);
            return Ok(JSONresult);
        }

        [AllowAnonymous]
        [HttpPost("StatusRemarkTable")]
        public IActionResult StatusRemarkTable([FromBody] ManageVMNModel model)
        {
            var response = dal.GetStatusRemarkable(model.VMN, out string? sts, out string? resp);

            var JSONresult = JsonConvert.SerializeObject(response);
            return Ok(JSONresult);
        }

        [AllowAnonymous]
        [HttpPost("GetStatusInfo")]
        public IActionResult GetStatusInfo([FromBody]ManageVMNModel model) {
            DataSet? dt;
            DataTable dt1, dt2, dt3, dt4;
            dt = dal.GetStatusInfo(model.VMN);
            var JSONresult = "";
            if (dt != null && dt.Tables.Count > 0)
            {

                dt1 = dt.Tables[0];
                dt2 = dt.Tables[1];
                             //Dictionary<string, object> jsonDict = new Dictionary<string, object>();
                //jsonDict["table1"] = dt1;
                //jsonDict["table2"] = dt2;

                //string json = JsonConvert.SerializeObject(jsonDict, Formatting.Indented);
                //string json_ = JsonConvert.SerializeObject(dt1.AsEnumerable(), Formatting.Indented);

                // Serialize lists to JSON
                string json1 = JsonConvert.SerializeObject(dt1);
                string json2 = JsonConvert.SerializeObject(dt2);
                


                JSONresult = "[{\"table1\":" + json1 + ",\"table2\":" + json2 + "}]";

                //JSONresult = "[{\"table1\":\"" + json1 + "\",\"table2\":\"" + json2 + "\"}]";
            }
            else
            {
                JSONresult = "[{\"table1\":\"No Data Available\",\"table2\":\"No Data Available\"}]";
            }

            return Ok(JSONresult);
        }

         

             [AllowAnonymous]
        [HttpPost("VMNStatusChange")]
        public IActionResult VMNStatusChange([FromBody] VMNChangeStatusModel model)
        {
           
            var status = dal.VMNStatusChange(model, out string? response);
            string JSONresult = "";
            if (status!=null) { 
               



                JSONresult = "[{\"status\":\"" + status + "\",\"response\":\"" + response + "\"}]";

                //JSONresult = "[{\"table1\":\"" + json1 + "\",\"table2\":\"" + json2 + "\"}]";
            }
            else
            {
                JSONresult = "[{\"status\":\"0\",\"response\":\"No Data Available\"}]";
            }

            return Ok(JSONresult);
        }
        [AllowAnonymous]
        [HttpPost("ChangeUrlInfo")]
        public IActionResult ChangeUrlInfo([FromBody] ManageVMNModel model)
        {
            var response = dal.GetUrlChangeInfo(model.VMN, out string? sts, out string? resp);

            var JSONresult = JsonConvert.SerializeObject(response);
            return Ok(JSONresult);
        }
        [AllowAnonymous]
        [HttpPost("UrlChange")]
        public IActionResult UrlChange([FromBody] ConfigureModel model)
        {

            var status = dal.UrlChange(model, out string? response);
            string JSONresult = "";
            if (status != null)
            { 

                JSONresult = "[{\"status\":\"" + status + "\",\"response\":\"" + response + "\"}]";

                //JSONresult = "[{\"table1\":\"" + json1 + "\",\"table2\":\"" + json2 + "\"}]";
            }
            else
            {
                JSONresult = "[{\"status\":\"0\",\"response\":\"No Data Available\"}]";
            }

            return Ok(JSONresult);
        }
        
                [AllowAnonymous]
        [HttpPost("UrlChangeTestInsert")]
        public IActionResult UrlChangeTestInsert([FromBody] ConfigureModel model)
        {

            var status = dal.UrlChangeTestInsert(model, out string? response, out string? url_id);
            string JSONresult = "";
            if (status != null)
            {
                if (status == "1")
                {
                    var result = dal.GetUrlTestInfo(url_id, out string? status_, out string? response_);
                    var json = JsonConvert.SerializeObject(result);
                    JSONresult = "[{\"status\":\"" + status + "\",\"response\":" + json + ",\"url_id\":\""+url_id+"\"}]";

                }
                else {
                    JSONresult = "[{\"status\":\"" + status + "\",\"response\":\"" + response + "\"}]";
                }
               

                //JSONresult = "[{\"table1\":\"" + json1 + "\",\"table2\":\"" + json2 + "\"}]";
            }
            else
            {
                JSONresult = "[{\"status\":\"0\",\"response\":\"No Data Available\"}]";
            }

            return Ok(JSONresult);
     
        }

        [AllowAnonymous]
        [HttpPost("InsertTestUrlDetails")]
        public IActionResult InsertTestUrlDetails([FromBody] InserturltestModel model)
        {

            var status = dal.InsertTestUrlDetails(model.data,model.url_id,model.parameters, out string? response, out string? url_status, out string? url_response,out string? urlcaller_urlid);
            string JSONresult = "";

            if (url_response?.Trim().ToString() == "")
            {
                url_response = "service unavailable";


            }
            if (url_status?.Trim().ToString() == "")
            {
                url_status = "0";


            }
            if (status != null)
            {

                JSONresult = "[{\"status\":\"" + status + "\",\"response\":\"" + response + "\",\"url_status\":\"" + url_status + "\",\"url_response\":\"" + url_response + "\",\"urlcaller_urlid\":\"" + urlcaller_urlid + "\"}]";

                //JSONresult = "[{\"table1\":\"" + json1 + "\",\"table2\":\"" + json2 + "\"}]";
            }
            else
            {
                JSONresult = "[{\"status\":\"0\",\"response\":\"No Data Available\"}]";
            }

            return Ok(JSONresult);
        }


    }
}
