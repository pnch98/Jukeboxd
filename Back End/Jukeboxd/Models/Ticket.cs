using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jukeboxd.Models
{
    public class Ticket
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [ForeignKey("Event")]
        public int EventId { get; set; }
        [ForeignKey("StoreUser")]
        public int UserId { get; set; }
        public double Price { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public virtual Event Event { get; set; }
        public virtual StoreUser StoreUser { get; set; }

    }
}
