# EZY1 — FULL PRODUCTION ARCHITECTURE AUDIT & STABILIZATION PLAN
**Document Version:** 1.0.0  
**Audit Date:** October 2026  
**Auditor:** Antigravity Principal Architecture & Engineering Team  
**Repository Baseline:** `d:/ALKA/ezy1f/project`  

---

## 1. EXECUTIVE SUMMARY

An exhaustive, non-destructive audit of the complete EZY1 repository was conducted. EZY1 is an Indian hyperlocal super-app combining grocery, fresh produce, pharmacy, healthcare/hospital bookings, local transport (buses, cabs, shared rides), home services, hotel stays, parcel delivery, partner storefronts, partner multi-tenant portals, and platform administration.

### Key Audit Findings:
1. **Four Concurrent Backend Implementations (Fragmentation):**
   - **Backend 1 (Motoko / Internet Computer):** `src/backend/` (`main.mo`, `mops.toml`, `caffeine.toml`, `mixins/`, `lib/`). Not connected to live production frontend.
   - **Backend 2 (Serverless JSON DB):** `api/` (`index.js`, `db.js` reading/writing `ezy1_db.json`). Used by Vercel serverless deployment (`vercel.json`).
   - **Backend 3 (Node.js + SQLite Express):** `src/server/` (`src/db.js`, `src/routes.js` targeting `database.sqlite`).
   - **Backend 4 (Node.js + TypeScript Express + Prisma):** `backend/` (`src/app.ts`, `src/server.ts`, `src/controllers`, `src/services`, `src/routes`, `prisma/schema.prisma`). Currently has a fallback to SQLite in `repositories/database.adapter.ts`.

2. **Database Fragmentation & Production Data:**
   - Active SQLite database at `src/server/database.sqlite` (249,856 bytes) contains **38 tables** with real production seed data:
     - 28 Partners (including Grocery, Pharmacy, Healthcare, Delivery, Food, Services, Admin)
     - 13 Users & Customers
     - 11 Orders
     - 3 Payments
     - 11 Notifications & 17 Notification Preferences
     - Hospital Beds (7), Hospital Doctors (2), Pharmacy Medicines (3), Restaurant Menu (3)
     - Stays/Hotels (4), Travel Packages (3), Explore Places (4), Buses (3), Shared Rides (3)
     - Home Healthcare Services (4), Partner Services (3), Diagnostic Tests (3)
     - Owner Business Settings (6) and Owner Services (19)
   - Secondary SQLite file at workspace root `../src/server/database.sqlite` (110,592 bytes, 12 tables, older stub).
   - Flat JSON file `ezy1_db.json` (38,540 bytes) used by `api/db.js`.
   - Comprehensive Prisma Schema (`backend/prisma/schema.prisma`, 28,982 bytes) defines **46 PostgreSQL models** covering all business domains. However, financial fields currently use `Float` instead of `Decimal`.

3. **Critical Security Vulnerabilities Identified:**
   - **Leaked Frontend Secrets:** `.env` contains `VITE_PAYMENT_SECRET` (Razorpay secret exposed in Vite build) and `VITE_AI_API_KEY` (OpenAI secret key exposed in Vite build). Must be removed immediately from `VITE_` variables.
   - **Client-Authoritative Pricing:** Frontend `CheckoutPage.tsx` calculates `toPay` in the browser and sends it to `/api/orders` and `/api/payments/create-razorpay-order`. The server trusts the client-provided amount.
   - **Missing Webhook Idempotency:** Payment webhooks lack strict transactional replay prevention.

4. **The "Checkout → Payment → Redirect to Home" Bug Discovered:**
   - In `src/frontend/src/App.tsx`, the checkout route is registered only as `/dashboard/checkout`.
   - The route `/checkout` is **missing** from TanStack Router configuration.
   - If a customer navigates to `/checkout` (or receives a redirect from payment/external provider), TanStack Router hits `RouterErrorFallback`, which explicitly executes:
     ```typescript
     localStorage.removeItem("ezy1-cart");
     localStorage.removeItem("ezy1_auth_token");
     localStorage.removeItem("ezy1_customer_user");
     window.location.href = "/";
     ```
     This wipes the user's cart, wipes auth state, and redirects them to the homepage!

