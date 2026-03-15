# 🏗️ Contexto e Arquitetura - Frontend Pizzaria Gomes

Este documento explica a arquitetura, padrões de design, fluxo de dados e organização do projeto **frontend** da Pizzaria Gomes.

---

## 📐 Arquitetura do Projeto

### Stack Tecnológica

| Categoria        | Tecnologia      | Versão  |
| ---------------- | --------------- | ------- |
| **Core**         | React           | 19.2.0  |
| **Linguagem**    | TypeScript      | 5.9     |
| **Build Tool**   | Vite            | 7.2.4   |
| **Estilização**  | Tailwind CSS    | 4.1.17  |
| **Roteamento**   | React Router    | 7.10.1  |
| **Formulários**  | React Hook Form | 7.68.0  |
| **Validação**    | Zod             | 4.1.13  |
| **HTTP Client**  | Axios           | 1.13.2  |
| **Notificações** | React Toastify  | 11.0.5  |
| **Ícones**       | Lucide React    | 0.556.0 |

### Fluxo de Dados

```
Browser → React Router → Layout → Context Providers → Pages → Components
                                        ↓
                                  Services (Axios) → API Backend (localhost:3333)
```

---

## 🎯 Padrão de Arquitetura: Context-Based State Management

O projeto utiliza a **Context API** do React para gerenciamento de estado global, dividido em duas camadas:

### 1. AuthContext — Gerenciamento de Autenticação

**Arquivos:**

- `src/contexts/auth/AuthContext.tsx` — Interface e tipos
- `src/contexts/auth/AuthProvider.tsx` — Lógica e implementação

**Fluxo de Autenticação:**

```
1. Usuário faz login
2. AuthProvider chama POST /login
3. Backend retorna { id, name, email, token }
4. Token salvo em localStorage ("@pizzaria")
5. Token injetado no Axios (Authorization: Bearer {token})
6. Estado `user` atualizado
7. Flag `signed` fica true
8. Rotas privadas liberam acesso
```

**API exposta pelo contexto:**

```typescript
{
  user: UserProps | null;           // Dados do usuário (uid, name, email)
  handleSignUp: (data) => Promise<boolean>;  // POST /signup
  handleSignIn: (data) => Promise<boolean>;  // POST /login
  loadingAuth: boolean;             // Loading durante verificação de token
  signed: boolean;                  // !!user
  logOut: () => void;              // Remove token + limpa estado
}
```

**Persistência de sessão:** No `useEffect` inicial, o AuthProvider:

1. Busca token no `localStorage("@pizzaria")`
2. Se encontrar, injeta no Axios e chama `GET /me`
3. Atualiza estado do usuário ou redireciona para login

---

### 2. AppContext — Gerenciamento de Dados da Aplicação

**Arquivos:**

- `src/contexts/app/AppContext.tsx` — Interface e tipos
- `src/contexts/app/AppProvider.tsx` — Lógica e implementação

**API exposta pelo contexto:**

```typescript
{
  // Categorias
  createCategory: (data) => Promise<boolean>;      // POST /add/categories
  listCategory: CategoryProps[];                    // Cache local
  handleListCategories: () => Promise<void>;        // GET /categories

  // Produtos
  createProduct: (data) => Promise<boolean>;        // POST /add/products (multipart)
  handleListProducts: () => Promise<void>;          // GET /products
  listProducts: ProductProps[];                     // Cache local

  // Pedidos
  listOrders: OrderProps[];                         // Cache local
  handleListOrders: () => Promise<void>;            // GET /orders
  handleDetailOrder: (id) => Promise<boolean>;      // GET /orders/detail
  detailOrder: DetailOrderProps | null;             // Pedido selecionado
  setDetailOrder: Dispatch<...>;                    // Setter manual
  handleCloseOrder: (id) => Promise<void>;          // POST /orders/:id/closeOrder
}
```

**Otimizações:** As funções `handleListOrders`, `handleListProducts`, `handleListCategories`, `handleDetailOrder` e `handleCloseOrder` são memorizadas com `useCallback`.

---

## 📂 Estrutura de Diretórios

