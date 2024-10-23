namespace shop_house.Server.DTO
{
    public class ProductDTO
    {
        public int ProductId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CategoryId { get; set; }
        public string? ImageBase64 { get; set; }
    }
}