5. **Mock Data Dependencies in Frontend:**
   - 12 frontend files import from `mock-data.ts` (e.g. `LandingPage`, `OmniSearchPage`, `DoctorsPage`, `HealthcarePage`, `TransportPage`).
   - 6 frontend files import from `ecosystem-data.ts` (e.g. `HospitalsPage`, `DiagnosticsPage`, `LocalFamousPage`).
   - 23 frontend files import from `storeData.ts` (Zustand store with `ezy1_complete_platform_os_v3` fallback).
   - In `backend-hooks.ts`, hooks query `/api/*` but immediately fall back to mock data if the API is offline or returns empty items.

---

## 2. CURRENT VS. TARGET ARCHITECTURE

### Current Fragmented Architecture
```
                        [ Client Browser ]
                                |
               +----------------+----------------+
               |                                 |
         Vercel CDN                       Node.js (Port 3000)
               |                                 |
         /api/index.js                    Express Server
         (api/db.js)                      (backend/src/server.ts)
               |                                 |
        ezy1_db.json                 repositories/database.adapter.ts
        (Flat JSON File)                         |
                                       +---------+---------+
                                       |                   |
                                   (Fallback)          (Configured)
                                       |                   |
                               database.sqlite       PostgreSQL
                               (38 Tables)          (Prisma ORM)
```

### Target Internet-Scale Architecture
```
                               INTERNET
                                  |
                                  v
                            Cloudflare CDN
                        (Static Assets & Edge Cache)
                                  |
                                  v
                            Load Balancer
                                  |
                +-----------------+-----------------+
                |                                   |
                v                                   v
      Node.js Express API (Node 1)        Node.js Express API (Node 2)
      - TypeScript (strict)               - TypeScript (strict)
      - Express Canonical REST /api/v1    - Express Canonical REST /api/v1
      - Zod Runtime Validation            - Zod Runtime Validation
      - Central Auth & RBAC               - Central Auth & RBAC
      - Server-Side Pricing Engine        - Server-Side Pricing Engine
      - Razorpay Verification & Webhooks  - Razorpay Verification & Webhooks
                |                                   |
                +-----------------+-----------------+
                                  |
        +-------------------------+-------------------------+
        |                         |                         |
        v                         v                         v
  Redis Cache Cluster       BullMQ / Queue Worker    PostgreSQL (Prisma ORM)
  - Rate Limiting           - Async Email/SMS        - Single Source of Truth
  - Session Metadata        - Notifications          - Decimal Financial Types
  - Idempotency Keys        - Search Indexing        - 46 Structured Models
  - Catalog Cache           - Settlement Jobs        - Strict Foreign Keys
```

---

## 3. INVENTORY OF CODEBASE ARTIFACTS

### 3.1 Frontend (`src/frontend/`)
- **Framework:** React 19 + TypeScript + Vite 5
- **Routing:** TanStack Router (`@tanstack/react-router`)
- **State Management:**
  - `AuthContext.tsx` (Customer JWT & profile)
  - `partnerAuthStore.ts` (Partner/Vendor auth & permissions)
  - `cartStore.ts` (Zustand persistent shopping cart)
  - `locationStore.ts` (Hyperlocal address & GPS store)
  - `notificationStore.ts` (In-app notifications feed)
  - `storeData.ts` (Legacy local storage fallback)
- **Styling:** Tailwind CSS + Radix UI primitives + Lucide Icons + Framer Motion
- **Entry Point:** `src/frontend/src/main.tsx` -> `src/frontend/src/App.tsx`
- **Key Client:** `src/frontend/src/lib/api.ts`

