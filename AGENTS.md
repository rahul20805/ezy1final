# EZY1 Project Guidance & Canonical Architecture

## Architecture Standards

- **Frontend**: React 19 + TypeScript + Vite (`src/frontend/`)
- **Backend**: Node.js + TypeScript + Express (`backend/`)
- **Database**: PostgreSQL with Prisma ORM (`backend/prisma/schema.prisma`), with SQL migration scripts in `database/migration_sqlite_to_pg.sql`
- **Payments**: Razorpay server-side order generation & HMAC-SHA256 signature verification (`backend/src/services/payment.service.ts`)
- **Messaging**: Brevo transactional emails & MSG91 OTP/SMS gateway (`backend/src/services/notification.service.ts`)

## Verified Commands

### Frontend (`src/frontend/`):
- **install**: `npm install` or `pnpm install`
- **typecheck**: `npm run typecheck`
- **build**: `npm run build`
- **dev**: `npm run dev`

### Backend (`backend/`):
- **install**: `npm install`
- **typecheck**: `npm run typecheck`
- **build**: `npm run build`
- **test**: `npm test`
- **prisma:generate**: `npm run prisma:generate`
- **prisma:migrate**: `npm run prisma:migrate`
- **data migration**: `npx tsx scripts/migrate-sqlite-to-postgres.ts`

### Root:
- **frontend dev**: `npm run dev`
- **frontend build**: `npm run build`
- **backend start**: `npm run server`
- **backend dev**: `npm run server:dev`
- **backend test**: `npm run server:test`
