using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jukeboxd.Models
{
    public class Track
    {
        [Key]
        public string Id { get; set; }
        public int Duration { get; set; }
        public string Name { get; set; }
        public int Popularity { get; set; }
        public string PreviewUrl { get; set; }
        public string Href { get; set; }
        [ForeignKey("Album")]
        public string AlbumId { get; set; }
        [ForeignKey("Artist")]
        public string ArtistId { get; set; }

    }
}
