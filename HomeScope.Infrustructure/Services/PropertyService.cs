using HomeScope.Application.DTOs;
using HomeScope.Application.Interfaces;
using HomeScope.Domain.Entities;
using HomeScope.Infrustructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScope.Infrustructure.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly HomeScopeDbContext _context;

        public PropertyService(HomeScopeDbContext context)
        {
            _context = context;
        }

        public async Task<int> CreatePropertyAsync(CreatePropertyRequest request, int userId)
        {
            var property = new Property
            {
                Title = request.Title,
                Description = request.Description,
                Location = request.Location,
                Price = request.Price,
                Bedrooms = request.Bedrooms,
                Bathrooms = request.Bathrooms,
                Type = request.Type,
                CreatedAt = DateTime.UtcNow,
                UserId = userId,
                Images = request.ImageUrls?.Select(url => new PropertyImage { ImageUrl = url }).ToList()
            };

            _context.Properties.Add(property);
            await _context.SaveChangesAsync();
            return property.Id;
        }

        public async Task<List<PropertyResponse>> GetAllPropertiesAsync()
        {
            return await _context.Properties
                .Include(p => p.Images)
                .Select(p => new PropertyResponse
                {
                    Id = p.Id,
                    Title = p.Title,
                    Location = p.Location,
                    Price = p.Price,
                    Type = p.Type,
                    ImageUrls = p.Images.Select(img => img.ImageUrl).ToList()
                })
                .ToListAsync();
        }

        public async Task<bool> UpdatePropertyAsync(int propertyId, UpdatePropertyRequest request, int userId)
        {
            var property = await _context.Properties
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == propertyId);

            if (property == null || property.UserId != userId)
                return false;

            property.Title = request.Title;
            property.Description = request.Description;
            property.Location = request.Location;
            property.Price = request.Price;
            property.Bedrooms = request.Bedrooms;
            property.Bathrooms = request.Bathrooms;
            property.Type = request.Type;

            // Replace images
            _context.PropertyImages.RemoveRange(property.Images);
            property.Images = request.ImageUrls?.Select(url => new PropertyImage
            {
                ImageUrl = url,
                PropertyId = propertyId
            }).ToList();

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeletePropertyAsync(int propertyId, int userId)
        {
            var property = await _context.Properties
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == propertyId);

            if (property == null || property.UserId != userId)
                return false;

            _context.PropertyImages.RemoveRange(property.Images);
            _context.Properties.Remove(property);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddToFavoritesAsync(int propertyId, int userId)
        {
            var exists = await _context.Favorites
                .AnyAsync(fp => fp.PropertyId == propertyId && fp.UserId == userId);

            if (exists) return false;

            var favorite = new Favorite
            {
                PropertyId = propertyId,
                UserId = userId
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<PropertyDto>> GetFavoritesAsync(int userId)
        {
            var favorites = await _context.Favorites
                .Where(fp => fp.UserId == userId)
                .Include(fp => fp.Property)
                .Select(fp => new PropertyDto
                {
                    Id = fp.Property.Id,
                    Title = fp.Property.Title,
                    Price = fp.Property.Price,
                    Location = fp.Property.Location
                })
                .ToListAsync();

            return favorites;
        }

    }

}
