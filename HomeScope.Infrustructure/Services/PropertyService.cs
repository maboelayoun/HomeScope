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
    }

}
