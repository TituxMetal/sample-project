# Sample Project - NestJS API + Astro Frontend

A modern fullstack application built with NestJS backend and Astro frontend, featuring clean
architecture, TypeScript, and Docker containerization.

## 🚀 Tech Stack

### Backend (API)

- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM for TypeScript & Node.js
- **SQLite** - Lightweight database for development
- **JWT** - JSON Web Token for authentication
- **Jest** - Testing framework

### Frontend (Web)

- **Astro** - Modern static site generator
- **React** - UI component library
- **TailwindCSS** - Utility-first CSS framework
- **Vitest** - Fast testing framework

### Development Tools

- **TypeScript** - Type-safe JavaScript
- **Turbo** - High-performance build system
- **Yarn Workspaces** - Monorepo package management
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **CommitLint** - Conventional commit messages

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** `>=22.17.0`
- **Yarn** `>=4.9.1`
- **Git** (latest version)
- **Docker** and **Docker Compose** (for containerized deployment)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd {project-name}
```

### 2. Install Dependencies

```bash
# Install all dependencies for all workspaces
yarn install
```

### 3. Environment Setup

Create environment files for the API:

```bash
# Create environment file for API (you may need to create this file)
touch apps/api/.env
```

Edit `apps/api/.env` with your configuration:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"
SESSION_TTL="86400"
```

### 4. Database Setup

```bash
# Generate Prisma client
yarn workspace @app/api prisma generate

# Run database migrations
yarn workspace @app/api prisma migrate dev

# (Optional) Seed the database
yarn workspace @app/api prisma db seed
```

### 5. Verify Installation

Run the validation script to ensure everything is set up correctly:

```bash
./scripts/validate-setup.sh
```

## 🏃‍♂️ Quick Start

### Development Mode

Start both API and web applications in development mode:

```bash
# Start all applications in parallel
yarn dev
```

This will start:

- **API Server**: <http://localhost:3000>
- **Web Application**: <http://localhost:4321>

### Individual Applications

You can also start applications individually:

```bash
# Start only the API
yarn workspace @app/api dev

# Start only the web app
yarn workspace @app/web dev
```

## 📁 Project Structure

```text
{project-name}/
├── apps/
│   ├── api/                 # NestJS backend application
│   │   ├── src/
│   │   │   ├── users/       # User module (Clean Architecture)
│   │   │   ├── shared/      # Shared domain/infrastructure
│   │   │   └── main.ts      # Application entry point
│   │   └── prisma/          # Database schema and migrations
│   └── web/                 # Astro frontend application
│       ├── src/
│       │   ├── components/  # React/Astro components
│       │   ├── pages/       # Astro pages
│       │   └── styles/      # Global styles
│       └── public/          # Static assets
├── packages/
│   ├── shared-types/        # Shared TypeScript types
│   ├── eslint-config/       # Shared ESLint configuration
│   └── ts-config/           # Shared TypeScript configuration
├── docker/                  # Docker configuration files
└── scripts/                 # Utility scripts
```

## 🔧 Available Scripts

### Root Level Scripts

```bash
# Development
yarn dev                     # Start all apps in development mode
yarn build                   # Build all applications
yarn start                   # Start all applications in production mode

# Code Quality
yarn lint                    # Lint all code
yarn format                  # Format all code with Prettier
yarn typecheck               # Type check all TypeScript

# Testing
yarn test                    # Run all tests
yarn test:watch              # Run tests in watch mode
yarn test:coverage           # Run tests with coverage

# Utilities
yarn clean                   # Clean build artifacts
yarn reset                   # Clean and reinstall dependencies
```

### API-Specific Scripts

```bash
# Development
yarn workspace @app/api dev          # Start API in development mode
yarn workspace @app/api build        # Build API for production

# Database
yarn workspace @app/api prisma generate    # Generate Prisma client
yarn workspace @app/api prisma migrate dev # Run migrations
yarn workspace @app/api prisma studio      # Open Prisma Studio

# Testing
yarn workspace @app/api test               # Run API tests
yarn workspace @app/api test:watch         # Run tests in watch mode
```

### Web-Specific Scripts

```bash
# Development
yarn workspace @app/web dev          # Start web app in development mode
yarn workspace @app/web build        # Build web app for production
yarn workspace @app/web start        # Preview production build

# Testing
yarn workspace @app/web test         # Run web app tests
yarn workspace @app/web test:watch   # Run tests in watch mode
```

## 🐳 Docker

### Build Docker Images

```bash
# Build all Docker images
yarn docker:build:all

# Build individual images
yarn docker:build:api
yarn docker:build:web

# Or build from workspace
yarn workspace @app/api docker:build
yarn workspace @app/web docker:build
```

