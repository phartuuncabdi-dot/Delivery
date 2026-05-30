using DeliverySystem.Application.DTOs;
using DeliverySystem.Application.Interfaces;
using DeliverySystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DeliverySystem.Application.Services;

public class NotificationService(AppDbContext db) : INotificationService
{
    public async Task<IEnumerable<NotificationResponse>> GetMyNotificationsAsync(int userId) =>
        await db.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NotificationResponse(n.NotificationId, n.Message, n.IsRead, n.CreatedAt))
            .ToListAsync();

    public async Task<bool> MarkAsReadAsync(int notificationId, int userId)
    {
        var notification = await db.Notifications
            .FirstOrDefaultAsync(n => n.NotificationId == notificationId && n.UserId == userId);
        if (notification == null) return false;

        notification.IsRead = true;
        await db.SaveChangesAsync();
        return true;
    }
}
