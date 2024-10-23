namespace shop_house.Server.Model
{
    public class Customer
    {
        public int CustomerId { get; set; }         
        public string? Name { get; set; }           
        public string? Email { get; set; }          
        public string? Phone { get; set; }    
        public int Purchases { get; set; }
        public DateTime CreatedAt { get; set; }   
        public DateTime UpdatedAt { get; set; }    
    }
}
