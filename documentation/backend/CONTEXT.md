# 🏗️ Contexto e Arquitetura - Backend Pizzaria

Este documento explica a arquitetura, padrões de design e organização do projeto backend da Pizzaria.

---

## 📐 Arquitetura do Projeto

### Padrão MVC (Model-View-Controller) Adaptado

O projeto utiliza uma variação do padrão MVC adaptada para APIs RESTful:

```
Cliente → Routes → Controllers → Services → Prisma (ORM) → Database
```

**Fluxo de uma Requisição:**

1. **Cliente** faz uma requisição HTTP
2. **Route** identifica o endpoint e chama o controller correspondente
3. **Controller** extrai dados da requisição e chama o service
4. **Service** contém a lógica de negócio e interage com o banco via Prisma
5. **Prisma** executa queries SQL no PostgreSQL
6. **Resposta** retorna pelo caminho inverso até o cliente

---

## 📂 Estrutura de Diretórios

```
backend/
├── prisma/                    # Configuração do banco de dados
│   ├── schema.prisma          # Schema do banco (modelos e relações)
│   └── migrations/            # Histórico de migrações
│
├── generated/                 # Código gerado automaticamente pelo Prisma
│   └── prisma/                # Cliente Prisma tipado
│
├── src/                       # Código fonte da aplicação
│   ├── server.ts              # Configuração e inicialização do servidor
│   ├── routes.ts              # Definição de todas as rotas da API
│   │
│   ├── controllers/           # Camada de controle (recebe requisições)
│   │   ├── user/              # Controllers de usuário
│   │   ├── category/          # Controllers de categoria
│   │   ├── product/           # Controllers de produto
│   │   └── order/             # Controllers de pedido
│   │
│   ├── services/              # Camada de negócio (lógica da aplicação)
│   │   ├── user/              # Services de usuário
│   │   ├── category/          # Services de categoria
│   │   ├── product/           # Services de produto
│   │   └── order/             # Services de pedido
│   │
│   ├── middlewares/           # Middlewares da aplicação
│   │   └── isAuthenticated.ts # Verificação de autenticação JWT
│   │
│   ├── config/                # Configurações
│   │   └── multer.ts          # Configuração de upload de arquivos
│   │
│   ├── prisma/                # Configuração do Prisma
│   │   └── prismaClient.ts    # Instância singleton do Prisma Client
│   │
│   └── @types/                # Definições de tipos TypeScript
│       └── express/           # Extensões de tipos do Express
│
└── tmp/                       # Armazenamento temporário de uploads
```

---

## 🎯 Responsabilidades das Camadas

### 1. **Controllers** (`src/controllers/`)

**Responsabilidade:** Receber requisições HTTP, extrair dados e delegar ao service.

**O que fazem:**

- Extraem parâmetros da requisição (body, query, params, files)
- Chamam o service correspondente
- Retornam a resposta HTTP

**O que NÃO fazem:**

- Lógica de negócio
- Validações complexas
- Acesso direto ao banco de dados

**Exemplo:**

```typescript
class CreateCategoryController {
	async handle(req: Request, res: Response) {
		const { name } = req.body;
		const createCategoryService = new CreateCategoryService();
		const category = await createCategoryService.execute({ name });
		return res.json(category);
	}
}
```

---

### 2. **Services** (`src/services/`)

**Responsabilidade:** Implementar a lógica de negócio da aplicação.

**O que fazem:**

- Validam dados de entrada
- Implementam regras de negócio
- Interagem com o banco de dados via Prisma
- Tratam erros e exceções

**O que NÃO fazem:**

- Lidam diretamente com requisições HTTP
- Formatam respostas HTTP

**Exemplo:**

```typescript
class CreateCategoryService {
	async execute({ name }: CreateCategoryRequest) {
		if (!name) {
			throw new Error("Nome da categoria é obrigatório");
		}

		const category = await prismaClient.category.create({
			data: { name },
		});

		return category;
	}
}
```

