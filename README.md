# Golf Charity Club

A production-ready, full-stack subscription platform combining golf score tracking, monthly prize draws, and charitable giving. Built as a trainee selection assignment for Digital Heroes.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://golf-charity-platform-chi.vercel.app/|
| Backend API |https://golf-charity-platform-gcws.onrender.com/|
| API Health | https://golf-charity-platform-gcws.onrender.com/health |

**Test Credentials**

| Role | Email | Password |
|---|---|---|
| Admin | admin@golfcharity.club | Admin@2026! |
| Subscriber | test@golfcharity.club | Test@2026! |

**Stripe Test Card:** `4242 4242 4242 4242` — any future expiry, any CVC

> The backend is hosted on Render free tier. If the first request takes 30-60 seconds, the server is waking up from sleep. Subsequent requests are fast.

---

## What It Does

Golf Charity Club lets golfers subscribe to a platform where their Stableford scores are automatically entered into a monthly prize draw. A portion of every subscription goes to a charity the user chooses. Winners are verified by an admin before payouts are sent.

**Three things in one product:**
- Golf score tracking (rolling 5-score Stableford system)
- Monthly lottery-style prize draws (3-match, 4-match, 5-match jackpot tiers)
- Charitable giving (minimum 10% of every subscription to a chosen charity)

---

## Features

### User Features
- Email signup and login with JWT authentication
- Monthly and yearly subscription plans via Stripe Checkout
- Enter up to 5 Stableford scores (rolling — oldest removed when 6th is added)
- Select and change charity at any time
- Adjust charity contribution percentage (10% minimum)
- View draw history with match visualisation
- Upload prize proof and track payout status
- Billing management via Stripe Customer Portal

### Admin Features
- Full user management (view, edit, delete, toggle admin role)
- Draw creation with two algorithms: Random and Weighted (frequent/rare scores)
- Draw simulation before publishing (no data saved until confirmed)
- Jackpot rollover when no 5-match winner
- Prize claim review (approve, reject with note, mark paid)
- Charity management (create, edit, feature, deactivate)
- Analytics dashboard with 4 charts (subscriber growth, prize pool, charity breakdown, match distribution)

### Technical Features
- Rate limiting and throttling on all API routes
- Server-side caching for charities and draw data
- Optimistic UI updates on score entry
- Infinite scroll with IntersectionObserver on charity and draw history lists
- Virtualised lists for admin user tables
- Route-level code splitting with React lazy and Suspense
- Debounced search inputs
- Winston logging with environment-aware transports
- Stripe webhook signature verification
- Row Level Security on all Supabase tables
- Database triggers for score rolling and charity totals
- Zod validation on all API inputs
- Global error handling with custom ApiError class

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| React Router v6 | Client-side routing |
| TanStack Query v5 | Server state management and caching |
| TanStack Virtual | Virtualised lists for large datasets |
| Zustand | Global UI state (auth, sidebar) |
| Axios | HTTP client with request/response interceptors |
| React Hook Form + Yup | Form handling and validation |
| Framer Motion | Animations and page transitions |
| Tailwind CSS v4 | Utility-first styling |
| Recharts | Analytics charts |
| date-fns | Date formatting |
| React Toastify | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 20 + Express 4 | Server framework |
| Supabase JS Client | Database, auth, and file storage |
| Stripe Node SDK | Subscription payments and webhooks |
| Resend | Transactional email delivery |
| Winston + Morgan | Structured logging |
| Zod | API input validation |
| express-rate-limit | Rate limiting per endpoint |
| express-slow-down | Request throttling |
| node-cache | In-memory caching |
| Helmet | HTTP security headers |
| Multer | File upload handling |
| Compression | Gzip response compression |

### Infrastructure
| Service | Purpose |
|---|---|
| Supabase | PostgreSQL database, authentication, file storage |
| Stripe | Payment processing (test mode) |
| Resend | Email delivery |
| Render | Backend hosting |
| Vercel | Frontend hosting |
| GitHub | Source control |

---

## Project Structure

