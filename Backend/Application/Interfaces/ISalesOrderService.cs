using Domain.Entities;

namespace Application.Interfaces
{
    public interface ISalesOrderService
    {
        Task<List<SalesOrder>> GetAllOrdersAsync();
        Task<SalesOrder?> GetOrderByIdAsync(int id);
        Task<SalesOrder> CreateOrderAsync(SalesOrder order);
        Task UpdateOrderAsync(int id, SalesOrder order);
        Task<List<Customer>> GetCustomersAsync();
        Task<List<Item>> GetItemsAsync();
    }
}