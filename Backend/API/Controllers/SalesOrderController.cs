using API.Models;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly ISalesOrderService _service; // Inject Service
        private readonly IMapper _mapper; // Inject Mapper

        public SalesController(ISalesOrderService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        // GET: api/sales/customers
        [HttpGet("customers")]
        public async Task<ActionResult<List<Customer>>> GetCustomers() => await _service.GetCustomersAsync();

        // GET: api/sales/items
        [HttpGet("items")]
        public async Task<ActionResult<List<Item>>> GetItems() => await _service.GetItemsAsync();

        // GET: api/sales
        [HttpGet]
        public async Task<ActionResult<List<SalesOrder>>> GetOrders() => await _service.GetAllOrdersAsync();

        // GET: api/sales/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SalesOrder>> GetOrder(int id)
        {
            var order = await _service.GetOrderByIdAsync(id);
            if (order == null) return NotFound();
            return order;
        }

        // POST: api/sales
        [HttpPost]
        public async Task<ActionResult<SalesOrder>> CreateOrder(CreateOrderDto dto)
        {
            // Controller handles Mapping 
            var order = _mapper.Map<SalesOrder>(dto);
            
            // Service handles Logic & Saving
            var createdOrder = await _service.CreateOrderAsync(order);
            
            return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.Id }, createdOrder);
        }

        // PUT: api/sales/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, CreateOrderDto dto)
        {
            var order = _mapper.Map<SalesOrder>(dto);
            try 
            {
                await _service.UpdateOrderAsync(id, order);
                return NoContent();
            }
            catch (KeyNotFoundException) 
            {
                return NotFound();
            }
        }
    }
}