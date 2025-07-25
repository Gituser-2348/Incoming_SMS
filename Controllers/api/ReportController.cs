using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SMS.DataAccess;
using SMS.Helpers;
using SMS.Models;
using System.Text.Json;

namespace SMS.Controllers.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : Controller
    {
        private readonly ReportDataAccessLayer dal;
        MailSender mailSender;
        public ReportController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {

            mailSender = new MailSender(configuration, httpContextAccessor);
            dal = new ReportDataAccessLayer(configuration, httpContextAccessor);
        }
        public IActionResult Index()
        {
            return View();
        }
        [AllowAnonymous]
        [HttpPost("CustomerDropDown")]
        public IActionResult CustomerDropDown()
        {

            var response = dal.CustomerDropDown();

            var JSONresult = JsonConvert.SerializeObject(response);

            return Ok(JSONresult);
        }
        [AllowAnonymous]
        [HttpPost("CustomerSearchVMNList")]
        public IActionResult CustomerSearchVMNList([FromBody] ReportModel model)
        {

            var response = dal.CustomerSearchVMNList(model.Customer_Id); 

            var JSONresult = JsonConvert.SerializeObject(response);
           
            return Ok(JSONresult);
        }
        [AllowAnonymous]
        [HttpPost("VMNReport")]
        public IActionResult VMNReport([FromBody] ReportModel model)
        {

            var response = dal.VMNReport(model.VMN,model.status,model.date,model.Customer_Id); 

            var JSONresult = JsonConvert.SerializeObject(response);

            return Ok(JSONresult);
        }

        [AllowAnonymous]
        [HttpPost("SummaryReport")]
        public IActionResult SummaryReport([FromBody] SummaryModal model)
        {

            var response = dal.SummaryReport(model);

            var JSONresult = JsonConvert.SerializeObject(response);

            return Ok(JSONresult); 
        }

        [AllowAnonymous]
        [HttpPost("DetailReport")]
        public IActionResult DetailReport([FromBody] SummaryModal model)
        {

            var response = dal.DetailReport(model.customer, model.vmn, model.date);

            var JSONresult = JsonConvert.SerializeObject(response);

            return Ok(JSONresult);
        }


    }
}
