# Sample Project - NestJS API + Astro Frontend

A modern fullstack application built with NestJS backend and Astro frontend, featuring clean
architecture, Better Auth authentication, TypeScript, and Docker containerization.

## Tech Stack

### Backend (API)

- **NestJS 11.x** - Progressive Node.js framework
- **Prisma 7.x** - Next-generation ORM for TypeScript & Node.js
- **SQLite** - Lightweight database for development
- **Better Auth 1.4.x** - Modern authentication library
- **Bun test** - Testing framework

### Frontend (Web)

- **Astro 5.x** - Modern static site generator with SSR
- **React 19.x** - UI component library
- **TailwindCSS 4.x** - Utility-first CSS framework
- **Better Auth client** - Authentication client
- **Bun test** - Testing framework with Testing Library

### Development Tools

- **TypeScript 5.x** - Type-safe JavaScript
- **Turbo 2.x** - High-performance build system
- **Bun 1.3.x** - JavaScript runtime & package manager
- **ESLint 9.x** - Code linting
- **Prettier 3.x** - Code formatting
- **Husky 9.x** - Git hooks
- **CommitLint 20.x** - Conventional commit messages

## Prerequisites

Before you begin, ensure you have the following installed:

- **Bun** `>=1.3.3`
- **Git** (latest version)
- **Docker** and **Docker Compose** (for containerized deployment)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd {project-name}
```

### 2. Install Dependencies

```bash
# Install all dependencies for all workspaces
bun install
```

### 3. Environment Setup

Create environment files for the API:

```bash
# Create environment file for API
touch apps/api/.env
```

Edit `apps/api/.env` with your configuration:

```env
# Prisma SQLite database location
DATABASE_URL="file:./dev.db"

# Better Auth configuration
# Generate with: openssl rand -hex 32
BETTER_AUTH_SECRET="your-generated-secret"
BETTER_AUTH_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:4321"
```

### 4. Database Setup

```bash
# Generate Prisma client
bun run --cwd apps/api prisma generate

# Run database migrations
bun run --cwd apps/api prisma migrate dev
```

### 5. Verify Installation

Run the validation script to ensure everything is set up correctly:

```bash
./scripts/validate-setup.sh
```

## Quick Start

### Development Mode

Start both API and web applications in development mode:

```bash
# Start all applications in parallel
bun run dev
```

This will start:

- **API Server**: <http://localhost:3000>
- **Web Application**: <http://localhost:4321>

### Individual Applications

You can also start applications individually:

```bash
# Start only the API
bun run dev --filter=@app/api

# Start only the web app
bun run dev --filter=@app/web
```

## Project Structure

```text
{project-name}/
├── apps/
│   ├── api/                 # NestJS backend application
│   │   ├── src/
│   │   │   ├── auth/        # Better Auth module
│   │   │   ├── users/       # User module (Clean Architecture)
│   │   │   ├── shared/      # Shared domain/infrastructure
│   │   │   └── main.ts      # Application entry point
│   │   ├── prisma/          # Database schema and migrations
│   │   └── README.md        # API documentation
│   └── web/                 # Astro frontend application
│       ├── src/
│       │   ├── components/  # React/Astro components
│       │   ├── pages/       # Astro pages
│       │   ├── services/    # API communication services
│       │   ├── lib/         # Better Auth client
│       │   └── styles/      # Global styles
│       ├── public/          # Static assets
│       └── README.md        # Web documentation
├── packages/
│   ├── eslint-config/       # Shared ESLint configuration
│   └── ts-config/           # Shared TypeScript configuration
├── docker/                  # Docker configuration files
└── scripts/                 # Utility scripts
```

### Application Documentation

Each application has detailed documentation:

- **[API Documentation](apps/api/README.md)** - NestJS backend with Better Auth
- **[Web Documentation](apps/web/README.md)** - Astro frontend with React integration

## Available Scripts

### Root Level Scripts

```bash
# Development
bun run dev                  # Start all apps in development mode
bun run build                # Build all applications
bun run start                # Start all applications in production mode

# Code Quality
bun run lint                 # Lint and fix all code
bun run lint:check           # Check linting without fixing
bun run format               # Format all code with Prettier
bun run format:check         # Check formatting
bun run typecheck            # Type check all TypeScript

# Testing
bun run test                 # Run all tests
bun run test:watch           # Run tests in watch mode
bun run test:coverage        # Run tests with coverage

