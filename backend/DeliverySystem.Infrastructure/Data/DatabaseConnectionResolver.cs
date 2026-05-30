using Microsoft.Extensions.Configuration;
using Npgsql;

namespace DeliverySystem.Infrastructure.Data;

public static class DatabaseConnectionResolver
{
    public static string? Resolve(IConfiguration configuration)
    {
        var candidates = new[]
        {
            configuration.GetConnectionString("DefaultConnection"),
            Environment.GetEnvironmentVariable("DATABASE_URL"),
            Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection"),
            BuildFromPgEnvVars()
        };

        foreach (var raw in candidates)
        {
            if (string.IsNullOrWhiteSpace(raw)) continue;
            return Normalize(raw);
        }

        return null;
    }

    public static string Normalize(string connectionString)
    {
        var trimmed = connectionString.Trim().Trim('"').Trim('\'');

        var builder = trimmed.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase)
                      || trimmed.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase)
            ? new NpgsqlConnectionStringBuilder(trimmed)
            : new NpgsqlConnectionStringBuilder { ConnectionString = trimmed };

        builder.SslMode = SslMode.Require;
        if (builder.Timeout == 0) builder.Timeout = 30;
        if (builder.CommandTimeout == 0) builder.CommandTimeout = 60;

        return builder.ConnectionString;
    }

    public static object Describe(string connectionString)
    {
        var b = new NpgsqlConnectionStringBuilder(connectionString);
        return new
        {
            host = b.Host,
            database = b.Database,
            username = b.Username,
            sslMode = b.SslMode.ToString(),
            timeout = b.Timeout
        };
    }

    private static string? BuildFromPgEnvVars()
    {
        var host = Environment.GetEnvironmentVariable("PGHOST");
        var user = Environment.GetEnvironmentVariable("PGUSER");
        var password = Environment.GetEnvironmentVariable("PGPASSWORD");
        var database = Environment.GetEnvironmentVariable("PGDATABASE") ?? "neondb";

        if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(user)) return null;

        return new NpgsqlConnectionStringBuilder
        {
            Host = host,
            Username = user,
            Password = password,
            Database = database,
            SslMode = SslMode.Require,
            Timeout = 30,
            CommandTimeout = 60
        }.ConnectionString;
    }
}
