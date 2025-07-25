using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SMS.DataAccess;
using SMS.Helpers;
using SMS.Models;

namespace SMS.Controllers.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class EndUserController : ControllerBase
    {
        private readonly EndUserDataAccessLayer dal;
        MailSender mailSender; string? abs_url = "";
        public EndUserController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            abs_url = configuration["MailInfo:AbsoluteUri"];
            mailSender = new MailSender(configuration, httpContextAccessor);
            dal = new EndUserDataAccessLayer(configuration, httpContextAccessor);
        }
        [AllowAnonymous]
        [HttpPost("VMNReport")]
        public IActionResult VMNReport([FromBody] EndUserReportModel model)
        {

            var response = dal.VMNReport(model.VMN, model.status, model.date, model.user_id);

            var JSONresult = JsonConvert.SerializeObject(response);

            return Ok(JSONresult);
        }

        [AllowAnonymous]
        [HttpPost("SummaryReport")]
        public IActionResult SummaryReport([FromBody] EndUserSummaryModal model)
        {

            var response = dal.SummaryReport(model);

            var JSONresult = JsonConvert.SerializeObject(response);

            return Ok(JSONresult);
        }

        [AllowAnonymous]
        [HttpPost("DetailReport")]
        public IActionResult DetailReport([FromBody] EndUserSummaryModal model)
        {

            var response = dal.DetailReport(model.user_id, model.vmn, model.date);

            var JSONresult = JsonConvert.SerializeObject(response);

            return Ok(JSONresult);
        }

        [AllowAnonymous]
        [HttpPost("EnduserVMNList")]
        public IActionResult EnduserVMNList([FromBody] EndUserModel model)
        {

            var response = dal.EndUserVMNList(model.user_id);


            var JSONresult = JsonConvert.SerializeObject(response);

            return Ok(JSONresult);
        }
    }
}
