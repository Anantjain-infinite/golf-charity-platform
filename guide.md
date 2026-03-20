# COMPLETE BEGINNER GUIDE
# Golf Charity Platform — From Zero to Deployed
# Cursor + Supabase + Stripe + Railway + Vercel
---

This guide assumes you have never used any of these tools before.
Every step is written in exact order. Do not skip steps.
Every tool has a free tier. You will not need to pay anything to build and test.

---

## ============================================================
## PHASE 0 — ACCOUNTS TO CREATE FIRST
## ============================================================

Create all of these accounts before touching any code.
Use the same email address for all of them to keep things organised.

1. GitHub — github.com (free)
   Used to store your code and connect to deployment platforms

2. Supabase — supabase.com (free)
   Your database, authentication, and file storage

3. Stripe — stripe.com (free)
   Payment processing — you will use test mode only, no real money involved

4. Railway — railway.app (free tier available)
   Where your Node/Express backend will be deployed and hosted

5. Vercel — vercel.com (free)
   Where your React frontend will be deployed and hosted

6. Resend — resend.com (free tier: 3000 emails/month)
   Transactional emails (winner notifications, welcome emails, etc.)

7. Cursor — cursor.com (free trial, then $20/month)
   The AI code editor you will use to build everything

Once all accounts are created, proceed to Phase 1.

---

## ============================================================
## PHASE 1 — INSTALL TOOLS ON YOUR COMPUTER
## ============================================================

### Step 1.1 — Install Node.js

Go to nodejs.org and download the LTS version (the one marked "Recommended for Most Users").
Run the installer. Accept all defaults.

To verify it installed correctly, open Terminal (Mac) or Command Prompt (Windows) and run:
  node --version
  npm --version

Both should print version numbers. If they do, Node is installed correctly.

### Step 1.2 — Install Git

Go to git-scm.com and download Git for your operating system.
Run the installer. Accept all defaults.

To verify:
  git --version

Should print a version number.

### Step 1.3 — Install Cursor

Go to cursor.com and download Cursor for your operating system.
Install it like any other application.
Open Cursor and sign in with your account.

When Cursor opens, it looks like VS Code. That is intentional — it is built on VS Code.

### Step 1.4 — Install Stripe CLI (needed for webhook testing)

Go to: stripe.com/docs/stripe-cli
Download the installer for your operating system and install it.

To verify:
  stripe --version

---

## ============================================================
## PHASE 2 — CREATE YOUR PROJECT FOLDERS
## ============================================================

### Step 2.1 — Create the project structure

Open Terminal and run these commands one by one:

  mkdir golf-charity-platform
  cd golf-charity-platform
  mkdir frontend
  mkdir backend
  git init

### Step 2.2 — Open in Cursor

In Cursor, go to File > Open Folder and select the golf-charity-platform folder.
You will now see both frontend and backend folders in the left panel.

### Step 2.3 — Place your prompt file

Copy the file GolfCharity_Master_Prompt_v2.md into the golf-charity-platform root folder.
You will reference this file in every Cursor conversation.

---

## ============================================================
## PHASE 3 — SUPABASE SETUP (Database + Auth + Storage)
## ============================================================

### Step 3.1 — Create a new Supabase project

1. Go to supabase.com and log in
2. Click "New Project"
3. Choose "Create a new organization" if prompted — name it "Golf Charity"
4. Project name: golf-charity-platform
5. Database password: generate a strong one and SAVE IT in a text file
6. Region: choose the one closest to your location
7. Click "Create new project"
8. Wait about 2 minutes for the project to provision

### Step 3.2 — Get your Supabase credentials

Once the project is ready:
1. In the left sidebar, click the gear icon (Project Settings)
2. Click "API" in the settings menu
3. You will see:
   - Project URL — looks like: https://abcdefgh.supabase.co
   - anon public key — a long string starting with "eyJ"
   - service_role key — another long string (keep this secret, never put it in frontend code)

Copy all three and save them in your text file.

### Step 3.3 — Run the database schema

1. In Supabase left sidebar, click "SQL Editor"
2. Click "New query"
3. Open your GolfCharity_Master_Prompt_v2.md file
4. Find PART 4 — DATABASE SCHEMA
5. Copy ONLY the "Step 1: Tables" SQL block
6. Paste it into the Supabase SQL editor
7. Click "Run" (or press Ctrl+Enter)
8. You should see "Success. No rows returned" at the bottom

Repeat for Step 2 (Indexes), Step 3 (Triggers), and Step 4 (RLS Policies) — run each one separately in a new query.

### Step 3.4 — Verify tables were created

1. In Supabase left sidebar, click "Table Editor"
2. You should see all 7 tables listed:
   - profiles
   - scores
   - charities
   - draws
   - draw_entries
   - prize_claims
   - payments

If all 7 are there, your database is set up correctly.

### Step 3.5 — Create Storage buckets

1. In Supabase left sidebar, click "Storage"
2. Click "New bucket"
3. Create these 3 buckets:

   Bucket 1:
   - Name: prize-proofs
   - Public bucket: NO (toggle off)
   - Click Save

   Bucket 2:
   - Name: charity-images
   - Public bucket: YES (toggle on)
   - Click Save

   Bucket 3:
   - Name: avatars
   - Public bucket: YES (toggle on)
   - Click Save

### Step 3.6 — Enable Email Authentication

1. In Supabase left sidebar, click "Authentication"
2. Click "Providers"
3. Make sure "Email" is enabled (it is by default)
4. Turn OFF "Confirm email" for now (makes testing easier — you can turn it back on before real launch)
5. Click Save

### Step 3.7 — Test your Supabase connection

In Supabase SQL Editor, run this query:

  select table_name from information_schema.tables
  where table_schema = 'public'
  order by table_name;

