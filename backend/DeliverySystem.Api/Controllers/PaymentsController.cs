using System.Security.Claims;
using DeliverySystem.Application.DTOs;
using DeliverySystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeliverySystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentsController(IPaymentService paymentService) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> Create([FromBody] CreatePaymentRequest request)
    {
        try
        {
            return Ok(await paymentService.CreatePaymentAsync(UserId, request));
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("order/{orderId:int}")]
    public async Task<IActionResult> ByOrder(int orderId) =>
        Ok(await paymentService.GetPaymentsByOrderAsync(orderId));
}
