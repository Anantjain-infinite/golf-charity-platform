# GOLF CHARITY SUBSCRIPTION PLATFORM
# MASTER BUILD PROMPT — VERSION 2
# Tech Stack: React JS + Node.js/Express | Production-Ready
---

## HOW TO USE THIS DOCUMENT

Paste this entire document into your AI coding tool (Cursor, Bolt, Windsurf, etc.).
This is the single source of truth for the entire application.
Build every section completely. No TODOs, no placeholders, no mock data in production paths.

---

## ============================================================
## PART 1 — PROJECT OVERVIEW
## ============================================================

Build a production-ready, fully deployed full-stack web application: the Golf Charity Subscription Platform.

The platform combines three experiences into one product:
- Golf score tracking (Stableford format, rolling 5-score system)
- Monthly lottery-style prize draws (scored against drawn numbers)
- Charitable giving (a percentage of every subscription goes to a user-chosen charity)

The audience is recreational golfers who want to participate in a fun, monthly draw and support charity. The design must feel like a modern charity-tech product — NOT a traditional golf website. No fairway imagery, no plaid, no club iconography as the primary design language.

---

## ============================================================
## PART 2 — MANDATORY TECH STACK
## ============================================================

### Frontend
- React 18 (Vite, JavaScript — no TypeScript)
- React Router v6 (client-side routing)
- TanStack Query v5 (React Query — all server state)
- Zustand (global UI state — auth, sidebar, modals)
- Axios (HTTP client — centralised instance with interceptors)
- React Hook Form + Yup (all forms and validation)
- Framer Motion (animations and transitions)
- Tailwind CSS (utility-first styling)
- shadcn/ui (base components, customised to brand)
- React Virtual / TanStack Virtual (virtualised lists)
- React Intersection Observer (lazy loading, infinite scroll)
- React Toastify (notifications)
- Recharts (analytics charts)
- date-fns (date formatting and manipulation)

### Backend
- Node.js 20+
- Express 4 (modular router structure)
- Supabase JS Client (database + auth + storage)
- Stripe Node SDK (subscriptions, webhooks)
- Resend (transactional emails)
- express-rate-limit (rate limiting)
- express-slow-down (throttling)
- node-cache (in-memory caching)
- Winston + Morgan (logging)
- Zod (server-side input validation)
- Helmet (HTTP security headers)
- CORS (configured per environment)
- compression (gzip response compression)
- multer + sharp (file upload + image processing)
- dotenv (environment variable management)

### Database
- Supabase (PostgreSQL)
- All queries: parameterised, no string concatenation
- Row Level Security on all tables
- Indexes on all foreign keys and frequent filter columns

### Infrastructure
- Frontend: Vercel (new project)
- Backend: Railway or Render (new project)
- Database: Supabase (new project)
- Storage: Supabase Storage

---

## ============================================================
## PART 3 — FEATURE-BASED MODULAR STRUCTURE
## ============================================================

### BACKEND STRUCTURE

```
/backend
  /src
    /config
      db.js              -- Supabase client (service role)
      stripe.js          -- Stripe client singleton
      resend.js          -- Resend client singleton
      cache.js           -- node-cache singleton
      logger.js          -- Winston logger config
      rateLimit.js       -- All rate limit / throttle configs

    /middleware
      auth.js            -- JWT verification, attach req.user
      adminOnly.js       -- Role check: req.user.role === 'admin'
      validate.js        -- Zod schema validator factory
      errorHandler.js    -- Global error handler
      notFound.js        -- 404 handler
      requestLogger.js   -- Morgan HTTP request logging

    /features
      /auth
        auth.routes.js
        auth.controller.js
        auth.service.js
        auth.validation.js

      /users
        users.routes.js
        users.controller.js
        users.service.js
        users.validation.js

      /scores
        scores.routes.js
        scores.controller.js
        scores.service.js
        scores.validation.js

      /charities
        charities.routes.js
        charities.controller.js
        charities.service.js
        charities.validation.js

      /draws
        draws.routes.js
        draws.controller.js
        draws.service.js
        draws.validation.js
        drawEngine.js        -- Core draw algorithm (random + weighted)
        prizeCalculator.js   -- Pool split + winner prize logic

      /claims
        claims.routes.js
        claims.controller.js
        claims.service.js
        claims.validation.js

      /payments
        payments.routes.js
        payments.controller.js
        payments.service.js
        stripe.webhook.js    -- Stripe webhook handler (signature verified)

      /admin
        admin.routes.js      -- Aggregates all admin sub-routes
        admin.analytics.controller.js
        admin.analytics.service.js

      /emails
        email.service.js     -- All Resend calls
        /templates
          welcome.js
          subscriptionConfirmed.js
          paymentFailed.js
          drawResults.js
          youWon.js
          claimApproved.js
          claimRejected.js
          paymentSent.js
          cancellationConfirmed.js

    /utils
      asyncHandler.js      -- Express async wrapper (eliminates try/catch boilerplate)
      ApiError.js          -- Custom error class with statusCode + isOperational
      pagination.js        -- Standard cursor/offset pagination helper
      fileUpload.js        -- multer config + sharp resize pipeline
      supabaseHelpers.js   -- Reusable Supabase query builders

    app.js                 -- Express app setup (middleware registration)
    server.js              -- HTTP server start + process error handling
    routes.js              -- Central route registry

  .env
  .env.example
  package.json
```

### FRONTEND STRUCTURE

