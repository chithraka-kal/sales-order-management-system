using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class SalesOrderRepository : ISalesOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public SalesOrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<SalesOrder>> GetAllAsync()
        {
            return await _context.SalesOrders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.InvoiceDate)
                .ToListAsync();
        }

        public async Task<SalesOrder?> GetByIdAsync(int id)
        {
            return await _context.SalesOrders
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task AddAsync(SalesOrder order)
        {
            _context.SalesOrders.Add(order);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(SalesOrder order)
        {
            
            _context.SalesOrders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Customer>> GetCustomersAsync() => await _context.Customers.ToListAsync();
        public async Task<List<Item>> GetItemsAsync() => await _context.Items.ToListAsync();
    }
}