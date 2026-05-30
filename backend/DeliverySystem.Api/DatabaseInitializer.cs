using DeliverySystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DeliverySystem.Api;

public sealed class DatabaseInitializer(IServiceScopeFactory scopeFactory, ILogger<DatabaseInitializer> logger)
    : IHostedService
{
    public Task StartAsync(CancellationToken cancellationToken)
    {
        // Do not block HTTP server — Railway healthcheck needs /health immediately.
        _ = InitializeAsync(cancellationToken);
        return Task.CompletedTask;
    }

    private async Task InitializeAsync(CancellationToken cancellationToken)
    {
        for (var attempt = 1; attempt <= 10; attempt++)
        {
            try
            {
                await using var scope = scopeFactory.CreateAsyncScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                using var timeout = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
                timeout.CancelAfter(TimeSpan.FromSeconds(30));

                await db.Database.MigrateAsync(timeout.Token);
                await DbSeeder.SeedAsync(db);
                logger.LogInformation("Database ready (attempt {Attempt}).", attempt);
                return;
            }
            catch (Exception ex) when (attempt < 10)
            {
                logger.LogWarning(ex, "Database init attempt {Attempt} failed; retrying...", attempt);
                await Task.Delay(TimeSpan.FromSeconds(5), cancellationToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Database init failed after all attempts. Update DATABASE_URL on Railway.");
            }
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