```
src/
├── App.tsx                       # Configuração de rotas (createBrowserRouter)
├── main.tsx                      # Entry point (AuthProvider + RouterProvider + ToastContainer)
├── index.css                     # Estilos globais + Tailwind import
│
├── @types/
│   └── types.d.ts               # CategoryProps, ProductProps, OrderProps, DetailOrderProps...
│
├── components/
│   ├── container/index.tsx      # Wrapper com max-width e padding
│   ├── layout/index.tsx         # Layout principal (Sidebar + Outlet)
│   └── sidebar/index.tsx        # Barra de navegação (logo, links, logout)
│
├── contexts/
│   ├── auth/
│   │   ├── AuthContext.tsx      # createContext + interfaces
│   │   └── AuthProvider.tsx     # Provider com login, signup, token, getMe
│   └── app/
│       ├── AppContext.tsx       # createContext + interfaces
│       └── AppProvider.tsx      # Provider com categorias, produtos, pedidos
│
├── pages/
│   ├── login/
│   │   ├── index.tsx            # Container alternando SignIn/SignUp
│   │   ├── signin/index.tsx     # Formulário de login
│   │   ├── signup/index.tsx     # Formulário de cadastro
│   │   ├── components/input.tsx # Input genérico tipado
│   │   └── schema/schema.ts    # Schemas Zod (signinSchema, signupSchema)
│   │
│   ├── dashboard/
│   │   ├── index.tsx            # Lista de pedidos em andamento
│   │   └── components/
│   │       ├── cardOrder.tsx    # Card de pedido na lista
│   │       └── cardModal.tsx    # Modal de detalhes do pedido
│   │
│   ├── category/
│   │   ├── index.tsx            # Formulário de criação de categoria
│   │   └── schema/schema.ts    # Schema Zod (categorySchema)
│   │
│   └── product/
│       ├── index.tsx            # Listagem de produtos em grid
│       ├── new/index.tsx        # Formulário de cadastro (upload + dados)
│       ├── components/
│       │   ├── cardProduct.tsx  # Card de produto com imagem
│       │   ├── input.tsx        # Input genérico tipado
│       │   └── error.tsx        # Mensagem de erro inline
│       └── schema/schema.ts    # Schema Zod (productSchema)
│
├── routes/
│   └── Private.tsx              # HOC: verifica auth antes de renderizar
│
└── services/
    └── api/
        └── axios.ts             # Instância Axios (baseURL via VITE_BASE_URL)
```

---

## 🗺️ Rotas da Aplicação

| Rota           | Componente | Protegida | Descrição            |
| -------------- | ---------- | --------- | -------------------- |
| `/login`       | Login      | ❌        | Login / Cadastro     |
| `/`            | Dashboard  | ✅        | Pedidos em andamento |
| `/category`    | Category   | ✅        | Nova categoria       |
| `/products`    | Products   | ✅        | Lista de produtos    |
| `/new-product` | NewProduct | ✅        | Cadastro de produto  |

**Hierarquia de Provider:**

```
AuthContextProvider (main.tsx)
  └── RouterProvider
        └── AppProvider (Layout route)
              ├── Private > Dashboard
              ├── Private > Category
              ├── Private > Products
              └── Private > NewProduct
```

---

## 🔐 Sistema de Rotas Protegidas

O componente `Private.tsx` funciona como um Higher-Order Component:

1. Lê `loadingAuth` e `signed` do AuthContext
2. Se carregando → exibe spinner com animação
3. Se não autenticado → `<Navigate to="/login" />`
4. Se autenticado → renderiza `{children}`

---

## 📝 Validação de Formulários

### Stack: React Hook Form + Zod

Todos os formulários utilizam:

```typescript
const {
	register,
	handleSubmit,
	formState: { errors },
	reset,
} = useForm<T>({
	resolver: zodResolver(schema),
});
```

**Schemas implementados:**

| Schema           | Campos                             | Arquivo                           |
| ---------------- | ---------------------------------- | --------------------------------- |
| `signinSchema`   | email, password                    | `pages/login/schema/schema.ts`    |
| `signupSchema`   | name, email, password              | `pages/login/schema/schema.ts`    |
| `categorySchema` | name                               | `pages/category/schema/schema.ts` |
| `productSchema`  | category, name, description, price | `pages/product/schema/schema.ts`  |

---

## 📤 Upload de Imagens

O cadastro de produto (`pages/product/new/index.tsx`) implementa upload com:

