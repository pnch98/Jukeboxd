using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jukeboxd.Models
{
    public class Highlight
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Track")]
        public string TrackId { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }
        public virtual Track Track { get; set; }
        public virtual User User { get; set; }

    }
}