### 3.2 Canonical Backend (`src/server/` / `backend/`)
- **Target Runtime:** Node.js 20+ / 24+ LTS, TypeScript 5.7+ (`strict: true`), Express 4
- **Target ORM:** Prisma 6 with `@prisma/client`
- **Target Single Database:** PostgreSQL (via `DATABASE_URL`)
- **Components:**
  - `app.ts`: Express application setup, security headers, CORS allowlist, request logging.
  - `server.ts`: Lifecycle management, database connection check, graceful shutdown.
  - `config/`: Environment configuration (`env.config.ts`), database configuration.
  - `middleware/`: Auth verification, RBAC authorization, rate limiting, request validation, error handler.
  - `routes/`: Canonical `/api/v1` routes with backward-compatible `/api` aliases.
  - `controllers/`: Route handlers (Auth, Product, Service, Order, Payment, Partner, Admin, Notification).
  - `services/`: Business logic layer (pricing calculations, Razorpay signing, OTP dispatch).
  - `repositories/`: Prisma ORM database queries (eliminating SQLite raw SQL queries).
  - `validators/`: Zod runtime request schemas.

### 3.3 Databases & Data Sources
| Data Source | Location | Size / Records | Status | Migration Strategy |
|---|---|---|---|---|
| Active SQLite | `src/server/database.sqlite` | 249,856 bytes / 38 tables | Active Baseline | Run automated migration script to PostgreSQL |
| Root SQLite Stub | `../src/server/database.sqlite` | 110,592 bytes / 12 tables | Obsolete Stub | Archive, do not overwrite active DB |
| Flat JSON DB | `ezy1_db.json` | 38,540 bytes / 12 entities | Vercel Mock | Merge into migration dataset for completeness |
| PostgreSQL Schema | `backend/prisma/schema.prisma` | 46 models / 998 lines | Canonical Target | Convert Float money fields to Decimal; apply migrations |

---

## 4. FILES TO MIGRATE, PRESERVE, AND REMOVE

### 4.1 Files to PRESERVE (Untouched UI / Core Logic)
- All React page components:
  - `src/frontend/src/pages/LandingPage.tsx`
  - `src/frontend/src/pages/LoginPage.tsx`
  - `src/frontend/src/pages/PartnerLoginPage.tsx`
  - `src/frontend/src/pages/PartnerDashboardPage.tsx`
  - `src/frontend/src/pages/AdminPage.tsx`
  - `src/frontend/src/pages/OwnerPortalPage.tsx`
  - `src/frontend/src/pages/CartPage.tsx`
  - `src/frontend/src/pages/CheckoutPage.tsx` (fix payment flow and pricing logic)
  - `src/frontend/src/pages/HealthcarePage.tsx`, `HospitalsPage.tsx`, `DoctorsPage.tsx`, `DiagnosticsPage.tsx`
  - `src/frontend/src/pages/TransportPage.tsx`, `BusTransportPage.tsx`, `ShareRidePage.tsx`
  - `src/frontend/src/pages/StaysPage.tsx`, `TravelPage.tsx`, `NoticeBoardPage.tsx`
  - `src/frontend/src/pages/MyOrdersPage.tsx`, `MyBookingsPage.tsx`, `MyDashboardPage.tsx`
  - All partner portal views (`partner/GroceryPartnerPortal.tsx`, `PharmacyPartnerPortal.tsx`, `HospitalPartnerPortal.tsx`, `RestaurantPartnerPortal.tsx`, `DeliveryPartnerPortal.tsx`, `ServiceProviderPortal.tsx`)
- All UI components in `src/frontend/src/components/`
- All asset files, logos, images, icons, and legal pages

### 4.2 Files to MIGRATE / REFURBISH
- `src/frontend/src/App.tsx`:
  - Add missing routes: `/checkout`, `/payment-success`, `/payment-failed`, `/orders/$orderId`.
  - Fix `RouterErrorFallback` so that unexpected errors do not silently wipe cart or redirect to `/`.
- `src/frontend/src/lib/api.ts`:
  - Centralize all API calls, point to canonical `/api/v1` base URL with backward compatibility.
  - Implement structured error handling and token refresh.
- `src/frontend/src/lib/backend-hooks.ts`:
  - Connect hooks to live `/api/v1` endpoints with real caching; remove fallback to static mock data in production mode.
