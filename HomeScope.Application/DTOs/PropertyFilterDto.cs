using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScope.Application.DTOs
{
    public class PropertyFilterDto
    {
        public string Location { get; set; }
        public decimal? PriceMin { get; set; }
        public decimal? PriceMax { get; set; }
        public string Type { get; set; }
        public int? Bedrooms { get; set; }
    }

}
