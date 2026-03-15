# 🍕 Pizzaria Backend API

API RESTful desenvolvida em Node.js com TypeScript para gerenciamento completo de uma pizzaria, incluindo cadastro de usuários, categorias, produtos e controle de pedidos.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Requisitos](#-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Documentação](#-documentação)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Banco de Dados](#-banco-de-dados)
- [Autenticação](#-autenticação)
- [Upload de Arquivos](#-upload-de-arquivos)
- [Testando a API](#-testando-a-api)
- [Deploy](#-deploy)
- [Contribuindo](#-contribuindo)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Sobre o Projeto

Sistema backend completo para gerenciamento de pizzaria com as seguintes funcionalidades:

- ✅ Autenticação de usuários com JWT
- ✅ Cadastro e listagem de categorias
- ✅ Cadastro de produtos com upload de imagens
- ✅ Criação e gerenciamento de pedidos
- ✅ Controle de itens do pedido
- ✅ Fluxo completo: rascunho → em andamento → finalizado

---

## 🚀 Tecnologias

### Core

- [Node.js](https://nodejs.org/) - Runtime JavaScript
- [TypeScript](https://www.typescriptlang.org/) - Superset tipado
- [Express](https://expressjs.com/) - Framework web

### Database & ORM

- [PostgreSQL](https://www.postgresql.org/) - Banco de dados
- [Prisma](https://www.prisma.io/) - ORM moderno e type-safe

### Autenticação & Segurança

- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JWT
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - Hash de senhas

### Upload & Assets

- [Multer](https://github.com/expressjs/multer) - Upload de arquivos

### Utilidades

- [dotenv](https://github.com/motdotla/dotenv) - Variáveis de ambiente
- [cors](https://github.com/expressjs/cors) - CORS
- [express-async-errors](https://github.com/davidbanham/express-async-errors) - Tratamento de erros

---

## 📦 Requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 16.x
- **npm** ou **yarn**
- **PostgreSQL** >= 13.x

---

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone  https://github.com/samuelgomes0309/Pizzaria
cd backend
```

### 2. Instale as dependências

```bash
# Com yarn (recomendado)
yarn install

# Ou com npm
npm install
```

### 3. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
```

### 4. Configure o banco de dados

```bash
# Execute as migrações
yarn prisma migrate dev

# Ou com npm
npx prisma migrate dev
```

### 5. Inicie o servidor

```bash
# Modo desenvolvimento (com hot reload)
yarn dev

# Ou com npm
npm run dev
```

O servidor estará rodando em: **http://localhost:3333**

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# 🗄️ Database Configuration
# URL de conexão com o PostgreSQL
# Formato: postgresql://usuario:senha@host:porta/database?schema=public
DATABASE_URL="postgresql://postgres:suasenha@localhost:5432/pizzaria?schema=public"

# 🔐 JWT Authentication
# Chave secreta para assinar e validar tokens JWT
# IMPORTANTE: Use uma chave forte e aleatória em produção
# Sugestão: openssl rand -hex 32
JWT_SECRET_KEY="sua-chave-secreta-super-segura-aqui"
```

> **⚠️ ATENÇÃO:** Nunca compartilhe ou versione o arquivo `.env` com credenciais reais!

### Configuração do PostgreSQL

#### Opção 1: PostgreSQL Local

1. Instale o PostgreSQL
2. Crie um banco de dados:
   ```sql
   CREATE DATABASE pizzaria;
   ```
3. Atualize a `DATABASE_URL` no `.env`

#### Opção 2: PostgreSQL Docker

---

## 🎮 Uso

### Executar o servidor

```bash
yarn dev
```

### Testar a API

#### Via Insomnia/Postman

1. Importe a coleção de endpoints (veja na pasta `documentation` no projeto)
2. Configure a variável de ambiente `BASE_URL` como `http://localhost:3333`
3. Faça login e copie o token
4. Adicione o token no header de autenticação das outras requisições

---

## 📁 Estrutura do Projeto

```
backend/
│
├── prisma/                    # 🗃️ Configuração do banco
│   ├── schema.prisma          # Modelos e relações
│   └── migrations/            # Histórico de migrações
│
├── src/                       # 📝 Código fonte
│   ├── server.ts              # Inicialização do servidor
│   ├── routes.ts              # Definição de rotas
│   │
│   ├── controllers/           # 🎮 Camada de controle
│   │   ├── user/              # Usuários
│   │   ├── category/          # Categorias
│   │   ├── product/           # Produtos
│   │   └── order/             # Pedidos
│   │
│   ├── services/              # 💼 Lógica de negócio
│   │   ├── user/
│   │   ├── category/
│   │   ├── product/
│   │   └── order/
│   │
│   ├── middlewares/           # 🔧 Middlewares
│   │   └── isAuthenticated.ts
│   │
│   ├── config/                # ⚙️ Configurações
│   │   └── multer.ts          # Upload de arquivos
│   │
│   └── prisma/                # 🔌 Cliente Prisma
│       └── prismaClient.ts
│
├── tmp/                       # 📦 Uploads temporários
├── generated/                 # 🤖 Código gerado (Prisma)
│
├── .env                       # 🔐 Variáveis de ambiente (não versionado)
├── .env.example               # 📄 Exemplo de variáveis
├── package.json               # 📋 Dependências
├── tsconfig.json              # ⚙️ Configuração TypeScript
└── README.md                  # 📖 Este arquivo
```

---

## 📚 Documentação

- **[ENDPOINTS.md](./ENDPOINTS.md)** - Documentação completa de endpoints com exemplos
- **[CONTEXT.md](./CONTEXT.md)** - Arquitetura e contexto técnico do projeto

### Principais Endpoints

| Método | Endpoint               | Descrição         | Auth |
| ------ | ---------------------- | ----------------- | ---- |
| POST   | `/signup`              | Criar usuário     | ❌   |
| POST   | `/login`               | Login             | ❌   |
| GET    | `/me`                  | Dados do usuário  | ✅   |
| POST   | `/add/categories`      | Criar categoria   | ✅   |
| GET    | `/categories`          | Listar categorias | ✅   |
| POST   | `/add/products`        | Criar produto     | ✅   |
| GET    | `/products`            | Listar produtos   | ✅   |
| POST   | `/add/orders`          | Criar pedido      | ✅   |
| POST   | `/orders/add/items`    | Adicionar item    | ✅   |
| DELETE | `/orders/remove/items` | Remover item      | ✅   |
| GET    | `/orders`              | Listar pedidos    | ✅   |

> Ver [ENDPOINTS.md](./ENDPOINTS.md) para documentação completa

---

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev              # Inicia servidor com hot reload

# Prisma
yarn prisma migrate dev       # Cria e aplica migração
yarn prisma migrate reset     # Reseta banco de dados
yarn prisma studio            # Interface visual do banco
yarn prisma generate          # Gera Prisma Client

```

---

## 🗂️ Banco de Dados

### Modelos

- **User** - Usuários do sistema
- **Category** - Categorias de produtos
- **Product** - Produtos/itens do cardápio
- **Order** - Pedidos das mesas
- **Item** - Itens individuais de cada pedido

### Relacionamentos

```
Category 1--N Product
Product  1--N Item
Order    1--N Item
```

### Migrations

```bash
# Criar nova migração
yarn prisma migrate dev --name nome_da_migracao

# Ver status das migrações
yarn prisma migrate status

# Resetar banco (CUIDADO: apaga todos os dados)
yarn prisma migrate reset
```

---

## 🔐 Autenticação

### Fluxo JWT

1. **Cadastro/Login** → Recebe token JWT
2. **Requisições** → Envia token no header:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. **Middleware** → Valida token automaticamente
4. **Acesso** → Dados do usuário disponíveis em `req.user_id`

### Segurança

- ✅ Senhas hasheadas com bcrypt (10 rounds)
- ✅ Tokens JWT assinados e validados
- ✅ Rotas protegidas por middleware de autenticação
- ✅ Variáveis sensíveis em `.env`

---

## 📸 Upload de Arquivos

### Configuração

- **Destino:** `tmp/`
- **Acesso:** `http://localhost:3333/files/{filename}`
- **Tipos aceitos:** Imagens (via Multer)

### Exemplo de uso

```bash
curl -X POST http://localhost:3333/add/products \
  -H "Authorization: Bearer {token}" \
  -F "name=Pizza Margherita" \
  -F "description=Deliciosa pizza" \
  -F "price=45" \
  -F "category_id={uuid}" \
  -F "file=@pizza.jpg"
```

---

## 🧪 Testando a API

### Fluxo Completo

```bash
# 1. Criar usuário
POST /signup
{
  "name": "Admin",
  "email": "admin@pizzaria.com",
  "password": "senha123"
}

# 2. Fazer login (salve o token)
POST /login
{
  "email": "admin@pizzaria.com",
  "password": "senha123"
}

# 3. Criar categoria (use o token)
POST /add/categories
Headers: Authorization: Bearer {token}
{
  "name": "Pizzas Tradicionais"
}

# 4. Criar produto
POST /add/products
Headers: Authorization: Bearer {token}
FormData:
- name: Pizza Margherita
- description: Molho, mussarela e manjericão
- price: 45
- category_id: {uuid da categoria}
- file: [imagem.jpg]

# 5. Criar pedido
POST /add/orders
Headers: Authorization: Bearer {token}
{
  "table": 5,
  "name": "João Silva"
}

# 6. Adicionar item ao pedido
POST /orders/add/items
Headers: Authorization: Bearer {token}
{
  "order_id": "{uuid do pedido}",
  "product_id": "{uuid do produto}",
  "amount": 2
}

# 7. Iniciar pedido
POST /orders/{order_id}/startOrder
Headers: Authorization: Bearer {token}

# 8. Finalizar pedido
POST /orders/{order_id}/closeOrder
Headers: Authorization: Bearer {token}
```

---

## 🔗 Links Úteis

- [Documentação do Prisma](https://www.prisma.io/docs)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JWT.io](https://jwt.io/) - Decodifique e entenda JWTs
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---
