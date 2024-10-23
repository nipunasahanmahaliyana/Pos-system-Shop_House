using Microsoft.AspNetCore.Mvc;
using shop_house.Server.Model;
using System.Data;
using System.Data.SqlClient;
using BCrypt.Net;

namespace shop_house.Server.Controllers
{
    public class UserController : Controller
    {
        private readonly string _connectionString;

        public UserController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [Route("api/[controller]")]
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = new List<Users>();
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand("SELECT user_id, username, password, role, created_at, updated_at FROM Users", connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                users.Add(new Users
                                {
                                    User_id = (int)reader["user_id"],
                                    Username = reader["username"].ToString(),
                                    Password = reader["password"].ToString(),
                                    Role = reader["role"].ToString(),
                                    Created_at = reader.GetDateTime(reader.GetOrdinal("created_at")),
                                    Updated_at = reader.GetDateTime(reader.GetOrdinal("updated_at"))
                                });
                            }
                        }
                    }
                }

                return Ok(users);
            }
            catch (SqlException sqlEx)
            {
                // Log SQL-specific errors
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "Database error occurred.",
                    Details = sqlEx.Message
                });
            }
            catch (InvalidOperationException invalidOpEx)
            {
                // Handle invalid operations, such as connection issues
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "Invalid operation occurred.",
                    Details = invalidOpEx.Message
                });
            }
            catch (Exception ex)
            {
                // Handle any other exceptions
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An unexpected error occurred.",
                    Details = ex.Message
                });
            }
        }


        [Route("api/[controller]/AddUsers")]
        [HttpPost]
        public async Task<IActionResult> AddUsers(string username, string password, string role, IFormFile imageFile)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password) || string.IsNullOrEmpty(role) || imageFile == null || imageFile.Length == 0)
            {
                return BadRequest(new { Message = "Username, password, role, and profile image are required." });
            }

            try
            {
                // Hash the password before saving
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

                using (var memoryStream = new MemoryStream())
                {
                    imageFile.CopyTo(memoryStream);
                    byte[] imageData = memoryStream.ToArray();

                    string query = "INSERT INTO Users (username, password, role, image) VALUES (@Username, @Password, @Role, @Image)";

                    using (SqlConnection conn = new SqlConnection(_connectionString))
                    {
                        conn.Open();
                        using (SqlCommand comm = new SqlCommand(query, conn))
                        {
                            comm.Parameters.AddWithValue("@Username", username);
                            comm.Parameters.AddWithValue("@Password", hashedPassword);
                            comm.Parameters.AddWithValue("@Role", role);
                            comm.Parameters.AddWithValue("@Image", imageData);

                            int rowsAffected = comm.ExecuteNonQuery();

                            if (rowsAffected > 0)
                            {
                                return CreatedAtAction(nameof(GetUsers), new { username }, new { Message = "User created successfully." });
                            }
                            else
                            {
                                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "User could not be created." });
                            }
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "Database error occurred.",
                    Details = sqlEx.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An unexpected error occurred.",
                    Details = ex.Message
                });
            }
        }



        [Route("api/[controller]/UpdateUser")]
        [HttpPut]
        public async Task<IActionResult> UpdateUser(int id,
                                 string username = null,
                                 string password = null,
                                 string role = null)
        {
            try
            {
                Users existingUser = null;

                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand("SELECT user_id, username, password, role FROM Users WHERE user_id = @UserId", connection))
                    {
                        command.Parameters.AddWithValue("@UserId", id);
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                existingUser = new Users
                                {
                                    User_id = (int)reader["user_id"],
                                    Username = reader["username"].ToString(),
                                    Password = reader["password"].ToString(),
                                    Role = reader["role"].ToString()
                                };
                            }
                        }
                    }
                }

                // If the user does not exist, return NotFound
                if (existingUser == null)
                {
                    return NotFound(new { Message = "User not found." });
                }

                // Update only the fields provided
                if (!string.IsNullOrEmpty(username))
                {
                    existingUser.Username = username;
                }
                if (!string.IsNullOrEmpty(password))
                {
                    existingUser.Password = password; // Remember to hash the password
                }
                if (!string.IsNullOrEmpty(role))
                {
                    existingUser.Role = role;
                }

                // Now update the database with the modified user
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand("UPDATE Users SET username = @Username, password = @Password, role = @Role WHERE user_id = @UserId", connection))
                    {
                        command.Parameters.AddWithValue("@UserId", id);
                        command.Parameters.AddWithValue("@Username", existingUser.Username);
                        command.Parameters.AddWithValue("@Password", existingUser.Password); // Hash before updating
                        command.Parameters.AddWithValue("@Role", existingUser.Role);

                        int rowsAffected = command.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(new { Message = "User updated successfully." });
                        }
                        else
                        {
                            return NotFound(new { Message = "User not found." });
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "Database error occurred.",
                    Details = sqlEx.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An unexpected error occurred.",
                    Details = ex.Message
                });
            }
        }


        [Route("api/[controller]")]
        [HttpDelete]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand("DELETE FROM Users WHERE user_id = @UserId", connection))
                    {
                        command.Parameters.AddWithValue("@UserId", id);

                        int rowsAffected = command.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(new { Message = "User deleted successfully." });
                        }
                        else
                        {
                            return NotFound(new { Message = "User not found." });
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "Database error occurred.",
                    Details = sqlEx.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An unexpected error occurred.",
                    Details = ex.Message
                });
            }
        }

    }
}
