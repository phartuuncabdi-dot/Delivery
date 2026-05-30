using DeliverySystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DeliverySystem.Api;

public sealed class DatabaseInitializer(IServiceScopeFactory scopeFactory, ILogger<DatabaseInitializer> logger)
    : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        for (var attempt = 1; attempt <= 5; attempt++)
        {
            try
            {
                await using var scope = scopeFactory.CreateAsyncScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                using var timeout = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
                timeout.CancelAfter(TimeSpan.FromSeconds(45));

                await db.Database.MigrateAsync(timeout.Token);
                await DbSeeder.SeedAsync(db);
                logger.LogInformation("Database ready (attempt {Attempt}).", attempt);
                return;
            }
            catch (Exception ex) when (attempt < 5)
            {
                logger.LogWarning(ex, "Database init attempt {Attempt} failed; retrying...", attempt);
                await Task.Delay(TimeSpan.FromSeconds(4), cancellationToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Database init failed after {Attempt} attempts.", attempt);
            }
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
