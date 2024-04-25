namespace Jukeboxd.DTO
{
    public class CartModel
    {
        public List<CartItemModel> CartProducts { get; set; }
        public double Total { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
    }
}