- `src/frontend/src/pages/CheckoutPage.tsx`:
  - Hand off price calculation to the server: call `POST /api/v1/orders/quote` or `POST /api/v1/orders/draft` to compute prices, delivery, and taxes server-side.
  - Pass server-calculated order amount to Razorpay.
  - Handle verify and webhook responses cleanly with redirect to `/payment-success` or `/payment-failed`.
- `backend/prisma/schema.prisma`:
  - Update all monetary columns from `Float` to `Decimal` (`@db.Decimal(12, 2)`):
    - `User.walletBalance`
    - `Partner.commissionRate`, `Partner.walletBalance`, `Partner.pendingSettlement`
    - `Product.price`, `Product.mrp`
    - `Service.price`
    - `Order.subtotal`, `Order.deliveryFee`, `Order.discountAmount`, `Order.totalAmount`
    - `OrderItem.unitPrice`, `OrderItem.totalPrice`
    - `Booking.totalAmount`
    - `BookingItem.unitPrice`, `BookingItem.totalPrice`
    - `Payment.amount`
    - `Settlement.grossSales`, `Settlement.platformFee`, `Settlement.taxDeduction`, `Settlement.netPayout`
    - `Refund.amount`
    - `HospitalBed.dailyRate`
    - `HospitalDoctor.consultationFee`
    - `PharmacyMedicine.price`
    - `RestaurantMenuItem.price`
    - `Hotel.pricePerNight`, `Hotel.originalPrice`, `HotelBooking.totalAmount`
    - `TravelPackage.price`, `TravelBooking.totalAmount`
    - `Bus.price`, `BusBooking.totalAmount`
    - `SharedRide.pricePerSeat`, `SharedRideBooking.totalAmount`
    - `HomeHealthcareService.price`, `HomeHealthcareBooking.totalAmount`
    - `DiagnosticTest.price`, `DiagnosticBooking.totalAmount`
    - `Coupon.discountValue`, `Coupon.minOrderValue`, `Coupon.maxDiscount`
- `backend/src/repositories/database.adapter.ts`:
  - Refactor to use Prisma Client exclusively; remove SQLite queries and raw SQLite tables.

### 4.3 Files to REMOVE (After Migration Verification)
- **Motoko / ICP Code:**
  - `src/backend/main.mo`
  - `src/backend/caffeine.toml`
  - `src/backend/mixins/`
  - `src/backend/lib/`
  - `src/backend/system-idl/`
  - `src/backend/types/`
  - `mops.toml`, `mops.lock`
  - `src/frontend/src/lib/backend-actor.ts`
  - Dfinity packages in `src/frontend/package.json` (`@dfinity/agent`, `@dfinity/identity`, `@dfinity/auth-client`, `@dfinity/candid`, `@dfinity/principal`, `@icp-sdk/core`)
- **Old SQLite / Serverless Redundant Backends:**
  - `api/` (after unifying serverless routing or directing Vercel rewrites to the canonical Express API)
  - `src/server/src/db.js`, `src/server/src/routes.js`
  - `database.sqlite` (archived and removed from git after PostgreSQL migration verification)
  - `sqlite` and `sqlite3` npm dependencies

---

## 5. API INVENTORY & CANONICAL ROUTES

