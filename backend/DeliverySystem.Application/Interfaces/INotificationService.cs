using DeliverySystem.Application.DTOs;

namespace DeliverySystem.Application.Interfaces;

public interface INotificationService
{
    Task<IEnumerable<NotificationResponse>> GetMyNotificationsAsync(int userId);
    Task<bool> MarkAsReadAsync(int notificationId, int userId);
}
