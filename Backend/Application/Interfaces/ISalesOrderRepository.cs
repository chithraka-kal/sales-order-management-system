using Domain.Entities;

namespace Application.Interfaces
{
    public interface ISalesOrderRepository
    {
        Task<List<SalesOrder>> GetAllAsync();
        Task<SalesOrder?> GetByIdAsync(int id);
        Task AddAsync(SalesOrder order);
        Task UpdateAsync(SalesOrder order);
        Task<List<Customer>> GetCustomersAsync();
        Task<List<Item>> GetItemsAsync();
    }
}