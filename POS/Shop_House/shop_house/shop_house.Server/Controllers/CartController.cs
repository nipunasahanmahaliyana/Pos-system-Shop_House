using Microsoft.AspNetCore.Mvc;
using shop_house.Server.DTO;
using shop_house.Server.Model;
using System.Data.SqlClient;

namespace shop_house.Server.Controllers
{
    //[Route("/api/[controller]")]
    [ApiController]
    public class CartController : Controller
    {
        private readonly string _connectionString;

        public CartController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [Route("/api/[controller]/AddToCart")]
        [HttpPost]
        public async Task<IActionResult> AddToCart(string id, [FromBody] CartDTO cartItem)
        {
            if (cartItem == null)
            {
                return BadRequest( "Cart item cannot be null.");
            }

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    string query = @"
                    INSERT INTO Cart (CartId, User_id, Product_name, Quantity, Price, DateAdded, Category_name,Customer_RefNo)
                    VALUES (@CartId, @UserId, @ProductName, @Quantity, @Price, @DateAdded, @CategoryName , @Customer_RefNo)";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {

                            command.Parameters.AddWithValue("@CartId", id); // Should be an integer
                            command.Parameters.AddWithValue("@UserId", cartItem.UserId);
                            command.Parameters.AddWithValue("@ProductName", cartItem.ProductName); // String
                            command.Parameters.AddWithValue("@Quantity", cartItem.Quantity); // Integer
                            command.Parameters.AddWithValue("@Price", cartItem.Price); // Decimal
                            //command.Parameters.AddWithValue("@TotalPrice", cartItem.TotalPrice); // Decimal
                            command.Parameters.AddWithValue("@DateAdded", DateTime.Now); // DateTime
                            command.Parameters.AddWithValue("@CategoryName", cartItem.CategoryName); // String
                            command.Parameters.AddWithValue("@Customer_RefNo", cartItem.Customer_RefNo); // String

                        int rowsAffected = await command.ExecuteNonQueryAsync();
             
                        if (rowsAffected > 0)
                        {
                            return Ok(cartItem);
                        }
                        else
                        {
                            return NotFound("Cart item not added");
                        }

                    }
                }
            }
            catch (SqlException sqlEx)
            {
                // Log the SQL exception details
                Console.WriteLine($"SQL Error: {sqlEx.Message}");
                throw new Exception("An error occurred while adding the item to the cart.", sqlEx);
            }
            catch (InvalidOperationException invOpEx)
            {
                // Log invalid operation exceptions
                Console.WriteLine($"Invalid Operation: {invOpEx.Message}");
                throw new Exception("An invalid operation occurred while adding the item to the cart.", invOpEx);
            }
            catch (Exception ex)
            {
                // Log general exceptions
                Console.WriteLine($"Error: {ex.Message}");
                throw new Exception("An unexpected error occurred while adding the item to the cart.", ex);

            }
        }

        
        [HttpGet]
        [Route("/api/[controller]/GetCartItem")]
        public async Task<IActionResult> GetCartItem(string cartid,int cusid)
        {
            Cart CartItem = null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlCommand command = new SqlCommand("SELECT * FROM Cart WHERE CartId=@cartid AND Customer_RefNo=@cusid", connection))
                {
                    command.Parameters.AddWithValue("@cartid", cartid);
                    command.Parameters.AddWithValue("@cusid", cusid);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                           CartItem = new Cart
                            {
                                CartId = reader.GetString(reader.GetOrdinal("CartId")),//Using GetOrdinal ensures you are referencing the correct column, even if its order changes.
                                UserId = reader.GetInt32(reader.GetOrdinal("UserId")),
                                ProductName = reader.GetString(reader.GetOrdinal("ProductName")),
                                Quantity = reader.GetInt32(reader.GetOrdinal("Quantity")),
                                Price = reader.GetDecimal(reader.GetOrdinal("Price")),
                                DateAdded = reader.GetDateTime(reader.GetOrdinal("DateAdded")),
                                CategoryName = reader.GetString(reader.GetOrdinal("CategoryName")),
                                Customer_RefNo = reader.GetString(reader.GetOrdinal("Customer_RefNo"))
                            };

                        }
                    }
                }
            }

            return Ok(CartItem);
        }
    }
}
