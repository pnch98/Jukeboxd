using Jukeboxd.Data;
using System.ComponentModel.DataAnnotations;

namespace Jukeboxd.Models
{
    public class User
    {
        [Key]
        public string Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Image { get; set; }
        public string Role { get; set; } = UserRole.USER;
        public virtual ICollection<Saved> SavedSongs { get; set; }
        public virtual ICollection<Jukebox> Jukeboxes { get; set; }
        public virtual ICollection<Discover> Discovers { get; set; }
        public virtual ICollection<Review> Reviews { get; set; }
        public virtual ICollection<Visited> Visits { get; set; }
    }
}
