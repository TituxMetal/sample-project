# API Application

A NestJS API built with Clean Architecture principles, featuring Better Auth authentication and
comprehensive testing.

## Architecture Overview

This API follows **Clean Architecture** with proper domain separation:

```treeview
src/
├── auth/                    # Authentication domain (Better Auth)
│   ├── domain/
│   │   ├── types/          # Session, User, Admin types
│   │   └── exceptions/     # Domain exceptions
│   └── infrastructure/
│       ├── config/         # Better Auth configuration
│       └── hooks/          # Auth lifecycle hooks
├── users/                   # User management domain
│   ├── domain/
│   │   ├── entities/       # User entity
│   │   ├── exceptions/     # Domain exceptions
│   │   ├── repositories/   # Repository interfaces
│   │   └── value-objects/  # UserId, Username, Name
│   ├── application/
│   │   ├── dtos/           # Data transfer objects
│   │   ├── mappers/        # Domain to DTO mappers
│   │   ├── services/       # Application services
│   │   └── use-cases/      # GetUserProfile, UpdateUserProfile, DeleteUserAccount
│   └── infrastructure/
│       ├── controllers/    # HTTP controllers
│       ├── mappers/        # Infrastructure mappers
│       └── repositories/   # Prisma implementations
├── shared/                  # Shared utilities
└── config/                  # Application configuration
```

## Features

- **Clean Architecture** - Domain-driven design with clear boundaries
- **Better Auth** - Modern authentication with email/password, email verification, admin plugin
- **User Management** - Profile operations with custom fields (username, firstName, lastName)
- **Admin Features** - User listing, role management, ban/unban via Better Auth admin plugin
- **Data Validation** - Request/response validation with class-validator
- **Database Integration** - Prisma ORM with SQLite
- **Comprehensive Testing** - Unit tests for all layers with Bun test
- **Type Safety** - Full TypeScript implementation

## Technology Stack

- **Framework**: NestJS 11.x with Express 5.x
- **Database**: Prisma 7.x ORM with SQLite
- **Authentication**: Better Auth 1.4.x with @thallesp/nestjs-better-auth 2.2.x
- **Validation**: class-validator 0.14.x, class-transformer 0.5.x
- **Testing**: Bun test with extensive mocking

## Prerequisites

- Bun >= 1.3.3

## Quick Start

### Environment Setup

Create `.env` file in the `apps/api` directory:

```bash
# Generate a secure secret
openssl rand -hex 32
```

```env
# Prisma SQLite database location
DATABASE_URL="file:./dev.db"

# Better Auth configuration
BETTER_AUTH_SECRET="<output-from-openssl-command>"
BETTER_AUTH_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:4321"
```

### Database Setup

```bash
# From monorepo root:
bun run --cwd apps/api prisma generate
bun run --cwd apps/api prisma migrate dev
```

### Development

```bash
# From monorepo root:
bun run dev --filter=@app/api
```

The API runs at `http://localhost:3000`

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication (Better Auth)

| Endpoint                            | Method | Auth   | Description               |
| ----------------------------------- | ------ | ------ | ------------------------- |
| `/api/auth/sign-up/email`           | POST   | Public | Register new user         |
| `/api/auth/sign-in/email`           | POST   | Public | Login user                |
| `/api/auth/sign-out`                | POST   | Auth   | Logout user               |
| `/api/auth/get-session`             | GET    | Auth   | Get current session       |
| `/api/auth/verify-email`            | POST   | Public | Verify email with token   |
| `/api/auth/send-verification-email` | POST   | Public | Resend verification email |
| `/api/auth/forget-password`         | POST   | Public | Request password reset    |
| `/api/auth/reset-password`          | POST   | Public | Reset password with token |
| `/api/auth/change-password`         | POST   | Auth   | Change password           |
| `/api/auth/update-user`             | POST   | Auth   | Update user info          |
| `/api/auth/revoke-session`          | POST   | Auth   | Revoke specific session   |
| `/api/auth/revoke-other-sessions`   | POST   | Auth   | Revoke all other sessions |

### Admin (Better Auth Admin Plugin)

| Endpoint                              | Method | Auth  | Description                |
| ------------------------------------- | ------ | ----- | -------------------------- |
| `/api/auth/admin/list-users`          | GET    | Admin | List all users (paginated) |
| `/api/auth/admin/create-user`         | POST   | Admin | Create user                |
| `/api/auth/admin/get-user`            | GET    | Admin | Get user by ID             |
| `/api/auth/admin/set-role`            | POST   | Admin | Set user role              |
| `/api/auth/admin/ban-user`            | POST   | Admin | Ban/unban user             |
| `/api/auth/admin/remove-user`         | POST   | Admin | Delete user                |
| `/api/auth/admin/list-sessions`       | GET    | Admin | List user sessions         |
| `/api/auth/admin/revoke-user-session` | POST   | Admin | Revoke user session        |

### Users (Custom NestJS)

| Endpoint        | Method | Auth | Description                                    |
| --------------- | ------ | ---- | ---------------------------------------------- |
| `/api/users/me` | GET    | Auth | Get current user profile                       |
| `/api/users/me` | PATCH  | Auth | Update profile (username, firstName, lastName) |
| `/api/users/me` | DELETE | Auth | Delete own account                             |

## Testing

```bash
# From monorepo root:
bun run test --filter=@app/api
bun run test:watch --filter=@app/api
bun run test:coverage --filter=@app/api
```

## Database Schema

```prisma
model User {
  id            String    @id
  email         String    @unique
  emailVerified Boolean   @default(false)
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Custom fields
  username      String    @unique
  firstName     String?
  lastName      String?

  // Admin plugin fields
  role          String    @default("user")
  banned        Boolean   @default(false)
  banReason     String?
  banExpires    DateTime?

  accounts      Account[]
  sessions      Session[]
}

model Account {
  id                    String    @id
  userId                String
  accountId             String
  providerId            String
  accessToken           String?
  refreshToken          String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  idToken               String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Session {
  id             String   @id
  userId         String
  token          String   @unique
  expiresAt      DateTime
  ipAddress      String?
  userAgent      String?
  impersonatedBy String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

## Security Features

- **Password Hashing**: Handled by Better Auth (Argon2)
- **Session Management**: Cookie-based sessions with `better-auth.session_token`
- **Email Verification**: Built-in email verification flow
- **Admin Controls**: Role-based access, user banning, session revocation
- **Input Validation**: Comprehensive request validation
- **CORS**: Configurable cross-origin resource sharing

## Documentation

- [Better Auth Documentation](https://www.better-auth.com/) - Authentication library
- [NestJS Documentation](https://docs.nestjs.com/) - Framework documentation
- [Prisma Documentation](https://www.prisma.io/docs/) - Database ORM
- [Clean Architecture Guide](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) -
  Architecture principles