1. **Validação de tipo:** Aceita apenas `image/*`
2. **Validação de tamanho:** Máximo 5 MB
3. **Preview:** `URL.createObjectURL()` antes do envio
4. **Limpeza de memória:** `URL.revokeObjectURL()` no cleanup
5. **Envio:** `FormData` com `Content-Type: multipart/form-data`

---

## 🌐 Comunicação HTTP

### Configuração do Axios

```typescript
export const api = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	timeout: 5000,
});
```

### Injeção de Token

Feito manualmente pelo AuthProvider após login ou restauração de sessão:

```typescript
api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
```

### Endpoints consumidos pelo Frontend

| Método | Endpoint                 | Usado por    |
| ------ | ------------------------ | ------------ |
| POST   | `/signup`                | AuthProvider |
| POST   | `/login`                 | AuthProvider |
| GET    | `/me`                    | AuthProvider |
| POST   | `/add/categories`        | AppProvider  |
| GET    | `/categories`            | AppProvider  |
| POST   | `/add/products`          | AppProvider  |
| GET    | `/products`              | AppProvider  |
| GET    | `/orders`                | AppProvider  |
| GET    | `/orders/detail`         | AppProvider  |
| POST   | `/orders/:id/closeOrder` | AppProvider  |

---

## 🎨 Sistema de Estilização

### Tailwind CSS 4.x (Utility-First)

**Cores do Tema:**

| Cor        | Hex       | Uso                            |
| ---------- | --------- | ------------------------------ |
| Background | `#1d1d2e` | Body                           |
| Cards      | `#101026` | Cards, inputs, modais          |
| Primary    | `#3fffa3` | Botões, links, destaques       |
| Accent     | `#ff0000` | Logo "Gomes", alertas          |
| Text       | `#ffffff` | Texto principal                |
| Gray       | `#99a1af` | Placeholders, texto secundário |

---

## 🔔 Notificações

Utiliza React Toastify configurado no `main.tsx`:

```typescript
toast.success("Mensagem de sucesso");
toast.error("Mensagem de erro");
```

Usado em todos os métodos dos contexts (createCategory, createProduct, handleSignIn, etc.).

---

## 🛡️ Tratamento de Erros

| Camada       | Estratégia                                        |
| ------------ | ------------------------------------------------- |
| Formulários  | Validação Zod → erros inline abaixo dos inputs    |
| API          | try/catch → toast.error() + console.log()         |
| Autenticação | Token inválido → limpa estado → redireciona login |

---

## 🧪 Padrões de Código

### Convenções de Nomenclatura

| Tipo                   | Padrão                  | Exemplo                          |
| ---------------------- | ----------------------- | -------------------------------- |
| Componentes            | PascalCase              | `Dashboard`, `CardOrder`         |
| Funções                | camelCase               | `handleSubmit`, `createCategory` |
| Interfaces/Types       | PascalCase + Props/Data | `UserProps`, `SigninData`        |
| Arquivos de componente | camelCase ou index.tsx  | `cardOrder.tsx`, `index.tsx`     |

### Estrutura de Componente

```typescript
// 1. Imports
// 2. Interfaces/Types
// 3. Componente (export default function)
//    3.1. Hooks de contexto (useContext)
//    3.2. Hooks de estado (useState)
//    3.3. Hooks de formulário (useForm)
//    3.4. Funções auxiliares
//    3.5. Effects (useEffect)
//    3.6. Return JSX
```

---

## 🚧 Oportunidades de Melhoria

### Curto Prazo

- [ ] Implementar refresh token automático
- [ ] Adicionar loading skeletons nas listas
- [ ] Adicionar confirmação antes de finalizar pedido
- [ ] Implementar debounce em buscas

### Médio Prazo

- [ ] Testes unitários (Vitest + Testing Library)
- [ ] Paginação em listas grandes
- [ ] Busca e filtros de produtos
- [ ] Cache de requisições (React Query / TanStack Query)

### Longo Prazo

- [ ] WebSocket para atualização em tempo real dos pedidos
- [ ] PWA (Progressive Web App)
- [ ] Internacionalização (i18n)
- [ ] Lazy loading de rotas

---

## 📚 Referências

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)

---

**Última atualização:** 15 de março de 2026