### Docker Images

The project includes Dockerfiles to build containerized versions of both applications:

- **API**: `ghcr.io/{your-username}/{project-name}-api`
- **Web**: `ghcr.io/{your-username}/{project-name}-web`

### CI/CD Pipeline

Docker images are automatically built and pushed to GitHub Container Registry when:

- Code is pushed to `main` branch (tagged as `latest` and `prod`)
- Code is pushed to `feature/**`, `fix/**`, or `hotfix/**` branches (tagged with branch name)

The CI workflow:

1. **Validates** code (lint, test, typecheck, build)
2. **Builds** Docker images with proper environment variables
3. **Pushes** to GitHub Container Registry (ghcr.io)

Images are available at:

- `ghcr.io/{your-username}/{project-name}-api:latest`
- `ghcr.io/{your-username}/{project-name}-web:latest`

### Local Development vs Production

The project uses a **dual registry approach** for flexibility:

- **Local Development**: Images built with `scripts/docker-build.sh` use Docker Hub
  (`{your-dockerhub-org}/{project-name}-*`) for quick testing and iteration
- **Production Releases**: CI automatically builds and pushes to GitHub Container Registry
  (`ghcr.io/{your-username}/{project-name}-*`) for official releases

This allows developers to test locally without polluting the production registry, while maintaining
clean CI/CD for production deployments.

### Environment Variables

For production deployment, you'll need these environment variables:

**API Environment Variables:**

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-production-jwt-secret"
JWT_EXPIRES_IN="24h"
SESSION_TTL="86400"
```

**Web Environment Variables:**

```env
# For local development
API_URL=http://localhost:3000

# For production deployment
PUBLIC_API_URL=/api
API_URL=http://{project-name}-api:3000
```

> **Note**: The code uses environment variable fallback pattern:
> `import.meta.env.API_URL || process.env.API_URL`
>
> **Build Arguments**: Docker images are built with these environment variables:
>
> - `API_URL=http://{project-name}-api:3000` (for container-to-container communication)
> - `PUBLIC_API_URL=/api` (for frontend requests through nginx proxy)

### Deployment

> **Note**: The `docker/compose.yaml` file in this repository is a personal deployment configuration
> for the project owner's server setup with custom networks and Portainer integration. It is not
> intended for general use.

For your own deployment, you'll need to create your own Docker Compose configuration or deployment
setup based on your infrastructure requirements, using the environment variables listed above.

## 🧪 Testing

### Running Tests

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run tests in watch mode
yarn test:watch

# Run specific app tests
yarn workspace @app/api test
yarn workspace @app/web test
```

### Test Structure

- **API Tests**: Jest with unit and integration tests
- **Web Tests**: Vitest with React Testing Library
- **E2E Tests**: (To be implemented)

## 🏗️ Architecture

This project follows **Clean Architecture** principles:

### Backend (API)

- **Domain Layer**: Entities, interfaces, and business rules
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: Database, external services, controllers

### Frontend (Web)

- **Component-based**: Reusable React components
- **Page-based routing**: Astro file-based routing
- **Static generation**: Pre-built pages for performance

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   # Supported patterns: feature/*, fix/*, hotfix/*
   ```

2. **Make your changes** following the coding standards

3. **Run quality checks locally**:

   ```bash
   yarn lint           # Check for linting errors
   yarn typecheck      # Check for TypeScript errors
   yarn test           # Run all tests
   yarn build          # Ensure build succeeds
   ```

4. **Commit your changes**:

   ```bash
   yarn commit         # Use conventional commits
   ```

5. **Push your branch**:

   ```bash
   git push origin feature/your-feature-name
   ```

   **The CI pipeline will automatically**:
   - ✅ Run all validation checks (lint, typecheck, test, build)
   - 🐳 Build Docker images (for supported branch patterns)
   - 📦 Push images to GitHub Container Registry

6. **Create a Pull Request** from your branch to `main`

### Code Style

- Follow the existing ESLint and Prettier configurations
- Use conventional commit messages
- Write tests for new features
- Update documentation as needed

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Astro Documentation](https://docs.astro.build/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Turbo Documentation](https://turbo.build/repo/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Titux Metal** - Initial work and maintenance

---

### 🚀 Getting Started Checklist

- [ ] Clone the repository
- [ ] Install Node.js (>=22.17.0) and Yarn (>=4.9.1)
- [ ] Run `yarn install`
- [ ] Set up environment variables
- [ ] Run database migrations
- [ ] Run `./scripts/validate-setup.sh`
- [ ] Start development with `yarn dev`
- [ ] Visit <http://localhost:4321> (web) and <http://localhost:3000> (api)

**Happy coding! 🎉**
