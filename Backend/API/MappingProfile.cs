using AutoMapper;
using Domain.Entities;
using API.Models;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<CreateOrderDto, SalesOrder>();
        CreateMap<OrderItemDto, SalesOrderItem>();
    }
}