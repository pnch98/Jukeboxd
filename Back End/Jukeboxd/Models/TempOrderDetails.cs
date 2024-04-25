using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jukeboxd.Models
{
    public class TempOrderDetails
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("TempOrder")]
        public int TempOrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
        public virtual TempOrder TempOrder { get; set; }
    }
}
