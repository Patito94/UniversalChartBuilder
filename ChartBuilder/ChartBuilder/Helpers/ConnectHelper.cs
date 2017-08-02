using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ChartBuilder.Helpers
{


    public class ConnectHelper
    {


        public async Task<string> SendRequestGetResponse(string postData)
        {
            var httpWebRequest = (HttpWebRequest)WebRequest.Create("http://demo.andoc.net:20080/json/reply/Authenticate");
            httpWebRequest.Headers.Add("X-Custom-APIKey", "teszt");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            

            using (var requestStream = await httpWebRequest.GetRequestStreamAsync())
            {
                byte[] postDataArray = Encoding.UTF8.GetBytes(postData);
                await requestStream.WriteAsync(postDataArray, 0, postDataArray.Length);
            }


            var postResponse = await httpWebRequest.GetResponseAsync() as HttpWebResponse;

            if (postResponse != null)
            {
                var postResponseStream = postResponse.GetResponseStream();
                var postStreamReader = new StreamReader(postResponseStream);

                string response = await postStreamReader.ReadToEndAsync();
                return response;
            }
            return null;
        }




    }
}