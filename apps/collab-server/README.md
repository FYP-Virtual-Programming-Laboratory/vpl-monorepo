# Collab Server

A backend service for CodeCollab, built with NestJS. It provides APIs and real-time collaboration features for code editing, project management, and file operations.

## Features

- GraphQL API for projects, files, and users
- Real-time collaboration via WebSocket
- Project and file versioning
- Directory and file management
- Session-based access control
- Prisma ORM for database access

## Getting Started

### Prerequisites

- Node.js (v22+ recommended)
- pnpm (monorepo uses pnpm workspaces)
- Database (SQLite by default, see `prisma/schema.prisma`)

### Installation

```bash
pnpm install
```

### Development

Run the server in development mode:

```bash
pnpm turbo run dev
```

### Production

Build and start the server for production:

```bash
pnpm turbo run build
pnpm turbo run start
```

### Database Migrations

Apply migrations and generate Prisma client:

```bash
pnpm turbo run prisma:migrate
pnpm turbo run prisma:generate
```

### Testing

Run unit and e2e tests:

```bash
pnpm turbo run test
```

## Project Structure

- `src/` — Main source code (modules: project, file, directory, user, etc.)
- `prisma/` — Prisma schema, migrations, and seed scripts
- `test/` — End-to-end tests
- `start_script.sh` — Helper script for starting the server

## Environment Variables

Configure environment variables in `.env` (see `.env.sample`):

- `DATABASE_URL` — Database connection string
- `PORT` — Server port
- `NODE_ENV` — Environment (development/production)

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)

## License

MIT