```
golf-charity-platform/
├── frontend/
│   └── src/
│       ├── features/          # Feature-based modules
│       │   ├── auth/          # Login, signup
│       │   ├── dashboard/     # Dashboard tabs
│       │   ├── scores/        # Score entry and management
│       │   ├── charities/     # Charity listing and detail
│       │   ├── draws/         # Draw history
│       │   ├── claims/        # Prize claims
│       │   ├── subscribe/     # Subscription flow
│       │   ├── settings/      # Account settings
│       │   ├── home/          # Public homepage
│       │   └── admin/         # Admin panel
│       ├── components/
│       │   ├── layout/        # AppShell, Sidebar, PublicLayout
│       │   └── shared/        # Reusable components
│       ├── hooks/             # Global custom hooks
│       ├── lib/               # Axios, QueryClient, Supabase client
│       ├── store/             # Zustand stores
│       ├── router/            # Routes, guards
│       └── utils/             # Formatters, constants
│
└── backend/
    └── src/
        ├── features/          # Feature-based modules
        │   ├── auth/          # Signup, login, logout
        │   ├── users/         # Profile management
        │   ├── scores/        # Score CRUD
        │   ├── charities/     # Charity listing
        │   ├── draws/         # Draw engine, prize calculator
        │   ├── claims/        # Prize claims and proof upload
        │   ├── payments/      # Stripe checkout and webhooks
        │   ├── emails/        # Email service and templates
        │   └── admin/         # Admin endpoints and analytics
        ├── config/            # DB, cache, logger, rate limits
        ├── middleware/        # Auth, validate, error handler
        └── utils/             # ApiError, asyncHandler, pagination
```

---

## Database Schema

The platform uses 7 PostgreSQL tables managed by Supabase:

| Table | Purpose |
|---|---|
| profiles | User accounts, subscription status, Stripe IDs |
| scores | Golf scores (max 5 per user, rolling) |
| charities | Charity listings with totals |
| draws | Monthly draws with drawn numbers and status |
| draw_entries | Per-user draw entry with match count and prize |
| prize_claims | Winner verification and payout tracking |
| payments | Payment history with charity/prize breakdown |

**Key database features:**
- Row Level Security on all tables
- Score rolling trigger (auto-removes oldest when 6th score inserted)
- Charity total trigger (auto-increments total_raised on payment)
- Indexes on all foreign keys and frequent filter columns

---

## Business Logic

### Prize Pool Split
Every subscription payment is split as follows:
```
Payment: GBP 9.99
  Charity (10% minimum): GBP 1.00
  Prize pool:            GBP 8.99
    5-match jackpot:     40% = GBP 3.60
    4-match pool:        35% = GBP 3.15
    3-match pool:        25% = GBP 2.25
```

### Draw Mechanics
- 5 numbers are drawn between 1 and 45
- Each user's submitted scores are compared against the drawn numbers
- Match count = number of user scores that appear in drawn numbers
- 5 matches = jackpot, 4 matches = second tier, 3 matches = third tier
- If multiple winners in same tier — prize is split equally
- If no jackpot winner — jackpot rolls over to next month

### Draw Algorithms
- **Random** — 5 cryptographically random integers via `crypto.randomInt`
- **Algorithmic (Frequent)** — weighted toward most commonly submitted scores
- **Algorithmic (Rare)** — weighted toward least commonly submitted scores

### Score Rolling
- Maximum 5 scores per user at any time
- Enforced by a PostgreSQL trigger on the scores table
- When a 6th score is inserted, the oldest by `played_date` is automatically deleted
- Scores are always displayed most recent first

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 20+
- A Supabase project
- A Stripe account (test mode)
- A Resend account

### 1. Clone the repository

```bash
git clone https://github.com/Anantjain-infinite/golf-charity-platform.git
cd golf-charity-platform
```

### 2. Set up the database

Run the SQL from the project documentation in your Supabase SQL Editor in this order:
1. Tables
2. Indexes
3. Triggers
4. Row Level Security policies

Create three storage buckets in Supabase:
- `prize-proofs` (private)
- `charity-images` (public)
- `avatars` (public)

### 3. Set up the backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
LOG_LEVEL=info

SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_from-stripe-listen
STRIPE_MONTHLY_PRICE_ID=price_your-monthly-id
STRIPE_YEARLY_PRICE_ID=price_your-yearly-id

RESEND_API_KEY=re_your-key
RESEND_FROM_EMAIL=onboarding@resend.dev

FRONTEND_URL=http://localhost:5173
APP_NAME=Golf Charity Club
ADMIN_EMAIL=admin@golfcharity.club
```

Run the seed script:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

### 4. Set up the frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
VITE_APP_NAME=Golf Charity Club
```

