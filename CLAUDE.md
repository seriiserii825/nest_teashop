# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
bun run start:dev        # watch mode
bun run start:debug      # debug + watch

# Build & production
bun run build
bun run start:prod

# Lint & format
bun run lint             # ESLint with auto-fix
bun run format           # Prettier

# Tests
bun run test             # unit tests (jest)
bun run test:watch       # watch mode
bun run test:cov         # coverage
bun run test:e2e         # e2e tests (test/jest-e2e.json)
# Run a single test file:
bun run test -- --testPathPattern=chat.service

# Database migrations (TypeORM via data-source.ts)
bun run migration:generate -- src/migrations/MigrationName   # generate from entity changes
bun run migration:run        # apply pending migrations
bun run migration:revert     # revert last migration
bun run migration:show       # list applied migrations
bun run migration:check      # detect if schema is out of sync
```

## Infrastructure

Start the database with Docker Compose (requires a `.env` file):

```bash
docker compose up -d     # starts PostgreSQL on $DB_PORT and Adminer on :8088
```

Required `.env` variables: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `JWT_EXPIRATION_TIME`, `JWT_REFRESH_EXPIRATION_TIME`, `JWT_REFRESH_COOKIE_DAYS`, `SERVER_DOMAIN`, `CLIENT_URL_DEVELOPMENT`, `CLIENT_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `PORT`.

## Architecture

NestJS 11 REST API with WebSocket support. All routes are prefixed `/api`. Swagger UI is available at `/api/docs` (configured in `src/config/swagger.config.ts`).

**Database**: PostgreSQL via TypeORM. `synchronize` is disabled — all schema changes must go through migrations. The TypeORM CLI data source is `src/data-source.ts`; entity auto-loading in the app uses `autoLoadEntities: true` in `app.module.ts`.

**Modules** (`src/`):
- `auth` — JWT + Google OAuth. Issues access token (short-lived) and refresh token (stored in `httpOnly` cookie). `@AuthJwt()` decorator applies `JwtAuthGuard`. `@Admin()` + `RolesGuard` enforce admin-only access.
- `user` — user accounts with roles (`UserRole.USER` / `UserRole.ADMIN`), favorite products (ManyToMany), one cart per user.
- `store` — a user can own multiple stores; products, categories, and colors are scoped per store.
- `product` — paginated/filtered listing with search, price range, category, color, and star rating filters. Image uploads stored under `uploads/products/<id>/`. Uses QueryBuilder with subqueries for `avg_rating` and `reviews_count`.
- `category` / `color` — simple lookup entities scoped to a store.
- `review` — product reviews with ratings.
- `order` / `order-item` — order management.
- `cart` / `cart-item` — one cart per user, one-to-one relationship on the `users` table.
- `statistic` — store/sales statistics.
- `file-manager` — shared service for uploading, updating, and deleting files. Files are saved to `uploads/` at project root and served statically at `/uploads/*`.
- `chat` — WebSocket gateway (`socket.io`) using `@nestjs/websockets`. JWT auth is read from `socket.handshake.auth.token`. Events: `sendMessage` (client→server), `newMessage` + `history` (server→client).

**Auth flow**: `POST /api/auth/login` returns `accessToken` in body and sets `refreshToken` cookie. `POST /api/auth/login/access-token` uses the cookie to issue a new access token. Google OAuth redirects to `$CLIENT_URL/dashboard?accessToken=...`.

**File uploads**: Multer is used in controllers. Files land in `uploads/` and URLs are stored as paths like `/uploads/products/42/image.webp`. The `FileManagerService` handles merge/diff logic for updating product image arrays.

**Migrations**: Generated with `typeorm-ts-node-commonjs`. Migration files live in `src/migrations/`. Never enable `synchronize: true` in production.
