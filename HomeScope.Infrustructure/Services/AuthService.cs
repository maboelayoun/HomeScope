using HomeScope.Application.DTOs;
using HomeScope.Application.Interfaces;
using HomeScope.Domain.Entities;
using HomeScope.Infrustructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HomeScope.Infrustructure.Services
{
    public class AuthService : IAuthService
    {
        #region constructor
        private readonly HomeScopeDbContext _context;
        private readonly JwtService _jwt;
        public AuthService(HomeScopeDbContext context,JwtService jwt)
        {
            _context = context;
            _jwt = jwt;
        }
        #endregion
        public async Task<string> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash) || user==null)
            {
                return null; // or Unauthorized
            }
            var test = _jwt.GenerateToken(user);
            return _jwt.GenerateToken(user);

        }

        public async Task<bool> RegisterAsync(RegisterRequest request)
        {
            if (_context.Users.Any(u => u.Email == request.Email))
                return false;
            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Phone = request.Phone,
                Role = "Customer",
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return true;

        }
    }
}
