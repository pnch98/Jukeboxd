using System.ComponentModel.DataAnnotations;

namespace Jukeboxd.Models
{
    public class Artist
    {
        [Key]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Href { get; set; }
        public string Image { get; set; }
        public int Popularity { get; set; }
        public int Followers { get; set; }
        public List<string> Genres { get; set; }
        public virtual ICollection<Discover> Discovers { get; set; }
        public virtual ICollection<Visited> Visits { get; set; }
        public virtual ICollection<Event> Events { get; set; }
    }
}
