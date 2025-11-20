using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class Item
    {
        [Key]
        public string Code { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}