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
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var adminPassword = BCrypt.Net.BCrypt.HashPassword("Admin@123");

            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                FullName = "System Admin",
                Email = "admin@homescope.com",
                PasswordHash = adminPassword,
                Phone = "0000000000",
                Role = "Admin",
                CreatedAt = new DateTime(2025, 1, 1)
            });
            // ❌ Prevent cascade from User → Property
            modelBuilder.Entity<Property>()
                .HasOne(p => p.User)
                .WithMany(u => u.Properties)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict); // ✅ This is the key line

            // ✅ Allow cascade from Property → PropertyImage
            modelBuilder.Entity<PropertyImage>()
                .HasOne(pi => pi.Property)
                .WithMany(p => p.Images)
                .HasForeignKey(pi => pi.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Inquiry> Inquiries { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Property> Properties { get; set; } // Already added
        public DbSet<PropertyImage> PropertyImages { get; set; }
    }


    }
