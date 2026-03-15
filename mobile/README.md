# 🍕 PizzariaGomes — Mobile

Aplicativo mobile para garçons e operadores de pizzaria, permitindo abrir mesas, montar pedidos com categorias e produtos, e enviá-los para a cozinha em tempo real.

![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-54.0.29-000020?style=flat&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-4.2.1-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

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
- [Contexto e Hook](#-contexto-e-hook)
- [Scripts Disponíveis](#-scripts-disponíveis)

---

## 🎯 Sobre o Projeto

O **PizzariaGomes Mobile** é o aplicativo de operação desenvolvido para garçons e atendentes da pizzaria. Através dele é possível abrir mesas, montar pedidos selecionando categorias e produtos do cardápio, gerenciar os itens adicionados e enviar o pedido para a cozinha.

### Características principais

- ✅ Interface dark moderna e responsiva com NativeWind (Tailwind CSS)
- ✅ Autenticação JWT com persistência de sessão via AsyncStorage
- ✅ Roteamento baseado em arquivos com Expo Router
- ✅ Proteção automática de rotas autenticadas
- ✅ Seleção de categorias e produtos via modal interativo
- ✅ Feedback visual com notificações toast

---

## 🚀 Tecnologias

| Categoria        | Tecnologia                    | Versão   | Descrição                                  |
| ---------------- | ----------------------------- | -------- | ------------------------------------------ |
| **Core**         | React Native                  | 0.81.5   | Framework para aplicações mobile nativas   |
| **Plataforma**   | Expo                          | ~54.0.29 | Plataforma de desenvolvimento React Native |
| **Linguagem**    | TypeScript                    | ~5.9.2   | Superset JavaScript com tipagem estática   |
| **Roteamento**   | Expo Router                   | ~6.0.19  | Roteamento baseado em arquivos para Expo   |
| **Estilização**  | NativeWind                    | ^4.2.1   | Tailwind CSS para React Native             |
| **HTTP Client**  | Axios                         | ^1.13.2  | Cliente HTTP baseado em Promises           |
| **Persistência** | AsyncStorage                  | 2.2.0    | Armazenamento chave-valor assíncrono       |
| **Notificações** | React Native Toast Message    | ^2.3.3   | Sistema de notificações toast              |
| **Ícones**       | @expo/vector-icons (Ionicons) | ^15.0.3  | Biblioteca de ícones vetoriais             |
| **Animações**    | React Native Reanimated       | ~4.1.1   | Animações performáticas na thread nativa   |

---

## ⚙️ Funcionalidades

### 🔐 Autenticação

- Login com email e senha
- Autenticação JWT com persistência via `AsyncStorage`
- Rotas privadas com redirecionamento automático para `/login`
- Logout com limpeza de token e estado global
- Validação de sessão existente na inicialização do app

### 🪑 Dashboard

- Tela inicial para operadores após o login
- Informar o número da mesa e abrir um novo pedido
- Botão de logout acessível diretamente na tela

### 🛒 Gerenciamento de Pedido

- Seleção de categoria via modal interativo
- Seleção de produto filtrado por categoria via modal interativo
- Informar quantidade do item e adicioná-lo ao pedido
- Listagem dos itens adicionados com quantidade e nome do produto
- Exclusão individual de itens do pedido
- Exclusão completa do pedido (somente quando sem itens)
- Navegação para a tela de confirmação e envio

### 📤 Envio do Pedido

- Tela de confirmação exibindo o número da mesa
- Envio do pedido para a cozinha com feedback de sucesso ou erro
- Redirecionamento automático ao dashboard após o envio

---

## 📁 Estrutura do Projeto

```
app/
├── _layout.tsx                  # Root layout: AuthProvider, StatusBar e Toast
├── index.tsx                    # Redirect inteligente baseado no estado de autenticação
├── login.tsx                    # Tela de login
└── (authenticated)/
    ├── _layout.tsx              # Layout protegido: guarda de rota autenticada
    ├── dashboard.tsx            # Abertura de nova mesa
    ├── order.tsx                # Montagem do pedido (itens, categorias, produtos)
    └── sendOrder.tsx            # Confirmação e envio do pedido

src/
├── @types/
│   └── index.ts                 # Tipagens globais (UserProps, CategoryProps, ProductProps, OrderProps…)
│
├── components/                  # Componentes reutilizáveis
│   ├── Button.tsx               # Botão estilizado com suporte a estado de loading
│   ├── Input.tsx                # Campo de texto estilizado no tema dark
│   ├── CardItem.tsx             # Card de item do pedido com botão de exclusão
│   ├── CardModal.tsx            # Modal de seleção de categorias ou produtos
│   └── Select.tsx               # Dropdown customizado para abrir o modal de seleção
│
├── contexts/
│   ├── AuthContext.tsx          # Definição do contexto de autenticação
│   └── AuthProvider.tsx         # Provider com lógica de login, logout e JWT (+hook useAuth)
│
├── hooks/
│   └── useOrder.tsx             # Hook com toda a lógica de pedidos
│
└── services/
    ├── api.config.ts            # Configuração de base URL e timeout via variável de ambiente
    └── api.ts                   # Instância Axios com interceptor de token Bearer
```

---

## 📋 Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** ou **yarn** ou **pnpm**
- **Expo Go** instalado no dispositivo ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)), ou emulador configurado
- **Backend da pizzaria** rodando e acessível na rede local

---

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/samuelgomes0309/Pizzaria

# Acesse a pasta do mobile
cd pizzaria/mobile

# Instale as dependências
npm install
```

---

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto com a URL base da API:

```env
# Substitua pelo endereço IP da máquina onde o servidor está rodando
EXPO_API_BASE_URL=http://192.168.x.x:3333
```

> **Atenção:** utilize o IP local da máquina onde o backend está rodando (encontre-o com `ipconfig` no Windows ou `ifconfig` no Linux/macOS). Não utilize `localhost`, pois o dispositivo físico ou emulador não resolve esse endereço para a máquina host.

---

## 💻 Execução

```bash
# Inicia o servidor Expo (QR code para Expo Go)
npm start

# Inicia diretamente no emulador Android
npm run android

# Inicia diretamente no simulador iOS
npm run ios

# Inicia no navegador (modo web)
npm run web
```

Ao rodar `npm start`, escaneie o QR Code exibido no terminal com o aplicativo **Expo Go** instalado no seu dispositivo físico.

---

## 🗺️ Rotas

| Rota                         | Tela                 | Protegida |
| ---------------------------- | -------------------- | --------- |
| `/login`                     | Login                | ❌        |
| `/`                          | Redirect (index)     | —         |
| `/(authenticated)/dashboard` | Abertura de mesa     | ✅        |
| `/(authenticated)/order`     | Montagem do pedido   | ✅        |
| `/(authenticated)/sendOrder` | Confirmação de envio | ✅        |

---

## 🏗️ Contexto e Hook

### `AuthContext`

Gerencia o estado de autenticação global. Na inicialização, o `AuthProvider` verifica o token e os dados do usuário persistidos no `AsyncStorage` antes de liberar as rotas privadas.

| Propriedade / Método  | Descrição                                                       |
| --------------------- | --------------------------------------------------------------- |
| `user`                | Dados do usuário logado (`id`, `name`, `email`)                 |
| `signed`              | `true` quando há sessão ativa                                   |
| `loading`             | `true` durante a verificação inicial do AsyncStorage            |
| `setLoading`          | Setter manual do estado de carregamento                         |
| `login(email, senha)` | Login via `POST /login` — salva token e usuário no AsyncStorage |
| `logOut()`            | Remove token e usuário do AsyncStorage e limpa o estado         |

### `useOrder`

Hook centralizado com toda a lógica de criação e gerenciamento de pedidos. Utilizado pelas telas `dashboard`, `order` e `sendOrder`.

| Método / Estado                | Endpoint                      | Descrição                                         |
| ------------------------------ | ----------------------------- | ------------------------------------------------- |
| `handleOpenOrder()`            | `POST /add/orders`            | Cria novo pedido e navega para a tela de itens    |
| `loadCategories(id?)`          | `GET /categories`             | Carrega categorias; filtra produtos ao selecionar |
| `loadProducts(category_id)`    | `GET /products/categories`    | Carrega produtos filtrados por categoria          |
| `handleAddItens()`             | `POST /orders/add/items`      | Adiciona item (produto + quantidade) ao pedido    |
| `handleDeleteItem(product_id)` | `DELETE /orders/remove/items` | Remove um item do pedido                          |
| `handleDetailOrder()`          | `GET /orders/detail`          | Atualiza os itens listados no pedido              |
| `handleDeleteOrder()`          | `DELETE /remove/orders`       | Exclui o pedido (somente quando sem itens)        |
| `handleSendOrder()`            | `POST /order/:id/startOrder`  | Envia o pedido para a cozinha                     |
| `handleOpenModal(type)`        | —                             | Abre o modal de seleção (categoria ou produto)    |
| `handleSelectItem(item, type)` | —                             | Seleciona item no modal e atualiza o estado       |
| `navigateToSendOrder()`        | —                             | Navega para a tela de confirmação de envio        |

---

## 📜 Scripts Disponíveis

| Comando           | Descrição                              |
| ----------------- | -------------------------------------- |
| `npm start`       | Inicia o servidor Expo com QR code     |
| `npm run android` | Inicia no emulador/dispositivo Android |
| `npm run ios`     | Inicia no simulador/dispositivo iOS    |
| `npm run web`     | Inicia no navegador web                |
| `npm run lint`    | Executa o ESLint em todo o projeto     |
