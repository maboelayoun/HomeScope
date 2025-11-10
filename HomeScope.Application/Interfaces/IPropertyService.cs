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
    }
}
