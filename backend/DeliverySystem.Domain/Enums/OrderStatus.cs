namespace DeliverySystem.Domain.Enums;

public static class OrderStatus
{
    public const string Pending = "Pending";
    public const string Assigned = "Assigned";
    public const string PickedUp = "PickedUp";
    public const string InTransit = "InTransit";
    public const string Delivered = "Delivered";
    public const string Cancelled = "Cancelled";

    public static readonly string[] All =
    [
        Pending, Assigned, PickedUp, InTransit, Delivered, Cancelled
    ];
}
