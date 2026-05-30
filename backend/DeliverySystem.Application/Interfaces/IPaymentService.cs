using DeliverySystem.Application.DTOs;

namespace DeliverySystem.Application.Interfaces;

public interface IPaymentService
{
    Task<PaymentResponse> CreatePaymentAsync(int userId, CreatePaymentRequest request);
    Task<IEnumerable<PaymentResponse>> GetPaymentsByOrderAsync(int orderId);
}
