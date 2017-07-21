using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Hosting;


namespace ChartBuilder.Controllers
{
    public class HomeController : Controller
    {
        string chartPath = HostingEnvironment.ApplicationPhysicalPath + @"Charts\chart.txt";

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetChart()
        {
            string chart = System.IO.File.ReadAllText(chartPath);
            return Json(chart, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public void SaveChart(string chartJson)
        {
            System.IO.File.WriteAllText(chartPath, chartJson);
        }
    }
}