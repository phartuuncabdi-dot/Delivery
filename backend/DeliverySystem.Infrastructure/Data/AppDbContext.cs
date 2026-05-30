using DeliverySystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DeliverySystem.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Driver> Drivers => Set<Driver>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<OrderStatusHistory> OrderStatusHistories => Set<OrderStatusHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(x => x.UserId);
            e.HasIndex(x => x.Email).IsUnique();
        });

        modelBuilder.Entity<Customer>(e =>
        {
            e.HasKey(x => x.CustomerId);
            e.HasOne(x => x.User).WithOne(x => x.Customer)
                .HasForeignKey<Customer>(x => x.UserId);
        });

        modelBuilder.Entity<Driver>(e =>
        {
            e.HasKey(x => x.DriverId);
            e.HasOne(x => x.User).WithOne(x => x.Driver)
                .HasForeignKey<Driver>(x => x.UserId);
        });

        modelBuilder.Entity<Order>(e =>
        {
            e.HasKey(x => x.OrderId);
            e.HasOne(x => x.Customer).WithMany(x => x.Orders)
                .HasForeignKey(x => x.CustomerId);
            e.HasOne(x => x.Driver).WithMany(x => x.Orders)
                .HasForeignKey(x => x.DriverId)
                .IsRequired(false);
        });

        modelBuilder.Entity<Payment>(e =>
        {
            e.HasKey(x => x.PaymentId);
            e.Property(x => x.Amount).HasPrecision(18, 2);
        });

        modelBuilder.Entity<Notification>().HasKey(x => x.NotificationId);
        modelBuilder.Entity<OrderStatusHistory>().HasKey(x => x.HistoryId);
    }
}
