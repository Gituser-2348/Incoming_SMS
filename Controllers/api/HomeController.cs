using Microsoft.AspNetCore.Mvc;

namespace SMS.Controllers.api
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
