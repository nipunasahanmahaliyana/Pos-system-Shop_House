namespace shop_house.Server.Model
{
    public class Product
    {
        public int ProductId { get; set; }    
        public string? Name { get; set; }    
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public IFormFile? Image { get; set; }
        public int CategoryId { get; set; } 
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
