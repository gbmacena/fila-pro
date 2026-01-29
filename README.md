# Fila-Pro

Um sistema completo de gerenciamento de filas em tempo real, desenvolvido com tecnologias modernas para facilitar o controle de atendimentos em estabelecimentos como bancos, restaurantes e clínicas.

## 📋 Descrição

O Fila-Pro é uma aplicação web que permite aos usuários gerenciar filas de atendimento de forma eficiente. Inclui funcionalidades de autenticação, criação de tickets, acompanhamento em tempo real via WebSocket, painel público para visualização e um dashboard administrativo.

## Previews

### Landing Page

![Landing Page](previews/landing-page.png)

### Dashboard Administrativo

![Dashboard](previews/dashboard.png)

### Painel Público

![Painel Público](previews/public-panel.png)

## ✨ Funcionalidades

- **Autenticação JWT**: Sistema seguro de login e registro de usuários
- **Gerenciamento de Filas**: Criação e controle de filas por usuário
- **Tickets em Tempo Real**: Geração de códigos únicos e acompanhamento da posição na fila
- **WebSocket Integration**: Atualizações em tempo real do status da fila
- **Painel Público**: Visualização da fila sem necessidade de login
- **Dashboard Administrativo**: Controle completo das operações da fila
- **API RESTful**: Backend robusto com NestJS
- **Interface Responsiva**: Frontend moderno com Next.js e Tailwind CSS

## 🛠️ Tecnologias Utilizadas

### Backend

- **NestJS**: Framework Node.js para aplicações escaláveis
- **TypeScript**: Tipagem estática para maior robustez
- **Prisma**: ORM para PostgreSQL
- **PostgreSQL**: Banco de dados relacional
- **JWT**: Autenticação baseada em tokens
- **WebSocket/Socket.io**: Comunicação em tempo real
- **Winston**: Sistema de logging estruturado

### Frontend

- **Next.js 16**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Framework CSS utilitário
- **React Hook Form + Zod**: Validação de formulários
- **Context API**: Gerenciamento de estado global

### DevOps & Qualidade

- **Jest**: Framework de testes
- **ESLint**: Linting de código
- **GitHub Actions**: CI/CD automatizado

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- PostgreSQL (versão 13 ou superior)
- Git

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/fila-pro.git
cd fila-pro
```

### 2. Configuração do Backend

```bash
cd backend
npm install
```

#### Variáveis de Ambiente

Copie o arquivo de exemplo e configure as variáveis:

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fila_pro"

# JWT
JWT_SECRET="sua-chave-secreta-muito-segura-aqui"

# CORS
CORS_ORIGINS="http://localhost:3000,https://seu-dominio.com"

# Application
PORT=3001
NODE_ENV=development
```

#### Configuração do Banco de Dados

```bash
# Execute as migrações do Prisma
npx prisma migrate deploy

# (Opcional) Gere o cliente Prisma
npx prisma generate
```

### 3. Configuração do Frontend

```bash
cd ../frontend
npm install
```

#### Variáveis de Ambiente do Frontend

```bash
cp .env.example .env.local
```

Configure o `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## ▶️ Como Executar

### Desenvolvimento

#### Backend

```bash
cd backend
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm run dev
```

A aplicação estará disponível em:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Documentação API: http://localhost:3001/api (Swagger)

## 🧪 Testes

### Backend

```bash
cd backend

# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

### Frontend

```bash
cd frontend

# Testes unitários
npm run test

# Testes e2e (se configurado)
npm run test:e2e
```

## 📁 Estrutura do Projeto

```
fila-pro/
├── backend/
│   ├── src/
│   │   ├── auth/          # Módulo de autenticação
│   │   ├── common/        # Utilitários compartilhados
│   │   ├── prisma/        # Configuração do Prisma
│   │   ├── queue/         # Lógica da fila
│   │   ├── tickets/       # Gerenciamento de tickets
│   │   └── ...
│   ├── prisma/
│   │   ├── schema.prisma  # Schema do banco
│   │   └── migrations/    # Migrações
│   └── test/              # Testes e2e
├── frontend/
│   ├── src/
│   │   ├── app/           # Páginas Next.js
│   │   ├── components/    # Componentes React
│   │   ├── contexts/      # Contextos globais
│   │   ├── hooks/         # Hooks customizados
│   │   ├── services/      # Serviços de API
│   │   └── types/         # Tipos TypeScript
│   └── public/            # Assets estáticos
├── .github/
│   └── workflows/         # CI/CD
└── README.md
```

## 🔧 Scripts Disponíveis

### Backend

- `npm run start` - Inicia em modo produção
- `npm run start:dev` - Inicia em modo desenvolvimento
- `npm run build` - Compila TypeScript
- `npm run test` - Executa testes unitários
- `npm run test:e2e` - Executa testes e2e
- `npm run lint` - Executa ESLint

### Frontend

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Compila para produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa ESLint
- `npm run test` - Executa testes

### CI/CD

O projeto inclui configuração GitHub Actions para CI/CD automático:

- Lint e testes em cada push/PR
- Build automatizado
- Deploy para ambientes de staging/produção

## 📝 API Documentation

A documentação completa da API está disponível via Swagger em `/api` quando o backend estiver rodando.

### Endpoints Principais

#### Autenticação

- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de novo usuário

#### Filas

- `GET /queue/state` - Estado atual da fila
- `POST /queue/call-next` - Chamar próximo ticket
- `POST /queue/finish` - Finalizar atendimento

#### Tickets

- `POST /tickets` - Criar novo ticket
- `GET /tickets/my-position/:code` - Verificar posição na fila

## 🔒 Segurança

- Autenticação JWT com tokens de curta duração
- CORS configurado para origens específicas
- Validação de entrada com DTOs
- Logs estruturados para auditoria
- Variáveis de ambiente para configurações sensíveis

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

-
