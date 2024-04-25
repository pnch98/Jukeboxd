using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jukeboxd.Models
{
    public class Visited
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }
        [ForeignKey("Artist")]
        public string ArtistId { get; set; }
        public virtual Artist Artist { get; set; }
        public virtual User User { get; set; }
    }
}
