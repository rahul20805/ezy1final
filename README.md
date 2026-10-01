# EZY1 — India's Hyperlocal & National Super App Platform

[![Built with React 19](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

**EZY1** is an all-in-one super app platform engineered for India's hyperlocal and national ecosystem. It unifies daily services, quick commerce, groceries, healthcare bookings, cab & bus transportation, ride sharing, parcel delivery, stays, home services, and vendor management into an AI-powered experience accessible from major metropolitan centers to tier-3 towns and rural villages.

---

## 🛠 Complete Technology Stack

### 1. Frontend Architecture & User Interface
- **Core Library**: [React 19](https://react.dev/) (`19.1.0`) with Concurrent Mode & Server Component primitives.
- **Language**: [TypeScript](https://www.typescriptlang.org/) (`^5.8.3`) for end-to-end type safety.
- **Build System & Bundler**: [Vite](https://vitejs.dev/) (`^5.4.1`) with `@vitejs/plugin-react` and `vite-plugin-environment`.
- **Routing Engine**: [TanStack Router](https://tanstack.com/router) (`~1.131.8`) with lazy loading, route guards, error boundaries, and multi-subdomain routing.
- **Server State Management**: [TanStack Query](https://tanstack.com/query) (`^5.24.0`) for client-side asynchronous caching and background refetching.
- **Client State Management**: [Zustand](https://github.com/pmndrs/zustand) (`~5.0.5`) powering modular stores:
  - `cartStore`: Persistent multi-vendor shopping cart and checkout state.
  - `locationStore`: Hyperlocal city/pincode selection and GPS coordinates.
  - `partnerAuthStore`: Multi-tenant session state and tenant isolation.
  - `notificationStore`: Real-time user alert preferences and notification feeds.
- **Styling & Design System**:
  - [Tailwind CSS](https://tailwindcss.com/) (`^3.4.17`) with `postcss` and `autoprefixer`.
  - Plugins: `@tailwindcss/typography`, `@tailwindcss/container-queries`, `tailwindcss-animate`.
  - Indian Heritage OKLCH color token architecture (Saffron `#FF6A00`, Deep Teal `#008080`, Indigo `#1A1C3B`).
- **UI Components & Headless Primitives**:
  - [Radix UI](https://www.radix-ui.com/) accessible primitives: Dialog, Dropdown Menu, Popover, Select, Tabs, Tooltip, Switch, Checkbox, Slider, ScrollArea, Avatar, Accordion, AlertDialog, NavigationMenu, ContextMenu, Menubar, Toggle, AspectRatio.
  - `class-variance-authority` (CVA), `clsx`, and `tailwind-merge` for style composition.
- **3D Graphics & Physics**:
  - [Three.js](https://threejs.org/) (`^0.176.0`)
  - [React Three Fiber](https://r3f.docs.pmnd.rs/) (`@react-three/fiber` `~9.1.2`)
  - [Drei](https://github.com/pmndrs/drei) (`@react-three/drei` `~10.0.8`)
  - [Cannon Physics](https://github.com/pmndrs/use-cannon) (`@react-three/cannon` `~6.6.0`)
- **Micro-Animations**: [Motion](https://motion.dev/) (`motion` `^12.34.3`, Framer Motion ecosystem).
- **Data Visualizations & Analytics**: [Recharts](https://recharts.org/) (`^2.15.1`) for vendor and admin analytics dashboards.
- **Form Management & Input**:
  - `react-hook-form` (`^7.53.0`)
  - `input-otp` (`^1.4.1`) for seamless 6-digit OTP verification.
  - `cmdk` (`^1.0.0`) for OmniSearch and Command Palette.
  - `vaul` (`^1.1.2`) for responsive mobile slide-over drawers.
  - `react-day-picker` (`^9.5.0`) & `date-fns` (`^3.6.0`) for booking calendar logic.
  - `react-quill-new` (`3.4.6`) for rich-text notices and vendor descriptions.
  - `embla-carousel-react` (`^8.2.1`) for responsive media carousels.
  - `sonner` (`^1.7.4`) for toast notifications.
  - `next-themes` (`~0.4.6`) for dark/light mode toggles.
- **Code Quality**: [Biome](https://biomejs.dev/) (`@biomejs/biome` `^1.9.0`) for high-speed linting and formatting.

---

### 2. Backend & Serverless API Architecture
- **Serverless API Engine**: Node.js 18+ ES Modules executed via Vercel Serverless Functions (`/api/index.js`).
- **Dedicated Application Server**: [Express 5](https://expressjs.com/) (`^5.2.1`) microservice with `cors` and `dotenv`.
- **Authentication & Authorization**:
  - Stateless JSON Web Tokens (`jsonwebtoken` / HMAC-SHA256 signatures).
  - Cryptographic password hashing (`crypto.pbkdf2Sync` with unique salts).
  - Role-Based Access Control (RBAC):
    - `CUSTOMER`
    - `PARTNER` (Grocery, Restaurant, Pharmacy, Hospital, Services, Logistics)
    - `PARTNER_STAFF`
    - `DRIVER`
    - `ADMIN` / `SUPER_ADMIN`
    - `OWNER` / `SUPER_OWNER`
  - Multi-tenant tenant ID isolation and automated session validation.
- **Decentralized / Blockchain Backend**:
  - [Motoko](https://internetcomputer.org/docs/current/motoko/main/motoko) (`moc` 1.3.0 canister on the Internet Computer / ICP).
  - Canister manager: [Mops](https://mops.one/) (`mops.toml`).
  - ICP client libraries: `@dfinity/agent`, `@dfinity/auth-client`, `@dfinity/candid`, `@dfinity/principal`, `@icp-sdk/core`.

---

### 3. Database & Storage Architecture
- **Primary Relational ORM**: [Prisma](https://www.prisma.io/) with a 530+ line schema (`src/server/prisma/schema.prisma`) targeting PostgreSQL for production enterprise scaling.
- **Dual-Engine Persistence Adapter**:
  - `dbAdapter.js` provides atomic transactional reads/writes with zero runtime setup.
  - Embedded [SQLite](https://sqlite.org/) (`sqlite3` `^6.0.1`, `sqlite` `^5.1.1`) for local environments and tests.
  - Serverless in-memory transactional JSON cache (`ezy1_db.json` / `/tmp/ezy1_production_db.json`).
- **Object Storage & KYC Document Protection**:
  - Compatible with Amazon S3 and Cloudflare R2.
  - Secure KYC document engine generating 15-minute time-limited HMAC-signed presigned URLs (`/secure-kyc/`).
  - Public asset distribution via CDN (`cdn.ezy1.site`).

---

### 4. Third-Party Integrations & Gateways
- **SMS & OTP Engine (DLT Compliant)**:
  - Multi-provider fallback engine (`smsProvider.js`):
    - **MSG91**: India DLT-compliant transaction & OTP route.
    - **Fast2SMS**: High-speed direct Indian mobile OTP route.
    - **Twilio**: Global SMS delivery.
    - **Textlocal**: Indian transactional notifications.
    - **Meta WhatsApp Cloud API**: WhatsApp template messaging for order confirmations and OTPs.
- **Email Service & Transactional Notifications**:
  - **Brevo** (formerly Sendinblue) SMTP (`smtp-relay.brevo.com`) and REST API.
  - **ImprovMX**: Inbound webhook processing and domain routing.
  - **Nodemailer** (`^10.0.10`): HTML template rendering and transactional dispatch.
  - Multi-identity sender architecture:
    - Support: `support@ezy1.site`
    - Orders: `orders@ezy1.site`
    - Admin: `admin@ezy1.site`
    - Management: `owner@ezy1.site`
    - Promotional: `offers@ezy1.site`
- **Payment & Settlement Gateway**:
  - [Razorpay](https://razorpay.com/) Payment Engine supporting UPI, Cards, Netbanking, and Wallets.
  - Cryptographic HMAC-SHA256 webhook signature validation and anti-replay attack safeguards.
  - Idempotency key tracking to eliminate double-charges.
- **Artificial Intelligence**:
  - [OpenAI](https://openai.com/) API integration (`gpt-4o`) powering the smart hyperlocal assistant and concierge chat.
- **Hyperlocal Location & Geocoding**:
  - Real-time reverse geocoding and address auto-completion (`/api/location.js`).
- **Asynchronous Task Queue**:
  - In-process event worker with Dead-Letter Queue (DLQ) support (`queueManager.js`).
  - Redis connection engine (`redisClient.js`) with BullMQ integration readiness.

---

### 5. DevOps, Infrastructure & Testing
- **Deployment Platform**: [Vercel](https://vercel.com/) with multi-domain routing rules:
  - User Portal: `https://ezy1.site`
  - Partner / Vendor Portal: `https://partner.ezy1.site`
  - Admin & Management Portal: `https://admin.ezy1.site`
  - Media & CDN Engine: `https://cdn.ezy1.site`
- **Performance & Load Testing**: [k6](https://k6.io/) stress-testing suite (`tests/load/k6_stress_test.js`).
- **Automated Verification**: End-to-end integration test runners in `src/server/`:
  - `test_real_phone_otp_e2e.mjs`
  - `test_partner_auth_e2e.mjs`
  - `test_auth_notifications_e2e.mjs`
  - `test_provider_auth_e2e.mjs`
  - `test_superapp_routes_e2e.mjs`
- **Image Optimization**: [Sharp](https://sharp.pixelplumbing.com/) (`^0.34.4`).

---

## 📂 Project Directory Structure

```text
ezy1f/
├── project/
│   ├── api/                     # Vercel Serverless Functions & API routes
│   │   ├── auth.js              # Password hashing, JWT creation & verification
│   │   ├── db.js                # Core transactional database layer
│   │   ├── emailService.js      # Brevo SMTP & ImprovMX email dispatch
│   │   ├── emailTemplates.js    # Responsive HTML email templates
│   │   ├── index.js             # API route handlers & endpoints
│   │   ├── location.js          # Reverse geocoding & address search
│   │   └── smsService.js        # SMS & OTP dispatch interface
│   ├── database/                # Database seed files & schemas
│   │   └── seed.sql             # SQL seed queries
│   ├── src/
│   │   ├── backend/             # Motoko ICP canister backend
│   │   │   ├── main.mo          # Canister actor source code
│   │   │   └── caffeine.toml    # ICP configuration
│   │   ├── frontend/            # React 19 single-page application
│   │   │   ├── src/
│   │   │   │   ├── components/  # Reusable UI & Layout components
│   │   │   │   ├── lib/         # Zustand stores, API clients & auth helpers
│   │   │   │   ├── pages/       # Super-App page views (40+ routes)
│   │   │   │   │   └── partner/ # Partner-specific dashboards (Grocery, Hospital, etc.)
│   │   │   │   ├── App.tsx      # Route definitions & router setup
│   │   │   │   └── main.tsx     # Application mounting point
│   │   │   ├── package.json     # Frontend dependencies
│   │   │   └── vite.config.ts   # Vite configuration
│   │   └── server/              # Express backend, Prisma schema & test runners
│   │       ├── prisma/          # Prisma PostgreSQL schema
│   │       │   └── schema.prisma
│   │       ├── src/             # Express routes, services & providers
│   │       └── package.json     # Server dependencies
│   ├── tests/                   # Load and stress testing suites (k6)
│   ├── .env.example             # Complete environment variables blueprint
│   ├── package.json             # Root workspace scripts
│   ├── vercel.json              # Domain routing, redirects & serverless rewrites
│   └── README.md                # Project documentation
```

---

## ⚡ Quick Start & Development Setup

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 2. Installation
Clone the repository and install all dependencies:

```bash
# Navigate to project root
cd project

# Install root dependencies
npm install

# Install frontend dependencies
npm --prefix src/frontend install

# (Optional) Install server dependencies if running dedicated Express server
npm --prefix src/server install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Key environment configurations include:
- `JWT_SECRET`: Secure cryptographic key for token generation.
- `OTP_PROVIDER`: Select from `msg91`, `fast2sms`, `twilio`, `textlocal`, or `whatsapp`.
- `BREVO_API_KEY` / `SMTP_PASS`: For transactional emails.
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`: For payment processing.
- `OPENAI_API_KEY`: For the AI concierge chatbot.

### 4. Running the Development Server

```bash
# Run Vite development server
npm run dev
```

The application will be live at `http://localhost:5173`.

### 5. Running Quality Checks & Build

```bash
# Type-check TypeScript codebase
npm run typecheck

# Code formatting and linting check via Biome
npm run check

# Automatically apply Biome formatting fixes
npm run fix

# Production build
npm run build
```

---

## 🌐 Production Multi-Subdomain Architecture

The production application is served via high-performance edge routing configured in `vercel.json`:

| Domain | Role | Target Audience |
| :--- | :--- | :--- |
| **`ezy1.site`** | Main Super App Platform | General users, shoppers, healthcare seekers & travelers |
| **`partner.ezy1.site`** | Partner & Vendor Portal | Kirana stores, pharmacies, restaurants, doctors & drivers |
| **`admin.ezy1.site`** | Administrative Governance | Platform owners, operations team & compliance officers |
| **`cdn.ezy1.site`** | Content Delivery Network | Public media distribution & time-limited KYC verification |

---

## 📄 License
This project is proprietary and confidential. All rights reserved © 2026 EZY1 Platform.