```
/frontend
  /src
    /features
      /auth
        /components
          LoginForm.jsx
          SignupForm.jsx
          ForgotPasswordForm.jsx
        /hooks
          useAuth.js         -- Login, logout, signup mutations
        /pages
          LoginPage.jsx
          SignupPage.jsx
        authService.js       -- Axios calls for auth endpoints

      /dashboard
        /components
          OverviewTab.jsx
          ScoresTab.jsx
          CharityTab.jsx
          DrawHistoryTab.jsx
          WinningsTab.jsx
          SubscriptionCard.jsx
          StatsCard.jsx
          DrawCountdown.jsx
        /hooks
          useDashboard.js
        /pages
          DashboardPage.jsx
        dashboardService.js

      /scores
        /components
          ScoreEntryForm.jsx
          ScoreList.jsx
          ScoreItem.jsx
          ScoreVisualiser.jsx
        /hooks
          useScores.js       -- useQuery + useMutation wrappers
        scoresService.js

      /charities
        /components
          CharityCard.jsx
          CharityGrid.jsx
          CharitySearchBar.jsx
          CharityProfile.jsx
          CharitySpotlight.jsx
          ContributionSlider.jsx
        /hooks
          useCharities.js
          useCharityDetail.js
        /pages
          CharitiesPage.jsx
          CharityDetailPage.jsx
        charitiesService.js

      /draws
        /components
          DrawCard.jsx
          DrawHistoryList.jsx
          DrawnNumbersReveal.jsx
          MatchBadge.jsx
          PrizePoolDisplay.jsx
        /hooks
          useDraws.js
          useDrawHistory.js
        /pages
          HowItWorksPage.jsx
        drawsService.js

      /claims
        /components
          ClaimUploadForm.jsx
          ClaimStatusBadge.jsx
          WinningsOverview.jsx
        /hooks
          useClaims.js
        claimsService.js

      /subscribe
        /components
          PlanSelector.jsx
          CharityPreSelector.jsx
          PricingCard.jsx
        /hooks
          useSubscription.js
        /pages
          SubscribePage.jsx
        subscribeService.js

      /admin
        /components
          UserTable.jsx
          UserDetailModal.jsx
          DrawConfigPanel.jsx
          SimulationResults.jsx
          ClaimsTable.jsx
          CharityForm.jsx
          AnalyticsCharts.jsx
          KPICard.jsx
        /hooks
          useAdminUsers.js
          useAdminDraws.js
          useAdminClaims.js
          useAdminCharities.js
          useAdminAnalytics.js
        /pages
          AdminOverviewPage.jsx
          AdminUsersPage.jsx
          AdminDrawsPage.jsx
          AdminCharitiesPage.jsx
          AdminWinnersPage.jsx
          AdminAnalyticsPage.jsx
        adminService.js

      /home
        /components
          HeroSection.jsx
          StatsTicker.jsx
          HowItWorksSection.jsx
          FeaturedCharity.jsx
          PricingSection.jsx
          TestimonialsSection.jsx
          FooterSection.jsx
        /pages
          HomePage.jsx

      /settings
        /components
          ProfileForm.jsx
          PasswordForm.jsx
          DangerZone.jsx
        /pages
          SettingsPage.jsx
        settingsService.js

    /components
      /ui                    -- shadcn base components (Button, Input, etc.)
      /layout
        AppShell.jsx         -- Authenticated layout (sidebar + topbar)
        AdminShell.jsx       -- Admin layout
        PublicLayout.jsx     -- Public pages layout
        Sidebar.jsx
        MobileSidebar.jsx
        Topbar.jsx
      /shared
        PageLoader.jsx
        ErrorBoundary.jsx
        EmptyState.jsx
        ConfirmModal.jsx
        ImageUpload.jsx
        StatusBadge.jsx
        VirtualList.jsx      -- TanStack Virtual wrapper component
        InfiniteScrollTrigger.jsx

    /hooks
      useIntersectionObserver.js
      useDebounce.js
      useLocalStorage.js
      usePagination.js

    /lib
      axios.js               -- Axios instance (baseURL, interceptors, auth header)
      queryClient.js         -- TanStack Query client config (staleTime, gcTime)
      supabaseClient.js      -- Supabase browser client (auth only)

    /store
      authStore.js           -- Zustand: user, token, isAuthenticated
      uiStore.js             -- Zustand: sidebar open, active modal, theme

    /utils
      formatters.js          -- Currency, date, number formatting
      validators.js          -- Shared Yup schemas
      constants.js           -- Score range, plan prices, pool percentages

    /router
      index.jsx              -- React Router route definitions
      ProtectedRoute.jsx     -- Auth guard component
      AdminRoute.jsx         -- Admin role guard component

    main.jsx
    App.jsx

  index.html
  vite.config.js
  tailwind.config.js
  .env
  .env.example
  package.json
```

---

## ============================================================
## PART 4 — DATABASE SCHEMA (Supabase / PostgreSQL)
## ============================================================

Execute the following SQL in Supabase SQL Editor in order:

### Step 1: Tables

```sql
-- Profiles (extends auth.users)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  email text not null unique,
  avatar_url text,
  handicap numeric(4,1),
  subscription_status text not null default 'inactive'
    check (subscription_status in ('active','inactive','cancelled','lapsed')),
  subscription_plan text check (subscription_plan in ('monthly','yearly')),
  subscription_renewal_date timestamptz,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  charity_id uuid,
  charity_contribution_percent integer not null default 10
    check (charity_contribution_percent between 10 and 100),
  role text not null default 'subscriber' check (role in ('subscriber','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Charities
create table charities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  cover_image_url text,
  website_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  upcoming_events jsonb not null default '[]',
  total_raised numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

-- Add foreign key after charities exists
alter table profiles
  add constraint profiles_charity_id_fkey
  foreign key (charity_id) references charities(id) on delete set null;

-- Scores
create table scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  score integer not null check (score between 1 and 45),
  played_date date not null,
  created_at timestamptz not null default now()
);

-- Draws
create table draws (
  id uuid default gen_random_uuid() primary key,
  draw_month text not null unique,        -- format: '2026-03'
  drawn_numbers integer[] not null,       -- 5 integers between 1 and 45
  draw_type text not null check (draw_type in ('random','algorithmic')),
  algorithm_mode text check (algorithm_mode in ('frequent','rare')),
  status text not null default 'draft'
    check (status in ('draft','simulated','published')),
  jackpot_amount numeric(12,2) not null default 0,
  pool_4match numeric(12,2) not null default 0,
  pool_3match numeric(12,2) not null default 0,
  total_entries integer not null default 0,
  jackpot_rolled_over boolean not null default false,
  rollover_from_draw_id uuid references draws(id),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- Draw Entries
create table draw_entries (
  id uuid default gen_random_uuid() primary key,
  draw_id uuid not null references draws(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  submitted_scores integer[] not null,
  match_count integer not null default 0 check (match_count between 0 and 5),
  is_winner boolean not null default false,
  prize_amount numeric(12,2),
  created_at timestamptz not null default now(),
  unique (draw_id, user_id)
);

-- Prize Claims
create table prize_claims (
  id uuid default gen_random_uuid() primary key,
  draw_entry_id uuid not null references draw_entries(id) on delete cascade unique,
  user_id uuid not null references profiles(id) on delete cascade,
  proof_url text,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','paid')),
  admin_note text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  paid_at timestamptz
);

-- Payments
create table payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  stripe_payment_intent_id text unique,
  stripe_invoice_id text unique,
  amount numeric(10,2) not null,
  currency text not null default 'gbp',
  status text not null check (status in ('succeeded','failed','refunded')),
  subscription_period_start timestamptz,
  subscription_period_end timestamptz,
  charity_contribution_amount numeric(10,2) not null default 0,
  prize_pool_contribution_amount numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);
```

### Step 2: Indexes

