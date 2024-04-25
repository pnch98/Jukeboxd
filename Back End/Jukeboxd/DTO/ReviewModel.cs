namespace Jukeboxd.DTO
{
    public class ReviewModel
    {
        public int Rating { get; set; }
        public string Comment { get; set; }
        public string AlbumId { get; set; }
        public string UserId { get; set; }
    }
}
