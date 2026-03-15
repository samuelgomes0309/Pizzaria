# 📱 Contexto e Arquitetura - Mobile Pizzaria Gomes

Este documento explica a arquitetura, padrões de design e organização do aplicativo mobile da Pizzaria Gomes.

---

## 📐 Arquitetura do Projeto

### Stack Tecnológica

| Categoria        | Tecnologia                    | Versão   |
| ---------------- | ----------------------------- | -------- |
| **Core**         | React Native                  | 0.81.5   |
| **Plataforma**   | Expo                          | ~54.0.29 |
| **Linguagem**    | TypeScript                    | ~5.9.2   |
| **Roteamento**   | Expo Router                   | ~6.0.19  |
| **Estilização**  | NativeWind (Tailwind CSS)     | ^4.2.1   |
| **HTTP Client**  | Axios                         | ^1.13.2  |
| **Persistência** | AsyncStorage                  | 2.2.0    |
| **Notificações** | React Native Toast Message    | ^2.3.3   |
| **Ícones**       | Ionicons (@expo/vector-icons) | ^15.0.3  |

### Fluxo de Dados

```
App → Expo Router → AuthProvider → Layouts → Screens → useOrder Hook → API
                                                            ↓
                                                  AsyncStorage (token/user)
```

---

## 📂 Estrutura de Diretórios

```
app/
├── _layout.tsx                  # Root: AuthProvider + StatusBar + Toast
├── index.tsx                    # Redirect inteligente baseado em autenticação
├── login.tsx                    # Tela de login
└── (authenticated)/
    ├── _layout.tsx              # Guard: redireciona para login se não autenticado
    ├── dashboard.tsx            # Abertura de mesa (input número + botão)
    ├── order.tsx                # Montagem do pedido (categorias, produtos, itens)
    └── sendOrder.tsx            # Confirmação e envio do pedido

src/
├── @types/
│   └── index.ts                 # UserProps, CategoryProps, ProductProps, OrderProps, etc.
│
├── components/
│   ├── Button.tsx               # Botão com suporte a loading
│   ├── Input.tsx                # TextInput estilizado (tema dark)
│   ├── CardItem.tsx             # Item do pedido com botão de exclusão
│   ├── CardModal.tsx            # Modal FlatList para seleção (categoria/produto)
│   └── Select.tsx               # Dropdown que abre o modal
│
├── contexts/
│   ├── AuthContext.tsx          # createContext + interface ContextProps
│   └── AuthProvider.tsx         # Provider + hook useAuth()
│
├── hooks/
│   └── useOrder.tsx             # Hook centralizado com toda lógica de pedidos
│
└── services/
    ├── api.config.ts            # BASE_URL e TIMEOUT via env
    └── api.ts                   # Instância Axios + interceptor de token
```

---

## 🔐 Sistema de Autenticação (AuthContext)

### Interface do Contexto

```typescript
interface ContextProps {
	signed: boolean; // !!user
	user: UserProps | null; // { id, email, name }
	login: (email: string, password: string) => void; // POST /login
	loading: boolean; // Carregamento inicial
	setLoading: Dispatch<SetStateAction<boolean>>; // Controle manual
	logOut: () => Promise<void>; // Limpa AsyncStorage + estado
}
```

### Ciclo de Vida

```
App inicia → AuthProvider monta → loading = true
  ↓
loadStorage()
  ↓
Token encontrado no AsyncStorage?
  ├── SIM → setUser(userData) → signed = true → Dashboard
  └── NÃO → user = null → signed = false → Login
```

### Função de Login

1. `POST /login` com email e senha
2. Separa `token` dos dados do usuário
3. Salva `@token:pizzaria` e `@user:pizzaria` no AsyncStorage
4. Atualiza `user` no estado → `signed` fica `true`

### Função de Logout

1. Remove `@token:pizzaria` e `@user:pizzaria` do AsyncStorage
2. Define `user` como `null` → `signed` fica `false`
3. Redirecionamento automático pelo layout autenticado

### Hook `useAuth()`

Exportado no final de `AuthProvider.tsx`, encapsula `useContext(AuthContext)` com verificação de erro.

---

## 🗺️ Sistema de Rotas (Expo Router)

### File-based Routing

| Arquivo                             | Rota                         | Protegida |
| ----------------------------------- | ---------------------------- | --------- |
| `app/index.tsx`                     | `/`                          | —         |
| `app/login.tsx`                     | `/login`                     | ❌        |
| `app/(authenticated)/dashboard.tsx` | `/(authenticated)/dashboard` | ✅        |
| `app/(authenticated)/order.tsx`     | `/(authenticated)/order`     | ✅        |
| `app/(authenticated)/sendOrder.tsx` | `/(authenticated)/sendOrder` | ✅        |

### Proteção em Duas Camadas

1. **`app/index.tsx`:** Verifica `signed` e redireciona para `/login` ou `/(authenticated)/dashboard`
2. **`app/(authenticated)/_layout.tsx`:** Se `!signed`, redireciona para `/login` e não renderiza nada

### Passagem de Parâmetros entre Telas

```typescript
// Dashboard → Order
router.push({
	pathname: "/(authenticated)/order",
	params: { table: "5", order_id: "uuid" },
});

// Order → SendOrder
router.push({
	pathname: "/(authenticated)/sendOrder",
	params: { table: "5", order_id: "uuid" },
});

// Leitura dos parâmetros
const { table, order_id } = useLocalSearchParams<{
	table: string;
	order_id: string;
}>();
```

---

## 🛒 Hook useOrder — Lógica Central de Pedidos

O hook `useOrder` (`src/hooks/useOrder.tsx`) centraliza **toda a lógica de pedidos** do app:

### Estados Gerenciados

