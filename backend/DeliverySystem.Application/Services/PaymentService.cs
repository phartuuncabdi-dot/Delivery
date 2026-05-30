using DeliverySystem.Application.DTOs;
using DeliverySystem.Application.Interfaces;
using DeliverySystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DeliverySystem.Application.Services;

public class PaymentService(AppDbContext db) : IPaymentService
{
    public async Task<PaymentResponse> CreatePaymentAsync(int userId, CreatePaymentRequest request)
    {
        var order = await db.Orders.Include(o => o.Customer)
            .FirstOrDefaultAsync(o => o.OrderId == request.OrderId)
            ?? throw new KeyNotFoundException("Order not found.");

        var customer = await db.Customers.FirstOrDefaultAsync(c => c.UserId == userId);
        if (customer == null || order.CustomerId != customer.CustomerId)
            throw new UnauthorizedAccessException("You can only pay for your own orders.");

        var payment = new Domain.Entities.Payment
        {
            OrderId = request.OrderId,
            Amount = request.Amount,
            PaymentMethod = request.PaymentMethod,
            Status = "Paid"
        };

        db.Payments.Add(payment);
        await db.SaveChangesAsync();

        return new PaymentResponse(
            payment.PaymentId,
            payment.OrderId,
            payment.Amount,
            payment.PaymentMethod,
            payment.Status,
            payment.PaymentDate);
    }

    public async Task<IEnumerable<PaymentResponse>> GetPaymentsByOrderAsync(int orderId) =>
        await db.Payments
            .Where(p => p.OrderId == orderId)
            .Select(p => new PaymentResponse(
                p.PaymentId,
                p.OrderId,
                p.Amount,
                p.PaymentMethod,
                p.Status,
                p.PaymentDate))
            .ToListAsync();
}
