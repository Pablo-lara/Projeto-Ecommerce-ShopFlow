namespace ShopFlow.Api.DTOs;

// Auth
public record RegisterDto(string Name, string Email, string Password, string? Role);
public record LoginDto(string Email, string Password);
public record AuthResponseDto(string Token, string Name, string Email, string Role);

// Products
public record ProductDto(int Id, string Name, string Description, decimal Price, int StockQuantity, string ImageUrl, string CategoryName);
public record CreateProductDto(string Name, string Description, decimal Price, int StockQuantity, string ImageUrl, int CategoryId);

// Orders & Checkout
public record OrderItemDto(int ProductId, int Quantity);
public record CreateOrderDto(List<OrderItemDto> Items);

public record PaymentRequestDto(int OrderId);
public record WebhookNotificationDto(string TransactionId, string Status);