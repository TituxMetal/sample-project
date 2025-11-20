# Source Tree Analysis

> **Generated:** 2025-11-16 **Project:** sample-project **Type:** Monorepo (Turborepo)

## Repository Overview

This is a **monorepo** containing a full-stack application with clean separation between frontend
and backend concerns.

```text
sample-project/                    # Monorepo root
├── apps/                          # Application workspaces
│   ├── api/                       # Backend API (NestJS)
│   └── web/                       # Frontend Web (Astro + React)
├── packages/                      # Shared packages
│   ├── eslint-config/            # Shared ESLint configuration
│   ├── shared-types/             # Shared TypeScript types
│   └── ts-config/                # Shared TypeScript configurations
├── docker/                        # Container deployment configs
├── docs/                          # Project documentation
├── scripts/                       # Build and utility scripts
└── .github/                       # CI/CD workflows
```

---

## Part 1: API (Backend Service)

**Path:** `apps/api/` **Type:** Backend Service **Framework:** NestJS with Clean Architecture
**Entry Point:** `src/main.ts`

### API Architecture Structure

```text
apps/api/
├── prisma/                        # Database layer
│   ├── schema.prisma             # Prisma schema definition (User model)
│   ├── migrations/               # Database migrations
│   └── dev.db                    # SQLite database (development)
│
├── src/
│   ├── main.ts                   # 🚀 APPLICATION ENTRY POINT
│   ├── app.module.ts             # Root NestJS module
│   │
│   ├── auth/                     # 🔐 Authentication Domain
│   │   ├── Auth.module.ts        # Auth module configuration
│   │   │
│   │   ├── domain/               # Business logic layer (Pure domain)
│   │   │   ├── entities/         # AuthUser entity
│   │   │   ├── value-objects/    # Email, Password, JwtPayload VOs
│   │   │   ├── repositories/     # Repository interfaces
│   │   │   ├── services/         # Service interfaces (JWT, Password)
│   │   │   └── exceptions/       # Domain-specific exceptions
│   │   │
│   │   ├── application/          # Application services layer
│   │   │   ├── use-cases/        # Login, Register, Logout use cases
│   │   │   ├── dtos/             # Data transfer objects
│   │   │   ├── mappers/          # Domain ↔ DTO mapping
│   │   │   └── services/         # Application service implementations
│   │   │
│   │   └── infrastructure/       # External concerns layer
│   │       ├── controllers/      # 📡 HTTP endpoints (Auth.controller.ts)
│   │       ├── guards/           # JWT authentication guards
│   │       ├── repositories/     # Prisma repository implementations
│   │       ├── services/         # JWT, Password, Token services
│   │       └── mappers/          # Infrastructure mappers
│   │
│   ├── users/                    # 👤 User Management Domain
│   │   ├── Users.module.ts       # Users module configuration
│   │   │
│   │   ├── domain/               # Business logic layer
│   │   │   ├── entities/         # User entity
│   │   │   ├── value-objects/    # Name, UserId, Username VOs
│   │   │   ├── repositories/     # Repository interfaces
│   │   │   └── exceptions/       # UserNotFound, InvalidUser
│   │   │
│   │   ├── application/          # Application services layer
│   │   │   ├── use-cases/        # CRUD operations (Create, Get, Update, Delete)
│   │   │   ├── dtos/             # CreateUser, UpdateUser DTOs
│   │   │   ├── mappers/          # Domain ↔ DTO mapping
│   │   │   └── services/         # User service implementations
│   │   │
│   │   └── infrastructure/       # External concerns layer
│   │       ├── controllers/      # 📡 HTTP endpoints (User.controller.ts)
│   │       ├── repositories/     # Prisma repository implementations
│   │       └── mappers/          # Infrastructure mappers
│   │
│   ├── shared/                   # 🔧 Shared utilities and infrastructure
│   │   ├── Shared.module.ts      # Shared module configuration
│   │   │
│   │   ├── domain/               # Shared domain concerns
│   │   │   ├── exceptions/       # Base DomainException
│   │   │   ├── types/            # Shared type definitions
│   │   │   └── validation/       # Domain validation utilities
│   │   │
│   │   └── infrastructure/       # Shared infrastructure
│   │       ├── database/         # Prisma module and provider
│   │       ├── decorators/       # Custom decorators (GetCurrentUser, Serialize)
│   │       ├── interceptors/     # Response transformation
│   │       ├── services/         # Logger service
│   │       ├── testing/          # Test data factories
│   │       └── validation/       # Validation decorators
│   │
│   └── config/                   # ⚙️ Application configuration
│       ├── config.module.ts      # Configuration module
│       ├── config.service.ts     # Configuration service
│       └── interfaces/           # Configuration interfaces
│
├── test/                         # Integration tests
├── jest.config.cjs               # Jest test configuration
├── nest-cli.json                 # NestJS CLI configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

### API Endpoints

**Discovered Controllers:**

- `Auth.controller.ts` - Authentication endpoints (login, register, logout)
- `User.controller.ts` - User management endpoints (CRUD operations)

### Data Models

**Prisma Schema (1 table):**

- `User` - User accounts with authentication

### Clean Architecture Layers

1. **Domain Layer** (`domain/`) - Pure business logic, no framework dependencies
   - Entities, Value Objects, Repository Interfaces, Domain Services

2. **Application Layer** (`application/`) - Use cases and application services
   - Use Cases (business workflows), DTOs, Mappers

3. **Infrastructure Layer** (`infrastructure/`) - External concerns
   - Controllers (HTTP), Guards, Repositories (Prisma), Services (JWT, Password)

### Testing

- **47 test files** across all layers
- Test coverage includes: unit tests (`.spec.ts`) for entities, VOs, services, use cases,
  controllers

---

## Part 2: Web (Frontend Application)

**Path:** `apps/web/` **Type:** Web Application **Framework:** Astro with React Islands **Entry
Point:** `src/pages/index.astro`

### Web Architecture Structure

```text
apps/web/
├── public/                       # Static assets (served as-is)
│
├── src/
│   ├── pages/                    # 🌐 File-based routing (Entry points)
│   │   ├── index.astro           # Home page (/)
│   │   ├── auth.astro            # Authentication page (/auth)
│   │   ├── profile.astro         # User profile (/profile) [Protected]
│   │   └── logout.astro          # Logout handler (/logout)
│   │
│   ├── layouts/                  # Page layouts
│   │   └── Main.astro            # Main layout wrapper (nav, footer)
│   │
│   ├── components/               # 🧩 React components (17 components)
│   │   ├── ui/                   # Base reusable UI components
│   │   │   ├── Button.tsx        # Button with variants
│   │   │   ├── Input.tsx         # Form input with validation
│   │   │   ├── Label.tsx         # Form label
│   │   │   ├── FormWrapper.tsx   # Form container wrapper
│   │   │   └── index.ts          # Barrel export
│   │   │
│   │   ├── forms/                # Feature-specific forms
│   │   │   ├── LoginForm.tsx     # Login form with validation
│   │   │   ├── SignupForm.tsx    # Registration form
│   │   │   └── EditProfileForm.tsx # Profile editing form
│   │   │
│   │   ├── containers/           # Container components (logic + UI)
│   │   │   ├── AuthContainer.tsx # Authentication container
│   │   │   └── EditProfileContainer.tsx # Profile editing container
│   │   │
│   │   └── ProfileView.tsx       # Profile display component
│   │
│   ├── services/                 # 📡 API communication layer
│   │   ├── auth.service.ts       # → Calls /api/auth/* endpoints
│   │   └── user.service.ts       # → Calls /api/users/* endpoints
│   │
│   ├── stores/                   # 📦 State management (Nanostores)
│   │   └── auth.ts               # Authentication state store
│   │
│   ├── hooks/                    # ⚛️ React custom hooks
│   │   └── useAuth.ts            # Authentication hook
│   │
│   ├── schemas/                  # ✅ Validation schemas (Zod)
│   │   ├── auth.schema.ts        # Login/signup validation
│   │   └── user.schema.ts        # User profile validation
│   │
│   ├── types/                    # 📘 TypeScript definitions
│   │   ├── api.types.ts          # API response types
│   │   ├── auth.types.ts         # Authentication types
│   │   ├── user.types.ts         # User types
│   │   └── app.d.ts              # Global type declarations
│   │
│   ├── lib/                      # 🛠️ Utility libraries
│   │   └── apiRequest.ts         # Generic API request helper
│   │
│   ├── utils/                    # Utility functions
│   │   ├── navigation.ts         # Navigation helpers
│   │   └── routes.ts             # Route constants
│   │
│   ├── config/                   # Configuration
│   │   └── env.ts                # Environment variables
│   │
│   ├── assets/                   # Project assets
│   │   └── icons/                # SVG icons (astro-icon)
│   │
│   ├── styles/                   # Global styles
│   │   └── globals.css           # Tailwind base + custom styles
│   │
│   └── middleware.ts             # 🔒 JWT authentication middleware
│
├── astro.config.mjs              # Astro configuration (SSR, React, Tailwind)
├── vitest.config.ts              # Vitest test configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

