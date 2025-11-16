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
    public class InquiryService:IInquiryService
    {
        private readonly HomeScopeDbContext _context;
        public InquiryService(HomeScopeDbContext context)
        {
            _context = context; 
        }
        public async Task<bool> CreateInquiryAsync(CreateInquiryDto dto, int userId)
        {
            var property = await _context.Properties.FindAsync(dto.PropertyId);
            if (property == null) return false;

            var inquiry = new Inquiry
            {
                PropertyId = dto.PropertyId,
                UserId = userId,
                Message = dto.Message
            };

            _context.Inquiries.Add(inquiry);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<InquiryDto>> GetReceivedInquiriesAsync(int ownerId)
        {
            var inquiries = await _context.Inquiries
                .Include(i => i.Property)
                .Include(i => i.User)
                .Where(i => i.Property.UserId == ownerId)
                .Select(i => new InquiryDto
                {
                    Id = i.Id,
                    PropertyId = i.PropertyId,
                    PropertyTitle = i.Property.Title,
                    UserId = i.UserId,
                    UserName = i.User.FullName,
                    Message = i.Message,
                    CreatedAt = i.CreatedAt
                })
                .ToListAsync();

            return inquiries;
        }

    }
}