```sql
-- Scores: most queries filter by user_id + order by played_date
create index idx_scores_user_id on scores(user_id);
create index idx_scores_user_played on scores(user_id, played_date desc);

-- Draw entries: filter by draw_id and user_id
create index idx_draw_entries_draw_id on draw_entries(draw_id);
create index idx_draw_entries_user_id on draw_entries(user_id);
create index idx_draw_entries_is_winner on draw_entries(is_winner) where is_winner = true;

-- Prize claims: filter by status for admin
create index idx_prize_claims_status on prize_claims(status);
create index idx_prize_claims_user_id on prize_claims(user_id);

-- Payments: filter by user_id and status
create index idx_payments_user_id on payments(user_id);
create index idx_payments_status on payments(status);

-- Profiles: subscription queries
create index idx_profiles_subscription_status on profiles(subscription_status);
create index idx_profiles_stripe_customer on profiles(stripe_customer_id);

-- Charities: listing queries
create index idx_charities_is_active on charities(is_active) where is_active = true;
create index idx_charities_is_featured on charities(is_featured) where is_featured = true;
```

### Step 3: Triggers

```sql
-- Auto-updated_at on profiles
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- Rolling 5-score limit: after inserting a score, delete oldest if count > 5
create or replace function enforce_score_limit()
returns trigger language plpgsql as $$
declare
  score_count integer;
  oldest_id uuid;
begin
  select count(*) into score_count
    from scores where user_id = new.user_id;

  if score_count > 5 then
    select id into oldest_id
      from scores
      where user_id = new.user_id
      order by played_date asc, created_at asc
      limit 1;

    delete from scores where id = oldest_id;
  end if;

  return null;
end;
$$;

create trigger scores_rolling_limit
  after insert on scores
  for each row execute function enforce_score_limit();

-- Increment charity total_raised after payment succeeds
create or replace function increment_charity_total()
returns trigger language plpgsql as $$
begin
  if new.status = 'succeeded' and new.charity_contribution_amount > 0 then
    update charities
      set total_raised = total_raised + new.charity_contribution_amount
      from profiles
      where profiles.id = new.user_id
        and charities.id = profiles.charity_id;
  end if;
  return null;
end;
$$;

create trigger payments_charity_total
  after insert on payments
  for each row execute function increment_charity_total();
```

### Step 4: Row Level Security

```sql
-- Enable RLS on all tables
alter table profiles enable row level security;
alter table scores enable row level security;
alter table charities enable row level security;
alter table draws enable row level security;
alter table draw_entries enable row level security;
alter table prize_claims enable row level security;
alter table payments enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Profiles
create policy "users read own profile" on profiles
  for select using (auth.uid() = id or is_admin());
create policy "users update own profile" on profiles
  for update using (auth.uid() = id);
create policy "admins full access profiles" on profiles
  for all using (is_admin());

-- Scores
create policy "users manage own scores" on scores
  for all using (auth.uid() = user_id or is_admin());

-- Charities (public read)
create policy "public read charities" on charities
  for select using (is_active = true or is_admin());
create policy "admins manage charities" on charities
  for all using (is_admin());

-- Draws (public read for published)
create policy "public read published draws" on draws
  for select using (status = 'published' or is_admin());
create policy "admins manage draws" on draws
  for all using (is_admin());

-- Draw Entries
create policy "users read own entries" on draw_entries
  for select using (auth.uid() = user_id or is_admin());
create policy "admins manage entries" on draw_entries
  for all using (is_admin());

-- Prize Claims
create policy "users manage own claims" on prize_claims
  for all using (auth.uid() = user_id or is_admin());

-- Payments
create policy "users read own payments" on payments
  for select using (auth.uid() = user_id or is_admin());
create policy "admins manage payments" on payments
  for all using (is_admin());
```

---

## ============================================================
## PART 5 — BACKEND IMPLEMENTATION
## ============================================================

### 5.1 Core Utilities

#### src/utils/ApiError.js
```javascript
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
```

#### src/utils/asyncHandler.js
```javascript
// Wraps async route handlers — eliminates repetitive try/catch blocks
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
```

#### src/utils/pagination.js
```javascript
// Returns a standardised pagination object for all list endpoints
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

const paginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});

module.exports = { getPagination, paginationMeta };
```

### 5.2 Logger Configuration

#### src/config/logger.js
```javascript
const winston = require('winston');
const path = require('path');

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: { service: 'golf-charity-api' },
  transports: [
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,  // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(colorize(), simple()),
  }));
}

module.exports = logger;
```

### 5.3 Rate Limiting and Throttling

#### src/config/rateLimit.js
```javascript
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// Standard API rate limit: 100 requests per 15 minutes
const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

// Auth endpoints: stricter — 10 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please wait before trying again.' },
});

// Stripe webhook: no rate limit (Stripe retries)
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 200,
});

// File upload: 5 uploads per minute per user
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Upload limit reached. Please wait before uploading again.' },
});

// Admin draw simulation: 10 per hour (expensive operation)
const drawLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Draw simulation limit reached for this hour.' },
});

// Slow down: begin delaying after 50 requests, +100ms per request
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: (hits) => hits * 100,
});

module.exports = {
  standardLimiter,
  authLimiter,
  webhookLimiter,
  uploadLimiter,
  drawLimiter,
  speedLimiter,
};
```

### 5.4 Cache Configuration

#### src/config/cache.js
```javascript
const NodeCache = require('node-cache');

// TTL values in seconds
const TTL = {
  CHARITIES_LIST: 60 * 5,      // 5 minutes — changes infrequently
  CHARITY_DETAIL: 60 * 10,     // 10 minutes
  DRAW_PUBLISHED: 60 * 60,     // 1 hour — published draws never change
  ANALYTICS: 60 * 5,           // 5 minutes — acceptable staleness for dashboards
  PRIZE_POOL_PREVIEW: 60 * 2,  // 2 minutes
};

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

// Cache key generators (consistent, collision-free)
const keys = {
  charitiesList: () => 'charities:list:active',
  charityBySlug: (slug) => `charity:slug:${slug}`,
  publishedDraws: (page) => `draws:published:page:${page}`,
  drawById: (id) => `draw:${id}`,
  prizePoolPreview: () => 'prize-pool:preview',
  analytics: (range) => `analytics:${range}`,
};

module.exports = { cache, TTL, keys };
```

### 5.5 Middleware

#### src/middleware/auth.js
```javascript
const { supabaseAdmin } = require('../config/db');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required');
  }

  const token = authHeader.split(' ')[1];

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    throw new ApiError(401, 'Invalid or expired token');
  }

  // Fetch profile to get role and subscription status
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, role, subscription_status, subscription_plan, charity_id, full_name, email')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new ApiError(401, 'User profile not found');
  }

  req.user = { ...user, ...profile };
  next();
});

module.exports = { authenticate };
```

#### src/middleware/adminOnly.js
```javascript
const ApiError = require('../utils/ApiError');

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Admin access required');
  }
  next();
};

module.exports = { adminOnly };
```

#### src/middleware/validate.js
```javascript
const ApiError = require('../utils/ApiError');

// Factory: returns middleware that validates req.body against a Zod schema
const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join('; ');
    throw new ApiError(422, message);
  }
  req[source] = result.data;  // Replace with parsed/coerced data
  next();
};

module.exports = { validate };
```

