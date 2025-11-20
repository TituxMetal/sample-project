# Project Documentation Index

> **Project:** sample-project **Type:** Monorepo (Turborepo) - Full-stack Application **Generated:**
> 2025-11-16 **Scan Level:** Quick Scan (pattern-based analysis)

## 📚 Quick Reference

| Aspect                | Details                                   |
| --------------------- | ----------------------------------------- |
| **Repository Type**   | Monorepo with 2 apps + 3 shared packages  |
| **Primary Languages** | TypeScript, JavaScript                    |
| **Backend**           | NestJS 11.x + Prisma + SQLite             |
| **Frontend**          | Astro 5.x + React 19.x + Tailwind CSS 4.x |
| **Build System**      | Turborepo 2.x                             |
| **Package Manager**   | Yarn 4.x                                  |

---

## 🎯 Project Structure

### Part 1: API (Backend Service)

- **Location:** `apps/api/`
- **Type:** Backend Service
- **Tech Stack:** NestJS + Prisma + SQLite
- **Architecture:** Clean Architecture (Domain-Driven Design)
- **Entry Point:** `src/main.ts`

### Part 2: Web (Frontend Application)

- **Location:** `apps/web/`
- **Type:** Web Application
- **Tech Stack:** Astro + React + Tailwind CSS
- **Architecture:** Islands Architecture with SSR
- **Entry Point:** `src/pages/index.astro`

### Shared Packages

- `packages/ts-config/` - Shared TypeScript configurations
- `packages/eslint-config/` - Shared ESLint rules
- `packages/shared-types/` - Common type definitions

---

## 📖 Generated Documentation

### Overview & Architecture

- [Project Overview](./project-overview.md) - Executive summary and quick reference
- [Source Tree Analysis](./source-tree-analysis.md) - Annotated directory structure with integration
  points

### Part-Specific Architecture _(To be generated)_

- [Architecture - API](./architecture-api.md) _(To be generated)_
- [Architecture - Web](./architecture-web.md) _(To be generated)_

### API Documentation _(To be generated)_

- [API Contracts - API](./api-contracts-api.md) _(To be generated)_
- [Data Models - API](./data-models-api.md) _(To be generated)_

### Component Documentation _(To be generated)_

- [Component Inventory - Web](./component-inventory-web.md) _(To be generated)_

### Development Guides _(To be generated)_

- [Development Guide - API](./development-guide-api.md) _(To be generated)_
- [Development Guide - Web](./development-guide-web.md) _(To be generated)_

### Deployment _(To be generated)_

- [Deployment Guide](./deployment-guide.md) _(To be generated)_

### Integration _(To be generated)_

- [Integration Architecture](./integration-architecture.md) _(To be generated)_

---

## 📄 Existing Project Documentation

These documents were created by the project team and provide valuable context:

- [Main README](../README.md) - Primary project documentation with setup and usage
- [API README](../apps/api/README.md) - Backend architecture and features
- [Web README](../apps/web/README.md) - Frontend architecture and features
- [Technical Decisions Template](./technical-decisions-template.md) - Template for documenting
  decisions
- [Learning Resources](./learning/README.md) - Educational materials

### GitHub Templates

- [Bug Report Template](../.github/ISSUE_TEMPLATE/bug_report.md)
- [Feature Request Template](../.github/ISSUE_TEMPLATE/feature_request.md)
- [Documentation Template](../.github/ISSUE_TEMPLATE/documentation.md)
- [Maintenance Template](../.github/ISSUE_TEMPLATE/maintenance.md)
- [Pull Request Template](../.github/pull_request_template.md)

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22.17.0
- Yarn >= 4.10.3
- Git (latest)
- Docker & Docker Compose (optional, for deployment)

### Quick Start

```bash
# Install dependencies
yarn install

# Start development servers (both API and Web)
yarn dev

# Run tests
yarn test

# Build for production
yarn build
```

### Development Workflow

**API Development** (`apps/api/`):

```bash
cd apps/api
yarn dev          # Start NestJS in watch mode (port 3000)
yarn test         # Run Jest tests
yarn prisma       # Access Prisma CLI
```

