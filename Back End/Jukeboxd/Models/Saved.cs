using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jukeboxd.Models
{
    public class Saved
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }
        [ForeignKey("Album")]
        public string AlbumId { get; set; }
        public virtual User User { get; set; }
        public virtual Album Album { get; set; }
    }
}
