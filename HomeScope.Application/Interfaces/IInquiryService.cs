using HomeScope.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScope.Application.Interfaces
{
    public interface IInquiryService
    {
        Task<bool> CreateInquiryAsync(CreateInquiryDto dto, int userId);
        Task<List<InquiryDto>> GetReceivedInquiriesAsync(int ownerId);
    }
}
