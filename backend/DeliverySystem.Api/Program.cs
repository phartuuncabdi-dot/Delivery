using System.Text;
using DeliverySystem.Api;
using DeliverySystem.Application.Interfaces;
using DeliverySystem.Application.Services;
using DeliverySystem.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
// Railway injects PORT; must match what the proxy healthcheck hits (ignore fixed :8080 in Docker).
Environment.SetEnvironmentVariable("ASPNETCORE_URLS", $"http://0.0.0.0:{port}");

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var connectionString = DatabaseConnectionResolver.Resolve(builder.Configuration);
if (string.IsNullOrWhiteSpace(connectionString))
{
    Console.Error.WriteLine(
        "WARNING: DATABASE_URL / ConnectionStrings__DefaultConnection not set. Set Neon URI on Railway.");
}
else
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(connectionString, npgsql => npgsql.CommandTimeout(60)));
    builder.Services.AddHostedService<DatabaseInitializer>();
}

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<ITokenService, TokenService>();

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? "DeliverySystemSecretKey2026SchoolProject!";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy
        .SetIsOriginAllowed(origin =>
        {
            if (string.IsNullOrEmpty(origin)) return false;
            if (origin.StartsWith("http://localhost:", StringComparison.OrdinalIgnoreCase)) return true;
            if (origin.EndsWith(".vercel.app", StringComparison.OrdinalIgnoreCase)) return true;
            return false;
        })
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();

static void ApplyCorsHeaders(HttpContext context)
{
    var origin = context.Request.Headers.Origin.ToString();
    if (string.IsNullOrEmpty(origin)) return;
    if (origin.StartsWith("http://localhost:", StringComparison.OrdinalIgnoreCase)
        || origin.EndsWith(".vercel.app", StringComparison.OrdinalIgnoreCase))
    {
        context.Response.Headers.AccessControlAllowOrigin = origin;
        context.Response.Headers.AccessControlAllowMethods = "GET, POST, PUT, DELETE, OPTIONS";
        context.Response.Headers.AccessControlAllowHeaders = "Content-Type, Authorization";
    }
}

app.Use(async (context, next) =>
{
    ApplyCorsHeaders(context);
    if (HttpMethods.IsOptions(context.Request.Method))
    {
        context.Response.StatusCode = StatusCodes.Status204NoContent;
        return;
    }
    await next();
});

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        ApplyCorsHeaders(context);
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { message = "Server error. Check Railway logs and database connection." });
    });
});

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));
app.MapGet("/health/db", async (IServiceProvider sp) =>
{
    if (string.IsNullOrWhiteSpace(connectionString))
    {
        return Results.Json(new
        {
            status = "unhealthy",
            database = "DATABASE_URL not configured on Railway",
            hint = "Railway → your backend service → Variables → RAW Editor → add DATABASE_URL (Neon URI)",
            envCheck = new
            {
                DATABASE_URL = string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DATABASE_URL")) ? "missing" : "set",
                ConnectionStrings__DefaultConnection = string.IsNullOrEmpty(Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")) ? "missing" : "set"
            }
        }, statusCode: 503);
    }

    var dbInfo = DatabaseConnectionResolver.Describe(connectionString);
    try
    {
        await using var scope = sp.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        if (!await db.Database.CanConnectAsync())
        {
            return Results.Json(new
            {
                status = "unhealthy",
                database = "cannot connect",
                hint = "Reset Neon password, copy DATABASE_URL, paste on Railway, redeploy.",
                config = dbInfo
            }, statusCode: 503);
        }

        var pending = await db.Database.GetPendingMigrationsAsync();
        var userCount = await db.Users.CountAsync();
        return Results.Ok(new
        {
            status = "healthy",
            database = "connected",
            pendingMigrations = pending.Count(),
            users = userCount,
            config = dbInfo
        });
    }
    catch (Exception ex)
    {
        return Results.Json(new
        {
            status = "unhealthy",
            database = ex.Message,
            config = dbInfo
        }, statusCode: 503);
    }
});
app.MapControllers();

app.Run();
