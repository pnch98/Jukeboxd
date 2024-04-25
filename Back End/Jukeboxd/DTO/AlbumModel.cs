namespace Jukeboxd.DTO
{
    public class AlbumModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string ReleaseDate { get; set; }
        public int Popularity { get; set; }
        public string Href { get; set; }
        public string Artist { get; set; }
        public string Image { get; set; }
        public int Duration { get; set; }
    }
}