---

### 3. **Routes** (`src/routes.ts`)

**Responsabilidade:** Mapear endpoints HTTP para controllers.

**Características:**

- Define todos os endpoints da API
- Aplica middlewares (autenticação, upload)
- Mantém a organização por domínio (user, category, product, order)

---

### 4. **Middlewares** (`src/middlewares/`)

**Responsabilidade:** Interceptar requisições antes dos controllers.

**Middlewares implementados:**

#### `isAuthenticated`

- Verifica presença do token JWT
- Valida assinatura do token
- Injeta dados do usuário na requisição

---

## 🗄️ Banco de Dados e Prisma

### Modelo de Dados

O sistema gerencia 5 entidades principais:

```
User (Usuário)
├── id: UUID
├── name: string
├── email: string (único)
├── password: string (hash bcrypt)
└── timestamps

Category (Categoria de Produtos)
├── id: UUID
├── name: string
├── timestamps
└── products: Product[]

Product (Produto)
├── id: UUID
├── name: string
├── price: int
├── description: string
├── banner: string (nome do arquivo)
├── categoryId: UUID → Category
├── timestamps
└── items: Item[]

Order (Pedido)
├── id: UUID
├── table: int (número da mesa)
├── status: boolean (false=andamento, true=finalizado)
├── draft: boolean (true=rascunho, false=confirmado)
├── name: string? (nome do cliente)
├── timestamps
└── items: Item[]

Item (Item do Pedido)
├── id: UUID
├── amount: int (quantidade)
├── orderId: UUID → Order
├── productId: UUID → Product
└── timestamps
```

### Relacionamentos

- **Category → Product**: Um para muitos (1:N)
- **Order → Item**: Um para muitos (1:N)
- **Product → Item**: Um para muitos (1:N)

---

## 🔐 Autenticação e Segurança

### JWT (JSON Web Token)

**Fluxo de Autenticação:**

1. **Login:** Usuário envia email e senha
2. **Validação:** Sistema verifica credenciais com bcrypt
3. **Token:** Sistema gera JWT assinado com SECRET_KEY
4. **Requisições:** Cliente envia token no header `Authorization: Bearer {token}`
5. **Verificação:** Middleware `isAuthenticated` valida token em cada requisição

### Segurança de Senhas

- **Hash:** Senhas são hasheadas com `bcryptjs` (10 rounds)
- **Nunca armazenamos senhas em texto puro**
- **Comparação:** bcrypt.compare() valida login de forma segura

---

## 📤 Upload de Arquivos

### Multer Configuration

**Localização:** `src/config/multer.ts`

**Configuração:**

- **Destino:** `tmp/` (arquivos temporários)
- **Nomeação:** timestamp + nome original
- **Tipos aceitos:** Imagens (JPEG, PNG, etc.)
- **Servir arquivos:** Express static serve `/files/`

**Fluxo de Upload:**

1. Cliente envia FormData com arquivo
2. Multer intercepta e salva em `tmp/`
3. Controller recebe `req.file` com informações
4. Service salva nome do arquivo no banco
5. Arquivo acessível via `/files/{filename}`

---

## 🔄 Fluxo de Negócio: Pedidos

### Estados de um Pedido

1. **Draft (Rascunho)**
   - `draft: true`, `status: false`
   - Pode adicionar/remover itens
   - Pode ser deletado

2. **Em Andamento**
   - `draft: false`, `status: false`
   - Não pode ser deletado
   - Pode adicionar itens (depende da regra de negócio)

3. **Finalizado**
   - `draft: false`, `status: true`
   - Pedido concluído
   - Não pode ser modificado

### Operações de Pedido

```
Criar Pedido (draft)
    ↓
Adicionar Itens
    ↓
Iniciar Pedido (remove draft)
    ↓
... preparação ...
    ↓
Fechar Pedido (status=true)
```

