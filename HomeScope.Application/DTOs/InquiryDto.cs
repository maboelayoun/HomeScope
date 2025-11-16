using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScope.Application.DTOs
{
    public class InquiryDto
    {
        public int Id { get; set; }

        public int PropertyId { get; set; }
        public string PropertyTitle { get; set; }

        public int UserId { get; set; }
        public string UserName { get; set; }

        public string Message { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
