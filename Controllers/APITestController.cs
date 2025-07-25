using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace SMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class APITestController : ControllerBase
    {
        [AllowAnonymous]
        [HttpPost("PostInsert")]
        public IActionResult PostInsert([FromBody] JsonElement json )
        {

            string response = "success";
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost("GetInsert")]
        public IActionResult PostIGetInsertnsert(string msisdn, string message)
        {

            string response = "success";
            return Ok(response);
        }
    }
}
