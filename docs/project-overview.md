# Project Overview - sample-project

> **Generated:** 2025-11-16 **Type:** Monorepo (Turborepo) **Primary Language:** TypeScript
> **Architecture:** Full-stack (NestJS + Astro)

## Executive Summary

Sample Project is a modern full-stack application demonstrating best practices in monorepo
architecture, clean code principles, and contemporary web development. The project features a NestJS
backend implementing Clean Architecture with a Prisma-powered database layer, paired with an Astro
frontend leveraging React islands for optimal performance.

## Project Purpose

A production-ready fullstack application showcasing:

- **Clean Architecture** in a NestJS API
- **Modern SSR** with Astro and React islands
- **Monorepo management** with Turborepo
- **Type-safe development** with TypeScript throughout
- **Comprehensive testing** with Jest and Vitest
- **Container-ready deployment** with Docker

## Repository Structure

**Type:** Monorepo **Parts:** 2 main applications + 3 shared packages

### Applications

#### 1. API (Backend Service)

- **Path:** `apps/api/`
- **Framework:** NestJS 11.x
- **Database:** SQLite (Prisma ORM)
- **Architecture:** Clean Architecture (Domain-Driven Design)
- **Entry Point:** `src/main.ts`

#### 2. Web (Frontend Application)

- **Path:** `apps/web/`
- **Framework:** Astro 5.x + React 19.x
- **Styling:** Tailwind CSS 4.x
- **Architecture:** Islands Architecture with SSR
- **Entry Point:** `src/pages/index.astro`

### Shared Packages

1. **ts-config** - Shared TypeScript configurations
2. **eslint-config** - Shared ESLint rules
3. **shared-types** - Common TypeScript type definitions

## Technology Stack Summary

| Layer          | API (Backend)          | Web (Frontend)         |
| -------------- | ---------------------- | ---------------------- |
| **Framework**  | NestJS 11.1.6          | Astro 5.14.1           |
| **UI Library** | N/A                    | React 19.1.1           |
| **Language**   | TypeScript 5.9.2       | TypeScript 5.9.2       |
| **Runtime**    | Node.js >=22.17.0      | Node.js >=22.17.0      |
| **Database**   | SQLite (Prisma 6.16.2) | N/A                    |
| **State**      | N/A                    | Nanostores 1.0.1       |
| **Styling**    | N/A                    | Tailwind CSS 4.1.13    |
| **Testing**    | Jest 30.1.3 (47 tests) | Vitest 3.2.4 (7 tests) |
| **Validation** | class-validator        | Zod 4.1.11             |
| **Forms**      | N/A                    | React Hook Form 7.63.0 |

## Architecture Classification

### Backend (API)

**Pattern:** Clean Architecture (Hexagonal Architecture)

- **Domain Layer:** Pure business logic with entities, value objects, and interfaces
- **Application Layer:** Use cases and application services
- **Infrastructure Layer:** Controllers, repositories, external services

### Frontend (Web)

**Pattern:** Islands Architecture

- **SSR:** Server-side rendering with Astro
- **Hydration:** Selective client-side hydration for React components
- **Routing:** File-based routing

### Integration

**Communication:** HTTP/REST with JSON

- Frontend proxies `/api/*` requests to backend
- JWT authentication via HTTP-only cookies
- CORS handling in development proxy

## Key Features

### Authentication & Authorization

- JWT-based authentication
- Cookie-based session management
- Token blacklisting for secure logout
- Password hashing with Argon2

### User Management

- User profile CRUD operations
- Email and username uniqueness validation
- Account confirmation and blocking capabilities

### Development Experience

- **Hot Reload:** Both apps support watch mode
- **Type Safety:** End-to-end TypeScript
- **Code Quality:** ESLint + Prettier + Husky
- **Conventional Commits:** Commitlint enforcement
- **Monorepo Tasks:** Turbo parallel execution

## Project Links

- **Main README:** [`README.md`](../README.md)
- **API Documentation:** [`apps/api/README.md`](../apps/api/README.md)
- **Web Documentation:** [`apps/web/README.md`](../apps/web/README.md)
- **Source Tree Analysis:** [`source-tree-analysis.md`](./source-tree-analysis.md)
- **Development Guide:** _(See existing READMEs)_
- **Architecture Details:** _(See part-specific READMEs)_

## Getting Started

See the main [README.md](../README.md) for:

- Prerequisites (Node.js >=22.17.0, Yarn >=4.10.3)
- Installation steps
- Development workflow
- Docker deployment

## Quick Reference

### Run Development Servers

```bash
yarn dev              # Start both API and Web
```

### Build for Production

```bash
yarn build            # Build all apps
```

### Run Tests

```bash
yarn test             # Run all tests
yarn test:coverage    # Generate coverage reports
```

### Code Quality

```bash
yarn lint             # Lint all code
yarn format           # Format with Prettier
yarn typecheck        # TypeScript validation
```

## Project Metrics

- **Total Parts:** 2 (API + Web)
- **Shared Packages:** 3
- **API Test Files:** 47
- **Web Test Files:** 7
- **UI Components:** 17
- **API Controllers:** 2 (Auth, Users)
- **Database Tables:** 1 (User)
- **Total Documentation Files:** 7+ existing, plus generated docs

---

**For detailed technical documentation, see:**

- [Source Tree Analysis](./source-tree-analysis.md)
- [API README](../apps/api/README.md)
- [Web README](../apps/web/README.md)

---

_Documentation generated by BMad Method - Document Project Workflow_
