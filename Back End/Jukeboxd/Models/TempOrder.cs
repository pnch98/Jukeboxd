using System.ComponentModel.DataAnnotations;

namespace Jukeboxd.Models
{
    public class TempOrder
    {
        [Key]
        public int Id { get; set; }
        public string SessionId { get; set; } = "";
        public int UserId { get; set; }
        public double Total { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public string City { get; set; }
        public string Address { get; set; }
        public virtual ICollection<TempOrderDetails> TempOrderDetails { get; set; }
    }
}