#### src/middleware/errorHandler.js
```javascript
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert non-ApiError to ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  // Log all 5xx errors; log 4xx at warn level
  if (error.statusCode >= 500) {
    logger.error({
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
      path: req.path,
      method: req.method,
      userId: req.user?.id,
    });
  } else {
    logger.warn({
      message: error.message,
      statusCode: error.statusCode,
      path: req.path,
      method: req.method,
    });
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

module.exports = { errorHandler };
```

### 5.6 Draw Engine

#### src/features/draws/drawEngine.js
```javascript
const { supabaseAdmin } = require('../../config/db');
const logger = require('../../config/logger');

// Generate 5 unique random integers between 1 and 45 (inclusive)
const generateRandomNumbers = () => {
  const numbers = new Set();
  while (numbers.size < 5) {
    // crypto.randomInt is cryptographically secure
    numbers.add(require('crypto').randomInt(1, 46));
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

// Weighted random selection: returns 5 unique numbers biased by weight map
const weightedRandom = (weightMap, mode) => {
  const entries = Object.entries(weightMap);  // [[number, frequency], ...]

  // Sort: 'frequent' = high weight first, 'rare' = low weight first
  entries.sort((a, b) => mode === 'frequent' ? b[1] - a[1] : a[1] - b[1]);

  // Build cumulative weight array (higher rank = higher selection probability)
  const weighted = [];
  entries.forEach(([num, _freq], index) => {
    const weight = entries.length - index;  // rank-based weight
    for (let i = 0; i < weight; i++) {
      weighted.push(parseInt(num));
    }
  });

  // Fisher-Yates shuffle on weighted array
  for (let i = weighted.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [weighted[i], weighted[j]] = [weighted[j], weighted[i]];
  }

  // Pick first 5 unique numbers from shuffled weighted array
  const result = new Set();
  for (const num of weighted) {
    if (result.size === 5) break;
    result.add(num);
  }

  // Fallback: fill remaining with random if weighted pool was too small
  while (result.size < 5) {
    result.add(require('crypto').randomInt(1, 46));
  }

  return Array.from(result).sort((a, b) => a - b);
};

// Build frequency map of all scores across active users for the draw period
const buildFrequencyMap = async (drawMonth) => {
  // Get start/end of the draw month
  const [year, month] = drawMonth.split('-').map(Number);
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  const { data: scores, error } = await supabaseAdmin
    .from('scores')
    .select('score, user_id, profiles!inner(subscription_status)')
    .eq('profiles.subscription_status', 'active')
    .gte('played_date', startDate)
    .lte('played_date', endDate);

  if (error) {
    logger.error({ message: 'Failed to build frequency map', error });
    throw error;
  }

  // Count frequency of each score value (1–45)
  const frequencyMap = {};
  for (let i = 1; i <= 45; i++) frequencyMap[i] = 0;
  scores.forEach(({ score }) => { frequencyMap[score]++; });

  return frequencyMap;
};

// Calculate how many of the user's scores match the drawn numbers
const calculateMatchCount = (userScores, drawnNumbers) => {
  const drawnSet = new Set(drawnNumbers);
  return userScores.filter((s) => drawnSet.has(s)).length;
};

// Main draw execution function
const executeDraw = async (drawConfig) => {
  const { drawType, algorithmMode, drawMonth } = drawConfig;

  let drawnNumbers;

  if (drawType === 'random') {
    drawnNumbers = generateRandomNumbers();
    logger.info({ message: 'Random draw executed', drawnNumbers, drawMonth });
  } else {
    const frequencyMap = await buildFrequencyMap(drawMonth);
    drawnNumbers = weightedRandom(frequencyMap, algorithmMode);
    logger.info({ message: 'Algorithmic draw executed', drawnNumbers, drawMonth, algorithmMode });
  }

  return drawnNumbers;
};

module.exports = { executeDraw, calculateMatchCount, generateRandomNumbers };
```

#### src/features/draws/prizeCalculator.js
```javascript
// Prize pool constants (percentage of prize pool after charity deduction)
const POOL_SPLITS = {
  jackpot: 0.40,     // 5-match
  fourMatch: 0.35,   // 4-match
  threeMatch: 0.25,  // 3-match
};

const CHARITY_PERCENT = 0.10;  // Minimum — actual percent per user may be higher

// Calculate prize pool amounts from total subscription revenue this period
const calculatePrizePools = (totalRevenue, jackpotRollover = 0) => {
  const charityAmount = totalRevenue * CHARITY_PERCENT;
  const prizePoolTotal = totalRevenue - charityAmount;

  return {
    jackpot: (prizePoolTotal * POOL_SPLITS.jackpot) + jackpotRollover,
    fourMatch: prizePoolTotal * POOL_SPLITS.fourMatch,
    threeMatch: prizePoolTotal * POOL_SPLITS.threeMatch,
    charityTotal: charityAmount,
  };
};

// Calculate per-winner prize amount when pool is split equally
const splitPrize = (poolAmount, winnerCount) => {
  if (winnerCount === 0) return 0;
  return parseFloat((poolAmount / winnerCount).toFixed(2));
};

// Per-payment breakdown — stored on each payment record
const calculatePaymentBreakdown = (amount, userContributionPercent) => {
  const charityAmount = parseFloat((amount * (userContributionPercent / 100)).toFixed(2));
  const prizePoolAmount = parseFloat((amount - charityAmount).toFixed(2));
  return { charityAmount, prizePoolAmount };
};

module.exports = { calculatePrizePools, splitPrize, calculatePaymentBreakdown, POOL_SPLITS };
```

### 5.7 Feature: Scores Service

#### src/features/scores/scores.service.js
```javascript
const { supabaseAdmin } = require('../../config/db');
const ApiError = require('../../utils/ApiError');
const logger = require('../../config/logger');

// Fetch user's current 5 scores, most recent first
const getUserScores = async (userId) => {
  const { data, error } = await supabaseAdmin
    .from('scores')
    .select('id, score, played_date, created_at')
    .eq('user_id', userId)
    .order('played_date', { ascending: false })
    .limit(5);

  if (error) {
    logger.error({ message: 'Failed to fetch scores', userId, error });
    throw new ApiError(500, 'Failed to retrieve scores');
  }

  return data;
};

// Insert new score — the DB trigger enforces the rolling 5-score limit
const addScore = async (userId, scoreValue, playedDate) => {
  const { data, error } = await supabaseAdmin
    .from('scores')
    .insert({ user_id: userId, score: scoreValue, played_date: playedDate })
    .select('id, score, played_date, created_at')
    .single();

  if (error) {
    logger.error({ message: 'Failed to add score', userId, error });
    throw new ApiError(500, 'Failed to save score');
  }

  logger.info({ message: 'Score added', userId, score: scoreValue });
  return data;
};

// Update an existing score — verify ownership before update
const updateScore = async (scoreId, userId, updates) => {
  // Ownership check: only update if the score belongs to this user
  const { data, error } = await supabaseAdmin
    .from('scores')
    .update({ score: updates.score, played_date: updates.played_date })
    .eq('id', scoreId)
    .eq('user_id', userId)  // This condition enforces ownership
    .select('id, score, played_date')
    .single();

  if (error || !data) {
    throw new ApiError(404, 'Score not found or access denied');
  }

  return data;
};

// Delete a score — verify ownership
const deleteScore = async (scoreId, userId) => {
  const { error } = await supabaseAdmin
    .from('scores')
    .delete()
    .eq('id', scoreId)
    .eq('user_id', userId);

  if (error) {
    throw new ApiError(404, 'Score not found or access denied');
  }
};

module.exports = { getUserScores, addScore, updateScore, deleteScore };
```

