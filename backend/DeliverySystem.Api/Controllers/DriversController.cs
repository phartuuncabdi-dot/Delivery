using System.Security.Claims;
using DeliverySystem.Application.DTOs;
using DeliverySystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeliverySystem.Api.Controllers;

[ApiController]
[Route("api/drivers")]
[Authorize(Roles = "Driver")]
public class DriversController(IOrderService orderService) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("assignments")]
    public async Task<IActionResult> Assignments() =>
        Ok(await orderService.GetDriverAssignmentsAsync(UserId));

    [HttpPut("orders/{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        try
        {
            var result = await orderService.UpdateStatusAsync(id, request, UserId, "Driver");
            return result == null ? NotFound() : Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("orders/{id:int}/complete")]
    public async Task<IActionResult> Complete(int id)
    {
        var result = await orderService.UpdateStatusAsync(
            id,
            new UpdateOrderStatusRequest("Delivered"),
            UserId,
            "Driver");
        return result == null ? NotFound() : Ok(result);
    }
}
