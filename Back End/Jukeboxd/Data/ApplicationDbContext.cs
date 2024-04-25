using Microsoft.EntityFrameworkCore;

namespace Jukeboxd.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Models.User> Users { get; set; }
        public DbSet<Models.Album> Albums { get; set; }
        public DbSet<Models.Artist> Artists { get; set; }
        public DbSet<Models.Saved> SavedList { get; set; }
        public DbSet<Models.Jukebox> JukeboxList { get; set; }
        public DbSet<Models.Discover> DiscoverList { get; set; }
        public DbSet<Models.Visited> VisitedList { get; set; }
        public DbSet<Models.Review> Reviews { get; set; }
        public DbSet<Models.Product> Products { get; set; }
        public DbSet<Models.StoreUser> StoreUsers { get; set; }
        public DbSet<Models.Order> Orders { get; set; }
        public DbSet<Models.OrderDetails> OrderDetails { get; set; }
        public DbSet<Models.Event> Events { get; set; }
        public DbSet<Models.TempOrder> TempOrders { get; set; }
        public DbSet<Models.TempOrderDetails> TempOrderDetails { get; set; }
        public DbSet<Models.TempTicket> TempTickets { get; set; }
        public DbSet<Models.Ticket> Tickets { get; set; }
    }
}