You should see all 7 of your tables listed. If you do, Supabase is ready.

---

## ============================================================
## PHASE 4 — STRIPE SETUP (Payments)
## ============================================================

### Step 4.1 — Access Stripe Dashboard

1. Go to stripe.com and log in
2. IMPORTANT: Make sure you are in TEST MODE
   - Look at the top right of the Stripe dashboard
   - There is a toggle that says "Test mode" — make sure it is ON
   - When in test mode, no real money moves. Everything is simulated.

### Step 4.2 — Get your API keys

1. In Stripe left sidebar, click "Developers"
2. Click "API keys"
3. You will see:
   - Publishable key — starts with "pk_test_"
   - Secret key — starts with "sk_test_" (click "Reveal test key" to see it)

Copy both and save them in your text file.

### Step 4.3 — Create your subscription products

1. In Stripe left sidebar, click "Products"
2. Click "Add product"

   Product 1 — Monthly Plan:
   - Name: Golf Charity Club - Monthly
   - Pricing model: Standard pricing
   - Price: 9.99
   - Currency: GBP
   - Billing period: Monthly
   - Click Save product

   After saving, click on the price you just created.
   Copy the "Price ID" — it looks like: price_1ABC123defghijk
   Save it as STRIPE_MONTHLY_PRICE_ID in your text file.

   Product 2 — Yearly Plan:
   - Name: Golf Charity Club - Yearly
   - Pricing model: Standard pricing
   - Price: 99.99
   - Currency: GBP
   - Billing period: Yearly
   - Click Save product

   Copy this Price ID too.
   Save it as STRIPE_YEARLY_PRICE_ID in your text file.

### Step 4.4 — Set up Stripe webhook (do this AFTER backend is deployed in Phase 8)

You will come back to this step later. Leave it for now.
Just know that webhooks are how Stripe tells your backend "a payment just happened."

### Step 4.5 — Save your Stripe test cards

These are fake card numbers you use for testing payments. Save them:

  Card that always succeeds: 4242 4242 4242 4242
  Expiry: any future date (e.g. 12/28)
  CVC: any 3 digits (e.g. 123)
  Postcode: any (e.g. SW1A 1AA)

  Card that always fails: 4000 0000 0000 9995

---

## ============================================================
## PHASE 5 — RESEND SETUP (Emails)
## ============================================================

### Step 5.1 — Get your Resend API key

1. Go to resend.com and log in
2. Click "API Keys" in the left sidebar
3. Click "Create API Key"
4. Name it: golf-charity-platform
5. Copy the key (starts with "re_") and save it

### Step 5.2 — Add a sending domain (optional for testing)

For testing purposes, Resend lets you send from onboarding@resend.dev without any domain setup.
Use this for now: RESEND_FROM_EMAIL=onboarding@resend.dev

For production you would add your own domain, but that is not needed for the assignment.

---

## ============================================================
## PHASE 6 — BUILD THE BACKEND WITH CURSOR
## ============================================================

This is where you write code. Follow these steps in exact order.

### Step 6.1 — Initialise the backend project