### 5.8 app.js Setup

#### src/app.js
```javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const logger = require('./config/logger');
const { standardLimiter, speedLimiter } = require('./config/rateLimit');
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');
const routes = require('./routes');

const app = express();

// Security headers
app.use(helmet());

// CORS: allow only known frontend origins
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Stripe webhook needs raw body — register BEFORE express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Gzip compression
app.use(compression());

// HTTP request logging via Morgan → Winston
app.use(morgan('combined', {
  stream: { write: (message) => logger.http(message.trim()) },
}));

// Global rate limiting and throttling on all API routes
app.use('/api', standardLimiter);
app.use('/api', speedLimiter);

// API routes
app.use('/api', routes);

// 404 and global error handler — must be last
app.use(notFound);
app.use(errorHandler);

module.exports = app;
```

#### src/routes.js
```javascript
const router = require('express').Router();

const authRoutes = require('./features/auth/auth.routes');
const userRoutes = require('./features/users/users.routes');
const scoresRoutes = require('./features/scores/scores.routes');
const charitiesRoutes = require('./features/charities/charities.routes');
const drawsRoutes = require('./features/draws/draws.routes');
const claimsRoutes = require('./features/claims/claims.routes');
const paymentsRoutes = require('./features/payments/payments.routes');
const adminRoutes = require('./features/admin/admin.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/scores', scoresRoutes);
router.use('/charities', charitiesRoutes);
router.use('/draws', drawsRoutes);
router.use('/claims', claimsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
```

---

## ============================================================
## PART 6 — FRONTEND IMPLEMENTATION
## ============================================================

### 6.1 Axios Instance with Interceptors

#### src/lib/axios.js
```javascript
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach auth token from Zustand store
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 globally, surface errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    if (error.response?.status === 429) {
      toast.error('Too many requests. Please slow down.');
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 6.2 TanStack Query Client

#### src/lib/queryClient.js
```javascript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,          // Data considered fresh for 2 minutes
      gcTime: 1000 * 60 * 10,            // Garbage collect after 10 minutes
      retry: (failureCount, error) => {
        // Do not retry on 4xx client errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});
```

### 6.3 Zustand Auth Store

#### src/store/authStore.js
```javascript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'golf-charity-auth',
      storage: createJSONStorage(() => localStorage),
      // Only persist token and basic user info — not sensitive data
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
```

### 6.4 Scores Feature — Complete Example with React Query + Virtualisation

#### src/features/scores/hooks/useScores.js
```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scoresService } from '../scoresService';
import toast from 'react-toastify';

const SCORES_KEY = ['scores'];

export const useScores = () => {
  return useQuery({
    queryKey: SCORES_KEY,
    queryFn: scoresService.getScores,
    // Scores are small — can afford short stale time for accuracy
    staleTime: 1000 * 30,
  });
};

export const useAddScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: scoresService.addScore,
    // Optimistic update: add score immediately, rollback on error
    onMutate: async (newScore) => {
      await queryClient.cancelQueries({ queryKey: SCORES_KEY });
      const previous = queryClient.getQueryData(SCORES_KEY);

      queryClient.setQueryData(SCORES_KEY, (old) => {
        const updated = [{ id: 'temp', ...newScore }, ...(old || [])];
        return updated.slice(0, 5);  // Reflect rolling limit optimistically
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(SCORES_KEY, context.previous);
      toast.error('Failed to save score. Please try again.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCORES_KEY });
      toast.success('Score saved successfully.');
    },
  });
};

export const useDeleteScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: scoresService.deleteScore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCORES_KEY });
      toast.success('Score removed.');
    },
    onError: () => {
      toast.error('Failed to remove score.');
    },
  });
};
```

### 6.5 Virtualised List for Admin Users Table

#### src/components/shared/VirtualList.jsx
```javascript
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

// Generic virtualised list — use for any large dataset (admin user tables, draw history, etc.)
const VirtualList = ({ items, itemHeight = 60, renderItem, className = '' }) => {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan: 5,  // Render 5 items beyond visible area for smoother scroll
  });

  return (
    <div ref={parentRef} className={`overflow-auto ${className}`}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualList;
```

### 6.6 Infinite Scroll with Intersection Observer

#### src/components/shared/InfiniteScrollTrigger.jsx
```javascript
import { useEffect, useRef } from 'react';

// Place this component at the bottom of a list to trigger loading more
const InfiniteScrollTrigger = ({ onIntersect, hasNextPage, isFetchingNextPage }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onIntersect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onIntersect]);

  return (
    <div ref={ref} className="py-4 text-center text-sm text-muted">
      {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Scroll for more' : ''}
    </div>
  );
};

export default InfiniteScrollTrigger;
```

### 6.7 Charities Page — with Lazy Loading, Search Debounce, Infinite Scroll

#### src/features/charities/hooks/useCharities.js
```javascript
import { useInfiniteQuery } from '@tanstack/react-query';
import { charitiesService } from '../charitiesService';

