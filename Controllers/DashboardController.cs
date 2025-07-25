using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SMS.DataAccess;
using SMS.Helpers;
using SMS.Models;
using System.Text.Json;

namespace SMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardDataAccessLayer dal;
        MailSender mailSender;
        public DashboardController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {

            mailSender = new MailSender(configuration, httpContextAccessor);
            dal = new DashboardDataAccessLayer(configuration, httpContextAccessor);
        }

        [AllowAnonymous]
        [HttpPost("DashboardReport")]
        public IActionResult DashboardReport()
        {
            DashboardModel model=new DashboardModel();
            model = dal.GetDashboardCount(); 

            var JSONresult = JsonConvert.SerializeObject(model);
        
            return Ok(JSONresult);
        }

    }
}
