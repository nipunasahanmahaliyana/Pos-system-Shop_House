namespace shop_house.Server.Model
{
    public class Inventory
    {
 
        public int InventoryId { get; set; }
        public string? CategoryName { get; set; }
        public string? ProductName { get; set; }
        public int Stock { get; set; }
        public DateTime UpdateDate { get; set; }
    }
}
