# FilaPro - Sistema de Gerenciamento de Filas

Sistema completo de gerenciamento de filas de atendimento em tempo real, desenvolvido com Next.js (frontend) e NestJS (backend).

## 🚀 Funcionalidades

### Landing Page (Pública)

- Explicação do produto com destaques
- Botões para acessar painel público e login de atendente

### Painel Público (Tempo Real)

- Senha sendo atendida no momento
- Próximas senhas da fila
- Quantidade de pessoas aguardando
- Tempo médio de atendimento
- Atualização automática via WebSocket

### Entrada na Fila (Cliente)

- Botão para entrar na fila
- Exibição do código da senha, posição e tempo estimado

### Dashboard do Atendente

- Lista da fila atual
- Atendimento em andamento
- Botões para chamar próximo e finalizar atendimento
- Card de previsão da fila (em desenvolvimento)

### Autenticação

- Login e cadastro de atendentes
- Sistema JWT seguro

## 🛠️ Tecnologias Utilizadas

### Frontend

- **Next.js 16** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes UI modernos
- **Socket.IO Client** - Comunicação em tempo real
- **Axios** - Cliente HTTP

### Backend

- **NestJS** - Framework Node.js
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para PostgreSQL
- **JWT** - Autenticação
- **Socket.IO** - WebSockets
- **PostgreSQL** - Banco de dados

## 📋 Pré-requisitos

- Docker e Docker Compose
- Node.js 18+ (opcional, para desenvolvimento local)

## 🚀 Como Executar

### Com Docker (Recomendado)

1. **Clone o repositório:**

   ```bash
   git clone <repository-url>
   cd fila-pro
   ```

2. **Execute todos os serviços:**

   ```bash
   docker-compose up --build
   ```

3. **Acesse as aplicações:**
   - **Frontend:** http://localhost:3001
   - **Backend API:** http://localhost:3000
   - **Banco de dados:** localhost:5435

### Desenvolvimento Local

1. **Backend:**

   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🧪 Testes

### Backend

```bash
cd backend
npm run test:e2e
```

### API Testing

Execute o script de teste incluído:

```bash
./test-all-routes.sh
```

## 📁 Estrutura do Projeto

```
fila-pro/
├── backend/              # API NestJS
│   ├── src/
│   │   ├── auth/         # Autenticação JWT
│   │   ├── queue/        # Lógica da fila e WebSockets
│   │   ├── tickets/      # Gerenciamento de tickets
│   │   └── prisma/       # Configuração do banco
├── frontend/             # Aplicação Next.js
│   ├── src/
│   │   ├── app/          # Páginas (App Router)
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── contexts/     # Contextos React
│   │   ├── hooks/        # Hooks customizados
│   │   ├── lib/          # Utilitários e API
│   │   └── types/        # Definições TypeScript
└── docker-compose.yml    # Orquestração dos serviços
```

## 🔧 Configuração

### Variáveis de Ambiente

**Frontend (.env.local):**

```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

**Backend (docker-compose.yml):**

```
DATABASE_URL: postgresql://user:gabriel123@db:5432/fila_pro?schema=public
```

## 🎯 Funcionalidades Implementadas

- ✅ Sistema de tickets com códigos únicos
- ✅ Controle de estado da fila em tempo real
- ✅ Autenticação JWT para atendentes
- ✅ WebSocket para atualizações live
- ✅ Interface responsiva e moderna
- ✅ Previsão de tempo de espera
- ✅ Dashboard completo do atendente
- ✅ Painel público em tempo real

## 🔮 Funcionalidades Futuras

- 📊 Análises e relatórios detalhados
- 🤖 Previsão inteligente de crescimento da fila
- 📱 Aplicativo mobile para clientes
- 🔄 Integração com sistemas externos
- 📧 Notificações por SMS/E-mail
- 🎨 Temas personalizáveis

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ para revolucionar o atendimento ao cliente!**
