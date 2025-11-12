using HomeScope.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScope.Application.Interfaces
{
    public interface IPropertyService
    {
        Task<int> CreatePropertyAsync(CreatePropertyRequest request, int userId);
        Task<List<PropertyResponse>> GetAllPropertiesAsync();
        Task<bool> UpdatePropertyAsync(int propertyId, UpdatePropertyRequest request, int userId);
        Task<bool> DeletePropertyAsync(int propertyId, int userId);
        Task<bool> AddToFavoritesAsync(int propertyId, int userId);
        Task<List<PropertyDto>> GetFavoritesAsync(int userId);



    }
}
