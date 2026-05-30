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
            try
            {
                return Normalize(raw);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Invalid database connection value: {ex.Message}");
            }
        }

        return null;
    }

    public static string Normalize(string connectionString)
    {
        var trimmed = connectionString.Trim().Trim('"').Trim('\'');

        if (trimmed.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase)
            || trimmed.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
        {
            return FromPostgresUri(trimmed).ConnectionString;
        }

        var builder = new NpgsqlConnectionStringBuilder { ConnectionString = trimmed };
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

    private static NpgsqlConnectionStringBuilder FromPostgresUri(string uri)
    {
        // Railway may truncate at '&' — drop unsupported query params before parsing.
        var cleaned = uri;
        var ampIndex = cleaned.IndexOf('&', StringComparison.Ordinal);
        if (ampIndex >= 0)
            cleaned = cleaned[..ampIndex];

        // Fix truncated "?sslmode" without "=require" (also caused by '&' split).
        if (cleaned.EndsWith("?sslmode", StringComparison.OrdinalIgnoreCase))
            cleaned += "=require";

        var parsed = new Uri(cleaned);
        var userParts = parsed.UserInfo.Split(':', 2);

        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = parsed.Host,
            Port = parsed.Port > 0 ? parsed.Port : 5432,
            Username = Uri.UnescapeDataString(userParts[0]),
            Password = userParts.Length > 1 ? Uri.UnescapeDataString(userParts[1]) : string.Empty,
            Database = parsed.AbsolutePath.TrimStart('/').Split('?')[0],
            SslMode = SslMode.Require,
            Timeout = 30,
            CommandTimeout = 60
        };

        var query = parsed.Query.TrimStart('?');
        if (!string.IsNullOrEmpty(query))
        {
            foreach (var part in query.Split('&', StringSplitOptions.RemoveEmptyEntries))
            {
                var kv = part.Split('=', 2);
                if (kv.Length != 2) continue;
                if (kv[0].Equals("sslmode", StringComparison.OrdinalIgnoreCase)
                    && Enum.TryParse<SslMode>(kv[1], true, out var ssl))
                {
                    builder.SslMode = ssl;
                }
            }
        }

        return builder;
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