### API Integration

**Proxy Configuration** (astro.config.mjs):

```javascript
'/api' → 'http://localhost:3000'
```

All frontend API calls to `/api/*` are proxied to the backend service.

**Service Layer:**

- `auth.service.ts` - Handles authentication API calls
- `user.service.ts` - Handles user profile API calls

### State Management

**Nanostores** - Lightweight reactive state

- `auth.ts` - Global authentication state (user, tokens, login status)

### Routing Strategy

**File-based routing** with Astro:

- `/` - Home page (`index.astro`)
- `/auth` - Login/Signup page (`auth.astro`)
- `/profile` - User profile (protected by `middleware.ts`)
- `/logout` - Logout handler (`logout.astro`)

### Testing

- **7 test files** with Vitest and Testing Library
- Component testing with React Testing Library

---

## Shared Packages

### packages/ts-config/

Shared TypeScript configurations for consistency across the monorepo:

- `tsconfig.base.json` - Base configuration
- `tsconfig.node.json` - Node.js specific config
- `tsconfig.web.json` - Web/browser specific config

### packages/eslint-config/

Shared ESLint rules for code quality consistency.

### packages/shared-types/

Shared TypeScript type definitions used across both API and Web.

---

## Infrastructure & DevOps

### Docker Configuration (`docker/`)

