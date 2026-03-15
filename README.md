<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Licença-MIT-green?style=for-the-badge" alt="Licença" />
</p>

# 🍕 Pizzaria Gomes — Sistema Completo

Sistema fullstack para gerenciamento de pizzaria com **API REST**, **painel administrativo web** e **aplicativo mobile para garçons**. Desenvolvido por **Samuel Gomes da Silva**.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Native-61DAFB?style=flat&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white" />
</p>

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Stack Tecnológica](#-stack-tecnológica)
- [Modelos de Dados](#-modelos-de-dados)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Monorepo](#-estrutura-do-monorepo)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Endpoints da API](#-endpoints-da-api)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Fluxo do Pedido](#-fluxo-do-pedido)
- [Documentação Detalhada](#-documentação-detalhada)
- [Licença](#-licença)
- [Autor](#-autor)

---

## 🎯 Visão Geral

O **Pizzaria Gomes** é um ecossistema completo para operação de pizzaria, dividido em três aplicações integradas:

| Aplicação    | Público-Alvo              | Função                                                              |
| ------------ | ------------------------- | ------------------------------------------------------------------- |
| **Backend**  | API central               | Gerencia autenticação, categorias, produtos e pedidos               |
| **Frontend** | Administradores / Cozinha | Painel web para cadastrar produtos, categorias e acompanhar pedidos |
| **Mobile**   | Garçons / Atendentes      | App para abrir mesas, montar pedidos e enviar para a cozinha        |

### Fluxo de Operação

```
  👨‍🍳 GARÇOM (Mobile)              🖥️ ADMINISTRADOR (Web)             🔧 API (Backend)
  ┌──────────────────┐          ┌───────────────────────┐          ┌──────────────────┐
  │ • Abre mesa      │          │ • Cadastra categorias │          │ • PostgreSQL     │
  │ • Monta pedido   │ ──────▶  │ • Cadastra produtos   │ ──────▶  │ • Prisma ORM     │
  │ • Envia p/ cozinha│          │ • Acompanha pedidos   │          │ • JWT Auth       │
  │                   │          │ • Finaliza pedidos    │          │ • Multer Upload  │
  └──────────────────┘          └───────────────────────┘          └──────────────────┘
         ▲                              ▲                                  │
         │                              │                                  │
         └──────────────────────────────┴──────────────────────────────────┘
                                   REST API (HTTP)
```

---

## 🏗️ Arquitetura do Sistema

```
                    ┌─────────────────────────────┐
                    │       PostgreSQL Database     │
                    │  (users, categories, products,│
                    │    orders, items)             │
                    └──────────────┬───────────────┘
                                   │ Prisma ORM
                    ┌──────────────▼───────────────┐
                    │     Backend (Node/Express)    │
                    │         Porta: 3333           │
                    │                               │
                    │  ┌─────────┐  ┌───────────┐  │
                    │  │ Routes  │→ │Controllers│  │
                    │  └─────────┘  └─────┬─────┘  │
                    │                     │        │
                    │               ┌─────▼─────┐  │
                    │               │ Services  │  │
                    │               └─────┬─────┘  │
                    │                     │        │
                    │               ┌─────▼─────┐  │
                    │               │  Prisma   │  │
                    │               └───────────┘  │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────┴───────────────┐
                    │                               │
           ┌────────▼────────┐            ┌────────▼────────┐
           │  Frontend (Web)  │            │  Mobile (App)   │
           │  React + Vite    │            │  React Native   │
           │  Porta: 5173     │            │  Expo ~54       │
           │                  │            │                 │
           │  • Dashboard     │            │  • Login        │
           │  • Produtos      │            │  • Dashboard    │
           │  • Categorias    │            │  • Pedido       │
           │  • Pedidos       │            │  • Envio        │
           └──────────────────┘            └─────────────────┘
```

### Padrão Arquitetural (Backend)

O backend segue o padrão **MVC adaptado** com camadas bem definidas:

- **Routes** → Define rotas e middlewares
- **Controllers** → Recebe requisições, extrai parâmetros
- **Services** → Regras de negócio (uma classe por operação)
- **Prisma Client** → Acesso ao banco de dados

---

## 🚀 Stack Tecnológica

### Backend

| Tecnologia | Versão | Função                    |
| ---------- | ------ | ------------------------- |
| Node.js    | ≥ 16   | Runtime JavaScript        |
| TypeScript | 5.9    | Tipagem estática          |
| Express    | 4.x    | Framework HTTP            |
| Prisma     | 7.0.1  | ORM com type-safety       |
| PostgreSQL | ≥ 13   | Banco de dados relacional |
| JWT        | 9.0.2  | Autenticação via token    |
| bcryptjs   | 3.0.3  | Hash de senhas            |
| Multer     | 2.0.2  | Upload de arquivos        |

### Frontend

| Tecnologia      | Versão | Função                    |
| --------------- | ------ | ------------------------- |
| React           | 19.2.0 | Biblioteca de UI          |
| TypeScript      | 5.9    | Tipagem estática          |
| Vite            | 7.2.4  | Build tool                |
| Tailwind CSS    | 4.1.17 | Estilização utility-first |
| React Router    | 7.10.1 | Roteamento SPA            |
| React Hook Form | 7.68.0 | Formulários               |
| Zod             | 4.1.13 | Validação de schemas      |
| Axios           | 1.13.2 | Cliente HTTP              |

### Mobile

| Tecnologia   | Versão   | Função                        |
| ------------ | -------- | ----------------------------- |
| React Native | 0.81.5   | Framework mobile              |
| Expo         | ~54.0.29 | Plataforma de desenvolvimento |
| TypeScript   | ~5.9.2   | Tipagem estática              |
| Expo Router  | ~6.0.19  | Roteamento file-based         |
| NativeWind   | 4.2.1    | Tailwind CSS para RN          |
| AsyncStorage | 2.2.0    | Persistência local            |
| Axios        | 1.13.2   | Cliente HTTP                  |

---

## 🗄️ Modelos de Dados

O banco de dados PostgreSQL contém 5 tabelas gerenciadas pelo Prisma:

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│    users     │     │    categories    │     │    orders    │
├──────────────┤     ├──────────────────┤     ├──────────────┤
│ id (PK/UUID) │     │ id (PK/UUID)     │     │ id (PK/UUID) │
│ name         │     │ name             │     │ table (Int)  │
│ email (UQ)   │     │ created_at       │     │ status       │
│ password     │     │ updated_at       │     │ draft        │
│ created_at   │     │                  │     │ name?        │
│ updated_at   │     │                  │     │ created_at   │
└──────────────┘     └────────┬─────────┘     │ updated_at   │
                              │ 1:N           └──────┬───────┘
                     ┌────────▼─────────┐            │ 1:N
                     │    products      │     ┌──────▼───────┐
                     ├──────────────────┤     │    items     │
                     │ id (PK/UUID)     │     ├──────────────┤
                     │ name             │     │ id (PK/UUID) │
                     │ price (Int)      │     │ amount (Int) │
                     │ description      │     │ orderId (FK) │◄──── Order
                     │ banner           │     │ productId(FK)│◄──── Product
                     │ categoryId (FK)  │     │ created_at   │
                     │ created_at       │     │ updated_at   │
                     │ updated_at       │     └──────────────┘
                     └──────────────────┘
```

### Relacionamentos

| Relação            | Tipo | Descrição                               |
| ------------------ | ---- | --------------------------------------- |
| Category → Product | 1:N  | Cada categoria possui vários produtos   |
| Order → Item       | 1:N  | Cada pedido contém vários itens         |
| Product → Item     | 1:N  | Cada produto pode estar em vários itens |

### Campos Importantes

| Campo    | Modelo  | Descrição                                         |
| -------- | ------- | ------------------------------------------------- |
| `draft`  | Order   | `true` = rascunho, `false` = enviado para cozinha |
| `status` | Order   | `false` = em andamento, `true` = finalizado       |
| `price`  | Product | Valor em centavos (inteiro)                       |
| `banner` | Product | Nome do arquivo de imagem salvo em `backend/tmp/` |

---

## ⚙️ Funcionalidades

### 🔐 Autenticação

- Cadastro de usuários com hash bcryptjs
- Login com geração de token JWT (expiração: 30 dias)
- Middleware `isAuthenticated` protege todas as rotas (exceto login/signup)
- Consulta dos dados do usuário logado via token

### 📦 Categorias

- Cadastro com nome (auto-uppercase + verificação de duplicatas)
- Listagem de todas as categorias

### 🍕 Produtos

- Cadastro com nome, descrição, preço e imagem (upload via Multer)
- Listagem geral de todos os produtos
- Listagem filtrada por categoria

### 🛒 Pedidos

- Criação de pedidos associados a uma mesa (rascunho)
- Adição de itens (lógica inteligente: se o mesmo produto já existe, soma a quantidade)
- Remoção de itens (apenas em pedidos com `draft = true`)
- Exclusão completa do pedido
- Envio do pedido para a cozinha (`draft` → `false`)
- Finalização do pedido (`status` → `true`)
- Listagem de pedidos enviados (não-rascunho, não-finalizados)
- Detalhamento completo de um pedido com itens e produtos

---

## 📁 Estrutura do Monorepo

```
pizzaria/
│
├── 📄 README.md                  ← Você está aqui
├── 📄 LICENSE                    ← Licença MIT
│
├── 📂 backend/                   ← API REST (Node.js + Express)
│   ├── prisma/                   ← Schema e migrations do Prisma
│   ├── generated/prisma/         ← Client Prisma gerado
│   ├── src/
│   │   ├── server.ts             ← Ponto de entrada (porta 3333)
│   │   ├── routes.ts             ← Definição de todas as rotas
│   │   ├── middlewares/          ← isAuthenticated (JWT)
│   │   ├── controllers/          ← Controllers por domínio
│   │   │   ├── user/             ← CreateUser, LoginUser, InfoUser
│   │   │   ├── category/         ← CreateCategory, ListCategory
│   │   │   ├── product/          ← CreateProduct, ListProductByCategory, ListProducts
│   │   │   └── order/            ← CreateOrder, DeleteOrder, AddItem, RemoveItem,
│   │   │                            StartOrder, CloseOrder, ListOrder, DetailOrder
│   │   ├── services/             ← Regras de negócio (1 classe por operação)
│   │   ├── prisma/               ← prismaClient singleton
│   │   └── config/               ← Configuração do Multer (upload)
│   └── tmp/                      ← Pasta de uploads de imagens
│
├── 📂 frontend/                  ← Painel Web (React + Vite)
│   └── src/
│       ├── App.tsx               ← Router com createBrowserRouter
│       ├── main.tsx              ← AuthProvider + React.StrictMode
│       ├── pages/
│       │   ├── login/            ← Tela de login
│       │   ├── dashboard/        ← Listagem de pedidos em andamento
│       │   ├── category/         ← Formulário de cadastro de categoria
│       │   └── product/          ← Listagem + cadastro de produtos
│       ├── components/           ← Container, Layout, Sidebar
│       ├── contexts/             ← AuthContext + AppContext
│       ├── routes/               ← Private.tsx (HOC de proteção)
│       └── services/api/         ← Axios configurado
│
├── 📂 mobile/                    ← App Mobile (React Native + Expo)
│   ├── app/                      ← Rotas (Expo Router file-based)
│   │   ├── _layout.tsx           ← Root: AuthProvider + Toast
│   │   ├── index.tsx             ← Redirect inteligente
│   │   ├── login.tsx             ← Tela de login
│   │   └── (authenticated)/      ← Grupo protegido
│   │       ├── dashboard.tsx     ← Abrir mesa
│   │       ├── order.tsx         ← Montar pedido
│   │       └── sendOrder.tsx     ← Confirmar envio
│   └── src/
│       ├── components/           ← Button, Input, Select, CardItem, CardModal
│       ├── contexts/             ← AuthContext + AuthProvider
│       ├── hooks/useOrder.tsx    ← Hook centralizando TODA lógica de pedido
│       └── services/             ← Axios com interceptor de token
│
└── 📂 documentation/             ← Documentação detalhada
    ├── backend/
    │   ├── CONTEXT.md            ← Arquitetura e decisões do backend
    │   └── ENDPOINTS.md          ← Referência completa de todos os endpoints
    ├── frontend/
    │   └── FRONTEND_CONTEXT.md   ← Arquitetura e práticas do frontend
    └── mobile/
        ├── CONTEXT-MOBILE.md     ← Arquitetura e decisões do mobile
        └── API-MOBILE.md         ← Endpoints consumidos pelo app
```

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

| Requisito           | Versão Mínima | Verificar Instalação               |
| ------------------- | :-----------: | ---------------------------------- |
| **Node.js**         |     16.x      | `node --version`                   |
| **npm** ou **yarn** |       —       | `npm --version` / `yarn --version` |
| **PostgreSQL**      |     13.x      | `psql --version`                   |
| **Expo CLI**        |       —       | `npx expo --version`               |
| **Git**             |       —       | `git --version`                    |

---

## 🔧 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/samuelgomes0309/Pizzaria.git
cd Pizzaria
```

### 2. Backend

```bash
cd backend

# Instalar dependências
yarn install  # ou npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/pizzaria"
JWT_SECRET="sua_chave_secreta_aqui"
```

```bash
# Gerar client Prisma e rodar migrations
npx prisma migrate dev

# Iniciar servidor de desenvolvimento
yarn dev
```

O backend estará rodando em `http://localhost:3333`.

### 3. Frontend

```bash
cd frontend

# Instalar dependências
yarn install  # ou npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env`:

```env
VITE_BASE_URL="http://localhost:3333"
```

```bash
# Iniciar servidor de desenvolvimento
yarn dev  # ou npm run dev
```

O frontend estará acessível em `http://localhost:5173`.

### 4. Mobile

```bash
cd mobile

# Instalar dependências
yarn install  # ou npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env`:

```env
EXPO_API_BASE_URL="http://SEU_IP_LOCAL:3333"
```

> ⚠️ **Importante:** Use o IP local da sua máquina (ex: `192.168.1.100`), não `localhost`, pois o emulador/dispositivo precisa acessar o backend pela rede.

```bash
# Iniciar Expo
npx expo start
```

Escaneie o QR code com o Expo Go (Android) ou use o emulador.

---

## ▶️ Executando o Projeto

### Inicialização Rápida (3 terminais)

**Terminal 1 — Backend:**

```bash
cd backend && yarn dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend && yarn dev
```

**Terminal 3 — Mobile:**

```bash
cd mobile && npx expo start
```

### Scripts Disponíveis

| Projeto  | Comando                    | Descrição                                    |
| -------- | -------------------------- | -------------------------------------------- |
| Backend  | `yarn dev`                 | Inicia servidor com hot-reload (ts-node-dev) |
| Frontend | `yarn dev`                 | Inicia Vite dev server                       |
| Frontend | `yarn build`               | Build de produção                            |
| Frontend | `yarn lint`                | Executa ESLint                               |
| Frontend | `yarn preview`             | Preview do build                             |
| Mobile   | `npx expo start`           | Inicia Expo dev server                       |
| Mobile   | `npx expo start --android` | Inicia no emulador Android                   |
| Mobile   | `npx expo start --ios`     | Inicia no emulador iOS                       |

---

## 📡 Endpoints da API

> Documentação completa em [documentation/backend/ENDPOINTS.md](documentation/backend/ENDPOINTS.md)

### Visão Geral

| Método   | Rota                           | Descrição                     | Auth |
| -------- | ------------------------------ | ----------------------------- | :--: |
| `POST`   | `/signup`                      | Cadastrar usuário             |  ❌  |
| `POST`   | `/login`                       | Autenticar usuário            |  ❌  |
| `GET`    | `/me`                          | Dados do usuário logado       |  ✅  |
| `POST`   | `/add/categories`              | Criar categoria               |  ✅  |
| `GET`    | `/categories`                  | Listar categorias             |  ✅  |
| `POST`   | `/add/products`                | Criar produto (com imagem)    |  ✅  |
| `GET`    | `/products`                    | Listar todos os produtos      |  ✅  |
| `GET`    | `/products/category`           | Listar produtos por categoria |  ✅  |
| `POST`   | `/add/orders`                  | Criar pedido (rascunho)       |  ✅  |
| `DELETE` | `/remove/orders`               | Excluir pedido                |  ✅  |
| `POST`   | `/orders/add/items`            | Adicionar item ao pedido      |  ✅  |
| `DELETE` | `/orders/remove/items`         | Remover item do pedido        |  ✅  |
| `POST`   | `/orders/:order_id/startOrder` | Enviar pedido p/ cozinha      |  ✅  |
| `POST`   | `/orders/:order_id/closeOrder` | Finalizar pedido              |  ✅  |
| `GET`    | `/orders`                      | Listar pedidos em andamento   |  ✅  |
| `GET`    | `/orders/detail`               | Detalhes de um pedido         |  ✅  |

---

## 🔑 Variáveis de Ambiente

### Backend (`.env`)

| Variável       | Descrição                     | Exemplo                                          |
| -------------- | ----------------------------- | ------------------------------------------------ |
| `DATABASE_URL` | String de conexão PostgreSQL  | `postgresql://user:pass@localhost:5432/pizzaria` |
| `JWT_SECRET`   | Chave secreta para tokens JWT | `minha_chave_ultra_secreta`                      |

### Frontend (`.env`)

| Variável        | Descrição               | Exemplo                 |
| --------------- | ----------------------- | ----------------------- |
| `VITE_BASE_URL` | URL base da API backend | `http://localhost:3333` |

### Mobile (`.env`)

| Variável            | Descrição                  | Exemplo                     |
| ------------------- | -------------------------- | --------------------------- |
| `EXPO_API_BASE_URL` | URL base da API (IP local) | `http://192.168.1.100:3333` |

---

## 🔄 Fluxo do Pedido

O ciclo de vida de um pedido passa por 3 estados:

```
┌─────────────────┐      POST /orders/:id       ┌─────────────────┐      POST /orders/:id       ┌─────────────────┐
│    RASCUNHO     │        /startOrder           │  EM ANDAMENTO   │        /closeOrder          │   FINALIZADO    │
│                 │ ──────────────────────────▶   │                 │ ──────────────────────────▶  │                 │
│ draft = true    │                              │ draft = false   │                              │ draft = false   │
│ status = false  │                              │ status = false  │                              │ status = true   │
│                 │                              │                 │                              │                 │
│ 📱 Garçom monta│                              │ 🖥️ Aparece no   │                              │ ✅ Concluído    │
│    o pedido     │                              │    dashboard web│                              │                 │
└─────────────────┘                              └─────────────────┘                              └─────────────────┘
       │
       │  Operações disponíveis no rascunho:
       │  • POST /orders/add/items (adicionar item)
       │  • DELETE /orders/remove/items (remover item)
       │  • DELETE /remove/orders (excluir pedido)
       │  • GET /orders/detail (ver detalhes)
```

### Passo a Passo

1. **Garçom** abre a mesa no app mobile → `POST /add/orders`
2. **Garçom** seleciona categoria e produtos → `POST /orders/add/items`
3. **Garçom** envia pedido para cozinha → `POST /orders/:id/startOrder`
4. **Administrador** visualiza pedido no painel web → `GET /orders`
5. **Administrador** verifica detalhes → `GET /orders/detail`
6. **Administrador** finaliza pedido após entrega → `POST /orders/:id/closeOrder`

---

## 📚 Documentação Detalhada

Cada parte do projeto possui documentação aprofundada:

| Documento                                                                                | Descrição                                                      |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [documentation/backend/CONTEXT.md](documentation/backend/CONTEXT.md)                     | Arquitetura, decisões técnicas e convenções do backend         |
| [documentation/backend/ENDPOINTS.md](documentation/backend/ENDPOINTS.md)                 | Referência completa de todos os endpoints com request/response |
| [documentation/frontend/FRONTEND_CONTEXT.md](documentation/frontend/FRONTEND_CONTEXT.md) | Arquitetura, componentes e práticas do frontend                |
| [documentation/mobile/CONTEXT-MOBILE.md](documentation/mobile/CONTEXT-MOBILE.md)         | Arquitetura, auth flow e decisões do app mobile                |
| [documentation/mobile/API-MOBILE.md](documentation/mobile/API-MOBILE.md)                 | Mapeamento de endpoints consumidos pelo mobile                 |
| [backend/README.md](backend/README.md)                                                   | Guia de instalação e uso do backend                            |
| [frontend/README.md](frontend/README.md)                                                 | Guia de instalação e uso do frontend                           |
| [mobile/README.md](mobile/README.md)                                                     | Guia de instalação e uso do mobile                             |

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** — veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👤 Autor

**Samuel Gomes da Silva**

- GitHub: [@samuelgomes0309](https://github.com/samuelgomes0309)

---
