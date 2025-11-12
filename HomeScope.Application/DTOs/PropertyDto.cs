using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScope.Application.DTOs
{
    public class PropertyDto
    {
        public int Id { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public decimal Price { get; set; }
        public string Location { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<string> ImageUrls { get; set; } // ✅ For frontend gallery

        public string OwnerName { get; set; } // Optional: show who posted it
    }

}
