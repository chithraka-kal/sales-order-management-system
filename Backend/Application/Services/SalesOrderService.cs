using Application.Interfaces;
using Domain.Entities;

namespace Application.Services
{
    public class SalesOrderService : ISalesOrderService
    {
        private readonly ISalesOrderRepository _repository;

        public SalesOrderService(ISalesOrderRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<SalesOrder>> GetAllOrdersAsync() => await _repository.GetAllAsync();
        public async Task<SalesOrder?> GetOrderByIdAsync(int id) => await _repository.GetByIdAsync(id);
        public async Task<List<Customer>> GetCustomersAsync() => await _repository.GetCustomersAsync();
        public async Task<List<Item>> GetItemsAsync() => await _repository.GetItemsAsync();

        public async Task<SalesOrder> CreateOrderAsync(SalesOrder order)
        {
            // Business Logic
            CalculateTotals(order);
            await _repository.AddAsync(order);
            return order;
        }

        public async Task UpdateOrderAsync(int id, SalesOrder order)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) throw new KeyNotFoundException("Order not found");

            
            existing.InvoiceNo = order.InvoiceNo;
            existing.InvoiceDate = order.InvoiceDate;
            existing.CustomerId = order.CustomerId;
            
            
            existing.Items = order.Items;
            

            CalculateTotals(existing);
            
            await _repository.UpdateAsync(existing);
        }

        private void CalculateTotals(SalesOrder order)
        {
            foreach (var item in order.Items)
            {
                item.ExclAmount = item.Qty * item.Price;
                item.TaxAmount = item.ExclAmount * (item.TaxRate / 100);
                item.InclAmount = item.ExclAmount + item.TaxAmount;
            }
            order.TotalExcl = order.Items.Sum(i => i.ExclAmount);
            order.TotalTax = order.Items.Sum(i => i.TaxAmount);
            order.TotalIncl = order.Items.Sum(i => i.InclAmount);
        }
    }
}