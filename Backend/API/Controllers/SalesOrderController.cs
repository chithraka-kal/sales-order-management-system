using API.Models; 
using AutoMapper; 
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
        private readonly IMapper _mapper; 

        public SalesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/sales/init
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
                    new Item { Code = "ITM002", Description = "Mouse Wireless", Price = 2500 },
                    new Item { Code = "ITM003", Description = "Mechanical Keyboard", Price = 8000 }
                );
                await _context.SaveChangesAsync();
                return "Database Seeded!";
            }
            return "Database already has data.";
        }

        // GET: api/sales/customers
        [HttpGet("customers")]
        public async Task<ActionResult<List<Customer>>> GetCustomers()
        {
            return await _context.Customers.ToListAsync();
        }

        // GET: api/sales/items
        [HttpGet("items")]
        public async Task<ActionResult<List<Item>>> GetItems()
        {
            return await _context.Items.ToListAsync();
        }

        // GET: api/sales/5 (New: For Edit Screen)
        [HttpGet("{id}")]
        public async Task<ActionResult<SalesOrder>> GetOrder(int id)
        {
            var order = await _context.SalesOrders
                .Include(o => o.Customer)
                .Include(o => o.Items) // Must include items so you can edit them
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();

            return order;
        }

        // PUT: api/sales/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, CreateOrderDto dto)
        {
            var existingOrder = await _context.SalesOrders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (existingOrder == null) return NotFound();

            // 1. Update Header
            existingOrder.InvoiceNo = dto.InvoiceNo;
            existingOrder.InvoiceDate = dto.InvoiceDate;
            existingOrder.CustomerId = dto.CustomerId;

            // 2. Update Items (Simplest approach: Remove old, add new)
            _context.SalesOrderItems.RemoveRange(existingOrder.Items);
            
            var newItems = _mapper.Map<List<SalesOrderItem>>(dto.Items);
            
            // Recalculate Totals
            foreach (var item in newItems)
            {
                item.ExclAmount = item.Qty * item.Price;
                item.TaxAmount = item.ExclAmount * (item.TaxRate / 100);
                item.InclAmount = item.ExclAmount + item.TaxAmount;
            }
            
            existingOrder.Items = newItems;
            existingOrder.TotalExcl = newItems.Sum(i => i.ExclAmount);
            existingOrder.TotalTax = newItems.Sum(i => i.TaxAmount);
            existingOrder.TotalIncl = newItems.Sum(i => i.InclAmount);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/sales (Updated: Uses DTO + AutoMapper)
        [HttpPost]
        public async Task<ActionResult<SalesOrder>> CreateOrder(CreateOrderDto dto)
        {
            // 1. Convert DTO to Entity using AutoMapper
            var order = _mapper.Map<SalesOrder>(dto);

            // 2. Server-Side Calculation (Security Best Practice)
            // We trust the Items/Qty/Price/TaxRate, but WE calculate the totals.
            foreach (var item in order.Items)
            {
                item.ExclAmount = item.Qty * item.Price;
                item.TaxAmount = item.ExclAmount * (item.TaxRate / 100);
                item.InclAmount = item.ExclAmount + item.TaxAmount;
            }

            // 3. Calculate Header Totals
            order.TotalExcl = order.Items.Sum(i => i.ExclAmount);
            order.TotalTax = order.Items.Sum(i => i.TaxAmount);
            order.TotalIncl = order.Items.Sum(i => i.InclAmount);

            // 4. Save to DB
            _context.SalesOrders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        // GET: api/sales (List for Home Screen)
        [HttpGet]
        public async Task<ActionResult<List<SalesOrder>>> GetOrders()
        {
            return await _context.SalesOrders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.InvoiceDate)
                .ToListAsync();
        }
    }
}