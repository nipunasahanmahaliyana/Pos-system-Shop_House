namespace shop_house.Server.Model
{
    public class Users
    {
      public int User_id { get; set; }
      public string? Username {  get; set; }
      public string? Password { get; set; }
      public string? Role { get; set; }
      public IFormFile? Image { get; set; }
      public DateTime Created_at { get; set; }
      public DateTime Updated_at { get; set; }
       
    }
}
