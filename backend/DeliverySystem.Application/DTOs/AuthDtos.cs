namespace DeliverySystem.Application.DTOs;

public record RegisterRequest(
    string Email,
    string Password,
    string Name,
    string? Phone,
    string? Address,
    string Role);

public record LoginRequest(string Email, string Password);

public record AuthResponse(string Token, string Email, string Role, int UserId);
