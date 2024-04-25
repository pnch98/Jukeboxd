using System.ComponentModel.DataAnnotations;

namespace Jukeboxd.Models
{
    public class Album
    {
        [Key]
        public string Id { get; set; }
        public string Name { get; set; }
        public string ReleaseDate { get; set; }
        public int Popularity { get; set; }
        public string Href { get; set; }
        public string Artist { get; set; }
        public string Image { get; set; }
        public int Duration { get; set; }
        public virtual ICollection<Saved> SavedSongs { get; set; }
        public virtual ICollection<Jukebox> Jukeboxes { get; set; }
        public virtual ICollection<Review> Reviews { get; set; }
    }
}