In Cursor terminal (press Ctrl+` to open terminal):

  cd backend
  npm init -y

Now open Cursor Composer:
- Press Ctrl+I (Windows) or Cmd+I (Mac)
- This opens the AI chat panel where you give instructions

### Step 6.2 — How to talk to Cursor

Every time you give Cursor an instruction:
1. Press Ctrl+I to open Composer
2. Type @ and select your prompt file: @GolfCharity_Master_Prompt_v2.md
3. Then type your specific instruction

Example first message:
  @GolfCharity_Master_Prompt_v2.md
  
  Set up the backend project. Install all packages listed in Part 2 of the prompt.
  Create the folder structure from Part 3 exactly as specified.
  Create the package.json scripts: start, dev, seed.
  Create the .env.example file with all variables from Part 12.

Cursor will generate the code. Review what it shows you, then click "Accept" or "Apply" to save the files.

### Step 6.3 — Build the backend in this exact order

After each step, test that it works before moving to the next.

INSTRUCTION 1 — Core infrastructure:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the core infrastructure files in this order:
  1. src/config/logger.js (from Part 5.2)
  2. src/config/db.js — Supabase admin client using SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
  3. src/config/cache.js (from Part 5.4)
  4. src/config/rateLimit.js (from Part 5.3)
  5. src/utils/ApiError.js (from Part 5.1)
  6. src/utils/asyncHandler.js (from Part 5.1)
  7. src/utils/pagination.js (from Part 5.1)
  8. src/middleware/auth.js (from Part 5.5)
  9. src/middleware/adminOnly.js (from Part 5.5)
  10. src/middleware/validate.js (from Part 5.5)
  11. src/middleware/errorHandler.js (from Part 5.5)
  12. src/middleware/notFound.js — returns 404 ApiError
  13. src/app.js (from Part 5.8)
  14. src/server.js — starts HTTP server on PORT, logs startup message
  15. src/routes.js (from Part 5.8)

INSTRUCTION 2 — Auth feature:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the auth feature completely:
  - auth.validation.js: Zod schemas for signup (email, password min 8 chars, full_name) and login
  - auth.service.js: signup (creates Supabase auth user + inserts profile row), login (returns session token), logout
  - auth.controller.js: calls service, returns consistent response shape
  - auth.routes.js: POST /signup, POST /login, POST /logout with authLimiter applied

INSTRUCTION 3 — Users feature:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the users feature:
  - users.validation.js: Zod schema for profile update (full_name, avatar_url, charity_id, charity_contribution_percent)
  - users.service.js: getProfile, updateProfile — ownership enforced
  - users.controller.js
  - users.routes.js: GET /me, PATCH /me — both require authenticate middleware

INSTRUCTION 4 — Scores feature:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the scores feature using the service from Part 5.7:
  - scores.validation.js: score between 1-45, played_date as ISO date string
  - scores.service.js: getUserScores, addScore, updateScore, deleteScore (from Part 5.7)
  - scores.controller.js
  - scores.routes.js: GET /, POST /, PATCH /:id, DELETE /:id — all require authenticate

INSTRUCTION 5 — Charities feature:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the charities feature:
  - charities.service.js: getCharities (paginated, search by name, filter active only, cache result for 5 min), getCharityBySlug (cache 10 min)
  - charities.controller.js
  - charities.routes.js: GET / (public, with pagination + search query params), GET /:slug (public)
  Apply cache.js: check cache before Supabase query, set cache after fetch, invalidate on admin update

INSTRUCTION 6 — Draw engine and draws feature:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the draw engine and draws feature:
  - src/features/draws/drawEngine.js (from Part 5.6)
  - src/features/draws/prizeCalculator.js (from Part 5.6)
  - draws.validation.js: draw creation schema (draw_month format YYYY-MM, draw_type, algorithm_mode)
  - draws.service.js: getPublishedDraws (paginated), getDrawById, getUserDrawEntries (paginated)
  - draws.controller.js
  - draws.routes.js: GET / (public), GET /:id (public), GET /my-entries (authenticated)

INSTRUCTION 7 — Claims feature:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the claims feature:
  - claims.validation.js
  - claims.service.js: getUserClaims, submitClaimProof (upload file to Supabase Storage bucket prize-proofs/{userId}/{claimId}, update claim with proof_url)
  - claims.controller.js
  - claims.routes.js: GET / (authenticated), POST /:id/proof (authenticated, uploadLimiter, multer)

INSTRUCTION 8 — Stripe payments feature:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the payments feature:
  - payments.service.js: createCheckoutSession, createPortalSession
  - stripe.webhook.js: handle all 5 webhook events from Part 10 with signature verification
  - payments.controller.js
  - payments.routes.js:
    POST /create-checkout-session (authenticated)
    POST /create-portal-session (authenticated)
    POST /webhook (webhookLimiter, raw body — NOT authenticated middleware)

INSTRUCTION 9 — Email service:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the email service:
  - emails/email.service.js: one function per email template from Part 11
  - emails/templates/: all 9 HTML email templates as JS template literal strings
  - Dark theme (#0A0A0F background, #6EE7B7 accent), DM Sans font, clean layout
  - Wire email calls into: draws.service.js (draw published), payments webhook (subscription events), claims.service.js (claim status changes)

INSTRUCTION 10 — Admin feature:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the admin feature:
  All routes require both authenticate and adminOnly middleware.
  
  admin.routes.js aggregates:
  - GET /users (paginated, searchable, filterable by status)
  - GET /users/:id
  - PATCH /users/:id (edit profile, edit scores, manage subscription, toggle role)
  - DELETE /users/:id
  
  - POST /draws (create draw)
  - POST /draws/:id/simulate (run draw engine, return results WITHOUT saving)
  - POST /draws/:id/publish (save results, create draw_entries, notify winners)
  
  - GET /charities (all including inactive)
  - POST /charities (create with image upload)
  - PATCH /charities/:id
  - DELETE /charities/:id (soft delete: is_active = false)
  
  - GET /claims (all, filterable by status)
  - PATCH /claims/:id (approve, reject with note, mark paid)
  
  - GET /analytics (stats for date range: user counts, prize totals, charity totals, draw match distribution)
  
  admin.analytics.service.js: all analytics queries using Supabase aggregate functions

INSTRUCTION 11 — Seed script:
  @GolfCharity_Master_Prompt_v2.md
  
  Create src/scripts/seed.js that:
  1. Inserts 5 charities from Part 13
  2. Creates admin user via Supabase auth.admin.createUser
  3. Sets admin profile role to 'admin'
  4. Creates test subscriber user
  5. Sets test subscriber subscription_status to 'active', subscription_plan to 'monthly'
  6. Inserts 5 scores for test subscriber
  7. Logs success/failure for each step
  Add "seed": "node src/scripts/seed.js" to package.json scripts

### Step 6.4 — Create the .env file

In the /backend folder, create a file named .env (no extension):

  NODE_ENV=development
  PORT=5000
  LOG_LEVEL=info

  SUPABASE_URL=paste-your-project-url-here
  SUPABASE_SERVICE_ROLE_KEY=paste-your-service-role-key-here
  SUPABASE_ANON_KEY=paste-your-anon-key-here

  STRIPE_SECRET_KEY=paste-your-sk_test_key-here
  STRIPE_WEBHOOK_SECRET=will-fill-in-later
  STRIPE_MONTHLY_PRICE_ID=paste-your-monthly-price-id-here
  STRIPE_YEARLY_PRICE_ID=paste-your-yearly-price-id-here

  RESEND_API_KEY=paste-your-resend-key-here
  RESEND_FROM_EMAIL=onboarding@resend.dev

  FRONTEND_URL=http://localhost:5173
  APP_NAME=Golf Charity Club

  ADMIN_EMAIL=admin@golfcharity.club

### Step 6.5 — Run the seed script

In terminal:

  cd backend
  npm install
  node src/scripts/seed.js

You should see success messages for each seed item.
Go to Supabase Table Editor and check the charities table — you should see 5 rows.

### Step 6.6 — Start the backend server

  npm run dev

You should see:
  Server running on port 5000

If you see errors, read the error message carefully. 99% of startup errors are:
- Missing .env variable
- Supabase credentials are wrong
- A package was not installed

---

## ============================================================
## PHASE 7 — BUILD THE FRONTEND WITH CURSOR
## ============================================================

### Step 7.1 — Initialise the frontend project

Open a new terminal tab and run:

  cd frontend
  npm create vite@latest . -- --template react
  (Press Enter to confirm overwriting the current directory)
  npm install

### Step 7.2 — Install all frontend packages

  npm install react-router-dom @tanstack/react-query @tanstack/react-virtual
  npm install zustand axios react-hook-form yup @hookform/resolvers
  npm install framer-motion react-toastify recharts date-fns
  npm install react-intersection-observer
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p

### Step 7.3 — Install shadcn/ui

  npx shadcn-ui@latest init

When prompted:
- Style: Default
- Base color: Slate
- CSS variables: Yes

Then install the components you will need:
  npx shadcn-ui@latest add button input card badge dialog select slider tabs toast

### Step 7.4 — Configure Tailwind

Replace the content of tailwind.config.js with the config from Part 7.1 of the prompt.

### Step 7.5 — Create the .env file

In the /frontend folder, create a file named .env:

  VITE_API_URL=http://localhost:5000/api
  VITE_SUPABASE_URL=paste-your-project-url-here
  VITE_SUPABASE_ANON_KEY=paste-your-anon-key-here
  VITE_STRIPE_PUBLISHABLE_KEY=paste-your-pk_test_key-here
  VITE_APP_NAME=Golf Charity Club

### Step 7.6 — Build the frontend in this exact order

INSTRUCTION 1 — Foundation files:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the foundation files:
  1. src/lib/axios.js (from Part 6.1)
  2. src/lib/queryClient.js (from Part 6.2)
  3. src/lib/supabaseClient.js — browser Supabase client using VITE env vars
  4. src/store/authStore.js (from Part 6.3)
  5. src/store/uiStore.js — sidebar open state, active modal ID
  6. src/utils/formatters.js — formatCurrency (GBP), formatDate (DD/MM/YYYY), formatMonth (March 2026)
  7. src/utils/constants.js — SCORE_MIN=1, SCORE_MAX=45, MONTHLY_PRICE=9.99, YEARLY_PRICE=99.99, POOL_SPLITS object
  8. src/hooks/useDebounce.js (from Part 6.7)
  9. src/components/shared/ErrorBoundary.jsx (from Part 6.9)
  10. src/components/shared/PageLoader.jsx — full-screen centered spinner
  11. src/components/shared/VirtualList.jsx (from Part 6.5)
  12. src/components/shared/InfiniteScrollTrigger.jsx (from Part 6.6)
  13. src/components/shared/StatusBadge.jsx — renders pill badge based on status string
  14. src/components/shared/EmptyState.jsx — icon, heading, subtext, optional CTA
  15. src/components/shared/ConfirmModal.jsx — reusable confirmation dialog
  16. main.jsx — wraps App with QueryClientProvider, BrowserRouter equivalent, ToastContainer
  17. App.jsx — renders AppRouter

INSTRUCTION 2 — Layout components:
  @GolfCharity_Master_Prompt_v2.md
  
  Build layout components:
  1. src/components/layout/PublicLayout.jsx — Header (logo, nav links, Subscribe CTA) + Outlet + Footer
  2. src/components/layout/AppShell.jsx — Sidebar + Topbar + Outlet (for dashboard pages)
  3. src/components/layout/AdminShell.jsx — Admin sidebar + Outlet
  4. src/components/layout/Sidebar.jsx — navigation links, user avatar at bottom, active state highlighting
  5. src/components/layout/MobileSidebar.jsx — slide-in drawer version of Sidebar
  6. src/router/ProtectedRoute.jsx — redirects to /login if not authenticated
  7. src/router/AdminRoute.jsx — redirects to /dashboard if authenticated but not admin
  8. src/router/index.jsx — full route definitions with lazy loading (from Part 6.8)

INSTRUCTION 3 — Auth feature:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the auth feature:
  - authService.js: login, signup, logout — calls backend API via axios instance
  - hooks/useAuth.js: useMutation for login (stores to authStore on success), signup, logout
  - components/LoginForm.jsx: email + password fields, React Hook Form + Yup, submit calls useLogin
  - components/SignupForm.jsx: full_name + email + password fields
  - pages/LoginPage.jsx: centered card layout, LoginForm, link to signup
  - pages/SignupPage.jsx: centered card layout, SignupForm, link to login

INSTRUCTION 4 — Charities feature:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the charities feature completely:
  - charitiesService.js: getCharities (with page, limit, search params), getCharityBySlug
  - hooks/useCharities.js (from Part 6.7) — useInfiniteQuery
  - hooks/useCharityDetail.js — useQuery by slug
  - components/CharityCard.jsx — logo, name, description, total raised badge, Learn More button
  - components/CharityGrid.jsx — renders grid of CharityCard, handles loading skeleton and empty state
  - components/CharitySearchBar.jsx — controlled input, debounced via useDebounce
  - components/CharityProfile.jsx — full charity detail display
  - components/CharitySpotlight.jsx — homepage featured charity section
  - pages/CharitiesPage.jsx — search bar + CharityGrid + InfiniteScrollTrigger
  - pages/CharityDetailPage.jsx — fetches by slug, renders CharityProfile

INSTRUCTION 5 — Dashboard and all tabs:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the dashboard feature. This is the most important user-facing page.
  
  dashboardService.js: getDashboardStats (subscription, draws entered, total won, charity contributed)
  
  ScoresTab:
  - scoresService.js: getScores, addScore, updateScore, deleteScore
  - hooks/useScores.js (from Part 6.4) — with optimistic update on add
  - components/ScoreEntryForm.jsx: number input (1-45) + date picker, validates with Yup
  - components/ScoreList.jsx: renders up to 5 score items, most recent first
  - components/ScoreItem.jsx: score value, date, edit/delete buttons, inline edit mode
  - components/ScoreVisualiser.jsx: Recharts BarChart of the 5 scores, mint colour bars
  
  CharityTab:
  - components/ContributionSlider.jsx: shadcn Slider (10–100), updates on release
  
  DrawHistoryTab:
  - drawsService.js: getMyDrawEntries (paginated)
  - hooks/useDrawHistory.js: useInfiniteQuery
  - components/DrawHistoryList.jsx: with InfiniteScrollTrigger
  - components/DrawnNumbersReveal.jsx: shows drawn numbers and highlights matches
  - components/MatchBadge.jsx: "3 Match", "4 Match", "Jackpot" styled badges
  
  WinningsTab:
  - claimsService.js: getMyClaims, submitProof
  - hooks/useClaims.js: useQuery + useMutation
  - components/ClaimUploadForm.jsx: file input (image only, 5MB max), preview, submit
  - components/WinningsOverview.jsx: total won display + claims table
  
  OverviewTab:
  - components/SubscriptionCard.jsx: plan, status, renewal date
  - components/StatsCard.jsx: reusable metric card
  - components/DrawCountdown.jsx: countdown to first day of next month
  
  pages/DashboardPage.jsx: shadcn Tabs containing all 5 tab components

INSTRUCTION 6 — Subscribe page:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the subscribe feature:
  - subscribeService.js: createCheckoutSession — calls backend, receives Stripe URL, redirects
  - hooks/useSubscription.js: useMutation wrapping createCheckoutSession
  - components/PricingCard.jsx: plan name, price, features list, CTA button
  - components/PlanSelector.jsx: toggle between monthly and yearly, shows savings
  - components/CharityPreSelector.jsx: dropdown populated from useCharities query
  - pages/SubscribePage.jsx: PlanSelector + CharityPreSelector + CTA button

INSTRUCTION 7 — Homepage:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the homepage. This is the public-facing first impression.
  Apply the design rules from Part 7.3 strictly.
  
  - components/HeroSection.jsx: full-viewport dark section, animated gradient mesh background (CSS only),
    large asymmetric Syne font headline ("Win. Give. Play."), subheadline, primary CTA button
    Numbers animate count-up on entrance using Framer Motion useMotionValue + useSpring
  
  - components/StatsTicker.jsx: 3 stat cards (Total Members, Total Charity Raised, Current Jackpot)
    Fetch live stats from backend via useQuery
  
  - components/HowItWorksSection.jsx: 3 numbered cards with connecting line on desktop
    Numbers: 01, 02, 03 in display font. Cards: Subscribe, Enter Scores, Win and Give
  
  - components/FeaturedCharity.jsx: full-width section, fetch first featured=true charity
    Cover image right, charity name + description + total raised + CTA left
  
  - components/PricingSection.jsx: two PricingCard components side by side
    Yearly card: primary glow border, "Best Value" label
  
  - components/FooterSection.jsx: 3 columns, minimal, dark
  
  - pages/HomePage.jsx: assembles all sections with Framer Motion staggered entrance

INSTRUCTION 8 — Admin panel:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the complete admin panel. All pages require AdminRoute.
  
  adminService.js: all admin API calls
  
  AdminOverviewPage: 4 KPI cards + recent signups table + outstanding claims count
  
  AdminUsersPage:
  - useAdminUsers.js: useInfiniteQuery (paginated user list)
  - UserTable.jsx: uses VirtualList component, columns from Part 8
  - UserDetailModal.jsx: full user management modal
  
  AdminDrawsPage:
  - useAdminDraws.js: useQuery + useMutations for create, simulate, publish
  - DrawConfigPanel.jsx: month picker, draw type selector, algorithm mode
  - SimulationResults.jsx: shows drawn numbers + winners per tier + prize amounts
  - Publish flow: confirmation modal then publish mutation
  
  AdminCharitiesPage:
  - useAdminCharities.js
  - CharityForm.jsx: all charity fields + image upload
  
  AdminWinnersPage:
  - useAdminClaims.js: useQuery with status filter
  - ClaimsTable.jsx: filterable by status
  - Claim detail panel: proof image + approve/reject/pay buttons
  
  AdminAnalyticsPage:
  - useAdminAnalytics.js: useQuery with date range
  - AnalyticsCharts.jsx: 4 Recharts charts from Part 8

INSTRUCTION 9 — Settings page:
  @GolfCharity_Master_Prompt_v2.md
  
  Build the settings page:
  - settingsService.js: updateProfile, updatePassword, cancelSubscription, deleteAccount
  - components/ProfileForm.jsx: name + avatar upload
  - components/PasswordForm.jsx: current + new + confirm password
  - components/DangerZone.jsx: cancel subscription button + delete account button
  - pages/SettingsPage.jsx: 3 sections vertically stacked

### Step 7.7 — Start the frontend

  cd frontend
  npm run dev

Open browser at http://localhost:5173
You should see the homepage.

---

## ============================================================
## PHASE 8 — TESTING LOCALLY (THE COMPLETE CHECKLIST)
## ============================================================

Test every feature in this exact order. Test each one before moving to the next.
Both backend (localhost:5000) and frontend (localhost:5173) must be running.

### TEST GROUP 1 — Authentication

Test 1.1 — Signup
- Go to http://localhost:5173/signup
- Fill in: full name, email, password (min 8 chars)
- Click Sign Up
- EXPECTED: Redirected to /dashboard
- VERIFY IN SUPABASE: Go to Authentication > Users — your new user should appear
- VERIFY IN SUPABASE: Go to Table Editor > profiles — a row should exist for your user

Test 1.2 — Login
- Go to http://localhost:5173/login
- Log in with the credentials you just created
- EXPECTED: Redirected to /dashboard, your name shows in sidebar

Test 1.3 — Protected route
- Log out
- Try to go directly to http://localhost:5173/dashboard
- EXPECTED: Redirected to /login

Test 1.4 — Admin access
- Log in as admin@golfcharity.club / Admin@2026!
- EXPECTED: /admin route accessible
- Log out, log in as test@golfcharity.club / Test@2026!
- Try to go to http://localhost:5173/admin
- EXPECTED: Redirected away (no admin access)

### TEST GROUP 2 — Score Entry

Test 2.1 — Add first score
- Log in as test user
- Go to Dashboard > Scores tab
- Enter score: 32, date: today
- Click Save
- EXPECTED: Score appears in list below

Test 2.2 — Validation
- Try entering score: 0 (below minimum)
- EXPECTED: Validation error "Score must be between 1 and 45"
- Try entering score: 46
- EXPECTED: Same validation error

Test 2.3 — Rolling 5-score limit
- Add 5 more scores (you already have 5 from the seed)
- When you add the 6th score, the oldest should disappear
- EXPECTED: List always shows maximum 5 scores
- EXPECTED: Toast notification "Oldest score was removed"
- VERIFY IN SUPABASE: Table Editor > scores, filter by your user_id — should be exactly 5 rows

Test 2.4 — Edit a score
- Click edit on an existing score
- Change the value and save
- EXPECTED: Score updates in list

Test 2.5 — Delete a score
- Click delete on a score
- EXPECTED: Score removed, list shows 4 items

### TEST GROUP 3 — Charities

Test 3.1 — Charity listing
- Go to http://localhost:5173/charities
- EXPECTED: 5 charity cards visible (from seed data)

Test 3.2 — Search
- Type "golf" in the search bar
- EXPECTED: Results filter to matching charities only

Test 3.3 — Charity detail
- Click "Learn More" on any charity
- EXPECTED: Charity detail page loads at /charities/[slug]

Test 3.4 — Charity selection in dashboard
- Go to Dashboard > Charity tab
- EXPECTED: Your currently selected charity is shown
- Click "Change Charity"
- EXPECTED: Dropdown with all charities appears

Test 3.5 — Contribution slider
- Move the slider from 10% to 25%
- EXPECTED: Value updates and saves
- VERIFY IN SUPABASE: profiles table, your row should show charity_contribution_percent = 25

### TEST GROUP 4 — Subscription and Stripe (TEST MODE)

Test 4.1 — Stripe webhook local forwarding
First, set up local webhook forwarding so Stripe can talk to your local backend.
In a new terminal window:

  stripe login
  stripe listen --forward-to localhost:5000/api/payments/webhook

You will see a webhook signing secret printed: whsec_...
Copy this and update your backend .env:
  STRIPE_WEBHOOK_SECRET=whsec_... (the one just printed)
Restart your backend server.

Test 4.2 — Subscribe flow
- Go to http://localhost:5173/subscribe
- Select Monthly plan
- Select a charity
- Click Subscribe
- EXPECTED: Redirected to Stripe Checkout page
- Enter test card: 4242 4242 4242 4242, any future expiry, any CVC, any postcode
- Click Pay
- EXPECTED: Redirected to /dashboard?success=true
- EXPECTED: Success toast visible

Test 4.3 — Verify subscription activated
- Go to Dashboard > Overview tab
- EXPECTED: Subscription status shows "Active"
- VERIFY IN SUPABASE: profiles table — subscription_status should be 'active'
- VERIFY IN SUPABASE: payments table — a payment record should exist
- VERIFY IN STRIPE: Stripe Dashboard > Customers — your test user should appear

Test 4.4 — Failed payment
- Go to /subscribe again
- Use the failing card: 4000 0000 0000 9995
- EXPECTED: Stripe shows payment declined
- EXPECTED: No subscription created

### TEST GROUP 5 — Draws (Admin)

Test 5.1 — Create a draw
- Log in as admin@golfcharity.club / Admin@2026!
- Go to http://localhost:5173/admin/draws
- Click "Create New Draw"
- Select current month, draw type: Random
- Click Create
- EXPECTED: Draw appears in list with status "Draft"

Test 5.2 — Simulate the draw
- Click "Simulate" on the draft draw
- EXPECTED: Drawn numbers appear (5 numbers between 1 and 45)
- EXPECTED: Winner list shows for each tier
- EXPECTED: Prize amounts shown
- NO DATA SAVED YET — check Supabase draw_entries table, it should be empty

Test 5.3 — Publish the draw
- Click "Publish Draw"
- EXPECTED: Confirmation modal appears
- Click Confirm
- EXPECTED: Draw status changes to "Published"
- VERIFY IN SUPABASE: draws table — status should be 'published'
- VERIFY IN SUPABASE: draw_entries table — rows should now exist for all eligible users
- EXPECTED: If test user's scores matched, they appear as winner

Test 5.4 — Check user draw history
- Log out, log in as test@golfcharity.club / Test@2026!
- Go to Dashboard > Draw History tab
- EXPECTED: The published draw appears with match count and result

### TEST GROUP 6 — Winner Verification (Admin)

Test 6.1 — Upload proof (as test user)
- Log in as test user
- Go to Dashboard > Winnings tab
- If you won: click "Upload Proof"
- Upload any image file (screenshot)
- EXPECTED: File uploads, status changes to "Pending"
- VERIFY IN SUPABASE: prize_claims table — a row with status 'pending'
- VERIFY IN SUPABASE STORAGE: prize-proofs bucket — your file should be there

Test 6.2 — Review claim (as admin)
- Log in as admin
- Go to /admin/winners
- EXPECTED: The pending claim appears
- Click on it to see the proof image
- Click "Approve"
- EXPECTED: Status changes to "Approved"

Test 6.3 — Mark as paid (as admin)
- On the same claim, click "Mark as Paid"
- EXPECTED: Status changes to "Paid"
- VERIFY IN SUPABASE: prize_claims — paid_at should now have a timestamp

### TEST GROUP 7 — Admin Management

Test 7.1 — View user list
- Go to /admin/users
- EXPECTED: Both test users appear in table

Test 7.2 — Edit a user's score
- Click on the test user row
- In the modal, find the scores section
- Edit one score
- EXPECTED: Score updates in Supabase

Test 7.3 — Charity management
- Go to /admin/charities
- Click "Add Charity"
- Fill in all fields, upload an image
- EXPECTED: New charity appears in list
- Go to /charities — new charity should be visible

Test 7.4 — Analytics
- Go to /admin/analytics
- EXPECTED: Charts load with data (even if minimal for test data)

### TEST GROUP 8 — Rate Limiting

Test 8.1 — Auth rate limit
- Go to /login
- Submit incorrect credentials 11 times rapidly
- EXPECTED: After 10 attempts, you receive "Too many authentication attempts" error

Test 8.2 — API rate limit
- This is harder to test manually. You can use a tool called Postman (free) to send 101 rapid requests
- Send 101 POST requests to http://localhost:5000/api/auth/login
- EXPECTED: The 101st request returns HTTP 429 status

### TEST GROUP 9 — Mobile Responsiveness

Open browser developer tools (F12), click the device toggle icon (phone/tablet icon).

Test at these widths:
- 375px (iPhone SE)
- 390px (iPhone 14)
- 768px (iPad)

Check every page:
- Homepage: hero, stats, how it works, pricing — all readable
- Charities: card grid wraps to single column
- Dashboard: tabs accessible, score form usable
- Admin: tables scroll horizontally or stack

---

## ============================================================
## PHASE 9 — DEPLOY TO PRODUCTION
## ============================================================

### Step 9.1 — Push code to GitHub

In terminal from the golf-charity-platform root:

  git add .
  git commit -m "Initial production build"
  git branch -M main
  git remote add origin https://github.com/YOUR-USERNAME/golf-charity-platform.git
  git push -u origin main

Replace YOUR-USERNAME with your actual GitHub username.
You will need to create the repository on github.com first (click New Repository).

### Step 9.2 — Deploy backend to Railway

1. Go to railway.app and log in
2. Click "New Project"
3. Click "Deploy from GitHub repo"
4. Connect your GitHub account if not already connected
5. Select your golf-charity-platform repository
6. Railway will ask which directory — select "backend"
7. Click Deploy

Once deployed, Railway will give you a URL like:
  https://golf-charity-backend-production.up.railway.app

Go to Railway project settings and add all your environment variables from Part 12 (backend .env).
Change FRONTEND_URL to your Vercel URL (you will get this in the next step).

### Step 9.3 — Deploy frontend to Vercel

1. Go to vercel.com and log in
2. Click "Add New > Project"
3. Import your GitHub repository
4. Set Root Directory to "frontend"
5. Framework Preset: Vite
6. Click Deploy

Vercel will give you a URL like:
  https://golf-charity-frontend.vercel.app

Go to Vercel project settings > Environment Variables and add all variables from Part 12 (frontend .env).
Change VITE_API_URL to your Railway backend URL + /api

### Step 9.4 — Set up Stripe production webhook

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Endpoint URL: https://your-railway-url.up.railway.app/api/payments/webhook
4. Select events to listen for:
   - checkout.session.completed
   - invoice.payment_succeeded
   - invoice.payment_failed
   - customer.subscription.updated
   - customer.subscription.deleted
5. Click Add endpoint
6. Copy the "Signing secret" (starts with whsec_)
7. Update STRIPE_WEBHOOK_SECRET in Railway environment variables

### Step 9.5 — Update CORS in backend

In backend .env on Railway:
  FRONTEND_URL=https://your-vercel-url.vercel.app

In src/app.js, if you have multiple allowed origins (local + production):

  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
  ];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));

### Step 9.6 — Run production smoke tests

Visit your Vercel URL and repeat the key tests:
1. Homepage loads with real charity data
2. Signup creates a user
3. Login works
4. Subscribe flow completes with test card
5. Dashboard shows correct subscription status
6. Score entry works
7. Admin panel accessible with admin credentials
8. Draw simulation and publish works

---

## ============================================================
## PHASE 10 — HOW TO CHECK EVERYTHING IS WORKING
## ============================================================

### Tool 1: Supabase Dashboard (your database viewer)

Use this to verify data is being created and updated correctly.

  Table Editor > profiles: check user rows, subscription_status, charity selection
  Table Editor > scores: verify rolling 5-score logic, check played_date ordering
  Table Editor > draws: check status transitions (draft > simulated > published)
  Table Editor > draw_entries: verify entries created after publish, match_count values
  Table Editor > prize_claims: verify status updates (pending > approved > paid)
  Table Editor > payments: verify records created after Stripe webhook fires
  Table Editor > charities: verify total_raised increments after payments

  Authentication > Users: all registered users appear here

  Storage > prize-proofs: uploaded winner proof images appear here

  Logs > API logs: see all database queries in real time

### Tool 2: Stripe Dashboard (your payment viewer)

  Customers: all users who subscribed appear here
  Subscriptions: active, cancelled, and lapsed subscriptions
  Payments: all successful test payments
  Events: every webhook event — use this to debug webhook issues
  Developers > Webhooks > [your endpoint] > Recent deliveries: see if webhooks are being received

  To check if a webhook fired and succeeded:
  Go to Stripe > Developers > Webhooks > click your endpoint > Recent deliveries
  Each delivery shows: event type, timestamp, HTTP status code returned by your backend
  200 = success, anything else = problem

### Tool 3: Railway Logs (your backend logs)

  Go to railway.app > your project > your service > Logs tab
  You will see Winston logs: all requests, errors, and application events
  Filter by level: error to see only errors

  Key things to look for:
  - Startup: "Server running on port 5000"
  - Auth: "User logged in: [userId]"
  - Draw: "Draw executed: [numbers]"
  - Webhook: "Stripe webhook received: checkout.session.completed"
  - Errors: any ApiError with statusCode 500

### Tool 4: Vercel Logs (your frontend logs)

  Go to vercel.com > your project > Deployments > Functions tab
  Shows any server-side errors from Vercel (less relevant since you are on Vite/CSR)

### Tool 5: Browser Developer Tools

  Open with F12 in any browser (Chrome recommended)

  Console tab: JavaScript errors will appear here — check this first if something looks broken
  
  Network tab: see every API request your frontend makes
  - Click on a request to see the full URL, request body, response body, and status code
  - 200-299 = success
  - 400 = bad request (check the response body for the error message)
  - 401 = not authenticated (check your token)
  - 403 = no permission (check your role)
  - 404 = not found
  - 422 = validation failed (check the response body for which field failed)
  - 429 = rate limited
  - 500 = server error (check Railway logs)

  Application tab > Local Storage: see if your auth token is being stored by Zustand persist

### Tool 6: Postman (API testing tool — free)

Download from postman.com
Use this to test your backend API independently of the frontend.

Create a collection called "Golf Charity API" with requests for each endpoint.
Set a collection variable: {{base_url}} = http://localhost:5000/api

Useful tests:
  POST {{base_url}}/auth/signup — body: {"email":"test2@test.com","password":"Test1234!","full_name":"Test User"}
  POST {{base_url}}/auth/login — body: {"email":"test2@test.com","password":"Test1234!"}
  GET {{base_url}}/scores — Header: Authorization: Bearer [paste token from login response]
  POST {{base_url}}/scores — Header + body: {"score": 32, "played_date": "2026-03-20"}

If your API returns correct responses in Postman but the frontend shows errors, the problem is in the frontend.
If Postman also returns errors, the problem is in the backend.

### Tool 7: React Query DevTools (see your cache in real time)

Add this to your frontend during development:

  npm install @tanstack/react-query-devtools

In main.jsx:
  import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

  // Inside your QueryClientProvider:
  <ReactQueryDevtools initialIsOpen={false} />

A small icon appears in the bottom corner of your app.
Click it to see:
- All active queries and their status (loading, success, error, stale)
- Cached data for each query key
- When data was last fetched
- Which queries are being refetched

This is invaluable for debugging stale data and caching issues.

---

## ============================================================
## APPENDIX — COMMON PROBLEMS AND SOLUTIONS
## ============================================================

PROBLEM: "Cannot find module" errors on backend startup
SOLUTION: Run "npm install" in the backend folder. A package is missing.

PROBLEM: Supabase returns "Row level security policy violated"
SOLUTION: You are using the anon key where you should use the service role key.
The backend should always use SUPABASE_SERVICE_ROLE_KEY, never the anon key.

PROBLEM: Stripe webhook returns 400 "signature verification failed"
SOLUTION: Your STRIPE_WEBHOOK_SECRET is wrong. When testing locally, use the secret
printed by "stripe listen", not the one from Stripe Dashboard.

PROBLEM: CORS error in browser console ("blocked by CORS policy")
SOLUTION: Your backend FRONTEND_URL env var does not match the URL your frontend is running on.
Check for trailing slashes: "http://localhost:5173" not "http://localhost:5173/"

PROBLEM: "401 Unauthorized" on all authenticated routes
SOLUTION: Check that your Axios interceptor is attaching the token correctly.
Open Browser DevTools > Network > click the failing request > check the Authorization header is present.

PROBLEM: Score rolling not working (more than 5 scores in database)
SOLUTION: The database trigger may not have been created. Go to Supabase SQL Editor and
run the trigger creation SQL from Part 4 Step 3 again.

PROBLEM: Charities not loading on homepage
SOLUTION: The seed script may not have run. Run "node src/scripts/seed.js" again.
Then check the charities table in Supabase has rows with is_active = true.

PROBLEM: Framer Motion animations not working
SOLUTION: Make sure the parent element has layout defined. Wrap animated sections in
a <motion.div> not a regular <div>.

PROBLEM: TanStack Virtual / VirtualList not rendering items
SOLUTION: The parent container must have a fixed height set via CSS.
Add style={{ height: '600px', overflowY: 'auto' }} to the parent.

PROBLEM: Railway deployment fails
SOLUTION: Check the Railway build logs. Most common cause: missing environment variables.
Make sure all variables from Part 12 are added to Railway settings.

PROBLEM: Vercel build fails
SOLUTION: Check Vercel deployment logs. Most common cause: an import path is wrong
(case-sensitive on Linux, not on Mac). Check all import paths match exactly.

---

## SUMMARY — WHAT YOU ARE BUILDING AND IN WHAT ORDER

Week 1: Setup + Database + Backend core + Auth
Week 2: Scores + Charities + Draws backend + Stripe integration
Week 3: Frontend foundation + Auth UI + Dashboard
Week 4: Admin panel + Email integration + Deploy + Test

This is a professional full-stack project. Take it one feature at a time.
Each completed, tested feature is permanent progress.

Credentials to deliver with submission:
  Admin: admin@golfcharity.club / Admin@2026!
  Test user: test@golfcharity.club / Test@2026!
  Frontend URL: your Vercel URL
  Backend URL: your Railway URL