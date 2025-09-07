# API Application

A NestJS API built with Clean Architecture principles, featuring user authentication and
comprehensive testing.

## Architecture Overview

This API follows **Clean Architecture** with proper domain separation:

```treeview
src/
├── auth/                    # Authentication domain
│   ├── domain/             # Business logic & entities
│   │   ├── entities/       # AuthUser entity
│   │   ├── exceptions/     # Domain exceptions
│   │   ├── repositories/   # Repository interfaces
│   │   ├── services/       # Domain service interfaces
│   │   └── value-objects/  # Email, Password, JwtPayload
│   ├── application/        # Use cases & application services
│   │   ├── dtos/           # Data transfer objects
│   │   ├── mappers/        # Domain to DTO mappers
│   │   ├── services/       # Application services
│   │   └── use-cases/      # Login, Register, Logout
│   └── infrastructure/     # External concerns
│       ├── controllers/    # HTTP controllers
│       ├── guards/         # Authentication guards
│       ├── repositories/   # Database implementations
│       └── services/       # JWT, Password, Token services
├── users/                  # User management domain
├── shared/                 # Shared utilities
└── config/                 # Application configuration
```

## Features

- **Clean Architecture** - Domain-driven design with clear boundaries
- **JWT Authentication** - Token-based auth with cookie storage and blacklisting
- **User Management** - Profile operations and admin endpoints
- **Data Validation** - Request/response validation with class-validator
- **Database Integration** - Prisma ORM with SQLite
- **Comprehensive Testing** - Unit tests for all layers with Jest
- **Type Safety** - Full TypeScript implementation

## Technology Stack

- **Framework**: NestJS with Express
- **Database**: Prisma ORM with SQLite
- **Authentication**: JWT with Argon2 hashing
- **Validation**: class-validator, class-transformer
- **Testing**: Jest with extensive mocking

## Prerequisites

- Node.js >= 22.17.0
- Yarn >= 4.9.1

## Quick Start

### Environment Setup

Create `.env` file in the `apps/api` directory:

```bash
# Generate a secure JWT secret
openssl rand -base64 32
```

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="<output-from-openssl-command>"
JWT_EXPIRES_IN="24h"
SESSION_TTL="86400"
```

### Database Setup

```bash
# From apps/api directory:
yarn prisma generate
yarn prisma migrate dev

# Or from root:
yarn workspace @app/api prisma generate
yarn workspace @app/api prisma migrate dev
```

### Development

```bash
# From apps/api directory:
yarn dev

# Or from root:
yarn workspace @app/api dev
```

The API runs at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user (sets HTTP-only cookie)
- `POST /auth/logout` - Logout user (clears cookie, blacklists token)

### Users

- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update current user profile
- `DELETE /users/me` - Delete current user account
- `GET /users` - Get all users (admin)
- `POST /users` - Create user (admin)

## Testing

```bash
# From apps/api directory:
yarn test
yarn test:watch
yarn test:coverage

# Or from root:
yarn workspace @app/api test
```

## Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String   @unique
  firstName String?
  lastName  String?
  hash      String
  confirmed Boolean  @default(true)
  blocked   Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Security Features

- **Password Hashing**: Argon2 for secure password storage
- **JWT Tokens**: HTTP-only cookies with configurable expiration
- **Token Blacklisting**: Secure logout implementation
- **Input Validation**: Comprehensive request validation
- **CORS**: Configurable cross-origin resource sharing

## Documentation

- [NestJS Documentation](https://docs.nestjs.com/) - Framework documentation
- [Prisma Documentation](https://www.prisma.io/docs/) - Database ORM
- [Clean Architecture Guide](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) -
  Architecture principles
- [Jest Testing](https://jestjs.io/docs/) - Testing framework
