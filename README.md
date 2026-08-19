Markdown
# ShopFlow - Plataforma de E-Commerce Fullstack

O **ShopFlow** é uma aplicação completa de e-commerce desenvolvida para gerenciamento e venda de produtos online. O sistema conta com um catálogo público de produtos, carrinho de compras interativo, checkout e um painel administrativo completo para controle de produtos, categorias e histórico de pedidos.

---

## Tecnologias Utilizadas

### **Backend (API)**
- **C# / .NET 8**: Desenvolvimento da API Web RESTful.
- **Entity Framework Core**: ORM para mapeamento e manipulação do banco de dados.
- **ASP.NET Core Identity / JWT**: Autenticação e autorização com suporte a cargos (`Admin`, `Customer`).
- **Swagger / OpenAPI**: Documentação interativa dos endpoints da API.

### **Frontend (Web)**
- **React 18** + **TypeScript**: Construção da interface com tipagem estática e reatividade.
- **Vite**: Ferramenta de build rápida para o ambiente frontend.
- **Tailwind CSS**: Estilização moderna e responsiva baseada em utilitários.
- **Axios**: Cliente HTTP para consumo da API REST.
- **Lucide React**: Biblioteca de ícones.

---

## Funcionalidades

### **Área da Loja (Cliente)**
- **Catálogo de Produtos**: Visualização de produtos em destaque com filtro por categorias.
- **Carrinho de Compras**: Adição/remoção de itens e ajuste de quantidades com cálculo do total em tempo real.
- **Checkout de Pedidos**: Finalização da compra integrando diretamente com a API.
- **Autenticação**: Login e cadastro de usuários.

### **Painel Administrativo (Admin)**
- **Gerenciamento de Produtos (CRUD)**: Cadastrar novos produtos associando a categorias e excluir itens do catálogo.
- **Seleção Dinâmica de Categorias**: Carregamento de categorias direto do banco de dados via API.
- **Histórico de Pedidos**: Acompanhamento de todos os pedidos realizados na plataforma com detalhes dos itens e totais.

---

## Arquitetura e Estrutura do Projeto

O repositório é estruturado no formato *Monorepo*, contendo o código da API e da interface web na mesma estrutura:

```text
ShopFlow/
├── backend/            # API RESTful em C# / .NET 8
│   ├── Controllers/    # Endpoints da aplicação (Products, Orders, Categories, Auth)
│   ├── Data/           # Contexto do EF Core (AppDbContext)
│   ├── DTOs/           # Objetos de transferência de dados (Request/Response)
│   ├── Entities/       # Modelos de domínio (Product, Category, Order, OrderItem)
│   └── Services/       # Serviços de autenticação e regras de negócio
└── frontend/           # Aplicação Web em React + TypeScript
    ├── src/
    │   ├── components/ # Componentes visuais e painel Admin (AdminDashboard, etc.)
    │   ├── context/    # Contextos do React (CartContext, AuthContext)
    │   ├── services/   # Configuração e chamadas do Axios (api.ts)
    │   └── types/      # Definições de interfaces TypeScript
    └── ...
```
Como Executar o Projeto Localmente
Pré-requisitos
.NET 8 SDK instalado.

Node.js (versão 18 ou superior) e npm instalados.

Git instalado.

1. Clonar o Repositório
```
git clone [https://github.com/Pablo-lara/Projeto-Ecommerce-ShopFlow.git](https://github.com/Pablo-lara/Projeto-Ecommerce-ShopFlow.git)
cd Projeto-Ecommerce-ShopFlow
```
2. Executar o Backend (.NET API)
Navegue até a pasta do backend:
```
Bash
cd backend # ou na pasta onde está o ShopFlow.API.csproj
Restaure as dependências e execute as migrações do banco de dados (se aplicável):
```
```
Bash
dotnet restore
dotnet ef database update
```
Inicie o servidor da API:
```
Bash
dotnet run
```
A API estará rodando por padrão em http://localhost:XXXX (ou na porta configurada no launchSettings.json).

3. Executar o Frontend (React)
Em um novo terminal, navegue até a pasta do frontend:
```
Bash
cd frontend # ou shopflow-web
```
Instale as dependências:
```
Bash
npm install
```
Execute a aplicação em modo de desenvolvimento:
```
Bash
npm run dev
```
Abra o navegador no endereço indicado pelo Vite.
