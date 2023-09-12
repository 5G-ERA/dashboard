namespace eu_projects_main_platform.Models._5gera
{
    //public class OnboardEntity
    //{
    //    public File file { get; set; } // ref: RelationModel
    //    public Guid Id { get; set; }
    //    public string? Question { get; set; }
    //    public Boolean IsSngleAnswer { get; set; }
    //    public IEnumerable<Object>? Answer{ get; set; } // ref KeyValuPair
    //}
    public interface OnboardEntity
    {
        string ContentType { get; }
        string ContentDisposition { get; }
        IHeaderDictionary Headers { get; }
        long Length { get; }
        string Name { get; }
        string FileName { get; }
        Stream OpenReadStream();
        Task CopyTo(Stream target);
        Task CopyToAsync(Stream target, CancellationToken cancellationToken);
    }
    public class Entityfile
    {
        public string entity_type { get; set; }
        public IFormFile file { get; set; }
    }
}
