﻿using System.Net;
using Newtonsoft.Json;
using System.Linq;
using System.IO;
using HECDB.Models;
using System.Collections.Generic;

namespace HECDB.Endpoints
{
    public class EndpointIncome : Endpoint
    {
        public EndpointIncome(HttpListenerRequest request, HttpListenerResponse response)
        {
            response.AddHeader("Access-Control-Allow-Origin", "*");
            response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
            response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            switch (request.HttpMethod)
            {
                case "OPTIONS":
                    HandlePreflightRequest(response);
                    break;
                case "GET":
                    if (request.Url.AbsolutePath == "/income")
                    {
                        // Return all expenses
                        SendResponse(response, JsonConvert.SerializeObject(DummyDatabase.IncomeData));
                    }
                    break;

                case "POST":
                    if (request.Url.AbsolutePath == "/income")
                    {
                        // Add a new expense
                        string requestBody = new StreamReader(request.InputStream).ReadToEnd();
                        var newIncome = JsonConvert.DeserializeObject<List<Income>>(requestBody);
                        DummyDatabase.IncomeData = newIncome;
                        SendResponse(response, JsonConvert.SerializeObject(newIncome), HttpStatusCode.Created);
                    }
                    break;

                //case "PUT":
                //    if (request.Url.AbsolutePath.StartsWith("/expenses/") && int.TryParse(request.Url.Segments[2], out int expenseIdToUpdate))
                //    {
                //        // Update an existing expense by ID
                //        string requestBody = new StreamReader(request.InputStream).ReadToEnd();
                //        var updatedExpense = JsonConvert.DeserializeObject<Expense>(requestBody);
                //        var existingExpense = DummyDatabase.Expenses.FirstOrDefault(e => e.Id == expenseIdToUpdate);
                //        if (existingExpense != null)
                //        {
                //            existingExpense.Amount = updatedExpense.Amount;
                //            existingExpense.Description = updatedExpense.Description;
                //            existingExpense.Date = updatedExpense.Date;
                //            existingExpense.ExpenseCategory = updatedExpense.ExpenseCategory;
                //            SendResponse(response, "Expense updated");
                //        }
                //        else
                //        {
                //            SendResponse(response, "Expense not found", HttpStatusCode.NotFound);
                //        }
                //    }
                //    break;

                //case "DELETE":
                //    if (request.Url.AbsolutePath.StartsWith("/expenses/") && int.TryParse(request.Url.Segments[2], out int expenseIdToDelete))
                //    {
                //        // Delete an expense by ID
                //        var expenseToDelete = DummyDatabase.Expenses.FirstOrDefault(e => e.Id == expenseIdToDelete);
                //        if (expenseToDelete != null)
                //        {
                //            DummyDatabase.Expenses.Remove(expenseToDelete);
                //            SendResponse(response, "Expense deleted");
                //        }
                //        else
                //        {
                //            SendResponse(response, "Expense not found", HttpStatusCode.NotFound);
                //        }
                //    }
                //    break;

                default:
                    SendResponse(response, "Invalid request", HttpStatusCode.BadRequest);
                    break;
            }
        }
    }
}
