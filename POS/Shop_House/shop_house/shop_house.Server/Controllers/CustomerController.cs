using Microsoft.AspNetCore.Mvc;
using shop_house.Server.Model;
using System.Data.SqlClient;

namespace shop_house.Server.Controllers
{
    public class CustomerController : Controller
    {
        private readonly string _connectionString;

        public CustomerController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [Route("/api/[controller]/Customers")]
        [HttpGet]   
        public async Task<IActionResult> GetCustomers()
        {
            var customers = new List<Customer>();
            string query = "SELECT customer_id, name, email, phone, created_at, updated_at, purchases FROM customers";

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
                                Customer customer = new Customer
                                {
                                    CustomerId = reader.GetInt32(0),
                                    Name = reader.GetString(1),
                                    Email = reader.IsDBNull(2) ? null : reader.GetString(2),
                                    Phone = reader.IsDBNull(3) ? null : reader.GetString(3),
                                    CreatedAt = reader.GetDateTime(4),
                                    UpdatedAt = reader.GetDateTime(5),
                                    Purchases = reader.GetInt32(6)
                                };
                                customers.Add(customer);
                            }
                        }
                    }
                }
                return Ok(customers);
            }
            catch (SqlException sqlEx)
            {
                // Log the error (sqlEx.Message) and handle it properly
                throw new Exception($"Database error: {sqlEx.Message}");
            }
            catch (Exception ex)
            {
                // Handle other types of errors
                throw new Exception($"Error: {ex.Message}");
            }

           
        }

        [Route("/api/[controller]/AddCustomers")]
        [HttpPost]
        public async Task<IActionResult> AddCustomer(
        string name,
        string email,
        string phone)
        {
            string query = @"
            INSERT INTO customers (name, email, phone) 
            VALUES (@Name, @Email, @Phone);
            SELECT SCOPE_IDENTITY();"; // Get the last inserted ID

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Name", name);
                        command.Parameters.AddWithValue("@Email", (object)email ?? DBNull.Value);
                        command.Parameters.AddWithValue("@Phone", (object)phone ?? DBNull.Value);

                        var result = await command.ExecuteScalarAsync(); // Get the ID of the new customer

                        if (result != null)
                        {
                            var CustomerId = Convert.ToInt32(result);
                            return Ok(new { Message = "Customer added successfully.", CustomerId });
                        }
                        else
                        {
                            return StatusCode(500, "Failed to add customer.");
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                // Log and handle SQL exception
                return StatusCode(500, $"Database error: {sqlEx.Message}");
            }
            catch (Exception ex)
            {
                // Handle general errors
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Route("/api/[controller]/DeleteCustomer")]
        [HttpDelete]
        public async Task<IActionResult> DeleteCustomer(int customerId)
        {
            string query = "DELETE FROM customers WHERE customer_id = @CustomerId";

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@CustomerId", customerId);

                        int rowsAffected = await command.ExecuteNonQueryAsync(); // Returns the number of rows affected

                        if (rowsAffected > 0)
                        {
                            return Ok("Customer deleted successfully.");
                        }
                        else
                        {
                            return NotFound("Customer not found.");
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                return StatusCode(500, $"Database error: {sqlEx.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [Route("/api/[controller]/UpdateCustomer")]
        [HttpPut]
        public async Task<IActionResult> UpdateCustomer(Customer customer)
        {
            string query = @"
            UPDATE customers 
            SET name = @Name, 
                email = @Email, 
                phone = @Phone, 
                updated_at = GETDATE() 
            WHERE customer_id = @CustomerId";

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@CustomerId", customer.CustomerId);
                        command.Parameters.AddWithValue("@Name", customer.Name);
                        command.Parameters.AddWithValue("@Email", (object)customer.Email ?? DBNull.Value);
                        command.Parameters.AddWithValue("@Phone", (object)customer.Phone ?? DBNull.Value);

                        int rowsAffected = await command.ExecuteNonQueryAsync(); // Returns the number of rows affected

                        if (rowsAffected > 0)
                        {
                            return Ok("Customer updated successfully.");
                        }
                        else
                        {
                            return NotFound("Customer not found.");
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                return StatusCode(500, $"Database error: {sqlEx.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
