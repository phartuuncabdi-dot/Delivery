using DeliverySystem.Application.DTOs;
using DeliverySystem.Application.Interfaces;
using DeliverySystem.Domain.Entities;
using DeliverySystem.Domain.Enums;
using DeliverySystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DeliverySystem.Application.Services;

public class AdminService(AppDbContext db) : IAdminService
{
    public async Task<IEnumerable<CustomerResponse>> GetCustomersAsync() =>
        await db.Customers
            .Include(c => c.User)
            .Select(c => new CustomerResponse(
                c.CustomerId,
                c.Name,
                c.Phone,
                c.Address,
                c.Email,
                c.User!.IsActive))
            .ToListAsync();

    public async Task<IEnumerable<DriverResponse>> GetDriversAsync() =>
        await db.Drivers
            .Select(d => new DriverResponse(
                d.DriverId,
                d.DriverName,
                d.Phone,
                d.VehicleType,
                d.IsAvailable))
            .ToListAsync();

    public async Task<DriverResponse> CreateDriverAsync(CreateDriverRequest request)
    {
        if (await db.Users.AnyAsync(u => u.Email == request.Email))
            throw new InvalidOperationException("Email already exists.");

        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = UserRole.Driver
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var driver = new Driver
        {
            UserId = user.UserId,
            DriverName = request.DriverName,
            Phone = request.Phone,
            VehicleType = request.VehicleType
        };
        db.Drivers.Add(driver);
        await db.SaveChangesAsync();

        return new DriverResponse(
            driver.DriverId,
            driver.DriverName,
            driver.Phone,
            driver.VehicleType,
            driver.IsAvailable);
    }

    public async Task<IEnumerable<DeliveryReportItem>> GetDeliveryReportAsync() =>
        await db.Orders
            .Include(o => o.Customer)
            .Include(o => o.Driver)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new DeliveryReportItem(
                o.OrderId,
                o.Customer!.Name,
                o.Driver != null ? o.Driver.DriverName : null,
                o.ProductName,
                o.Status,
                o.CreatedAt))
            .ToListAsync();

    public async Task<IEnumerable<CustomerReportItem>> GetCustomerReportAsync() =>
        await db.Customers
            .Select(c => new CustomerReportItem(
                c.CustomerId,
                c.Name,
                c.Email,
                c.Orders.Count))
            .ToListAsync();
}
