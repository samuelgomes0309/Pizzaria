# 📡 Documentação da API - Mobile Pizzaria Gomes

Este arquivo documenta todos os endpoints da API consumidos pelo aplicativo mobile, com detalhes de implementação.

---

## 🔧 Configuração Base

| Configuração | Valor                                         |
| ------------ | --------------------------------------------- |
| **Base URL** | Definida via `EXPO_API_BASE_URL` no `.env`    |
| **Timeout**  | 12.000ms (12 segundos)                        |
| **Token**    | Interceptor Axios automático via AsyncStorage |

**Arquivo:** `src/services/api.config.ts` e `src/services/api.ts`

### Interceptor de Token

Todas as requisições (exceto login) incluem automaticamente:

```
Authorization: Bearer {token}
```

O token é recuperado do AsyncStorage (`@token:pizzaria`) via interceptor Axios configurado em `src/services/api.ts`.

---

## 📋 Mapa de Endpoints por Tela

| Tela      | Endpoint                 | Método | Arquivo                     |
| --------- | ------------------------ | ------ | --------------------------- |
| Login     | `/login`                 | POST   | `contexts/AuthProvider.tsx` |
| Dashboard | `/add/orders`            | POST   | `hooks/useOrder.tsx`        |
| Order     | `/categories`            | GET    | `hooks/useOrder.tsx`        |
| Order     | `/products/category`     | GET    | `hooks/useOrder.tsx`        |
| Order     | `/orders/add/items`      | POST   | `hooks/useOrder.tsx`        |
| Order     | `/orders/remove/items`   | DELETE | `hooks/useOrder.tsx`        |
| Order     | `/orders/detail`         | GET    | `hooks/useOrder.tsx`        |
| Order     | `/remove/orders`         | DELETE | `hooks/useOrder.tsx`        |
| SendOrder | `/orders/:id/startOrder` | POST   | `hooks/useOrder.tsx`        |

---

## 🔐 Autenticação

### POST `/login`

**Usado em:** `src/contexts/AuthProvider.tsx`

**Request Body:**

```json
{
	"email": "string",
	"password": "string"
}
```

**Response (200):**

```json
{
	"id": "string",
	"email": "string",
	"name": "string",
	"token": "string"
}
```

**Tipo TypeScript:** `LoginResponse`

**Comportamento no App:**

1. Armazena `token` em `@token:pizzaria` (AsyncStorage)
2. Armazena dados do usuário (sem token) em `@user:pizzaria`
3. Atualiza estado global → `signed = true`

---

## 🛒 Pedidos

### POST `/add/orders`

Cria um novo pedido (rascunho).

**Usado em:** `hooks/useOrder.tsx` → `handleOpenOrder()`

**Request Body:**

```json
{
	"table": 5
}
```

**Response (200):**

```json
{
	"id": "uuid",
	"table": 5,
	"status": false,
	"draft": true,
	"name": null
}
```

**Tipo TypeScript:** `OrderProps`

**Após sucesso:** Navega para `/(authenticated)/order` com params `{ table, order_id }`.

---

### DELETE `/remove/orders`

Exclui um pedido (somente quando sem itens).

**Usado em:** `hooks/useOrder.tsx` → `handleDeleteOrder()`

**Query Parameters:** `order_id`

**Validação no App:** Verifica se `detailOrder.items.length === 0` antes de chamar, exibindo Toast de erro caso contrário.

**Após sucesso:** Navega de volta ao Dashboard.

---

## 📋 Categorias e Produtos

### GET `/categories`

Lista todas as categorias.

**Usado em:** `hooks/useOrder.tsx` → `loadCategories()`

**Response (200):**

```json
[
	{ "id": "uuid", "name": "PIZZAS" },
	{ "id": "uuid", "name": "BEBIDAS" }
]
```

**Tipo TypeScript:** `CategoryProps[]`

**Comportamento:** Na inicialização da tela Order, carrega categorias e seleciona a primeira automaticamente, disparando `loadProducts()`.

---

### GET `/products/category`

Lista produtos filtrados por categoria.

**Usado em:** `hooks/useOrder.tsx` → `loadProducts()`

**Query Parameters:** `category_id`