| Estado             | Tipo                            | Descrição                         |
| ------------------ | ------------------------------- | --------------------------------- |
| `categories`       | `CategoryProps[]`               | Categorias carregadas             |
| `products`         | `ProductProps[]`                | Produtos da categoria selecionada |
| `categorySelected` | `CategoryProps \| undefined`    | Categoria selecionada             |
| `productSelected`  | `ProductProps \| undefined`     | Produto selecionado               |
| `detailOrder`      | `DetailOrderProps \| undefined` | Itens do pedido atual             |
| `amount`           | `string`                        | Quantidade digitada               |
| `modalVisible`     | `boolean`                       | Modal aberto/fechado              |
| `typeModal`        | `"category" \| "product"`       | Tipo do modal                     |
| `tableInput`       | `string`                        | Número da mesa (dashboard)        |

### Métodos Expostos

| Método                 | Endpoint                      | Descrição                             |
| ---------------------- | ----------------------------- | ------------------------------------- |
| `handleOpenOrder()`    | `POST /add/orders`            | Cria pedido e navega para Order       |
| `loadCategories(id?)`  | `GET /categories`             | Carrega categorias + primeiro produto |
| `loadProducts(cat_id)` | `GET /products/category`      | Carrega produtos por categoria        |
| `handleAddItens()`     | `POST /orders/add/items`      | Adiciona item ao pedido               |
| `handleDeleteItem(id)` | `DELETE /orders/remove/items` | Remove item do pedido                 |
| `handleDetailOrder()`  | `GET /orders/detail`          | Atualiza lista de itens               |
| `handleDeleteOrder()`  | `DELETE /remove/orders`       | Exclui pedido (sem itens)             |
| `handleSendOrder()`    | `POST /orders/:id/startOrder` | Envia pedido para cozinha             |

### Fluxo de Uso por Tela

**Dashboard:** `handleOpenOrder()` → cria pedido → navega para Order

**Order:** `loadCategories()` → selecionar categoria/produto → `handleAddItens()` / `handleDeleteItem()` → `navigateToSendOrder()`

**SendOrder:** `handleSendOrder()` → envia pedido → volta ao Dashboard

---

## 🧩 Componentes Reutilizáveis

| Componente  | Props Principais                                  | Descrição                              |
| ----------- | ------------------------------------------------- | -------------------------------------- |
| `Button`    | `title`, `loading?`, `disabled?`                  | TouchableOpacity com ActivityIndicator |
| `Input`     | `placeholder`, `...TextInputProps`                | TextInput estilizado (tema dark)       |
| `CardItem`  | `item`, `deleteItem`                              | Item do pedido + botão lixeira         |
| `CardModal` | `data`, `type`, `onSelect`, `onClose`, `selected` | FlatList modal para seleção            |
| `Select`    | `title`, `type`, `onOpen`                         | Dropdown que abre o CardModal          |

---

## 🌐 Comunicação HTTP

### Configuração

```typescript
// api.config.ts
export const API_CONFIG = {
	BASE_URL: process.env.EXPO_API_BASE_URL, // ex: http://192.168.x.x:3333
	TIMEOUT: 12000,
};
```

### Interceptor de Token

```typescript
// api.ts
api.interceptors.request.use(async (config) => {
	const token = await AsyncStorage.getItem("@token:pizzaria");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
```

Diferente do frontend web (que injeta o token manualmente), o mobile usa um **interceptor Axios** que busca o token do AsyncStorage em cada requisição.

---

## 🎨 Estilização

### NativeWind (Tailwind CSS para React Native)

- Configurado via `tailwind.config.js` com preset `nativewind/preset`
- Inclui arquivos de `app/**` e `src/**`
- Mesmo padrão de cores do frontend web:
  - Background: `#1d1d2e` e `#101026`
  - Primary: `#3fffa3`
  - Accent: vermelho (logo, botões de exclusão)

---

## ⚠️ Pontos de Atenção e Melhorias Sugeridas

### Identificados na Análise

1. **Race Condition no Login:** `router.replace()` é chamado antes do `await login()` resolver — se o login falhar, o usuário ainda é redirecionado
2. **Sem validação de token na restauração:** `loadStorage()` não valida se o token ainda é válido (não chama `/me`)
3. **AsyncStorage não é criptografado:** Para maior segurança, considerar `expo-secure-store`
4. **Logout apenas client-side:** Não invalida o token no servidor
5. **Endpoint mobile diverge do backend:** Mobile chama `/products/categories` mas backend usa `/products/category`
6. **Endpoint startOrder diverge:** Mobile chama `/order/:id/startOrder` (singular) mas backend usa `/orders/:id/startOrder` (plural)

### Melhorias Sugeridas

- [ ] Aguardar `await login()` antes de redirecionar
- [ ] Validar token com `GET /me` ao restaurar sessão
- [ ] Migrar para `expo-secure-store` para armazenamento de token
- [ ] Implementar refresh token
- [ ] Adicionar tratamento de erros visíveis ao usuário no login
- [ ] Corrigir endpoints para corresponder ao backend

---

## 📊 Fluxo de Estados

```
App Inicia → AuthProvider → loading = true → loadStorage()
                                                ↓
                                       Token no AsyncStorage?
                                       ├── SIM → setUser() → signed = true
                                       └── NÃO → signed = false
                                                ↓
                                          Index redireciona
                                       ├── signed? → Dashboard
                                       └── !signed? → Login
                                                ↓
                                          Login → login() → AsyncStorage
                                                ↓
                                          Dashboard → useOrder → API
                                                ↓
                                          Order → adicionar/remover itens
                                                ↓
                                          SendOrder → startOrder → Dashboard
```

---

**Última atualização:** 15 de março de 2026
