using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jukeboxd.Models
{
    public class Review
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int Rating { get; set; }
        public string Comment { get; set; }
        [ForeignKey("Album")]
        public string AlbumId { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }
        public virtual User User { get; set; }
        public virtual Album Album { get; set; }
    }
}
