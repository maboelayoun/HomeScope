using HomeScope.Application.DTOs;
using HomeScope.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HomeScope.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InquiryController : ControllerBase
    {
        private readonly IInquiryService _inquiryService;   
        public InquiryController(IInquiryService inquiryService)
        {
            _inquiryService = inquiryService;
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateInquiry([FromBody] CreateInquiryDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var success = await _inquiryService.CreateInquiryAsync(dto, userId);

            if (!success) return NotFound("Property not found.");
            return Ok("Inquiry sent successfully.");
        }

        [Authorize]
        [HttpGet("received")]
        public async Task<IActionResult> GetReceivedInquiries()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var inquiries = await _inquiryService.GetReceivedInquiriesAsync(userId);
            return Ok(inquiries);
        }

    }
}
