namespace DeliverySystem.Domain.Entities;

public class OrderStatusHistory
{
    public int HistoryId { get; set; }
    public int OrderId { get; set; }
    public string Status { get; set; } = string.Empty;
    public int? ChangedByUserId { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    public Order? Order { get; set; }
}
