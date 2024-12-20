using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using shop_house.Server.Model;
using System.Data.SqlClient;
using System.Reflection.PortableExecutable;

namespace shop_house.Server.Controllers
{
    public class InventoryController : Controller
    {
        private readonly string _connectionString;

        public InventoryController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [Route("api/[controller]/AddProduct")]
        [HttpPost]
        public async Task<IActionResult> AddProduct(
            string name,
            string description,
            decimal price,
            int categoryId,
            IFormFile image
        )
        {
            try
            {
                byte[] imageBytes = null;

                // Step 1: Convert image to byte array if provided
                if (image != null)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await image.CopyToAsync(memoryStream);
                        imageBytes = memoryStream.ToArray();
                    }
                }

                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    // Step 2: Insert into products table
                    string insertProductQuery = @"
                    INSERT INTO products
                    (name, description, price, category_id, image)
                    VALUES (@Name, @Description, @Price, @CategoryId, @Image)";

                    using (SqlCommand insertCommand = new SqlCommand(insertProductQuery, connection))
                    {
                        insertCommand.Parameters.AddWithValue("@Name", name);
                        insertCommand.Parameters.AddWithValue("@Description", (object)description ?? DBNull.Value);
                        insertCommand.Parameters.AddWithValue("@Price", price);
                        insertCommand.Parameters.AddWithValue("@CategoryId", categoryId);
                        insertCommand.Parameters.AddWithValue("@Image", imageBytes);

                        int rowsAffected = await insertCommand.ExecuteNonQueryAsync();

                        if (rowsAffected <= 0)
                        {
                            return StatusCode(500, "Failed to add the product to the products table.");
                        }
                      
                    }

                    // Step 3: Retrieve the category name from the category table
                    string categoryName = null;
                    string categoryQuery = "SELECT name FROM [shop_house_pos].[dbo].[categories] WHERE category_id = @CategoryId";

                    using (SqlCommand categoryCommand = new SqlCommand(categoryQuery, connection))
                    {
                        categoryCommand.Parameters.AddWithValue("@CategoryId", categoryId);
                        object result = await categoryCommand.ExecuteScalarAsync();

                        if (result == null)
                        {
                            return BadRequest("Invalid category ID provided. Category not found.");
                        }
                        categoryName = result.ToString();
                    }

                    // Step 4: Check if the product already exists in the inventory
                    string checkQuery = @"
                    SELECT inventory_id, stock 
                    FROM [shop_house_pos].[dbo].[inventory] 
                    WHERE product_name = @ProductName 
                    AND category_name = @CategoryName";

                    using (SqlCommand checkCommand = new SqlCommand(checkQuery, connection))
                    {
                        checkCommand.Parameters.AddWithValue("@ProductName", name);
                        checkCommand.Parameters.AddWithValue("@CategoryName", categoryName);

                        using (SqlDataReader reader = await checkCommand.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync()) // Product exists in inventory
                            {
                                int inventoryId = reader.GetInt32(0);
                                int currentStock = reader.GetInt32(1);
                                int newStock = currentStock + 1; // Increment stock

                                // Update the existing product's stock
                                string updateStockQuery = @"
                                UPDATE [shop_house_pos].[dbo].[inventory]
                                SET stock = @Stock, update_date = GETDATE()
                                WHERE inventory_id = @InventoryId";

                                using (SqlCommand updateCommand = new SqlCommand(updateStockQuery, connection))
                                {
                                    updateCommand.Parameters.AddWithValue("@Stock", newStock);
                                    updateCommand.Parameters.AddWithValue("@InventoryId", inventoryId);

                                    await updateCommand.ExecuteNonQueryAsync();
                                }

                                return Ok("Product added successfully to products and stock updated.");
                            }
                        } // Automatically closes the reader here
                    }

                    // Step 5: If the product does not exist in inventory, insert it
                    string insertInventoryQuery = @"
                    INSERT INTO [shop_house_pos].[dbo].[inventory]
                    ([category_name], [product_name], [stock], [update_date])
                    VALUES (@CategoryName, @ProductName, 1, GETDATE())";

                    using (SqlCommand inventoryCommand = new SqlCommand(insertInventoryQuery, connection))
                    {
                        inventoryCommand.Parameters.AddWithValue("@CategoryName", categoryName);
                        inventoryCommand.Parameters.AddWithValue("@ProductName", name);

                        await inventoryCommand.ExecuteNonQueryAsync();
                    }

