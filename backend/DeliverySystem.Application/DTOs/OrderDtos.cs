namespace DeliverySystem.Application.DTOs;

public record CreateOrderRequest(
    string ProductName,
    int Quantity,
    string DeliveryAddress,
    DateTime? ScheduledDate);

public record AssignDriverRequest(int DriverId);

public record UpdateOrderStatusRequest(string Status);

public record OrderResponse(
    int OrderId,
    int CustomerId,
    string CustomerName,
    int? DriverId,
    string? DriverName,
    string ProductName,
    int Quantity,
    string DeliveryAddress,
    DateTime? ScheduledDate,
    string Status,
    DateTime CreatedAt);
