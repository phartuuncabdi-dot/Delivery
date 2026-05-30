namespace DeliverySystem.Application.DTOs;

public record CreatePaymentRequest(int OrderId, decimal Amount, string? PaymentMethod);

public record PaymentResponse(
    int PaymentId,
    int OrderId,
    decimal Amount,
    string? PaymentMethod,
    string Status,
    DateTime PaymentDate);

public record CustomerResponse(
    int CustomerId,
    string Name,
    string? Phone,
    string? Address,
    string? Email,
    bool IsActive);

public record DriverResponse(
    int DriverId,
    string DriverName,
    string? Phone,
    string? VehicleType,
    bool IsAvailable);

public record CreateDriverRequest(
    string Email,
    string Password,
    string DriverName,
    string? Phone,
    string? VehicleType);

public record NotificationResponse(
    int NotificationId,
    string Message,
    bool IsRead,
    DateTime CreatedAt);

public record DeliveryReportItem(
    int OrderId,
    string CustomerName,
    string? DriverName,
    string ProductName,
    string Status,
    DateTime CreatedAt);

public record CustomerReportItem(
    int CustomerId,
    string Name,
    string? Email,
    int TotalOrders);
