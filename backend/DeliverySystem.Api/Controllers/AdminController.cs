using System.Security.Claims;
using DeliverySystem.Application.DTOs;
using DeliverySystem.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DeliverySystem.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController(IAdminService adminService, IOrderService orderService) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("customers")]
    public async Task<IActionResult> GetCustomers() =>
        Ok(await adminService.GetCustomersAsync());

    [HttpGet("drivers")]
    public async Task<IActionResult> GetDrivers() =>
        Ok(await adminService.GetDriversAsync());

    [HttpPost("drivers")]
    public async Task<IActionResult> CreateDriver([FromBody] CreateDriverRequest request)
    {
        try
        {
            return Ok(await adminService.CreateDriverAsync(request));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders() =>
        Ok(await orderService.GetAllOrdersAsync());

    [HttpPut("orders/{id:int}/assign-driver")]
    public async Task<IActionResult> AssignDriver(int id, [FromBody] AssignDriverRequest request)
    {
        try
        {
            var result = await orderService.AssignDriverAsync(id, request, UserId);
            return result == null ? NotFound() : Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("orders/{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        try
        {
            var result = await orderService.UpdateStatusAsync(id, request, UserId, "Admin");
            return result == null ? NotFound() : Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("reports/deliveries")]
    public async Task<IActionResult> DeliveryReport() =>
        Ok(await adminService.GetDeliveryReportAsync());

    [HttpGet("reports/customers")]
    public async Task<IActionResult> CustomerReport() =>
        Ok(await adminService.GetCustomerReportAsync());
}
