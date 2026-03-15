# 📚 Documentação da API - Pizzaria Gomes

API RESTful para gerenciamento de pizzaria, incluindo usuários, categorias, produtos e pedidos.

**Base URL:** `http://localhost:3333`

---

## 🔐 Autenticação

A maioria dos endpoints requer autenticação via **Bearer Token (JWT)**. Após fazer login, inclua o token no header das requisições:

```
Authorization: Bearer {seu_token_jwt}
```

---

## 📋 Índice de Endpoints

| Método   | Endpoint                       | Descrição                    | Auth |
| -------- | ------------------------------ | ---------------------------- | ---- |
| `POST`   | `/signup`                      | Criar usuário                | ❌   |
| `POST`   | `/login`                       | Login                        | ❌   |
| `GET`    | `/me`                          | Dados do usuário autenticado | ✅   |
| `POST`   | `/add/categories`              | Criar categoria              | ✅   |
| `GET`    | `/categories`                  | Listar categorias            | ✅   |
| `POST`   | `/add/products`                | Criar produto (multipart)    | ✅   |
| `GET`    | `/products`                    | Listar todos os produtos     | ✅   |
| `GET`    | `/products/category`           | Produtos por categoria       | ✅   |
| `POST`   | `/add/orders`                  | Criar pedido (rascunho)      | ✅   |
| `DELETE` | `/remove/orders`               | Remover pedido               | ✅   |
| `POST`   | `/orders/add/items`            | Adicionar item ao pedido     | ✅   |
| `DELETE` | `/orders/remove/items`         | Remover item do pedido       | ✅   |
| `POST`   | `/orders/:order_id/startOrder` | Iniciar pedido               | ✅   |
| `POST`   | `/orders/:order_id/closeOrder` | Finalizar pedido             | ✅   |
| `GET`    | `/orders`                      | Listar pedidos em andamento  | ✅   |
| `GET`    | `/orders/detail`               | Detalhes de um pedido        | ✅   |
| `GET`    | `/files/:filename`             | Acessar imagem de produto    | ❌   |

---

## 👤 Usuários

### POST `/signup`

Cria um novo usuário no sistema.

**Autenticação:** Não requerida

**Body:**

```json
{
	"name": "João Silva",
	"email": "joao@example.com",
	"password": "senha123"
}
```

**Resposta de Sucesso (200):**

```json
{
	"id": "uuid-do-usuario",
	"name": "João Silva",
	"email": "joao@example.com"
}
```

**Erros Possíveis:**

| Código | Mensagem                          | Causa                        |
| ------ | --------------------------------- | ---------------------------- |
| 400    | `Email and password are required` | Campos obrigatórios ausentes |
| 400    | `User already exists`             | Email já cadastrado          |

---

### POST `/login`

Autentica um usuário e retorna um token JWT.

**Autenticação:** Não requerida

**Body:**

```json
{
	"email": "joao@example.com",
	"password": "senha123"
}
```

**Resposta de Sucesso (200):**