**Response (200):**

```json
[
	{
		"id": "uuid",
		"name": "Pizza Margherita",
		"price": 45,
		"description": "...",
		"banner": "arquivo.jpg"
	}
]
```

**Tipo TypeScript:** `ProductProps[]`

**Comportamento:** Seleciona automaticamente o primeiro produto da lista.

> ⚠️ **Atenção:** O app mobile chama `/products/categories` (plural) mas o backend define a rota como `/products/category` (singular). Verificar se isto está causando erros.

---

## 🧾 Itens do Pedido

### POST `/orders/add/items`

Adiciona um item ao pedido. Se o produto já existir, soma a quantidade.

**Usado em:** `hooks/useOrder.tsx` → `handleAddItens()`

**Request Body:**

```json
{
	"order_id": "uuid",
	"product_id": "uuid",
	"amount": 2
}
```

**Tipo TypeScript:** `ItemProps`

**Validação no App:**

- Verifica se `productSelected` e `amount` existem
- Converte `amount` para `parseInt` e valida `> 0`

**Após sucesso:** Limpa `amount`, chama `handleDetailOrder()` para atualizar a lista, exibe Toast de sucesso.

---

### DELETE `/orders/remove/items`

Remove um item do pedido.

**Usado em:** `hooks/useOrder.tsx` → `handleDeleteItem()`

**Request Body (via `data`):**

```json
{
	"order_id": "uuid",
	"product_id": "uuid"
}
```

> Usa `axios.delete({ data: {...} })` para enviar body no DELETE.

**Após sucesso:** Chama `handleDetailOrder()` para atualizar a lista, exibe Toast.

---

### GET `/orders/detail`

Obtém detalhes completos do pedido com itens e produtos.

**Usado em:** `hooks/useOrder.tsx` → `handleDetailOrder()`

**Query Parameters:** `order_id`

**Response (200):**

```json
{
	"id": "uuid",
	"table": 5,
	"status": false,
	"draft": true,
	"items": [
		{
			"id": "uuid",
			"amount": 2,
			"productId": "uuid",
			"product": {
				"name": "Pizza Margherita",
				"price": 45,
				"description": "..."
			}
		}
	]
}
```

**Tipo TypeScript:** `DetailOrderProps`

---

### POST `/orders/:order_id/startOrder`

Envia o pedido para a cozinha (muda `draft` para `false`).

**Usado em:** `hooks/useOrder.tsx` → `handleSendOrder()`

**Validação no App:** Verifica se `order_id` existe, exibe Toast de erro caso contrário.

> ⚠️ **Atenção:** O app chama `/order/:id/startOrder` (singular) mas o backend define `/orders/:id/startOrder` (plural). Verificar.

**Após sucesso:** Exibe Toast de sucesso e navega de volta ao Dashboard.

---

## 🔄 Fluxo Completo no App

```
Dashboard
  │
  ├── Digita número da mesa
  ├── POST /add/orders → Cria pedido rascunho
  └── Navega para Order (params: table, order_id)
        │
        ├── GET /categories → Carrega categorias
        ├── GET /products/category → Carrega produtos da 1ª categoria
        │
        ├── [Loop] Selecionar categoria/produto
        │   ├── Modal de categorias → Seleciona → Recarrega produtos
        │   └── Modal de produtos → Seleciona produto
        │
        ├── POST /orders/add/items → Adiciona item
        ├── GET /orders/detail → Atualiza lista de itens
        ├── DELETE /orders/remove/items → Remove item
        │
        ├── DELETE /remove/orders → Exclui pedido (somente sem itens)
        │
        └── Navega para SendOrder (params: table, order_id)
              │
              ├── POST /orders/:id/startOrder → Envia para cozinha
              └── Navega de volta ao Dashboard
```

---

## 🔒 Armazenamento Local

| Chave             | Conteúdo                | Usado por                        |
| ----------------- | ----------------------- | -------------------------------- |
| `@token:pizzaria` | Token JWT (string)      | api.ts interceptor, AuthProvider |
| `@user:pizzaria`  | Dados do usuário (JSON) | AuthProvider                     |

---

**Última atualização:** 15 de março de 2026
