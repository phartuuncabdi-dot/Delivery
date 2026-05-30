namespace DeliverySystem.Domain.Entities;

public class Driver
{
    public int DriverId { get; set; }
    public int UserId { get; set; }
    public string DriverName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? VehicleType { get; set; }
    public bool IsAvailable { get; set; } = true;

    public User? User { get; set; }
    public ICollection<Order> Orders { get; set; } = [];
}
