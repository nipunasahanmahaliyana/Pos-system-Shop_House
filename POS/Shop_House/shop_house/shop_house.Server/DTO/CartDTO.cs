namespace shop_house.Server.DTO
{
    public class CartDTO
    {
        public int UserId { get; set; }        // Ensure this is an integer
        public string? ProductName { get; set; }
        public int Quantity { get; set; }      // Ensure this is an integer
        public decimal Price { get; set; }     // Ensure decimal
        public DateTime DateAdded { get; set; }
        public string? CategoryName { get; set; }
        public string? Customer_RefNo { get; set; }
    }
}
