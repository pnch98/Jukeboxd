namespace Jukeboxd.Models
{
    public class StoreUser
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } = "USER";
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<Ticket> Tickets { get; set; }
    }
}
