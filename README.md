# Scheduling System

Sistema de agendamento para clínicas e hospitais. Pacientes se cadastram, marcam consultas com médicos, agendam exames e solicitam retornos; administradores gerenciam o catálogo de serviços (especialidades, médicos, exames e planos de saúde) e o fluxo de todos os agendamentos.

## O que o sistema faz

**Para o paciente**
- Cadastro e login com token de API (Laravel Sanctum).
- Agendamento de **consulta**, **exame** ou **retorno**, com pagamento **particular** ou por **plano de saúde**.
- Listagem, edição e cancelamento dos próprios agendamentos.
- Visualização mensal em calendário, catálogo de serviços e perfil com foto.

**Para o administrador**
- CRUD de especialidades, médicos, exames e planos de saúde.
- Confirmação, marcação de falta e exclusão de agendamentos de qualquer paciente.
- Listagem de usuários.

**Regras de negócio aplicadas no domínio**
- Não é possível agendar em data/hora no passado.
- Um médico atende um paciente por vez; um paciente não pode ter dois agendamentos no mesmo horário. Exame não é recurso exclusivo, então não gera conflito entre pacientes diferentes.
- Agendamentos cancelados liberam o horário.
- Um retorno ativo por consulta de origem, dentro de uma janela configurável (`FOLLOW_UP_WINDOW_DAYS`, padrão 30 dias).



## Tecnologias

### Backend (`server/`)
| Tecnologia | Versão | Papel |
|---|---|---|
| PHP | ^8.3 | Linguagem |
| Laravel | ^13.8 | Framework da API REST |
| Laravel Sanctum | ^4.0 | Autenticação por token (Bearer) |
| L5-Swagger (`darkaonline/l5-swagger`) | ^11.1 | Documentação OpenAPI |
| PostgreSQL | 17-alpine | Banco de dados |
| PHPUnit | ^12.5 | Testes |

### Frontend (`client/`)
| Tecnologia | Versão | Papel |
|---|---|---|
| Next.js (App Router) | 16.2.6 | Framework React |
| React | 19.2.4 | UI |
| TypeScript | ^5 | Tipagem |
| Tailwind CSS | ^4 | Estilização |

```

## Pré-requisitos

- **Docker** e **Docker Compose** (o banco sobe em container).
- **PHP 8.3+** com as extensões `pdo_pgsql` e `pgsql` habilitadas.
- **Composer 2**.
- **Node.js 20+** e npm.

## Como rodar

### 1. Banco de dados (Docker + PostgreSQL)

O `docker-compose.yml` fica em `server/` e lê as credenciais do `server/.env`. Crie o arquivo a partir do exemplo:

```bash
cd server
cp .env.example .env
```

Preencha o `.env` com os valores abaixo — em especial o bloco `DB_*`, que precisa apontar para **pgsql**

```dotenv
APP_NAME="Scheduling System"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_TIMEZONE=America/Sao_Paulo
APP_FAKER_LOCALE=pt_BR

LOG_CHANNEL=single
LOG_LEVEL=debug

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=scheduling
DB_USERNAME=scheduling
DB_PASSWORD=troque-esta-senha

SESSION_DRIVER=database
SESSION_LIFETIME=120
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SANCTUM_TOKEN_EXPIRATION=1440

CACHE_STORE=database
QUEUE_CONNECTION=database

FOLLOW_UP_WINDOW_DAYS=30
```

Suba o container:

```bash
docker compose up -d
```

### 2. API (Laravel)

```bash
cd server
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

A API sobe em `http://localhost:8000`.

Usuários criados pelo seeder:

| Perfil | E-mail | Senha |
|---|---|---|
| Admin | `admin@email.com` | `senha123` |
| Cliente | `cliente@email.com` | `senha123` |

### 3. Frontend (Next.js)

Em outro terminal:

```bash
cd client
npm install
npm run dev
```

Crie o `client/.env` apontando para a API:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Documentação da API

Com a API rodando, o Swagger UI fica em `http://localhost:8000/api/documentation`. Para regerar a especificação a partir das anotações em `app/Swagger/`:

```bash
php artisan l5-swagger:generate
```

## Endpoints principais

| Método | Rota | Acesso |
|---|---|---|
| `POST` | `/api/register`, `/api/login` | Público (com throttle) |
| `GET` | `/api/user` | Autenticado |
| `POST` | `/api/user/photo`, `/api/logout` | Autenticado |
| `GET/POST/PUT` | `/api/agendamentos` | Autenticado |
| `PATCH` | `/api/agendamentos/{id}/cancel` | Autenticado |
| `GET` | `/api/especialidades`, `/api/medicos`, `/api/exames`, `/api/planos-saude` | Autenticado |
| `PATCH` | `/api/agendamentos/{id}/confirm`, `/api/agendamentos/{id}/no-show` | Admin |
| `DELETE` | `/api/agendamentos/{id}` | Admin |
| `POST/PUT/DELETE` | `/api/especialidades`, `/api/medicos`, `/api/exames`, `/api/planos-saude` | Admin |
| `GET` | `/api/users` | Admin |