### 5.1 Public & Customer API (`/api/v1`)
| Method | Canonical Endpoint | Existing Frontend Alias | Description | Rate Limit Policy |
|---|---|---|---|---|
| `GET` | `/api/v1/health` | `/api/health` | Process liveness & readiness check | Unlimited (Internal) |
| `POST` | `/api/v1/auth/send-otp` | `/api/auth/send-otp` | Generate and dispatch phone/email OTP | Strict: 3 req / 10 min / phone |
| `POST` | `/api/v1/auth/verify-otp` | `/api/auth/verify-otp` | Validate OTP and issue customer JWT | Strict: 5 req / 10 min / phone |
| `POST` | `/api/v1/auth/login` | `/api/auth/login` | Username/password login | Moderate: 10 req / 15 min / IP |
| `POST` | `/api/v1/auth/register` | `/api/auth/register` | Customer account registration | Moderate: 10 req / 15 min / IP |
| `POST` | `/api/v1/auth/logout` | `/api/auth/logout` | Revoke session/token | General: 60 req / min |
| `GET` | `/api/v1/auth/me` | `/api/auth/me` | Fetch authenticated user profile | User: 60 req / min |
| `GET` | `/api/v1/products` | `/api/products` | Paginated product catalog with category filter | Public: 120 req / min (Edge cached) |
| `GET` | `/api/v1/products/:id` | `/api/products/:id` | Product detail view | Public: 120 req / min (Edge cached) |
| `GET` | `/api/v1/categories` | `/api/categories` | Catalog category list | Public: 120 req / min (Edge cached) |
| `GET` | `/api/v1/vendors` | `/api/vendors` | Hyperlocal vendor / storefront list | Public: 120 req / min |
| `GET` | `/api/v1/search` | `/api/search` | Omni-search across products/services/vendors | Search: 60 req / min / IP |
| `POST` | `/api/v1/orders/quote` | New | Server-side cart validation and price calculation | User: 30 req / 10 min |
| `POST` | `/api/v1/orders` | `/api/orders` | Atomic order creation with inventory reservation | User: 10 req / 10 min |
| `GET` | `/api/v1/orders` | `/api/orders` | Customer order history (paginated) | User: 60 req / min |
| `GET` | `/api/v1/orders/:id` | `/api/orders/:id` | Order details and live tracking | User: 60 req / min |
| `POST` | `/api/v1/payments/create-order`| `/api/payments/create-razorpay-order` | Server-side Razorpay order generation | User: 10 req / 10 min |
| `POST` | `/api/v1/payments/verify` | `/api/payments/verify` | Cryptographic signature verification | User: 10 req / 10 min / order |
| `POST` | `/api/v1/payments/webhook` | `/api/payments/webhook` | Idempotent gateway webhook handler | Gateway: Signature validated |
| `GET` | `/api/v1/notifications` | `/api/notifications` | User notification feed | User: 60 req / min |
| `PATCH`| `/api/v1/notifications/:id/read` | `/api/notifications/:id/read` | Mark notification as read | User: 60 req / min |

### 5.2 Super-App Domain APIs
| Method | Canonical Endpoint | Existing Frontend Alias | Domain |
|---|---|---|---|
| `GET` | `/api/v1/hospitals` | `/api/hospitals` | Hospital list & details |
| `GET` | `/api/v1/hospitals/beds` | `/api/hospital/beds` | Real-time bed availability |
| `GET` | `/api/v1/doctors` | `/api/doctors` | Doctor directory |
| `POST` | `/api/v1/doctors/appointments` | `/api/doctors/appointments` | Book doctor consultation |
| `GET` | `/api/v1/diagnostics` | `/api/diagnostics` | Lab test catalog |
| `POST` | `/api/v1/diagnostics/book` | `/api/diagnostics/book` | Diagnostic test booking |
| `GET` | `/api/v1/stays` | `/api/stays` | Hotel / stay listings |
| `POST` | `/api/v1/stays/book` | `/api/stays/book` | Hotel room booking |
| `GET` | `/api/v1/travel` | `/api/travel` | Travel packages |
| `POST` | `/api/v1/travel/book` | `/api/travel/book` | Travel package booking |
| `GET` | `/api/v1/buses` | `/api/buses` | Bus routes & schedules |
| `POST` | `/api/v1/buses/book` | `/api/buses/book` | Bus ticket reservation |
| `GET` | `/api/v1/rides/shared` | `/api/rides/shared` | Shared ride carpool listings |
| `POST` | `/api/v1/rides/shared/book` | `/api/rides/shared/book` | Ride booking |
| `GET` | `/api/v1/home-healthcare` | `/api/home-healthcare` | At-home nurse / physiotherapist services |
| `POST` | `/api/v1/home-healthcare/book` | `/api/home-healthcare/book`| Healthcare service booking |
| `GET` | `/api/v1/services` | `/api/services` | Local home services (electricians, repairs) |
| `POST` | `/api/v1/services/book` | `/api/services/book` | Local service booking |

