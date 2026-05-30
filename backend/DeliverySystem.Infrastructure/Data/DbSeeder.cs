using DeliverySystem.Domain.Entities;
using DeliverySystem.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace DeliverySystem.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Users.AnyAsync(u => u.Role == UserRole.Admin))
            return;

        var admin = new User
        {
            Email = "admin@delivery.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = UserRole.Admin,
            IsActive = true
        };
        db.Users.Add(admin);
        await db.SaveChangesAsync();
    }
}
