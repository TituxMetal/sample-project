# Web Application

A modern frontend built with Astro and React, featuring server-side rendering and Better Auth
authentication.

## Architecture Overview

Astro app with React components for interactivity:

```treeview
src/
├── components/             # React components
│   ├── ui/                # Base components
│   │   ├── Button.tsx     # Reusable button with variants
│   │   └── Input.tsx      # Form input with validation
│   ├── containers/        # Container components
│   │   └── AuthContainer.tsx # Auth form container
│   ├── forms/             # Form components
│   │   ├── LoginForm.tsx  # Login form
│   │   ├── SignupForm.tsx # Signup form
│   │   └── EditProfileForm.tsx # Profile editing form
│   └── ProfileView.tsx    # Profile display
├── layouts/               # Page layouts
│   └── Main.astro         # Main layout with nav/footer
├── pages/                 # File-based routing
│   ├── index.astro        # Home page
│   ├── auth.astro         # Authentication page
│   ├── profile.astro      # User profile (protected)
│   └── logout.astro       # Logout handler
├── services/              # API communication
│   ├── api.service.ts     # Generic API client
│   ├── auth.service.ts    # Authentication API (SSR)
│   └── user.service.ts    # User profile API
├── hooks/                 # React hooks
│   └── useAuth.ts         # Auth operations hook
├── lib/                   # Library configurations
│   └── authClient.ts      # Better Auth client
├── schemas/               # Validation schemas
│   ├── auth.schema.ts     # Login/signup validation
│   └── user.schema.ts     # Profile validation
├── stores/                # State management
│   └── auth.ts            # Auth state (nanostores)
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
├── styles/                # Global styles
└── middleware.ts          # Session authentication middleware
```

## Features

- **Server-Side Rendering** - Fast page loads with Astro
- **React Components** - Interactive forms and UI
- **Better Auth** - Cookie-based session authentication
- **Form Validation** - Zod schemas with React Hook Form
- **Responsive Design** - TailwindCSS mobile-first
- **Type Safety** - Full TypeScript implementation
- **Route Protection** - Middleware-based authentication

## Technology Stack

- **Framework**: Astro 5.x with SSR
- **UI Library**: React 19.x for interactive components
- **Styling**: TailwindCSS 4.x
- **Forms**: React Hook Form 7.x with Zod 4.x validation
- **Authentication**: Better Auth 1.4.x client
- **State**: Nanostores 1.x
- **Testing**: Bun test with Testing Library

## Prerequisites

- Bun >= 1.3.3

## Quick Start

### Environment Setup

Optional `.env` file in `apps/web` directory:

```env
# API URL for Better Auth client
PUBLIC_API_URL=http://localhost:3000
```

### Development

```bash
# From monorepo root:
bun run dev --filter=@app/web
```

The web app runs at `http://localhost:4321`

## Pages

- **Home (`/`)** - Landing page with auth status
- **Auth (`/auth`)** - Login/signup forms (mode via query param)
- **Profile (`/profile`)** - User profile view/edit (protected)
- **Logout (`/logout`)** - Handles logout and redirect

## API Integration

The app communicates with the API via Better Auth client and custom endpoints:

### Better Auth (via authClient)

- `signIn.email()` - User login
- `signUp.email()` - User signup
- `signOut()` - User logout
- `useSession()` - Get current session

### Custom API

- `GET /api/users/me` - Get user profile (SSR middleware)
- `PATCH /api/users/me` - Update profile (username, firstName, lastName)

## Testing

```bash
# From monorepo root:
bun run test --filter=@app/web
bun run test:watch --filter=@app/web
bun run test:coverage --filter=@app/web
```

## Configuration

### Astro Config

- **SSR Mode**: Server-side rendering enabled
- **React Integration**: For interactive components
- **TailwindCSS**: Utility-first styling

### Middleware

Authentication middleware handles:

- Session token validation from `better-auth.session_token` cookie
- User data injection into `Astro.locals.user`
- Route protection for authenticated pages
- Silent authentication on all requests

## Documentation

- [Astro Documentation](https://docs.astro.build/) - Framework documentation
- [Better Auth Documentation](https://www.better-auth.com/) - Authentication library
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod Documentation](https://zod.dev/) - Schema validation
- [TailwindCSS](https://tailwindcss.com/docs) - CSS framework