### 5.3 Partner & Admin Multi-Tenant APIs
| Method | Canonical Endpoint | Existing Alias | Tenant Isolation Enforcement |
|---|---|---|---|
| `POST` | `/api/v1/partners/login` | `/api/partner/login` | Issues Partner JWT scoped to `partnerId` & `partnerType` |
| `GET` | `/api/v1/partner/dashboard` | `/api/partner/dashboard` | Scoped strictly to `req.partner.id` |
| `GET` | `/api/v1/partner/products` | `/api/grocery/products` / `/api/pharmacy/medicines` | Returns only products where `partnerId = req.partner.id` |
| `POST` | `/api/v1/partner/products` | `/api/grocery/products` | Injects `partnerId = req.partner.id`; ignores client body |
| `PATCH`| `/api/v1/partner/products/:id` | `/api/grocery/products/:id` | Validates product ownership before update |
| `DELETE`| `/api/v1/partner/products/:id`| `/api/grocery/products/:id` | Validates product ownership before delete |
| `GET` | `/api/v1/partner/orders` | `/api/grocery/orders` / `/api/restaurant/orders` | Scoped strictly to `req.partner.id` |
| `PATCH`| `/api/v1/partner/orders/:id/status` | `/api/partner/orders/:id/status` | Scoped to partner orders only |
| `GET` | `/api/v1/admin/stats` | `/api/admin/stats` | Requires `ADMIN` or `SUPER_ADMIN` role |
| `GET` | `/api/v1/admin/users` | `/api/admin/users` | Requires Admin role; paginated |
| `GET` | `/api/v1/admin/partners` | `/api/admin/partners` | Requires Admin role |
| `PATCH`| `/api/v1/admin/partners/:id/verify` | `/api/admin/partners/:id/verify` | Requires Admin role; audit logged |

---

## 6. ENVIRONMENT VARIABLES & SECRETS AUDIT

### 6.1 Vulnerabilities & Leaks Found:
1. **`VITE_PAYMENT_SECRET`**:
   - Discovered in `.env` and `src/server/.env`.
   - Any variable prefixed with `VITE_` is statically injected into the client bundle by Vite during `npm run build`.
   - **Remediation:** Remove `VITE_PAYMENT_SECRET` and `VITE_PAYMENT_KEY_ID`. Keep only `VITE_RAZORPAY_KEY_ID` (public key) on frontend; keep `RAZORPAY_KEY_SECRET` exclusively on backend.
2. **`VITE_AI_API_KEY`**:
   - Discovered in `.env` and `src/server/.env` containing a real OpenAI API key.
   - **Remediation:** Remove `VITE_AI_API_KEY` from frontend build. Route AI requests through authenticated server endpoint `POST /api/v1/ai/chat` if AI features are used.
3. **Quoted `DATABASE_URL` in `backend/.env`**:
   - The value had outer quotes (`"postgresql://..."`), causing string prefix matching to fail.
   - **Remediation:** Ensure unquoted format or strip wrapping quotes in `env.config.ts`.