# Utilities
bun run clean                # Clean build artifacts
bun run reset                # Clean and reinstall dependencies
```

### API-Specific Scripts

```bash
# Development
bun run dev --filter=@app/api        # Start API in development mode
bun run build --filter=@app/api      # Build API for production

# Database
bun run --cwd apps/api prisma generate    # Generate Prisma client
bun run --cwd apps/api prisma migrate dev # Run migrations
bun run --cwd apps/api prisma studio      # Open Prisma Studio

# Testing
bun run test --filter=@app/api            # Run API tests
bun run test:watch --filter=@app/api      # Run tests in watch mode
```

### Web-Specific Scripts

```bash
# Development
bun run dev --filter=@app/web        # Start web app in development mode
bun run build --filter=@app/web      # Build web app for production
bun run start --filter=@app/web      # Preview production build

# Testing
bun run test --filter=@app/web       # Run web app tests
bun run test:watch --filter=@app/web # Run tests in watch mode
```

## Docker

### Build Docker Images

```bash
# Build all Docker images
bun run docker:build:all

# Build individual images
bun run docker:build:api
bun run docker:build:web
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
BETTER_AUTH_SECRET="your-production-secret"
BETTER_AUTH_URL="https://api.yourdomain.com"
FRONTEND_URL="https://yourdomain.com"
```

**Web Environment Variables:**

```env
# API URL for Better Auth client
PUBLIC_API_URL=http://localhost:3000
```

### Deployment

> **Note**: The `docker/compose.yaml` file in this repository is a personal deployment configuration
> for the project owner's server setup with custom networks and Portainer integration. It is not
> intended for general use.

For your own deployment, you'll need to create your own Docker Compose configuration or deployment
setup based on your infrastructure requirements, using the environment variables listed above.

## Testing

### Running Tests

```bash
# Run all tests
bun run test

# Run tests with coverage
bun run test:coverage

# Run tests in watch mode
bun run test:watch

# Run specific app tests
bun run test --filter=@app/api
bun run test --filter=@app/web
```

### Test Structure

- **API Tests**: Bun test with unit and integration tests
- **Web Tests**: Bun test with React Testing Library
- **E2E Tests**: (To be implemented)

## Architecture

This project follows **Clean Architecture** principles:

### Backend (API)

- **Domain Layer**: Entities, interfaces, and business rules
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: Database, external services, controllers

### Frontend (Web)

- **Component-based**: Reusable React components
- **Page-based routing**: Astro file-based routing
- **Server-side rendering**: SSR for authenticated pages

## Contributing

### Development Workflow

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   # Supported patterns: feature/*, fix/*, hotfix/*
   ```

2. **Make your changes** following the coding standards

3. **Run quality checks locally**:

   ```bash
   bun run lint           # Check for linting errors
   bun run typecheck      # Check for TypeScript errors
   bun run test           # Run all tests
   bun run build          # Ensure build succeeds
   ```

4. **Commit your changes**:

   ```bash
   bun run commit         # Use conventional commits
   ```

5. **Push your branch**:

   ```bash
   git push origin feature/your-feature-name
   ```

   **The CI pipeline will automatically**:
   - Run all validation checks (lint, typecheck, test, build)
   - Build Docker images (for supported branch patterns)
   - Push images to GitHub Container Registry

6. **Create a Pull Request** from your branch to `main`

### Code Style

- Follow the existing ESLint and Prettier configurations
- Use conventional commit messages
- Write tests for new features
- Update documentation as needed

## Additional Resources

- [Turbo Documentation](https://turbo.build/repo/docs) - Monorepo build system
- [Better Auth Documentation](https://www.better-auth.com/) - Authentication library
- [Conventional Commits](https://www.conventionalcommits.org/) - Commit message format
- [GitHub Actions](https://docs.github.com/en/actions) - CI/CD workflows

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Titux Metal** - Initial work and maintenance

---

### Getting Started Checklist

- [ ] Clone the repository
- [ ] Install Bun (>=1.3.3)
- [ ] Run `bun install`
- [ ] Set up environment variables
- [ ] Run database migrations
- [ ] Run `./scripts/validate-setup.sh`
- [ ] Start development with `bun run dev`
- [ ] Visit <http://localhost:4321> (web) and <http://localhost:3000> (api)

**Happy coding!**
