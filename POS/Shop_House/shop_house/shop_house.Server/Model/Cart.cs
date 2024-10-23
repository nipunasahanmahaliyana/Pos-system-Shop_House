namespace shop_house.Server.Model
{
    public class Cart
    {
        public string? CartId { get; set; }     
        public int UserId { get; set; }      
        public string? ProductName { get; set; }   
        public int Quantity { get; set; }       
        public decimal Price { get; set; }      
        public decimal TotalPrice { get; set; }   
        public DateTime DateAdded { get; set; }   
        public string? CategoryName { get; set; }  
        public string? Customer_RefNo { get; set; }
    }
}