```text
docker/
├── Dockerfile.api        # Multi-stage build for NestJS API
├── Dockerfile.web        # Multi-stage build for Astro Web
├── compose.yaml          # Docker Compose orchestration
└── start.sh             # Container startup script
```

**Containerization:**

- Separate Dockerfiles for API and Web
- Docker Compose for local multi-container development

### CI/CD (`.github/workflows/`)

```text
.github/workflows/
└── ci.yml               # Continuous Integration pipeline
```

**Automated workflows:** Build, lint, typecheck, test on push/PR.

### Build Scripts (`scripts/`)

```text
scripts/
├── docker-build.sh      # Docker image build automation
└── validate-setup.sh    # Environment validation
```

---

## Integration Points

### How API and Web Communicate

```text
┌─────────────┐         Proxy         ┌─────────────┐
│             │    /api → :3000       │             │
│   Web App   │─────────────────────→ │   API App   │
│  (Astro)    │                       │  (NestJS)   │
│   :4321     │←─────────────────────│   :3000     │
└─────────────┘    JSON/Cookies      └─────────────┘
```

**Integration Details:**

- **Protocol:** HTTP/REST
- **Data Format:** JSON
- **Authentication:** JWT tokens stored in HTTP-only cookies
- **Proxy:** Astro dev server proxies `/api` requests to backend
- **CORS:** Handled by proxy in development, origin checking in production

**API Contracts:**

- `/auth/login` - POST - Login endpoint
- `/auth/register` - POST - Registration endpoint
- `/auth/logout` - POST - Logout endpoint
- `/users/profile` - GET - Get user profile
- `/users/profile` - PATCH - Update user profile

---

## Critical Directories Summary

| Directory                  | Purpose                         | Entry Points                                 |
| -------------------------- | ------------------------------- | -------------------------------------------- |
| `apps/api/src/`            | Backend API source code         | `main.ts`                                    |
| `apps/api/prisma/`         | Database schema and migrations  | `schema.prisma`                              |
| `apps/web/src/pages/`      | Frontend routes                 | `index.astro`, `auth.astro`, `profile.astro` |
| `apps/web/src/components/` | React components                | Various `.tsx` components                    |
| `apps/web/src/services/`   | API client layer                | `auth.service.ts`, `user.service.ts`         |
| `packages/`                | Shared configurations and types | Various config files                         |
| `docker/`                  | Container deployment            | `Dockerfile.*`, `compose.yaml`               |
| `.github/workflows/`       | CI/CD automation                | `ci.yml`                                     |

---

## Development Workflow

### Monorepo Commands (Root)

```bash
yarn dev           # Start both API and Web in parallel
yarn build         # Build all apps and packages
yarn test          # Run all tests across workspace
yarn lint          # Lint all code
yarn typecheck     # TypeScript validation
```

### API-Specific Commands

```bash
cd apps/api
yarn dev           # Start NestJS in watch mode
yarn test          # Run Jest tests
yarn prisma        # Prisma CLI
```

### Web-Specific Commands

```bash
cd apps/web
yarn dev           # Start Astro dev server
yarn test          # Run Vitest tests
```

---

**Documentation generated by BMad Method - Document Project Workflow**