export const useCharities = (searchTerm = '') => {
  return useInfiniteQuery({
    queryKey: ['charities', searchTerm],
    queryFn: ({ pageParam = 1 }) =>
      charitiesService.getCharities({ page: pageParam, limit: 12, search: searchTerm }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,  // 5 minutes — charity data is stable
  });
};
```

#### src/hooks/useDebounce.js
```javascript
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
```

### 6.8 Lazy Loading Pages (Route-Level Code Splitting)

#### src/router/index.jsx
```javascript
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PageLoader from '../components/shared/PageLoader';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import PublicLayout from '../components/layout/PublicLayout';
import AppShell from '../components/layout/AppShell';
import AdminShell from '../components/layout/AdminShell';

// All pages are lazy-loaded — only downloaded when the route is visited
const HomePage = lazy(() => import('../features/home/pages/HomePage'));
const CharitiesPage = lazy(() => import('../features/charities/pages/CharitiesPage'));
const CharityDetailPage = lazy(() => import('../features/charities/pages/CharityDetailPage'));
const HowItWorksPage = lazy(() => import('../features/draws/pages/HowItWorksPage'));
const SubscribePage = lazy(() => import('../features/subscribe/pages/SubscribePage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('../features/auth/pages/SignupPage'));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const SettingsPage = lazy(() => import('../features/settings/pages/SettingsPage'));
const AdminOverviewPage = lazy(() => import('../features/admin/pages/AdminOverviewPage'));
const AdminUsersPage = lazy(() => import('../features/admin/pages/AdminUsersPage'));
const AdminDrawsPage = lazy(() => import('../features/admin/pages/AdminDrawsPage'));
const AdminCharitiesPage = lazy(() => import('../features/admin/pages/AdminCharitiesPage'));
const AdminWinnersPage = lazy(() => import('../features/admin/pages/AdminWinnersPage'));
const AdminAnalyticsPage = lazy(() => import('../features/admin/pages/AdminAnalyticsPage'));

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/charities', element: <CharitiesPage /> },
      { path: '/charities/:slug', element: <CharityDetailPage /> },
      { path: '/how-it-works', element: <HowItWorksPage /> },
      { path: '/subscribe', element: <SubscribePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
    ],
  },
  {
    element: <ProtectedRoute><AppShell /></ProtectedRoute>,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
  {
    element: <AdminRoute><AdminShell /></AdminRoute>,
    children: [
      { path: '/admin', element: <AdminOverviewPage /> },
      { path: '/admin/users', element: <AdminUsersPage /> },
      { path: '/admin/draws', element: <AdminDrawsPage /> },
      { path: '/admin/charities', element: <AdminCharitiesPage /> },
      { path: '/admin/winners', element: <AdminWinnersPage /> },
      { path: '/admin/analytics', element: <AdminAnalyticsPage /> },
    ],
  },
]);

const AppRouter = () => (
  <Suspense fallback={<PageLoader />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default AppRouter;
```

### 6.9 Error Boundary

#### src/components/shared/ErrorBoundary.jsx
```javascript
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production: send to error reporting service (Sentry, etc.)
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-lg font-medium text-text-primary">Something went wrong</p>
          <p className="text-sm text-text-muted">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn-primary"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

## ============================================================
## PART 7 — DESIGN SYSTEM
## ============================================================

### 7.1 Color Variables (tailwind.config.js)

```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        surface: '#13131A',
        elevated: '#1C1C28',
        border: '#2A2A3D',
        primary: '#6EE7B7',
        'primary-dark': '#34D399',
        accent: '#F59E0B',
        'accent-soft': '#FCD34D',
        'text-primary': '#F9FAFB',
        'text-secondary': '#9CA3AF',
        'text-muted': '#6B7280',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        button: '10px',
      },
    },
  },
  plugins: [],
};
```

### 7.2 Design Rules — Apply Throughout

- Background: always `bg` (#0A0A0F)
- Cards: `surface` background, 1px `border` border, `card` border-radius
- Card hover: `box-shadow: 0 0 0 1px #6EE7B7` (primary glow, not drop shadow)
- All text content: `body` font. Headlines/display: `display` font. Numbers/data: `mono` font
- Buttons: `rounded-button`, `transition-all duration-200`, `scale-95 active:scale-95`
- No golf imagery as the primary design language
- Status badges: small pills using Tailwind utilities (green/amber/red/gray)
- Spacing unit: 4px base, use multiples (4, 8, 12, 16, 24, 32, 48, 64)
- Max content width: 1200px, centered
- Mobile breakpoint: 375px minimum
- All animations via Framer Motion — not CSS where motion is complex

### 7.3 Homepage Layout

Hero section (100vh):
- Large asymmetric display headline, left-aligned
- Subheadline (body font, text-secondary)
- Single primary CTA: "Join and Start Winning"
- Background: animated CSS gradient mesh (mint + dark), no images
- No golf images in hero

Stats bar below hero:
- 3 columns: Total Members / Total Charity Raised / Current Jackpot
- Numbers animate count-up on viewport entrance (Framer Motion + useMotionValue)
- JetBrains Mono font for numbers

How It Works (3 cards in a row):
- Card 1: Subscribe
- Card 2: Enter Your Scores
- Card 3: Win and Give
- Numbered indicators (01, 02, 03) in display font
- Connecting horizontal rule between cards on desktop

Featured Charity section:
- Full-width dark section
- Charity cover image right, text + total raised + CTA left
- Data pulled from Supabase (first featured charity)

Pricing (2 cards):
- Monthly and Yearly side by side
- Yearly card: primary glow border + "Best Value" label
- Feature list per plan

Footer:
- 3 columns: brand/mission, navigation, legal
- Dark, minimal

---

## ============================================================
## PART 8 — ALL PAGES AND FEATURES (COMPLETE SPECIFICATION)
## ============================================================

### PUBLIC PAGES

#### Homepage ( / )
- Fetch featured charity via useQuery (staleTime 5 min)
- Fetch platform stats (total members, charity raised, jackpot) via useQuery
- Animate stats count-up on scroll intersection

#### Charities ( /charities )
- useInfiniteQuery with 12 per page
- Search input: debounced 400ms before triggering refetch
- Infinite scroll via IntersectionObserver trigger component
- Charity cards: logo, name, description snippet, total raised badge

#### Charity Detail ( /charities/:slug )
- useQuery by slug, staleTime 10 minutes
- Display all charity fields
- Upcoming events list (from JSONB field)
- CTA links to /subscribe with charity pre-selected via URL param

#### How It Works ( /how-it-works )
- Static content with animated diagram of draw mechanics
- Prize pool table
- FAQ accordion (React state, no library needed)

#### Subscribe ( /subscribe )
- Plan toggle (monthly/yearly)
- Charity pre-selector (dropdown, pre-filled from URL param if present)
- On submit: call backend to create Stripe Checkout Session → redirect to Stripe

### AUTHENTICATED PAGES

#### Dashboard ( /dashboard )
Tabs: Overview | Scores | Charity | Draw History | Winnings

Overview tab:
- Subscription status card: plan, renewal date, status badge
- 3 stat cards: Draws Entered, Total Won, Charity Contributed
- Countdown timer to next draw (calculated from first day of next month)

Scores tab:
- Form: score (number input 1–45) + date picker
- On submit: useAddScore mutation with optimistic update
- Score list: max 5 items, most recent first, each editable/deletable
- Bar visualisation of 5 scores using Recharts (simple BarChart)
- Warning banner if count < 5

Charity tab:
- Current charity card (logo, name, total raised)
- Contribution % slider (10–100), updates on blur
- One-time donation button (Stripe PaymentIntent flow)
- Change charity button (confirmation modal → dropdown → confirm)

Draw History tab:
- useInfiniteQuery for user's draw entries, paginated
- Each row: draw month, match count badge, prize amount, status
- Expanded row: shows their submitted scores and drawn numbers side by side

Winnings tab:
- Total won amount (prominent, display font)
- Table of prize claims with status
- Upload proof button: file input (image only, 5MB max) → base64 → POST to backend
- Status timeline per claim: Pending → Approved → Paid

#### Settings ( /settings )
- Profile form: name, avatar upload
- Password form: current + new + confirm
- Cancel subscription: modal with consequences listed
- Delete account: modal with typed confirmation ("DELETE" to confirm)

### ADMIN PAGES (all behind AdminRoute guard)

#### Admin Overview ( /admin )
- 4 KPI cards: Total Users / Active Subscribers / Total Prize Pool / Total Charity Raised
- Recent signups table (last 10)
- Outstanding claims count with link to winners page

#### Admin Users ( /admin/users )
- Paginated table with VirtualList component for performance
- Columns: name, email, plan, status, scores count, joined date, actions
- Search by name or email (debounced)
- Filter by subscription status
- Row click: opens UserDetailModal
  - Modal: view/edit profile fields
  - View/edit their scores
  - View draw entry history
  - Subscription management (cancel, change plan)
  - Toggle admin role

#### Admin Draws ( /admin/draws )
- List of all draws (past and draft)
- Create New Draw button:
  - Select month (month picker)
  - Draw type: Random or Algorithmic
  - If algorithmic: weight mode (Frequent / Rare)
  - Prize pool preview: calculated from active subscriber count
- Simulate button: runs draw, shows results without publishing
  - Simulation results panel: drawn numbers, winner list per tier, prize amounts
  - No data is saved during simulation
- Publish button (only after simulation): confirms, saves to DB, sends winner emails
- Jackpot rollover toggle (shown when no 5-match winner in simulation)
- Past draws list: drawn numbers, winners per tier, status badges

#### Admin Charities ( /admin/charities )
- Table: name, slug, featured, active, total raised, actions
- Add/Edit charity: modal with all fields + image upload via Supabase Storage
- Toggle featured and active status
- Delete charity (soft delete: set is_active = false)

#### Admin Winners ( /admin/winners )
- Filter by status: All / Pending / Approved / Rejected / Paid
- Table: user name, draw month, tier, prize amount, submitted date, status
- Row click: detail panel
  - Uploaded proof image (from Supabase Storage)
  - Approve / Reject buttons (admin note textarea for rejection)
  - Mark as Paid button
  - Each action: confirmation modal

#### Admin Analytics ( /admin/analytics )
- Date range picker
- Charts (Recharts):
  - Subscriber growth (LineChart)
  - Monthly prize pool totals (BarChart)
  - Charity contribution breakdown (PieChart)
  - Draw match distribution per month (BarChart)
- All chart data via useQuery with analytics endpoint

---

## ============================================================
## PART 9 — BUSINESS LOGIC (IMPLEMENT EXACTLY)
## ============================================================

### Subscription Pricing
- Monthly: 9.99 GBP
- Yearly: 99.99 GBP (displayed as "Save 17%")

### Prize Pool Split (per subscription payment)
```
Payment received: 9.99
  User charity contribution %: 10% (minimum)
  Charity amount: 0.10 * 9.99 = 1.00 GBP (rounded to 2dp)
  Prize pool amount: 9.99 - 1.00 = 8.99 GBP
    5-match jackpot pool += 8.99 * 0.40 = 3.60
    4-match pool        += 8.99 * 0.35 = 3.15
    3-match pool        += 8.99 * 0.25 = 2.25
```

### Draw Entry Eligibility
- Subscription status must be 'active'
- User must have at least 1 score in the scores table
- Scores are snapshotted at draw execution into draw_entries.submitted_scores

### Match Calculation (set intersection)
```javascript
function countMatches(userScores, drawnNumbers) {
  const drawn = new Set(drawnNumbers);
  return userScores.filter(s => drawn.has(s)).length;
}
// 5 matches = jackpot tier, 4 = second tier, 3 = third tier, <3 = no win
```

### Jackpot Rollover
- If no 5-match winner: jackpot_amount carries to next draw
- Store rollover_from_draw_id on the new draw
- Show "Rollover Jackpot" badge on homepage and draw detail

### Multiple Winners in Same Tier
- Prize is split equally: tier_pool / winner_count
- Round down to 2 decimal places
- Any remainder (from rounding) goes to charity

### Score Rolling Limit
- Maximum 5 scores per user
- Enforced by database trigger (see SQL above)
- When 6th score inserted: oldest by played_date is deleted
- Frontend shows toast: "Your oldest score was removed to make room"

### Winner Verification Flow
1. Draw published
2. Backend creates prize_claims record for each winner (status: pending)
3. Winner receives email with upload instructions
4. Winner uploads proof image (POST /api/claims/:id/proof)
5. Image stored in Supabase Storage bucket: prize-proofs/{userId}/{claimId}
6. Admin sees claim in winners panel
7. Admin approves: status -> approved, email sent to winner
8. Admin marks paid: status -> paid, payment confirmation email sent
9. Admin rejects: status -> rejected, email with reason sent to winner

---

## ============================================================
## PART 10 — STRIPE INTEGRATION
## ============================================================

### Stripe Products and Prices (create in Stripe Dashboard)
- Product: "Golf Charity Club Subscription"
- Price 1: 9.99 GBP / month (recurring) → store ID as STRIPE_MONTHLY_PRICE_ID
- Price 2: 99.99 GBP / year (recurring) → store ID as STRIPE_YEARLY_PRICE_ID

### Checkout Session Creation
```javascript
// POST /api/payments/create-checkout-session
const session = await stripe.checkout.sessions.create({
  customer: profile.stripe_customer_id || undefined,
  customer_email: profile.stripe_customer_id ? undefined : user.email,
  mode: 'subscription',
  line_items: [{ price: priceId, quantity: 1 }],
  metadata: { userId: user.id, charityId, plan },
  success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
  cancel_url: `${process.env.FRONTEND_URL}/subscribe?cancelled=true`,
  allow_promotion_codes: true,
});
```

### Webhook Handler (POST /api/payments/webhook)
Handle and implement all of these events:
- checkout.session.completed: create/update profile with stripe_customer_id and stripe_subscription_id, set subscription_status to 'active', create payment record
- invoice.payment_succeeded: create payment record with prize pool breakdown, extend subscription_renewal_date
- invoice.payment_failed: update subscription_status to 'lapsed', send payment failed email
- customer.subscription.updated: update plan and renewal date
- customer.subscription.deleted: update subscription_status to 'cancelled', send cancellation email

### Webhook Signature Verification (mandatory)
```javascript
const sig = req.headers['stripe-signature'];
let event;
try {
  event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
} catch (err) {
  logger.warn({ message: 'Stripe webhook signature failed', error: err.message });
  return res.status(400).json({ error: 'Webhook signature verification failed' });
}
```

---

## ============================================================
## PART 11 — EMAIL TEMPLATES (Resend)
## ============================================================

Implement all 9 email templates as JavaScript template literal HTML strings.
All emails: dark background (#0A0A0F), mint accent (#6EE7B7), DM Sans font.
Send via Resend SDK from email.service.js.

Templates and their trigger points:
1. welcome — on signup completion
2. subscriptionConfirmed — on checkout.session.completed
3. paymentFailed — on invoice.payment_failed
4. drawResults — on draw publish (sent to all entries, winners and non-winners)
5. youWon — on draw publish (sent only to winners, includes upload instructions)
6. claimApproved — on admin claim approval
7. claimRejected — on admin claim rejection (includes admin_note)
8. paymentSent — on admin mark paid
9. cancellationConfirmed — on customer.subscription.deleted

---

## ============================================================
## PART 12 — ENVIRONMENT VARIABLES
## ============================================================

### Backend (.env)
```
NODE_ENV=production
PORT=5000
LOG_LEVEL=info

# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_YEARLY_PRICE_ID=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@golfcharity.club

# App
FRONTEND_URL=https://your-vercel-url.vercel.app
APP_NAME=Golf Charity Club

# Admin
ADMIN_EMAIL=admin@golfcharity.club
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_APP_NAME=Golf Charity Club
```

---

## ============================================================
## PART 13 — SEED DATA
## ============================================================

Create a /backend/src/scripts/seed.js file:

Insert the following charities:
1. Golf Foundation — Growing the game for young people in the UK
2. Macmillan Cancer Support — Supporting people living with cancer
3. Walking With The Wounded — Supporting injured veterans through golf and sport
4. Prostate Cancer UK — Research and support for men affected by prostate cancer
5. The R&A Foundation — Golf development and access worldwide

Insert admin user:
- Email: admin@golfcharity.club
- Password: Admin@2026! (via Supabase auth.admin.createUser)
- Profile role: admin

Insert test subscriber:
- Email: test@golfcharity.club
- Password: Test@2026!
- Profile: subscription_status active, subscription_plan monthly
- 5 scores pre-inserted: [28, 31, 35, 22, 29] on dates in current month

---

## ============================================================
## PART 14 — ERROR HANDLING MATRIX
## ============================================================

Every one of these scenarios must be handled gracefully — no crashes, no blank screens:

| Scenario | Backend Response | Frontend Behaviour |
|---|---|---|
| Score out of range (1-45) | 422 with Zod error message | Form field error, no submission |
| 6th score inserted | DB trigger removes oldest, 200 returned | Toast: "Oldest score was removed" |
| Score not owned by user | 404 Not found | Toast error, no UI change |
| Draw already published | 409 Conflict | Admin sees error toast |
| No 5-match winner | Draw publishes normally, jackpot rolls over | Rollover badge shown |
| Multiple winners same tier | Prize split calculated server-side | Each winner notified of their share |
| Stripe webhook signature fails | 400, logged as warning | Stripe retries automatically |
| Proof file over 5MB | 413 from multer | File input error message |
| Invalid file type for proof | 422 from validation | File input error message |
| Subscription lapsed | 200 with subscription_status: lapsed | Locked UI with resubscribe CTA |
| Admin deletes non-existent user | 404 | Admin toast: "User not found" |
| Charity not found by slug | 404 | Full-page 404 with return link |
| Token expired | 401 | Auto-logout, redirect to /login |
| Rate limit exceeded | 429 | Toast: "Too many requests" |
| Network timeout (15s) | Axios timeout error | Toast: "Request timed out. Try again." |
| Payment intent creation fails | 500 logged, 502 to client | Subscribe page error state |

---

## ============================================================
## PART 15 — DEPLOYMENT CHECKLIST
## ============================================================

### Supabase
- [ ] New project created (not personal account)
- [ ] All SQL from Part 4 executed in order: tables, indexes, triggers, RLS
- [ ] Storage buckets created: prize-proofs (private), charity-images (public), avatars (public)
- [ ] Seed script executed successfully
- [ ] RLS tested: subscriber cannot read another user's scores

### Stripe
- [ ] Test mode products and prices created
- [ ] Webhook endpoint registered: POST https://your-backend.railway.app/api/payments/webhook
- [ ] All 5 webhook events subscribed
- [ ] Webhook secret copied to backend .env

### Backend (Railway or Render)
- [ ] New project created
- [ ] All environment variables set
- [ ] Logs directory exists or logging writes to stdout
- [ ] POST /api/health returns 200

### Frontend (Vercel)
- [ ] New project created (not personal account)
- [ ] All environment variables set
- [ ] Vite build completes without errors
- [ ] Public URL accessible

### End-to-End Testing
- [ ] Signup → email received → profile created in Supabase
- [ ] Subscribe flow → Stripe Checkout → webhook fires → subscription active
- [ ] Add 6 scores → confirm only 5 remain, oldest removed
- [ ] Admin: create draw → simulate → publish → winner emails sent
- [ ] Winner: upload proof → admin approves → status updates
- [ ] Admin: mark paid → payment confirmation email sent
- [ ] Mobile layout at 375px: all pages usable
- [ ] Rate limit: 11 rapid auth requests → 429 returned on 11th
- [ ] Admin route: subscriber user cannot access /admin

---

## ============================================================
## PART 16 — FINAL INSTRUCTIONS
## ============================================================

1. Build every section above. Do not mark anything as TODO or stub it.

2. Start in this order:
   Step 1 — Execute all SQL in Supabase (Part 4)
   Step 2 — Build backend feature modules (Part 5) starting with auth, then scores, then draws
   Step 3 — Build frontend feature modules (Part 6) starting with auth, then dashboard
   Step 4 — Connect end-to-end: verify each feature works before moving to the next
   Step 5 — Build admin panel
   Step 6 — Stripe integration and webhooks
   Step 7 — Email templates
   Step 8 — Deploy and run checklist

3. Rate limiting is mandatory. Apply the correct limiter from rateLimit.js to every route group.

4. Every backend service function must have error handling that logs via Winston and throws ApiError.

5. Every frontend useQuery and useMutation must handle loading and error states visibly.

6. VirtualList must be used for any list that can exceed 50 items (admin user tables, draw entry lists).

7. All page-level components must be wrapped in React.lazy and loaded through Suspense in the router.

8. Use InfiniteScrollTrigger + useInfiniteQuery for charity listings, draw history, and admin lists.

9. Do not use lorem ipsum. Write real copy that reflects the brand: charitable, modern, warm.

10. Comment all non-obvious logic — especially the draw engine, prize calculator, and Stripe webhook handler.

11. The admin panel is evaluated equally to the subscriber panel. Build it to the same standard.

12. Deliver with: live frontend URL, live backend URL, admin credentials, test subscriber credentials.

---

Document version: 2.0
Stack: React JS + Node.js/Express
Database: Supabase (PostgreSQL)
Prepared for: Digital Heroes Full-Stack Development Trainee Selection
Build standard: Production-ready
```
