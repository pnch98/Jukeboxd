namespace Jukeboxd.DTO
{
    public class OrderModel
    {
        public string UserId { get; set; }
        public double Total { get; set; }
        public DateTime OrderDate { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public List<OrderDetailsModel> OrderDetails { get; set; }
    }
}
