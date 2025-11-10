using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScope.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Phone { get; set; }
        public string Role { get; set; } // Admin, Customer
        public DateTime CreatedAt { get; set; }

        public ICollection<Inquiry> Inquiries { get; set; }
        public ICollection<Favorite> Favorites { get; set; }
        public ICollection<Property> Properties { get; set; }
    }
}
