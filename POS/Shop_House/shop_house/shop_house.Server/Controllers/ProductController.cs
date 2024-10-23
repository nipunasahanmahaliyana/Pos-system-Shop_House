using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using shop_house.Server.DTO;
using shop_house.Server.Model;
using System.Data.SqlClient;

namespace shop_house.Server.Controllers
{
    public class ProductController : Controller
    {
        private readonly string _connectionString;

        public ProductController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [Route("api/[controller]/Category")]
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = new List<Category>();

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand("SELECT [category_id], [name], [created_at], [updated_at], [description] FROM [categories]", connection))
                    {
                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var category = new Category
                                {
                                    CategoryId = reader.GetInt32(0),
                                    Name = reader.GetString(1),
                                    CreatedAt = reader.GetDateTime(2),
                                    UpdatedAt = reader.GetDateTime(3),
                                    Description = reader.IsDBNull(4) ? null : reader.GetString(4) // Handle nullable field
                                };
                                categories.Add(category);
                            }
                        }
                    }
                }

                if (categories.Count == 0)
                {
                    return NotFound(new { Message = "No categories found." });
                }

                return Ok(categories);
            }
            catch (SqlException sqlEx)
            {
                // Log the SQL error
                return StatusCode(500, new { Message = "Database error occurred.", Error = sqlEx.Message });
            }
            catch (System.Exception ex)
            {
                // Log the error
                return StatusCode(500, new { Message = "An unexpected error occurred.", Error = ex.Message });
            }
        }

        [Route("api/[controller]/AddCategory")]
        [HttpPost]
        public IActionResult CreateCategory(Category category)
        {
            if (category == null || string.IsNullOrWhiteSpace(category.Name))
            {
                return BadRequest(new { Message = "Invalid category data." });
            }

            try
            {

                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();


                    string query = "INSERT INTO [categories] ([name], [description]) " +
                                   "VALUES (@Name, @CreatedAt, @UpdatedAt, @Description); " +
                                   "SELECT CAST(SCOPE_IDENTITY() AS INT);"; // Retrieves the last inserted ID

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
  
                        command.Parameters.AddWithValue("@Name", category.Name);
                        command.Parameters.AddWithValue("@Description", (object)category.Description ?? DBNull.Value);

                        int newCategoryId = (int)command.ExecuteScalar();

                        category.CategoryId = newCategoryId;
                        category.CreatedAt = DateTime.Now;
                        category.UpdatedAt = DateTime.Now;
                    }
                }

                return StatusCode(201, category);
            }
            catch (SqlException sqlEx)
            {
                // Log the SQL exception (in production, use proper logging)
                return StatusCode(500, new { Message = "A database error occurred.", Error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                // Catch any other general exceptions
                return StatusCode(500, new { Message = "An unexpected error occurred.", Error = ex.Message });
            }
        }



        [Route("api/[controller]")]
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            try
            {
                string query = @"
                SELECT [product_id], [name], [description], [price], [category_id], [image] ,[created_at]
                FROM [shop_house_pos].[dbo].[products] WHERE [checkout] = 0";

                List<ProductDTO> products = new List<ProductDTO>();

                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            if (reader.HasRows)
                            {
                                while (await reader.ReadAsync())
                                {
                                    // Convert the image to a base64 string if it exists
                                    string? imageBase64 = null;
                                    if (!reader.IsDBNull(5))
                                    {
                                        byte[] imageBytes = (byte[])reader["image"];
                                        imageBase64 = Convert.ToBase64String(imageBytes);
                                    }

                                    products.Add(new ProductDTO
                                    {
                                        ProductId = reader.GetInt32(0),
                                        Name = reader.IsDBNull(1) ? null : reader.GetString(1),
                                        Description = reader.IsDBNull(2) ? null : reader.GetString(2),
                                        Price = reader.GetDecimal(3),
                                        CategoryId = reader.GetInt32(4),
                                        ImageBase64 = imageBase64,
                                        CreatedAt = reader.GetDateTime(6),
                                    });
                                }
                            }
                            else
                            {
                                return NotFound("No products found.");
                            }
                        }
                    }
                }

                return Ok(products);
            }
            catch (SqlException sqlEx)
            {
                // Log detailed SQL exception information (in production you'd log this more securely)
                return StatusCode(500, $"Database error: {sqlEx.Message}");
            }
            catch (Exception ex)
            {
                // Log general exception
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
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
                using (var memoryStream = new MemoryStream())
                {
                    image.CopyTo(memoryStream);
                    byte[] imageBytes = memoryStream.ToArray();

                    using (SqlConnection connection = new SqlConnection(_connectionString))
                    {
                        await connection.OpenAsync();

                        string query = @"
                        INSERT INTO [shop_house_pos].[dbo].[products]
                        ([name], [description], [price], [category_id],[image])
                        VALUES (@Name, @Description, @Price, @CategoryId, @Image)";

                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@Name", name);
                            command.Parameters.AddWithValue("@Description", (object)description ?? DBNull.Value);
                            command.Parameters.AddWithValue("@Price", price);
                            command.Parameters.AddWithValue("@CategoryId", categoryId);
                            command.Parameters.AddWithValue("@Image", imageBytes);

                            int rowsAffected = await command.ExecuteNonQueryAsync();

                            if (rowsAffected > 0)
                            {
                                return Ok("Product added successfully.");
                            }
                            else
                            {
                                return StatusCode(500, "Failed to add the product.");
                            }
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                // Log exception (could log more details in production)
                return StatusCode(500, $"Database error: {sqlEx.Message}");
            }
            catch (Exception ex)
            {
                // Log exception
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Route("api/[controller]/Checkout")]
        [HttpPut]
        public async Task<IActionResult> Checkout(int id)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    string updateQuery = "UPDATE products SET checkout = 1 WHERE product_id = @Id";

                    using (SqlCommand command = new SqlCommand(updateQuery, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);

                        int rowsAffected = await command.ExecuteNonQueryAsync();
                        if (rowsAffected == 0)
                        {
                            return NotFound(new { message = "Product not found." });
                        }
                    }

                    return Ok(new { message = "Checkout successful." });
                }
            }
            catch (SqlException sqlEx)
            {
                // Handle SQL errors
                return StatusCode(500, new { message = "Database error occurred.", error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                // Handle general errors
                return StatusCode(500, new { message = "An error occurred during checkout.", error = ex.Message });
            }
        }

    }
}

