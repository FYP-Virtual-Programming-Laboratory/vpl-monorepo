# VPL Monorepo

A monorepo for the Virtual Programming Laboratory (VPL) platform, managed with Turborepo. It includes backend, frontend, and shared packages for collaborative coding, project management, and real-time editing.

## Monorepo Structure

### Apps

- `collab-server`: NestJS backend providing GraphQL APIs, real-time collaboration, and project/file management.

### Packages

- `collab-ui`: React-based frontend library for collaborative code editing and project interaction.

## Getting Started

### Prerequisites

- Node.js (v22+ recommended)
- pnpm (uses pnpm workspaces)
- turborepo

### Install dependencies

```bash
pnpm install
```

### Develop

To start development servers for all apps:

```bash
pnpm turbo run dev
```

> If you install turbo as a global package, you can replace `pnpm turbo` with `turbo`.

Or for a specific app:

```bash
pnpm turbo run dev --filter=collab-ui
pnpm turbo run dev --filter=collab-server
```

### Build

To build all apps and packages:

```bash
pnpm turbo run build
```

Or build a specific app/package:

```bash
pnpm turbo run build --filter=collab-ui
pnpm turbo run build --filter=collab-server
```

### Test

To run tests for all apps/packages:

```bash
pnpm turbo run test
```

Or for a specific app/package:

```bash
pnpm turbo run test --filter=collab-ui
pnpm turbo run test --filter=collab-server
```

## Useful Links

- [Turborepo Documentation](https://turbo.build/repo/docs)

## License

MIT
