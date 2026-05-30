namespace DeliverySystem.Domain.Entities;

public class Payment
{
    public int PaymentId { get; set; }
    public int OrderId { get; set; }
    public decimal Amount { get; set; }
    public string? PaymentMethod { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

    public Order? Order { get; set; }
}
