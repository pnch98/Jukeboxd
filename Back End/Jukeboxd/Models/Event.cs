using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jukeboxd.Models
{
    public class Event
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Artist")]
        public string ArtistId { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public DateTime Date { get; set; }
        public double Price { get; set; }
        public int nOfTickets { get; set; }
        public bool IsSoldOut { get; set; }
        public virtual Artist Artist { get; set; }

    }
}
