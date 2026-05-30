using DeliverySystem.Application.DTOs;
using DeliverySystem.Application.Interfaces;
using DeliverySystem.Domain.Entities;
using DeliverySystem.Domain.Enums;
using DeliverySystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DeliverySystem.Application.Services;

public class AuthService(AppDbContext db, ITokenService tokenService) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (request.Role is not (UserRole.Customer or UserRole.Driver))
            throw new InvalidOperationException("Registration allowed only for Customer or Driver.");

        if (await db.Users.AnyAsync(u => u.Email == request.Email))
            throw new InvalidOperationException("Email already exists.");

        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        if (request.Role == UserRole.Customer)
        {
            db.Customers.Add(new Customer
            {
                UserId = user.UserId,
                Name = request.Name,
                Phone = request.Phone,
                Address = request.Address,
                Email = request.Email
            });
        }
        else
        {
            db.Drivers.Add(new Driver
            {
                UserId = user.UserId,
                DriverName = request.Name,
                Phone = request.Phone,
                VehicleType = request.Address
            });
        }

        await db.SaveChangesAsync();

        var token = tokenService.GenerateToken(user.UserId, user.Email, user.Role);
        return new AuthResponse(token, user.Email, user.Role, user.UserId);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        var token = tokenService.GenerateToken(user.UserId, user.Email, user.Role);
        return new AuthResponse(token, user.Email, user.Role, user.UserId);
    }
}
