using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Mvc;

using ChartBuilder.Helpers;

namespace ChartBuilder.Controllers
{
    public class AuthenticateController : Controller
    {
        // GET: Authenticate
        public async System.Threading.Tasks.Task<ActionResult> Index()
        {
            //using (var client = new HttpClient())
            //{
            //    var uri = new Uri("http://www.google.com/");

            //    var response = await client.GetAsync(uri);

            //    string textResult = await response.Content.ReadAsStringAsync();

            //    ViewData["textResult"] = textResult;

            //    return View();
            //}

            //using (var client = new HttpClient())
            //{
            //    var requestMessage = new HttpRequestMessage(HttpMethod.Post, "http://demo.andoc.net:20080/json/reply/Authenticate");
            //    requestMessage.Headers.Authorization = new AuthenticationHeaderValue("X-Custom-APIKey", "teszt");
            //    requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Content-Type", "application/json");
            //    HttpResponseMessage result = await client.SendAsync(requestMessage);
            //    ViewData["textResult"] = result.Content.ToString();

            //    return View();
            //}


            //string url = "http://demo.andoc.net:20080/json/reply/Authenticate";
            string json = "{\"UserName\":\"admin\",\"Password\":\"admin\",\"provider\":\"credentials\",\"State\":\"null\",\"oauth_token\":\"null\",\"oauth_verifier\":\"null\"}";


            ConnectHelper cn = new ConnectHelper();

            string result = await cn.SendRequestGetResponse(json);

            ViewData["textResult"] = result;

            return View();

        }





    }
}