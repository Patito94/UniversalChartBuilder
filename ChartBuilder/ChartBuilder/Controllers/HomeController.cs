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
        //string chartPath = HostingEnvironment.ApplicationPhysicalPath + @"Charts\chart.txt";

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetChart(string path)
        {
            string chartPath = HostingEnvironment.ApplicationPhysicalPath + @path;
            string chart = System.IO.File.ReadAllText(chartPath);
            return Json(chart, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public void SaveChart(string path, string chartJson)
        {
            string chartPath = HostingEnvironment.ApplicationPhysicalPath + @path;
            System.IO.File.WriteAllText(chartPath, chartJson);
        }
    }
}