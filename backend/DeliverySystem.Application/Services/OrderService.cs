using DeliverySystem.Application.DTOs;
using DeliverySystem.Application.Interfaces;
using DeliverySystem.Domain.Entities;
using DeliverySystem.Domain.Enums;
using DeliverySystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DeliverySystem.Application.Services;

public class OrderService(AppDbContext db) : IOrderService
{
    public async Task<OrderResponse> CreateOrderAsync(int userId, CreateOrderRequest request)
    {
        var customer = await db.Customers.FirstOrDefaultAsync(c => c.UserId == userId)
            ?? throw new InvalidOperationException("Customer profile not found.");

        var order = new Order
        {
            CustomerId = customer.CustomerId,
            ProductName = request.ProductName,
            Quantity = request.Quantity,
            DeliveryAddress = request.DeliveryAddress,
            ScheduledDate = request.ScheduledDate,
            Status = OrderStatus.Pending
        };

        db.Orders.Add(order);
        await db.SaveChangesAsync();
        await AddHistoryAsync(order.OrderId, order.Status, userId);
        await NotifyAdminsAsync($"New order #{order.OrderId} from {customer.Name}");

        return (await MapOrderAsync(order.OrderId))!;
    }

    public async Task<OrderResponse?> GetOrderAsync(int orderId) =>
        await MapOrderAsync(orderId);

    public async Task<IEnumerable<OrderResponse>> GetMyOrdersAsync(int userId)
    {
        var customer = await db.Customers.FirstOrDefaultAsync(c => c.UserId == userId);
        if (customer == null) return [];

        var orders = await db.Orders
            .Where(o => o.CustomerId == customer.CustomerId)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => o.OrderId)
            .ToListAsync();

        var result = new List<OrderResponse>();
        foreach (var id in orders)
        {
            var mapped = await MapOrderAsync(id);
            if (mapped != null) result.Add(mapped);
        }
        return result;
    }

    public async Task<IEnumerable<OrderResponse>> GetAllOrdersAsync()
    {
        var ids = await db.Orders.OrderByDescending(o => o.CreatedAt)
            .Select(o => o.OrderId).ToListAsync();
        var result = new List<OrderResponse>();
        foreach (var id in ids)
        {
            var mapped = await MapOrderAsync(id);
            if (mapped != null) result.Add(mapped);
        }
        return result;
    }

    public async Task<OrderResponse?> AssignDriverAsync(int orderId, AssignDriverRequest request, int adminUserId)
    {
        var order = await db.Orders.FindAsync(orderId)
            ?? throw new KeyNotFoundException("Order not found.");

        var driver = await db.Drivers.FindAsync(request.DriverId)
            ?? throw new KeyNotFoundException("Driver not found.");

        order.DriverId = driver.DriverId;
        order.Status = OrderStatus.Assigned;
        order.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        await AddHistoryAsync(orderId, order.Status, adminUserId);

        if (driver.UserId > 0)
            await AddNotificationAsync(driver.UserId, $"You were assigned order #{orderId}.");

        return await MapOrderAsync(orderId);
    }

    public async Task<OrderResponse?> UpdateStatusAsync(int orderId, UpdateOrderStatusRequest request, int userId, string role)
    {
        if (!OrderStatus.All.Contains(request.Status))
            throw new InvalidOperationException("Invalid status.");

        var order = await db.Orders.Include(o => o.Customer).FirstOrDefaultAsync(o => o.OrderId == orderId)
            ?? throw new KeyNotFoundException("Order not found.");

        if (role == UserRole.Driver)
        {
            var driver = await db.Drivers.FirstOrDefaultAsync(d => d.UserId == userId)
                ?? throw new UnauthorizedAccessException("Driver profile not found.");
            if (order.DriverId != driver.DriverId)
                throw new UnauthorizedAccessException("This order is not assigned to you.");
        }

        order.Status = request.Status;
        order.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        await AddHistoryAsync(orderId, request.Status, userId);

        if (order.Customer != null)
        {
            var customerUser = await db.Customers.Where(c => c.CustomerId == order.CustomerId)
                .Select(c => c.UserId).FirstOrDefaultAsync();
            if (customerUser > 0)
                await AddNotificationAsync(customerUser, $"Order #{orderId} status: {request.Status}");
        }

        return await MapOrderAsync(orderId);
    }

    public async Task<IEnumerable<OrderResponse>> GetDriverAssignmentsAsync(int userId)
    {
        var driver = await db.Drivers.FirstOrDefaultAsync(d => d.UserId == userId)
            ?? throw new InvalidOperationException("Driver profile not found.");

        var ids = await db.Orders
            .Where(o => o.DriverId == driver.DriverId && o.Status != OrderStatus.Delivered && o.Status != OrderStatus.Cancelled)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => o.OrderId)
            .ToListAsync();

        var result = new List<OrderResponse>();
        foreach (var id in ids)
        {
            var mapped = await MapOrderAsync(id);
            if (mapped != null) result.Add(mapped);
        }
        return result;
    }

    private async Task<OrderResponse?> MapOrderAsync(int orderId)
    {
        return await db.Orders
            .Include(o => o.Customer)
            .Include(o => o.Driver)
            .Where(o => o.OrderId == orderId)
            .Select(o => new OrderResponse(
                o.OrderId,
                o.CustomerId,
                o.Customer!.Name,
                o.DriverId,
                o.Driver != null ? o.Driver.DriverName : null,
                o.ProductName,
                o.Quantity,
                o.DeliveryAddress,
                o.ScheduledDate,
                o.Status,
                o.CreatedAt))
            .FirstOrDefaultAsync();
    }

    private async Task AddHistoryAsync(int orderId, string status, int? userId)
    {
        db.OrderStatusHistories.Add(new OrderStatusHistory
        {
            OrderId = orderId,
            Status = status,
            ChangedByUserId = userId
        });
        await db.SaveChangesAsync();
    }

    private async Task AddNotificationAsync(int userId, string message)
    {
        db.Notifications.Add(new Notification { UserId = userId, Message = message });
        await db.SaveChangesAsync();
    }

    private async Task NotifyAdminsAsync(string message)
    {
        var admins = await db.Users.Where(u => u.Role == UserRole.Admin).Select(u => u.UserId).ToListAsync();
        foreach (var adminId in admins)
            await AddNotificationAsync(adminId, message);
    }
}
