using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopFlow.Api.Data;
using ShopFlow.Api.DTOs;
using ShopFlow.Api.Entities;

namespace ShopFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly AppDbContext _context;

    public PaymentController(AppDbContext context)
    {
        _context = context;
    }

    // POST /api/payment/create - Gera o Pedido e simula o payload de pagamento
    [HttpPost("create")]
    [Authorize]
    public async Task<IActionResult> CreatePayment([FromBody] CreateOrderDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

        int userId = int.Parse(userIdClaim);

        if (dto.Items == null || !dto.Items.Any())
            return BadRequest(new { message = "O carrinho não pode estar vazio." });

        var orderItems = new List<OrderItem>();
        decimal totalAmount = 0;

        foreach (var item in dto.Items)
        {
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product == null)
                return BadRequest(new { message = $"Produto ID {item.ProductId} não encontrado." });

            if (product.StockQuantity < item.Quantity)
                return BadRequest(new { message = $"Estoque insuficiente para o produto: {product.Name}" });

            decimal itemTotal = product.Price * item.Quantity;
            totalAmount += itemTotal;

            orderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPrice = product.Price
            });
        }

        var order = new Order
        {
            UserId = userId,
            TotalAmount = totalAmount,
            Status = OrderStatus.Pending,
            PaymentTransactionId = "TX_" + Guid.NewGuid().ToString("N")[..12].ToUpper(),
            Items = orderItems
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            orderId = order.Id,
            transactionId = order.PaymentTransactionId,
            totalAmount = order.TotalAmount,
            status = order.Status.ToString(),
            qrCodePixSimulated = $"00020126360014BR.GOV.BCB.PIX0114+551199999999520400005303986540{order.TotalAmount:F2}5802BR5913SHOPFLOW_STORE"
        });
    }

    // POST /api/payment/webhook - Recebe a notificação de pagamento do Gateway fictício
    [HttpPost("webhook")]
    public async Task<IActionResult> PaymentWebhook([FromBody] WebhookNotificationDto dto)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.PaymentTransactionId == dto.TransactionId);

        if (order == null)
            return NotFound(new { message = "Transação não encontrada." });

        if (order.Status == OrderStatus.Paid)
            return Ok(new { message = "Este pedido já foi processado anteriormente." });

        if (dto.Status.ToUpper() == "APPROVED" || dto.Status.ToUpper() == "PAID")
        {
            order.Status = OrderStatus.Paid;

            // Baixa no estoque
            foreach (var item in order.Items)
            {
                item.Product.StockQuantity -= item.Quantity;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Pagamento aprovado e estoque atualizado com sucesso!", orderId = order.Id });
        }

        order.Status = OrderStatus.Failed;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Status de pagamento atualizado para Falhou.", orderId = order.Id });
    }
}