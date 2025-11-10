using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScope.Application.DTOs
{
    public class PropertyResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Location { get; set; }
        public decimal Price { get; set; }
        public string Type { get; set; }
        public List<string>? ImageUrls { get; set; }
    }

}
