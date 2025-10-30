using HomeScope.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScope.Infrustructure.Persistence
{
    public class HomeScopeDbContext:DbContext
    {
        public HomeScopeDbContext(DbContextOptions<HomeScopeDbContext> options) :base(options)
        {
            
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Inquiry> Inquiries { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Property> Properties { get; set; } // Already added
    }
}
