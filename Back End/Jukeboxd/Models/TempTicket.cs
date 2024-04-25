using System.ComponentModel.DataAnnotations;

namespace Jukeboxd.Models
{
    public class TempTicket
    {
        [Key]
        public int Id { get; set; }
        public string SessionId { get; set; } = "";
        public int EventId { get; set; }
        public int UserId { get; set; }
        public double Price { get; set; }
    }
}
