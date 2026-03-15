# 🍕 PizzariaGomes — Frontend

Sistema web administrativo para gerenciamento completo de pizzaria, incluindo controle de pedidos, produtos, categorias e autenticação de usuários.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat&logo=vite&logoColor=white)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Execução](#-execução)
- [Rotas](#-rotas)
- [Contextos](#-contextos)
- [Scripts Disponíveis](#-scripts-disponíveis)

---

## 🎯 Sobre o Projeto

O **PizzariaGomes Frontend** é uma interface web moderna desenvolvida para operadores de pizzaria. O sistema cobre todo o fluxo operacional: desde o cadastro de produtos e categorias até o controle em tempo real dos pedidos.

### Características principais

- ✅ Interface moderna e responsiva com Tailwind CSS
- ✅ Autenticação JWT com rotas protegidas
- ✅ Gerenciamento de produtos com upload de imagem
- ✅ Dashboard de pedidos com atualização manual
- ✅ Validação robusta de formulários com Zod
- ✅ Feedback visual com notificações toast

---

## 🚀 Tecnologias

| Categoria        | Tecnologia      | Versão  | Descrição                                      |
| ---------------- | --------------- | ------- | ---------------------------------------------- |
| **Core**         | React           | 19.2.0  | Biblioteca para construção de interfaces       |
| **Linguagem**    | TypeScript      | 5.9     | Superset JavaScript com tipagem estática       |
| **Build Tool**   | Vite            | 7.2.4   | Build tool rápida para desenvolvimento moderno |
| **Estilização**  | Tailwind CSS    | 4.1.17  | Framework CSS utility-first                    |
| **Roteamento**   | React Router    | 7.10.1  | Gerenciamento de rotas SPA                     |
| **Formulários**  | React Hook Form | 7.68.0  | Gerenciamento de formulários performático      |
| **Validação**    | Zod             | 4.1.13  | Validação de schemas TypeScript-first          |
| **HTTP Client**  | Axios           | 1.13.2  | Cliente HTTP baseado em Promises               |
| **Notificações** | React Toastify  | 11.0.5  | Sistema de notificações toast                  |
| **Ícones**       | Lucide React    | 0.556.0 | Biblioteca de ícones modernos                  |

---

## ⚙️ Funcionalidades

### 🔐 Autenticação

- Login e cadastro de usuários
- Autenticação JWT com persistência de sessão via `localStorage`
- Rotas privadas com redirecionamento automático para `/login`
- Logout com limpeza de token e estado

### 📊 Dashboard

- Listagem de pedidos em andamento
- Modal com detalhes completos de cada pedido
- Finalização de pedidos diretamente pelo modal
- Atualização manual da lista de pedidos

### 📦 Categorias

- Criação de novas categorias de produto
- Validação de dados com feedback instantâneo

### 🍕 Produtos

- Listagem de produtos cadastrados em grid responsivo
- Cadastro de novos produtos com:
  - Upload de imagem com preview antes do envio
  - Nome, descrição e preço
  - Associação a uma categoria
- Formulário com validação completa via Zod

---

## 📁 Estrutura do Projeto

```
src/
├── @types/                   # Tipagens globais
│   └── types.d.ts            # CategoryProps, ProductProps, OrderProps…
│
├── components/               # Componentes reutilizáveis
│   ├── container/            # Wrapper de largura máxima
│   ├── layout/               # Shell com Sidebar + Outlet
│   └── sidebar/              # Barra de navegação superior
│
├── contexts/                 # Context API
│   ├── app/
│   │   ├── AppContext.tsx    # Definição do contexto operacional
│   │   └── AppProvider.tsx  # Provider com lógica de categorias, produtos e pedidos
│   └── auth/
│       ├── AuthContext.tsx   # Definição do contexto de autenticação
│       └── AuthProvider.tsx # Provider com lógica de login, cadastro e JWT
│
├── pages/                    # Páginas da aplicação
│   ├── category/             # Cadastro de categorias
│   │   ├── index.tsx
│   │   └── schema/schema.ts  # Schema Zod
│   ├── dashboard/            # Dashboard de pedidos
│   │   ├── index.tsx
│   │   └── components/
│   │       ├── cardOrder.tsx # Card de pedido na listagem
│   │       └── cardModal.tsx # Modal de detalhes do pedido
│   ├── login/                # Autenticação
│   │   ├── index.tsx         # Alternância login/cadastro
│   │   ├── signin/           # Tela de login
│   │   ├── signup/           # Tela de cadastro
│   │   ├── components/       # Input customizado
│   │   └── schema/schema.ts  # Schemas Zod (signinSchema, signupSchema)
│   └── product/              # Gestão de produtos
│       ├── index.tsx         # Listagem
│       ├── new/              # Cadastro de novo produto
│       ├── components/       # CardProduct, Input, Error
│       └── schema/schema.ts  # Schema Zod
│
├── routes/
│   └── Private.tsx           # HOC de proteção de rota
│
├── services/
│   └── api/
│       └── axios.ts          # Instância Axios configurada via VITE_BASE_URL
│
├── App.tsx                   # Configuração do React Router
├── main.tsx                  # Entry point
└── index.css                 # Estilos globais
```

---

## 📋 Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** ou **yarn** ou **pnpm**
- **Backend da pizzaria** rodando e acessível

---

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/samuelgomes0309/Pizzaria

# Acesse a pasta do frontend
cd pizzaria/frontend

# Instale as dependências
npm install
```

---

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto com a URL base da API:

```env
VITE_BASE_URL=http://localhost:3333
```

---

## 💻 Execução

```bash
# Inicia o servidor de desenvolvimento com HMR
npm run dev

# Compila TypeScript e gera o bundle de produção
npm run build

# Serve o build de produção localmente
npm run preview
```

A aplicação ficará disponível em **http://localhost:5173**.

---

## 🗺️ Rotas

| Rota           | Página               | Protegida |
| -------------- | -------------------- | --------- |
| `/login`       | Login / Cadastro     | ❌        |
| `/`            | Dashboard de pedidos | ✅        |
| `/category`    | Nova categoria       | ✅        |
| `/products`    | Cardápio             | ✅        |
| `/new-product` | Cadastro de produto  | ✅        |

---

## 🏗️ Contextos

### `AuthContext`

Gerencia o estado de autenticação global. Na inicialização, o `AuthProvider` valida o token existente no `localStorage` via `GET /me` antes de liberar as rotas privadas.

| Propriedade / Método | Descrição                                               |
| -------------------- | ------------------------------------------------------- |
| `user`               | Dados do usuário logado (`uid`, `name`, `email`)        |
| `signed`             | `true` quando há sessão ativa                           |
| `loadingAuth`        | `true` durante a verificação inicial via `GET /me`      |
| `handleSignIn(data)` | Login via `POST /login` — salva token no `localStorage` |
| `handleSignUp(data)` | Cadastro via `POST /signup`                             |
| `logOut()`           | Remove token do `localStorage` e limpa o estado         |

### `AppContext`

Gerencia os dados operacionais da aplicação.

| Método / Estado                           | Endpoint                      | Descrição                          |
| ----------------------------------------- | ----------------------------- | ---------------------------------- |
| `listCategory` / `handleListCategories()` | `GET /categories`             | Busca categorias                   |
| `createCategory(data)`                    | `POST /add/categories`        | Cria categoria                     |
| `listProducts` / `handleListProducts()`   | `GET /products`               | Busca produtos                     |
| `createProduct(data)`                     | `POST /add/products`          | Cria produto (multipart/form-data) |
| `listOrders` / `handleListOrders()`       | `GET /orders`                 | Busca pedidos abertos              |
| `detailOrder` / `handleDetailOrder(id)`   | `GET /orders/detail`          | Detalhes de um pedido              |
| `handleCloseOrder(id)`                    | `POST /orders/:id/closeOrder` | Fecha um pedido                    |

---

## 📜 Scripts Disponíveis

| Comando           | Descrição                                      |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Inicia o Vite em modo desenvolvimento (HMR)    |
| `npm run build`   | Compila TypeScript e gera o bundle de produção |
| `npm run preview` | Serve o build de produção localmente           |
| `npm run lint`    | Executa o ESLint em todo o projeto             |
