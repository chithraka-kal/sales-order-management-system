using Domain.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SalesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/sales/init
        // Seeds the database with dummy data if empty (For testing)
        [HttpGet("init")]
        public async Task<ActionResult<string>> Initialize()
        {
            if (!_context.Customers.Any())
            {
                _context.Customers.AddRange(
                    new Customer { Name = "Tech Solutions", Address1 = "123 Main St", City = "Colombo" },
                    new Customer { Name = "Alpha Inc", Address1 = "45 Ind. Zone", City = "Kandy" }
                );
                _context.Items.AddRange(
                    new Item { Code = "ITM001", Description = "Laptop Dell", Price = 150000 },
                    new Item { Code = "ITM002", Description = "Mouse Wireless", Price = 2500 }
                );
                await _context.SaveChangesAsync();
                return "Database Seeded!";
            }
            return "Database already has data.";
        }

        [cite_start]// GET: api/sales/customers (Screen 1 Dropdown) [cite: 89]
        [HttpGet("customers")]
        public async Task<ActionResult<List<Customer>>> GetCustomers()
        {
            return await _context.Customers.ToListAsync();
        }

        [cite_start]// GET: api/sales/items (Screen 1 Dropdown) [cite: 92]
        [HttpGet("items")]
        public async Task<ActionResult<List<Item>>> GetItems()
        {
            return await _context.Items.ToListAsync();
        }

        [cite_start]// POST: api/sales (Screen 1 Save) [cite: 104]
        [HttpPost]
        public async Task<ActionResult<SalesOrder>> CreateOrder(SalesOrder order)
        {
            // Simple validation
            if (order.Items == null || order.Items.Count == 0)
                return BadRequest("Order must have items.");

            _context.SalesOrders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, order);
        }

        [cite_start]// GET: api/sales (Screen 2 List) [cite: 122]
        [HttpGet]
        public async Task<ActionResult<List<SalesOrder>>> GetOrders()
        {
            return await _context.SalesOrders
                .Include(o => o.Customer) // JOIN Customer table
                .OrderByDescending(o => o.InvoiceDate)
                .ToListAsync();
        }
    }
}