Start the development server:

```bash
npm run dev
```

### 5. Set up Stripe webhook forwarding (local)

```bash
stripe login
stripe listen --forward-to http://localhost:5000/api/payments/webhook
```

Copy the webhook signing secret printed and update `STRIPE_WEBHOOK_SECRET` in your `.env`.

### 6. Open the app

- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api/health

---

## API Reference

### Public Endpoints

```
GET  /api/health                    Health check
GET  /api/charities                 List charities (paginated, searchable)
GET  /api/charities/featured        Featured charity for homepage
GET  /api/charities/:slug           Charity detail
GET  /api/draws                     Published draws (paginated)
GET  /api/draws/:id                 Single draw detail
```

### Authenticated Endpoints

```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/users/me
PATCH  /api/users/me

GET    /api/scores
POST   /api/scores
PATCH  /api/scores/:id
DELETE /api/scores/:id

GET    /api/draws/my-entries

GET    /api/claims
POST   /api/claims/:id/proof

POST   /api/payments/create-checkout-session
POST   /api/payments/create-portal-session
POST   /api/payments/webhook
```

### Admin Endpoints

```
GET    /api/admin
GET    /api/admin/users
GET    /api/admin/users/:id
PATCH  /api/admin/users/:id
DELETE /api/admin/users/:id

GET    /api/admin/draws
POST   /api/admin/draws
POST   /api/admin/draws/:id/simulate
POST   /api/admin/draws/:id/publish

GET    /api/admin/charities
POST   /api/admin/charities
PATCH  /api/admin/charities/:id
DELETE /api/admin/charities/:id

GET    /api/admin/claims
PATCH  /api/admin/claims/:id

GET    /api/admin/analytics
```

---

## Email Templates

The platform sends 9 transactional emails via Resend:

| Trigger | Template |
|---|---|
| Signup | Welcome email with get started CTA |
| Subscription activated | Plan details, renewal date, charity selected |
| Payment failed | Action required with billing portal link |
| Draw published (all entries) | Drawn numbers, user scores, match result |
| Draw published (winners only) | Prize amount, proof upload instructions |
| Claim approved | Payment incoming notification |
| Claim rejected | Reason and resubmission instructions |
| Payment sent | Confirmation with amount |
| Subscription cancelled | End date and resubscribe option |

---

## Rate Limiting

| Endpoint Group | Limit |
|---|---|
| All API routes | 100 requests per 15 minutes |
| Auth endpoints | 10 requests per 15 minutes |
| File uploads | 5 uploads per minute |
| Draw simulation | 10 simulations per hour |
| Stripe webhook | 200 requests per minute |
| Speed throttle | Delay added after 50 requests in 15 minutes |

---

## Deployment

### Backend (Render)
- Runtime: Node.js
- Build command: `npm install`
- Start command: `node src/server.js`
- Root directory: `backend`

### Frontend (Vercel)
- Framework: Vite
- Root directory: `frontend`
- Includes `vercel.json` for client-side routing support

### Environment Variables
All sensitive values are stored as environment variables. Never committed to source control. See `.env.example` files in both `frontend` and `backend` directories.

---

## Evaluation Checklist

| Requirement | Status |
|---|---|
| User signup and login | Done |
| Subscription flow (monthly and yearly) | Done |
| Score entry with rolling 5-score logic | Done |
| Draw system with simulation and publish | Done |
| Charity selection and contribution calculation | Done |
| Winner verification and payout tracking | Done |
| User dashboard with all modules | Done |
| Admin panel with full control | Done |
| Data accuracy across all modules | Done |
| Responsive design on mobile and desktop | Done |
| Error handling and edge cases | Done |
| Live deployment with public URL | Done |

---

## Known Limitations

- Stripe is in test mode. No real payments are processed.
- Resend free tier only allows sending to verified email addresses. In production a custom domain would be configured.
- The backend on Render free tier sleeps after 15 minutes of inactivity. First request after sleep takes 30-60 seconds.
- Analytics charts show data only for the date range selected. Early in the platform lifecycle, charts may show minimal data.

---

## Built By

**Anant Jain**



- LinkedIn: [linkedin.com/in/your-profile](https://linkedin.com/in/anantjain2208)
- GitHub: [github.com/your-username](https://github.com/Anantjain-infinite)
- Email: [your@email.com](mailto:anantjain.works@gmail.com)