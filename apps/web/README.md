# Web Application

A modern frontend built with Astro and React, featuring server-side rendering and JWT
authentication.

## Architecture Overview

Astro app with React components for interactivity:

```treeview
src/
├── components/             # React components
│   ├── ui/                # Base components
│   │   ├── Button.tsx     # Reusable button with variants
│   │   └── Input.tsx      # Form input with validation
│   ├── AuthForm.tsx       # Login/signup form
│   └── EditProfileForm.tsx # Profile editing form
├── layouts/               # Page layouts
│   └── Main.astro         # Main layout with nav/footer
├── pages/                 # File-based routing
│   ├── index.astro        # Home page
│   ├── auth.astro         # Authentication page
│   ├── profile.astro      # User profile (protected)
│   └── logout.astro       # Logout handler
├── services/              # API communication
│   ├── api.service.ts     # Generic API client
│   ├── auth.service.ts    # Authentication API
│   └── user.service.ts    # User profile API
├── hooks/                 # React hooks
│   └── useAuthForm.tsx    # Form logic
├── schemas/               # Validation schemas
│   ├── auth.schema.ts     # Login/signup validation
│   └── user.schema.ts     # Profile validation
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
├── styles/                # Global styles
└── middleware.ts          # JWT authentication middleware
```

## Features

- **Server-Side Rendering** - Fast page loads with Astro
- **React Components** - Interactive forms and UI
- **JWT Authentication** - Cookie-based auth with middleware
- **Form Validation** - Zod schemas with React Hook Form
- **Responsive Design** - TailwindCSS mobile-first
- **Type Safety** - Full TypeScript implementation
- **Route Protection** - Middleware-based authentication

## Technology Stack

- **Framework**: Astro with SSR
- **UI Library**: React for interactive components
- **Styling**: TailwindCSS
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest with React Testing Library
- **Icons**: React Icons + Astro Icon

## Prerequisites

- Node.js >= 22.17.0
- Yarn >= 4.9.1

## Quick Start

### Environment Setup

Optional `.env` file in `apps/web` directory:

```env
# For production deployment
PUBLIC_API_URL=/api
API_URL=http://api:3000
```

### Development

```bash
# From apps/web directory:
yarn dev

# Or from root:
yarn workspace @app/web dev
```

The web app runs at `http://localhost:4321`

## Pages

- **Home (`/`)** - Landing page with auth status
- **Auth (`/auth`)** - Login/signup forms (mode via query param)
- **Profile (`/profile`)** - User profile view/edit (protected)
- **Logout (`/logout`)** - Handles logout and redirect

## API Integration

The app communicates with the API via:

- `POST /auth/login` - User login
- `POST /auth/register` - User signup
- `POST /auth/logout` - User logout
- `GET /users/me` - Get user profile
- `PATCH /users/me` - Update profile

## Testing

```bash
# From apps/web directory:
yarn test
yarn test:watch
yarn test:coverage

# Or from root:
yarn workspace @app/web test
```

## Configuration

### Astro Config

- **SSR Mode**: Server-side rendering enabled
- **React Integration**: For interactive components
- **API Proxy**: Development proxy to `http://localhost:3000`
- **TailwindCSS**: Utility-first styling

### Middleware

Authentication middleware handles:

- JWT token validation from cookies
- User data injection into `Astro.locals.user`
- Invalid token cleanup
- Silent authentication on all requests

## Documentation

- [Astro Documentation](https://docs.astro.build/) - Framework documentation
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod Documentation](https://zod.dev/) - Schema validation
- [TailwindCSS](https://tailwindcss.com/docs) - CSS framework
- [Vitest](https://vitest.dev/) - Testing framework
