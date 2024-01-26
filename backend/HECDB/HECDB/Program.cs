using System;
using System.IO;
using System.Net;
using HECDB.Endpoints;
using Newtonsoft.Json;

namespace HECDB
{
    class Program
    {
        static void Main(string[] args)
        {
            const string url = "http://127.0.0.1:8080/";
            var listener = new HttpListener();
            listener.Prefixes.Add(url);
            listener.Start();

            Console.WriteLine("Listening for requests on " + url);

            while (true)
            {
                var context = listener.GetContext();
                var request = context.Request;
                var response = context.Response;

                Console.WriteLine($"{request.HttpMethod} request for {request.Url}");

                // Handle different HTTP methods
                if (request.Url.AbsolutePath.StartsWith("/expenses"))
                {
                    var endpointExpense = new EndpointExpense2(request, response);
                } 
                else if (request.Url.AbsolutePath.StartsWith("/income"))
                {
                    var endpointCategory = new EndpointIncome(request, response);
                }
                else
                {
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    byte[] buffer = System.Text.Encoding.UTF8.GetBytes("<!DOCTYPE html><html><head><title>DB</title></head>" +
                        "<body><center><h2><i>DummyAPInDB</i> v1.0.0</h2></center><div><p><b>DummyDatabase.IncomeData</b></p>" + JsonConvert.SerializeObject(DummyDatabase.IncomeData)+
                        "</div><div><p><b>DummyDatabase.ExpensesData</b></p>" + JsonConvert.SerializeObject(DummyDatabase.ExpensesData) + "</div></body></html>");
                    response.ContentLength64 = buffer.Length;
                    Stream output = response.OutputStream;
                    output.Write(buffer, 0, buffer.Length);
                    output.Close();
                }
            }
        }
    }
}
