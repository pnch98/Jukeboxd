using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jukeboxd.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("StoreUser")]
        public int UserId { get; set; }
        public double Total { get; set; }
        public DateTime Date { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public virtual StoreUser StoreUser { get; set; }
        public virtual ICollection<OrderDetails> OrderDetails { get; set; }
    }
}
