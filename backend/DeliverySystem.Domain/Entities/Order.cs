namespace DeliverySystem.Domain.Entities;

public class Order
{
    public int OrderId { get; set; }
    public int CustomerId { get; set; }
    public int? DriverId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string DeliveryAddress { get; set; } = string.Empty;
    public DateTime? ScheduledDate { get; set; }
    public string Status { get; set; } = Domain.Enums.OrderStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public Customer? Customer { get; set; }
    public Driver? Driver { get; set; }
    public ICollection<Payment> Payments { get; set; } = [];
    public ICollection<OrderStatusHistory> StatusHistory { get; set; } = [];
}
