using DeliverySystem.Application.DTOs;

namespace DeliverySystem.Application.Interfaces;

public interface IOrderService
{
    Task<OrderResponse> CreateOrderAsync(int userId, CreateOrderRequest request);
    Task<OrderResponse?> GetOrderAsync(int orderId);
    Task<IEnumerable<OrderResponse>> GetMyOrdersAsync(int userId);
    Task<IEnumerable<OrderResponse>> GetAllOrdersAsync();
    Task<OrderResponse?> AssignDriverAsync(int orderId, AssignDriverRequest request, int adminUserId);
    Task<OrderResponse?> UpdateStatusAsync(int orderId, UpdateOrderStatusRequest request, int userId, string role);
    Task<IEnumerable<OrderResponse>> GetDriverAssignmentsAsync(int userId);
}