**Web Development** (`apps/web/`):

```bash
cd apps/web
yarn dev          # Start Astro dev server (port 4321)
yarn test         # Run Vitest tests
```

**Monorepo Commands** (from root):

```bash
yarn build        # Build all apps and packages
yarn test         # Run all tests
yarn lint         # Lint all code
yarn format       # Format with Prettier
yarn typecheck    # TypeScript validation across all packages
```

---

## 🔧 Development Tools

- **Code Quality:** ESLint, Prettier, Husky, lint-staged
- **Commit Convention:** Commitlint (conventional commits)
- **Testing:** Jest (API), Vitest (Web)
- **Build System:** Turborepo for parallel task execution
- **CI/CD:** GitHub Actions (`.github/workflows/ci.yml`)
- **Containerization:** Docker (`docker/Dockerfile.api`, `docker/Dockerfile.web`,
  `docker/compose.yaml`)

---

## 📊 Project Statistics

- **API Test Coverage:** 47 test files
- **Web Test Coverage:** 7 test files
- **UI Components:** 17 components (ui/, forms/, containers/)
- **API Endpoints:** 2 controllers (Auth, Users)
- **Database Tables:** 1 (User model via Prisma)
- **Documentation Files:** 7+ existing + generated docs

---

## 🏗️ Architecture Patterns

### Backend (API)

**Clean Architecture** - Three-layer separation:

1. **Domain Layer** - Pure business logic (entities, value objects, repository interfaces)
2. **Application Layer** - Use cases and application services
3. **Infrastructure Layer** - Controllers, repositories, external services (JWT, Prisma)

### Frontend (Web)

**Islands Architecture** - Optimal performance:

- Server-side rendering (SSR) with Astro
- Selective client-side hydration for React components
- File-based routing for pages

### Integration

- **Protocol:** HTTP/REST with JSON
- **Authentication:** JWT tokens via HTTP-only cookies
- **Proxy:** Frontend proxies `/api/*` to backend `:3000`
- **CORS:** Handled by development proxy

---

## 🔒 Security Features

- **Authentication:** JWT-based with @nestjs/jwt
- **Password Hashing:** Argon2 (secure hashing algorithm)
- **Token Management:** Blacklist service for secure logout
- **Cookie Security:** HTTP-only cookies for token storage
- **Validation:** class-validator (API), Zod (Web)
- **Middleware:** JWT authentication guard on protected routes

---

## 📈 Next Steps for Complete Documentation

The items marked **_(To be generated)_** above can be generated by re-running this workflow with a
**Deep Scan** or **Exhaustive Scan** level. These scans will:

- Read source files to extract detailed API contracts
- Generate comprehensive architecture diagrams
- Document all data models and relationships
- Create component inventories with props and usage
- Produce detailed development and deployment guides

To generate these documents, run:

```bash
# Re-run the document-project workflow and select scan level 2 or 3
```

---

## 💡 Using This Documentation

### For New Developers

1. Start with [Project Overview](./project-overview.md)
2. Review [Source Tree Analysis](./source-tree-analysis.md)
3. Read the [Main README](../README.md) for setup
4. Explore part-specific READMEs ([API](../apps/api/README.md), [Web](../apps/web/README.md))

### For AI-Assisted Development

When creating a brownfield PRD for new features:

- Reference this index as the starting point
- Use [Source Tree Analysis](./source-tree-analysis.md) for structural understanding
- Refer to part-specific READMEs for domain knowledge
- Cross-reference integration points for full-stack features

### For Architecture Reviews

- Review [Source Tree Analysis](./source-tree-analysis.md) for structure
- Examine existing READMEs for current architecture decisions
- Use this index to identify documentation gaps

---

**Primary Entry Point for AI Documentation:** `docs/index.md` (this file)

**Documentation System:** BMad Method - Document Project Workflow v1.2.0

---

_This documentation was generated using pattern-based analysis (Quick Scan). For more detailed
documentation including full API contracts, data models, and component inventories, re-run with a
Deep or Exhaustive scan level._
