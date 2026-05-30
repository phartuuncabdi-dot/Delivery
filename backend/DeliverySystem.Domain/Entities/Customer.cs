namespace DeliverySystem.Domain.Entities;

public class Customer
{
    public int CustomerId { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Email { get; set; }

    public User? User { get; set; }
    public ICollection<Order> Orders { get; set; } = [];
}
