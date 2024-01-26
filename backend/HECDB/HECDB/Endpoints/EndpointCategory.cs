//using System;
//using System.Collections.Generic;
//using System.IO;
//using System.Linq;
//using System.Net;
//using System.Text;
//using HECDB.Models;
//using Newtonsoft.Json;

//namespace HECDB.Endpoints
//{
//    public class EndpointCategory : Endpoint
//    {
//        public EndpointCategory(HttpListenerRequest request, HttpListenerResponse response)
//        {
//            response.AddHeader("Access-Control-Allow-Origin", "*");
//            response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//            response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//            switch (request.HttpMethod)
//            {
//                case "OPTIONS":
//                    HandlePreflightRequest(response);
//                    break;
//                case "GET":
//                    if (request.Url.AbsolutePath == "/categories")
//                    {
//                        // Return all categories
//                        SendResponse(response, JsonConvert.SerializeObject(DummyDatabase.Categories));
//                    }
//                    else if (request.Url.AbsolutePath.StartsWith("/categories/") && int.TryParse(request.Url.Segments[2], out int categoryId))
//                    {
//                        // Return a specific category by ID
//                        var category = DummyDatabase.Categories.FirstOrDefault(c => c.Id == categoryId);
//                        if (category != null)
//                            SendResponse(response, JsonConvert.SerializeObject(category));
//                        else
//                            SendResponse(response, "Category not found", HttpStatusCode.NotFound);
//                    }
//                    break;

//                case "POST":
//                    if (request.Url.AbsolutePath == "/categories")
//                    {
//                        // Add a new category
//                        string requestBody = new StreamReader(request.InputStream).ReadToEnd();
//                        var newCategory = JsonConvert.DeserializeObject<Category>(requestBody);
//                        DummyDatabase.Categories.Add(newCategory);
//                        SendResponse(response, "Category added", HttpStatusCode.Created);
//                    }
//                    break;

//                case "PUT":
//                    if (request.Url.AbsolutePath.StartsWith("/categories/") && int.TryParse(request.Url.Segments[2], out int categoryIdToUpdate))
//                    {
//                        // Update an existing category by ID
//                        string requestBody = new StreamReader(request.InputStream).ReadToEnd();
//                        var updatedExpense = JsonConvert.DeserializeObject<Category>(requestBody);
//                        var existingCategory = DummyDatabase.Categories.FirstOrDefault(e => e.Id == categoryIdToUpdate);
//                        if (existingCategory != null)
//                        {
//                            existingCategory.Name = updatedExpense.Name;
//                            existingCategory.Description = updatedExpense.Description;
//                            SendResponse(response, "Category updated");
//                        }
//                        else
//                        {
//                            SendResponse(response, "Category not found", HttpStatusCode.NotFound);
//                        }
//                    }
//                    break;

//                case "DELETE":
//                    if (request.Url.AbsolutePath.StartsWith("/categories/") && int.TryParse(request.Url.Segments[2], out int categoryIdToDelete))
//                    {
//                        // Delete an category by ID
//                        var categoryToDelete = DummyDatabase.Categories.FirstOrDefault(c => c.Id == categoryIdToDelete);
//                        if (categoryToDelete != null)
//                        {
//                            DummyDatabase.Categories.Remove(categoryToDelete);
//                            SendResponse(response, "Category deleted");
//                        }
//                        else
//                        {
//                            SendResponse(response, "Category not found", HttpStatusCode.NotFound);
//                        }
//                    }
//                    break;

//                default:
//                    SendResponse(response, "Invalid request", HttpStatusCode.BadRequest);
//                    break;
//            }
//        }
//    }
//}