```json
{
	"id": "uuid-do-usuario",
	"name": "João Silva",
	"email": "joao@example.com",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Detalhes do Token:**

- **Expiração:** 30 dias
- **Payload:** `name`, `email`
- **Subject:** `user.id`

**Erros Possíveis:**

| Código | Mensagem                          | Causa                  |
| ------ | --------------------------------- | ---------------------- |
| 400    | `Email and password are required` | Campos ausentes        |
| 400    | `Invalid email or password`       | Credenciais incorretas |

---

### GET `/me`

Retorna informações do usuário autenticado.

**Autenticação:** Requerida

**Resposta de Sucesso (200):**

```json
{
	"id": "uuid-do-usuario",
	"name": "João Silva",
	"email": "joao@example.com"
}
```

**Erros:**

| Código | Mensagem         | Causa                  |
| ------ | ---------------- | ---------------------- |
| 401    | —                | Token ausente/inválido |
| 400    | `User not found` | Usuário não existe     |

---

## 📂 Categorias

### POST `/add/categories`

Cria uma nova categoria de produtos.

**Autenticação:** Requerida

**Body:**

```json
{
	"name": "Pizzas Tradicionais"
}
```

**Comportamento:**

- O nome é automaticamente convertido para **UPPERCASE** e trimmed
- Não permite categorias com nomes duplicados

**Resposta de Sucesso (200):**

```json
{
	"id": "uuid-da-categoria",
	"name": "PIZZAS TRADICIONAIS"
}
```

**Erros:**

| Código | Mensagem                  | Causa              |
| ------ | ------------------------- | ------------------ |
| 400    | `Name is required`        | Nome vazio ou nulo |
| 400    | `Category already exists` | Nome já existe     |

---

### GET `/categories`

Lista todas as categorias cadastradas, ordenadas alfabeticamente por nome.

**Autenticação:** Requerida

**Resposta de Sucesso (200):**

```json
[
	{
		"id": "uuid-da-categoria-1",
		"name": "BEBIDAS"
	},
	{
		"id": "uuid-da-categoria-2",
		"name": "PIZZAS TRADICIONAIS"
	}
]
```

---

## 🍕 Produtos

### POST `/add/products`

Cria um novo produto com imagem.

**Autenticação:** Requerida

**Content-Type:** `multipart/form-data`

**Body (FormData):**

| Campo         | Tipo   | Obrigatório | Descrição            |
| ------------- | ------ | ----------- | -------------------- |
| `name`        | string | ✅          | Nome do produto      |
| `description` | string | ✅          | Descrição do produto |
| `price`       | number | ✅          | Preço (inteiro > 0)  |
| `category_id` | string | ✅          | UUID da categoria    |
| `file`        | File   | ✅          | Arquivo de imagem    |

**Resposta de Sucesso (200):**

```json
{
	"id": "uuid-do-produto",
	"name": "Pizza Margherita",
	"description": "Molho de tomate, mussarela e manjericão",
	"price": 45,
	"banner": "a1b2c3d4-pizza-margherita.jpg",
	"categoryId": "uuid-da-categoria",
	"created_at": "2026-03-15T10:30:00.000Z",
	"updated_at": "2026-03-15T10:30:00.000Z"
}
```

**Erros:**

| Código | Mensagem                  | Causa                |
| ------ | ------------------------- | -------------------- |
| 400    | `error upload file`       | Arquivo não enviado  |
| 400    | `All fields are required` | Campos ausentes      |
| 400    | `Category not found`      | category_id inválido |
| 400    | `Invalid price`           | Preço <= 0 ou NaN    |

---

### GET `/products`

Lista todos os produtos cadastrados.

**Autenticação:** Requerida

**Resposta de Sucesso (200):**

```json
[
	{
		"id": "uuid-do-produto",
		"name": "Pizza Margherita",
		"description": "Molho de tomate, mussarela e manjericão",
		"price": 45,
		"banner": "a1b2c3d4-pizza-margherita.jpg"
	}
]
```

---

### GET `/products/category`

Lista produtos de uma categoria específica.

**Autenticação:** Requerida

**Query Parameters:**

| Parâmetro     | Tipo   | Obrigatório | Descrição         |
| ------------- | ------ | ----------- | ----------------- |
| `category_id` | string | ✅          | UUID da categoria |

**Exemplo:** `GET /products/category?category_id=uuid-da-categoria`

**Resposta de Sucesso (200):**

```json
[
	{
		"id": "uuid-do-produto",
		"name": "Pizza Margherita",
		"description": "Molho de tomate, mussarela e manjericão",
		"price": 45,
		"banner": "a1b2c3d4-pizza-margherita.jpg"
	}
]
```

**Erros:**

| Código | Mensagem                  | Causa              |
| ------ | ------------------------- | ------------------ |
| 400    | `Category ID is required` | Parâmetro ausente  |
| 400    | `Category not found`      | Categoria inválida |

---

## 🛒 Pedidos

### POST `/add/orders`

Cria um novo pedido em modo rascunho.

**Autenticação:** Requerida

**Body:**

| Campo   | Tipo   | Obrigatório | Descrição                    |
| ------- | ------ | ----------- | ---------------------------- |
| `table` | number | ✅          | Número da mesa (inteiro > 0) |
| `name`  | string | ❌          | Nome do cliente              |

```json
{
	"table": 5,
	"name": "João Silva"
}
```

**Resposta de Sucesso (200):**

```json
{
	"id": "uuid-do-pedido",
	"table": 5,
	"name": "João Silva",
	"status": false,
	"draft": true,
	"created_at": "2026-03-15T10:30:00.000Z",
	"updated_at": "2026-03-15T10:30:00.000Z"
}
```

**Erros:**

| Código | Mensagem                   | Causa              |
| ------ | -------------------------- | ------------------ |
| 400    | `Table number is required` | Mesa não informada |
| 400    | `Invalid table number`     | Número inválido    |

---

### DELETE `/remove/orders`

Remove um pedido. Somente permitido se **não possuir itens**.

**Autenticação:** Requerida

**Query Parameters:**

| Parâmetro  | Tipo   | Obrigatório | Descrição      |
| ---------- | ------ | ----------- | -------------- |
| `order_id` | string | ✅          | UUID do pedido |

**Exemplo:** `DELETE /remove/orders?order_id=uuid-do-pedido`

**Erros:**

| Código | Mensagem                                  | Causa               |
| ------ | ----------------------------------------- | ------------------- |
| 400    | `Order ID is required`                    | Parâmetro ausente   |
| 400    | `Order not found`                         | Pedido não existe   |
| 400    | `Cannot delete order with existing items` | Pedido possui itens |

---

### POST `/orders/add/items`

Adiciona um item ao pedido. Se o produto já existir no pedido, a **quantidade é somada**.

**Autenticação:** Requerida

**Body:**

```json
{
	"order_id": "uuid-do-pedido",
	"product_id": "uuid-do-produto",
	"amount": 2
}
```

**Comportamento especial:** Se já houver um item com o mesmo `product_id` nesse pedido, o `amount` é incrementado (não cria duplicata).

**Resposta de Sucesso (200):**

```json
{
	"id": "uuid-do-item",
	"orderId": "uuid-do-pedido",
	"productId": "uuid-do-produto",
	"amount": 2,
	"created_at": "2026-03-15T10:30:00.000Z",
	"updated_at": "2026-03-15T10:30:00.000Z"
}
```

**Erros:**

| Código | Mensagem               | Causa                  |
| ------ | ---------------------- | ---------------------- |
| 400    | `Order ID is required` | order_id ausente       |
| 400    | `Invalid amount`       | Quantidade <= 0 ou NaN |
| 400    | `Order not found`      | Pedido não existe      |

---

### DELETE `/orders/remove/items`

Remove um item do pedido usando `order_id` e `product_id`. Somente permitido quando o pedido é **rascunho** (`draft: true`).

**Autenticação:** Requerida

**Body (JSON):**

```json
{
	"order_id": "uuid-do-pedido",
	"product_id": "uuid-do-produto"
}
```

> ⚠️ Este endpoint utiliza **body na requisição DELETE**, não query parameters.

**Resposta de Sucesso (200):** Retorna o item deletado.

**Erros:**

| Código | Mensagem                      | Causa                            |
| ------ | ----------------------------- | -------------------------------- |
| 400    | `Order ID is required`        | order_id ausente                 |
| 400    | `Item not found`              | Item não encontrado              |
| 400    | `Order has already been sent` | Pedido já enviado (draft: false) |

---

### POST `/orders/:order_id/startOrder`

Inicia um pedido (remove do rascunho). Requer pelo menos um item.

**Autenticação:** Requerida

**URL Parameters:**

| Parâmetro  | Tipo   | Descrição      |
| ---------- | ------ | -------------- |
| `order_id` | string | UUID do pedido |

**Exemplo:** `POST /orders/uuid-do-pedido/startOrder`

**Resposta de Sucesso (200):**

```json
{
	"id": "uuid-do-pedido",
	"table": 5,
	"name": "João Silva",
	"status": false,
	"draft": false
}
```

**Erros:**

| Código | Mensagem                            | Causa            |
| ------ | ----------------------------------- | ---------------- |
| 400    | `Order ID is required`              | Parâmetro vazio  |
| 400    | `Order must have at least one item` | Pedido sem itens |

---

### POST `/orders/:order_id/closeOrder`

Finaliza um pedido (marca como concluído). Requer pelo menos um item.

**Autenticação:** Requerida

**URL Parameters:**

| Parâmetro  | Tipo   | Descrição      |
| ---------- | ------ | -------------- |
| `order_id` | string | UUID do pedido |

**Exemplo:** `POST /orders/uuid-do-pedido/closeOrder`

**Resposta de Sucesso (200):**

```json
{
	"id": "uuid-do-pedido",
	"table": 5,
	"name": "João Silva",
	"status": true,
	"draft": false
}
```

**Erros:**

| Código | Mensagem                            | Causa            |
| ------ | ----------------------------------- | ---------------- |
| 400    | `Order ID is required`              | Parâmetro vazio  |
| 400    | `Order must have at least one item` | Pedido sem itens |

---

### GET `/orders`

Lista todos os pedidos **em andamento** (não rascunhos e não finalizados).

**Autenticação:** Requerida

**Filtro interno:** `draft: false` AND `status: false`

**Ordenação:** `updated_at` descendente

**Resposta de Sucesso (200):**

```json
[
	{
		"id": "uuid-do-pedido",
		"table": 5,
		"name": "João Silva",
		"status": false,
		"draft": false,
		"created_at": "2026-03-15T10:30:00.000Z",
		"updated_at": "2026-03-15T10:30:00.000Z"
	}
]
```

---

### GET `/orders/detail`

Obtém detalhes completos de um pedido incluindo itens e dados dos produtos.

**Autenticação:** Requerida

**Query Parameters:**

| Parâmetro  | Tipo   | Obrigatório | Descrição      |
| ---------- | ------ | ----------- | -------------- |
| `order_id` | string | ✅          | UUID do pedido |

**Exemplo:** `GET /orders/detail?order_id=uuid-do-pedido`

**Resposta de Sucesso (200):**

```json
{
	"id": "uuid-do-pedido",
	"table": 5,
	"name": "João Silva",
	"status": false,
	"draft": false,
	"created_at": "2026-03-15T10:30:00.000Z",
	"updated_at": "2026-03-15T10:30:00.000Z",
	"items": [
		{
			"id": "uuid-do-item",
			"amount": 2,
			"orderId": "uuid-do-pedido",
			"productId": "uuid-do-produto",
			"created_at": "2026-03-15T10:30:00.000Z",
			"updated_at": "2026-03-15T10:30:00.000Z",
			"product": {
				"id": "uuid-do-produto",
				"name": "Pizza Margherita",
				"description": "Molho de tomate, mussarela e manjericão",
				"price": 45,
				"banner": "a1b2c3d4-pizza-margherita.jpg",
				"categoryId": "uuid-da-categoria",
				"created_at": "2026-03-15T10:30:00.000Z",
				"updated_at": "2026-03-15T10:30:00.000Z"
			}
		}
	]
}
```

---

## 📁 Arquivos Estáticos

### GET `/files/:filename`

Acessa imagens de produtos enviadas via upload.

**Autenticação:** Não requerida

**Exemplo:** `GET /files/a1b2c3d4-pizza-margherita.jpg`

---

## 🔄 Fluxo Completo de um Pedido

```
1. POST /add/orders              → Cria pedido (draft: true, status: false)
2. POST /orders/add/items        → Adiciona itens ao pedido (pode repetir)
3. POST /orders/:id/startOrder   → Envia pedido (draft: false, status: false)
4. GET  /orders                  → Pedido aparece na lista de "em andamento"
5. GET  /orders/detail           → Consultar detalhes com itens e produtos
6. POST /orders/:id/closeOrder   → Finaliza pedido (draft: false, status: true)
```

---

## ❌ Códigos de Erro

| Código | Significado           | Descrição                                   |
| ------ | --------------------- | ------------------------------------------- |
| 200    | OK                    | Requisição bem-sucedida                     |
| 400    | Bad Request           | Dados inválidos ou regra de negócio violada |
| 401    | Unauthorized          | Token ausente ou inválido                   |
| 500    | Internal Server Error | Erro inesperado no servidor                 |

**Formato de erro (400):**

```json
{ "error": "Mensagem descritiva do erro" }
```

**Formato de erro (500):**

```json
{ "status": "error", "message": "Internal server error." }
```

---

**Última atualização:** 15 de março de 2026
