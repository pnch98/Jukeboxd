namespace Jukeboxd.DTO
{
    public class ArtistModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Href { get; set; }
        public string Image { get; set; }
        public int Popularity { get; set; }
        public int Followers { get; set; }
        public List<string> Genres { get; set; }
    }
}
