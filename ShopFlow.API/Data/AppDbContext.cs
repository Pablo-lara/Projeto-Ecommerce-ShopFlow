using Microsoft.EntityFrameworkCore;
using ShopFlow.Api.Entities;


namespace ShopFlow.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. Seed de Categorias
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Geral" },
            new Category { Id = 2, Name = "Eletrônicos" }
        );

        // 2. Seed de Produtos (já existentes)
        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                Id = 1,
                Name = "Mouse Gamer RGB",
                Description = "Mouse óptico de alta precisão 16000 DPI",
                Price = 149.90m,
                StockQuantity = 25,
                ImageUrl = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
                CategoryId = 2
            },
            new Product
            {
                Id = 2,
                Name = "Teclado Mecânico Wireless",
                Description = "Teclado mecânico switch blue com retroiluminação",
                Price = 389.00m,
                StockQuantity = 10,
                ImageUrl = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
                CategoryId = 2
            }
        );
    }
}