---

## 🛠️ Tecnologias Utilizadas

### Core

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express** - Framework web minimalista

### Database & ORM

- **PostgreSQL** - Banco de dados relacional
- **Prisma** - ORM moderno e type-safe
- **pg** - Driver PostgreSQL para Node.js

### Autenticação & Segurança

- **jsonwebtoken** - Geração e validação de JWT
- **bcryptjs** - Hash de senhas

### Upload de Arquivos

- **multer** - Middleware para upload multipart/form-data

### Utilidades

- **dotenv** - Gerenciamento de variáveis de ambiente
- **cors** - Controle de acesso CORS
- **express-async-errors** - Tratamento automático de erros assíncronos

### Desenvolvimento

- **ts-node-dev** - Execução TypeScript com hot reload
- **prettier** - Formatação de código

---

## 🎨 Padrões de Código

### Nomenclatura

**Controllers:**

- Padrão: `{Action}{Entity}Controller`
- Exemplos: `CreateUserController`, `ListOrderController`

**Services:**

- Padrão: `{Action}{Entity}Service`
- Exemplos: `CreateUserService`, `ListOrderService`

**Métodos:**

- Controllers: `handle(req, res)`
- Services: `execute(data)`

### Organização

- **Um arquivo por classe**
- **Agrupamento por domínio** (user, category, product, order)
- **Separação clara de responsabilidades**

---

## ⚡ Middlewares

### Global Middlewares (aplicados a todas as rotas)

1. **express.json()** - Parse de JSON no body
2. **express.static()** - Servir arquivos estáticos
3. **cors()** - Habilitar CORS
4. **Error Handler** - Captura erros globalmente

### Route-Specific Middlewares

1. **isAuthenticated** - Verifica autenticação JWT
2. **multer** - Processa upload de arquivos

---

## 🚨 Tratamento de Erros

### Estratégia

```typescript
// Middleware Global de Erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof Error) {
		return res.status(400).json({ error: err.message });
	}
	return res.status(500).json({
		status: "error",
		message: "Internal server error.",
	});
});
```

**Como funciona:**

- Services lançam erros com `throw new Error("mensagem")`
- `express-async-errors` captura erros assíncronos automaticamente
- Middleware global formata resposta de erro

---

## 🔧 Variáveis de Ambiente

```env
DATABASE_URL       # URL de conexão com PostgreSQL
JWT_SECRET_KEY     # Chave secreta para assinar JWT
```

Ver [.env.example](.env.example) para mais detalhes.

---

## 📊 Performance e Otimização

### Prisma Client

- **Singleton Pattern:** Uma única instância do Prisma Client
- **Connection Pooling:** Gerenciamento automático de conexões
- **Type Safety:** Queries totalmente tipadas

### Assets Estáticos

- Servidos diretamente pelo Express (alta performance)
- Sem processamento desnecessário

---

## 🧪 Possíveis Melhorias Futuras

1. **Validação de Dados**
   - Implementar biblioteca de validação (Zod, Yup)
   - Validar inputs antes da lógica de negócio

2. **Testes**
   - Testes unitários (Jest)
   - Testes de integração
   - Testes E2E

3. **Documentação**
   - Swagger/OpenAPI
   - Documentação automática de endpoints

4. **Segurança**
   - Rate limiting
   - Helmet.js (headers de segurança)
   - Validação de tipos de arquivo em uploads

5. **Logging**
   - Sistema de logs estruturado (Winston, Pino)
   - Monitoramento de erros (Sentry)

6. **Cache**
   - Redis para cache de queries frequentes
   - Cache de sessões

7. **CI/CD**
   - Pipeline de deploy automatizado
   - Testes automatizados

---

## 📖 Recursos Adicionais

- [Documentação da API](./API.md)
- [README do Projeto](./README.md)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express Documentation](https://expressjs.com/)

---

**Última atualização:** 15 de março de 2026
