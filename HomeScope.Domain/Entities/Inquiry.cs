using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScope.Domain.Entities
{
    public class Inquiry
    {
        public int Id { get; set; }
        public int PropertyId { get; set; }
        public Property Property { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public string Message { get; set; }
        public DateTime SentAt { get; set; }
    }
}
