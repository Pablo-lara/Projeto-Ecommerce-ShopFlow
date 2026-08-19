namespace ShopFlow.Api.Entities;

public enum OrderStatus
{
    Pending,
    Paid,
    Failed,
    Shipped,
    Canceled
}

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string? PaymentTransactionId { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}