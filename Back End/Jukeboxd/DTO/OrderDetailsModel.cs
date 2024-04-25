namespace Jukeboxd.DTO
{
    public class OrderDetailsModel
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public ProductModel Product { get; set; }

    }
}