### 6.2 Canonical `.env.example`
```env
# Application Server
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://ezy1.site
BACKEND_URL=https://api.ezy1.site
CORS_ORIGINS=https://ezy1.site,https://partner.ezy1.site,https://admin.ezy1.site,http://localhost:5173

# Database (PostgreSQL ONLY)
DATABASE_URL=postgresql://user:password@localhost:5432/ezy1_db?schema=public
DIRECT_DATABASE_URL=postgresql://user:password@localhost:5432/ezy1_db?schema=public

# Redis Distributed Cache & Rate Limiting
REDIS_URL=redis://localhost:6379

# Authentication & Security
JWT_SECRET=production_super_secure_random_jwt_secret_min_32_characters
JWT_REFRESH_SECRET=production_refresh_token_secret_min_32_characters
SESSION_SECRET=production_session_encryption_secret_min_32_characters
OTP_SECRET=production_otp_hmac_secret_key_2026

# Payments (Razorpay)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Communication Providers
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=contact@ezy1.site
SMTP_PASS=xxxxxxxxxxxxxxxxxxxx
BREVO_API_KEY=xxxxxxxxxxxxxxxxxxxx
FAST2SMS_API_KEY=xxxxxxxxxxxxxxxxxxxx

# Object Storage (AWS S3 or Compatible)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxx
AWS_PUBLIC_BUCKET=ezy1-public-media
AWS_KYC_BUCKET=ezy1-partner-kyc-private
CDN_BASE_URL=https://cdn.ezy1.site
```

---

## 7. MIGRATION PLAN & EXECUTION PHASING

```
[Phase 1] Database Migration:
          - Convert Float money fields in schema.prisma to Decimal
          - Build scripts/migrate-sqlite-to-postgres.ts to migrate 38 tables from database.sqlite
          - Validate row counts, relations, and monetary values
          - Update database.adapter.ts / repositories to use Prisma exclusively

[Phase 2] Canonical TypeScript Backend:
          - Consolidate src/server and backend into canonical TypeScript Express backend
          - Implement strict Zod validators, request IDs, rate limiting, and global error handling
          - Remove Motoko / ICP backend (main.mo, mops.toml, caffeine.toml)
          - Remove unused Dfinity dependencies

[Phase 3] Checkout & Payment Security:
          - Register missing routes: /checkout, /payment-success, /payment-failed, /orders/:orderId
          - Fix RouterErrorFallback in App.tsx to prevent cart wipe and home bounce
          - Implement server-side pricing engine (orders/quote)
          - Implement cryptographic Razorpay verification and idempotent webhook processing

[Phase 4] Multi-Tenant RBAC & Partner Isolation:
          - Enforce server-side partnerId scoping on all partner endpoints
          - Secure Admin endpoints with strict role-based middleware
          - Add tenant-isolation automated test suite

[Phase 5] Frontend Real API Integration:
          - Wire all screens to canonical /api/v1 client
          - Eliminate production reliance on mock-data.ts, ecosystem-data.ts, storeData.ts
          - Remove leaked secrets (VITE_PAYMENT_SECRET, VITE_AI_API_KEY)

[Phase 6] Internet-Scale Architecture & Load Testing:
          - Configure Redis distributed caching and endpoint rate limiting
          - Define capacity model for horizontal scaling toward 100M concurrent users
          - Execute automated tests (Unit, API, E2E, Load, Smoke)
```

---

## 8. RISK ASSESSMENT & MITIGATION

| Identified Risk | Severity | Likelihood | Mitigation Strategy |
|---|---|---|---|
| Data loss during SQLite to PostgreSQL migration | CRITICAL | Low | Backup active `database.sqlite` (249 KB) before any operation; run non-destructive validation script verifying all 38 tables and row counts before disconnecting SQLite. |
| Checkout flow breaks or payment signature fails | CRITICAL | Medium | Retain existing Razorpay test credentials for automated tests; verify signature using standard HMAC SHA256; preserve local cart until verification succeeds. |
| Customer cart or session lost on route navigation | HIGH | High | Fix `RouterErrorFallback` in `App.tsx` and register `/checkout` alias so users are never bounced to `/` with wiped state. |
| Partner data leakage across tenants | CRITICAL | Low | Bind partner identity strictly to authenticated JWT (`req.partner.id`); never accept `partnerId` or `vendorId` from request body. |
| Leaked API keys in production builds | HIGH | Medium | Purge `VITE_PAYMENT_SECRET` and `VITE_AI_API_KEY` from all `.env` files; audit Vite bundle output for string occurrences. |
| Database connection exhaustion under load | HIGH | Medium | Implement Prisma connection pooling with PgBouncer compatibility; enforce connection limits in `database.config.ts`. |

---
**Audit Approved for Phase 1 Execution.**
