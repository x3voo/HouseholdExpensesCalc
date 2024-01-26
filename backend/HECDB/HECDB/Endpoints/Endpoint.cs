using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;

namespace HECDB.Endpoints
{
    public class Endpoint
    {
        protected void SendResponse(HttpListenerResponse response, string content, HttpStatusCode statusCode = HttpStatusCode.OK)
        {
            response.StatusCode = (int)statusCode;
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(content);
            response.ContentLength64 = buffer.Length;
            Stream output = response.OutputStream;
            output.Write(buffer, 0, buffer.Length);
            output.Close();
        }

        protected void HandlePreflightRequest(HttpListenerResponse response)
        {
            response.AddHeader("Access-Control-Allow-Origin", "*");
            response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
            response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            SendResponse(response, "");
        }
    }
}
