using DeliverySystem.Application.DTOs;

namespace DeliverySystem.Application.Interfaces;

public interface IAdminService
{
    Task<IEnumerable<CustomerResponse>> GetCustomersAsync();
    Task<IEnumerable<DriverResponse>> GetDriversAsync();
    Task<DriverResponse> CreateDriverAsync(CreateDriverRequest request);
    Task<IEnumerable<DeliveryReportItem>> GetDeliveryReportAsync();
    Task<IEnumerable<CustomerReportItem>> GetCustomerReportAsync();
}