                    return Ok("Product added successfully to products and inventory.");
                }
            }
            catch (SqlException sqlEx)
            {
                // Log the SQL exception details here (optional)
                return StatusCode(500, $"Database error: {sqlEx.Message}. Please contact support.");
            }
            catch (InvalidOperationException invalidOpEx)
            {
                // Log the invalid operation exception details here (optional)
                return StatusCode(500, $"Invalid operation error: {invalidOpEx.Message}. Please contact support.");
            }
            catch (ArgumentNullException argNullEx)
            {
                // Log the argument null exception details here (optional)
                return BadRequest($"Invalid input: {argNullEx.Message}");
            }
            catch (Exception ex)
            {
                // Log the general exception details here (optional)
                return StatusCode(500, $"Internal server error: {ex.Message}. Please contact support.");
            }
        }

        [Route("/api/[controller]")]
        [HttpGet]
        public async Task<IActionResult> GetInventory()
        {
            string query = "SELECT inventory_id, category_name, product_name, stock, update_date FROM inventory";
            var inventoryList = new List<Inventory>();

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                           

                            while (await reader.ReadAsync())
                            {
                                var inventoryItem = new Inventory
                                {
                                    InventoryId = reader.GetInt32(0),
                                    CategoryName = reader.GetString(1),
                                    ProductName = reader.GetString(2),
                                    Stock = reader.GetInt32(3),
                                    UpdateDate = reader.GetDateTime(4)
                                };
                                inventoryList.Add(inventoryItem);
                            }

                            // Check if the list is empty
                            if (inventoryList.Count == 0)
                            {
                                return NotFound("No inventory items found.");
                            }

                            return Ok(inventoryList);
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                // Log SQL Exception details (you can implement your logging here)
                // For example: _logger.LogError(sqlEx, "An SQL error occurred.");
                return StatusCode(500, $"Database error: {sqlEx.Message}");
            }
            catch (InvalidOperationException invalidOpEx)
            {
                // Handle invalid operation exceptions
                // _logger.LogError(invalidOpEx, "An invalid operation occurred.");
                return StatusCode(500, $"Invalid operation error: {invalidOpEx.Message}");
            }
            catch (TimeoutException timeoutEx)
            {
                // Handle timeout exceptions
                // _logger.LogError(timeoutEx, "A timeout occurred while accessing the database.");
                return StatusCode(504, $"Database timeout: {timeoutEx.Message}");
            }
            catch (Exception ex)
            {
                // Handle all other exceptions
                // _logger.LogError(ex, "An unexpected error occurred.");
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [Route("/api/[controller]/UpdateInventory")]
        [HttpPut]
        public async Task<IActionResult> UpdateInventory(
            int id, 
            string categoryName ,
            string productName ,
            int stock
            )
        {
            // Validate input
            if (id <= 0 || categoryName == null || productName == null || stock < 0)
            {
                return BadRequest("Product data is invalid.");
            }
            
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    
                    string sql = "UPDATE inventory SET product_name = @ProductName, category_name = @CategoryName, stock = @Stock , update_date  = @Date WHERE inventory_id = @InventoryId";
                    using (SqlCommand cmd = new SqlCommand(sql, connection))
                    {
                        cmd.Parameters.AddWithValue("@InventoryId", id);
                        cmd.Parameters.AddWithValue("@ProductName", productName);
                        cmd.Parameters.AddWithValue("@CategoryName", categoryName);
                        cmd.Parameters.AddWithValue("@Stock", stock);
                        cmd.Parameters.AddWithValue("@Date",DateTime.Now);
                        // Execute the command
                        int rowsAffected = cmd.ExecuteNonQuery();
                        if (rowsAffected > 0)
                        {
                            return Ok("Product updated successfully.");
                        }
                        else
                        {
                            return NotFound("Product not found.");
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                // Log the SQL exception (implement your logging mechanism here)
                Console.Error.WriteLine($"SQL error: {ex.Message}");
                return StatusCode(500, "An error occurred while updating the product. Please try again later.");
            }
            catch (Exception ex)
            {
                // Log the general exception
                Console.Error.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "An unexpected error occurred. Please try again later.");
            }
        }


        [Route("/api/[controller]/DeleteInventory")]
        [HttpDelete]
        public async Task<IActionResult> DeleteInventory(int id)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    //inventory_id, category_name, product_name, stock, update_date
                    string sql = "DELETE FROM Inventory WHERE inventory_id = @InventoryId";

                    using (SqlCommand cmd = new SqlCommand(sql, connection))
                    {
                        cmd.Parameters.AddWithValue("@InventoryId", id);

                        // Execute the command
                        int rowsAffected = cmd.ExecuteNonQuery();
                        if (rowsAffected > 0)
                        {
                            return Ok("Product deleted successfully.");
                        }
                        else
                        {
                            return NotFound("Product not found.");
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                // Log the SQL exception
                Console.Error.WriteLine($"SQL error: {ex.Message}");
                return StatusCode(500, "An error occurred while deleting the product. Please try again later.");
            }
            catch (Exception ex)
            {
                // Log the general exception
                Console.Error.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "An unexpected error occurred. Please try again later.");
            }
        }


    }
}
