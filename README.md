# Golf Charity Subscription Platform

A production-ready, full-stack web application that combines golf score tracking with monthly lottery-style prize draws and charitable giving. Recreational golfers can participate in a fun, monthly draw while supporting their chosen charity.

## 📋 Overview

The Golf Charity Subscription Platform is a modern, charity-focused product designed for recreational golfers who want to:
- Track their golf scores using the Stableford format (rolling 5-score system)
- Participate in monthly lottery-style prize draws
- Support charitable causes with every subscription

**Design Philosophy:** Modern charity-tech aesthetic with contemporary UI — no traditional golf website styling.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite, JavaScript)
- **React Router v6** - Client-side routing
- **TanStack Query v5** - Server state management
- **Zustand** - Global UI state (auth, sidebar, modals)
- **Axios** - Centralized HTTP client with interceptors
- **React Hook Form + Yup** - Forms and validation
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Base components
- **Framer Motion** - Animations and transitions
- **Recharts** - Analytics charts
- **React Virtual** - Virtualized lists
- **React Intersection Observer** - Lazy loading & infinite scroll
- **React Toastify** - Notifications
- **date-fns** - Date formatting and manipulation

### Backend
- **Node.js 20+** - Runtime
- **Express 4** - Modular router structure
- **Supabase JS Client** - Database, auth & storage
- **Stripe Node SDK** - Subscriptions and webhooks
- **Resend** - Transactional emails
- **Winston + Morgan** - Logging
- **Zod** - Server-side input validation
- **Helmet** - HTTP security headers
- **express-rate-limit** - Rate limiting
- **node-cache** - In-memory caching
- **multer + sharp** - File upload & image processing

### Database & Infrastructure
- **Supabase (PostgreSQL)** - Database
- **Supabase Storage** - File storage
- **Frontend:** Vercel deployment
- **Backend:** Railway or Render deployment

---

## 📁 Project Structure

```
golf-charity-platform/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── routes.js              # Main router
│   │   ├── server.js              # Server entry point
│   │   ├── config/                # Configuration files
│   │   │   ├── db.js              # Supabase client
│   │   │   ├── env.js             # Environment variables
│   │   │   ├── logger.js          # Winston logger
│   │   │   ├── cache.js           # Node-cache configuration
│   │   │   └── rateLimit.js       # Rate limiting rules
│   │   ├── features/              # Feature modules
│   │   │   ├── auth/              # Authentication
│   │   │   ├── users/             # User management
│   │   │   ├── scores/            # Golf score tracking
│   │   │   ├── charities/         # Charity management
│   │   │   ├── draws/             # Draw engine & logic
│   │   │   ├── claims/            # Prize claims
│   │   │   ├── payments/          # Payment processing
│   │   │   ├── emails/            # Email templates
│   │   │   └── admin/             # Admin features
│   │   ├── middleware/            # Express middleware
│   │   │   ├── auth.js            # Auth verification
│   │   │   ├── adminOnly.js       # Admin guard
│   │   │   ├── validate.js        # Input validation
│   │   │   ├── errorHandler.js    # Global error handling
│   │   │   └── notFound.js        # 404 handler
│   │   ├── utils/                 # Shared utilities
│   │   │   ├── ApiError.js        # Custom error class
│   │   │   ├── asyncHandler.js    # Async route wrapper
│   │   │   └── pagination.js      # Pagination helper
│   │   ├── scripts/               # Database scripts
│   │   │   └── seed.js            # Seed data
│   │   └── logs/                  # Application logs
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Root component
│   │   ├── main.jsx               # Entry point
│   │   ├── components/
│   │   │   ├── layout/            # Layout components
│   │   │   │   ├── AppShell.jsx
│   │   │   │   ├── AdminShell.jsx
│   │   │   │   ├── PublicLayout.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── shared/            # Reusable components
│   │   │       ├── ErrorBoundary.jsx
│   │   │       ├── VirtualList.jsx
│   │   │       ├── InfiniteScrollTrigger.jsx
│   │   │       ├── ConfirmModal.jsx
│   │   │       └── EmptyState.jsx
│   │   ├── features/              # Feature pages & modules
│   │   │   ├── auth/              # Login, signup
│   │   │   ├── dashboard/         # User dashboard
│   │   │   ├── scores/            # Score entry & tracking
│   │   │   ├── charities/         # Charity listings
│   │   │   ├── draws/             # Draw information
│   │   │   ├── claims/            # Prize claims
│   │   │   ├── admin/             # Admin interface
│   │   │   ├── subscribe/         # Subscription flow
│   │   │   ├── settings/          # User settings
│   │   │   ├── home/              # Homepage
│   │   │   └── [feature]Service.js
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useDebounce.js
│   │   │   └── useLocalStorage.js
│   │   ├── lib/                   # External integrations
│   │   │   ├── axios.js           # HTTP client
│   │   │   ├── queryClient.js     # TanStack Query config
│   │   │   └── supabaseClient.js
│   │   ├── router/                # React Router config
│   │   │   ├── index.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── store/                 # Zustand stores
│   │   │   ├── authStore.js
│   │   │   └── uiStore.js
│   │   ├── utils/                 # Utilities
│   │   │   ├── constants.js
│   │   │   └── formatters.js
│   │   └── assets/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── GolfCharity_Master_Prompt_v2.md  # Complete build specification
├── guide.md                         # Development guide
└── README.md                        # This file
```

---

## ✨ Key Features

### User Features
- **Score Tracking:** Track golf scores using Stableford format with rolling 5-score system
- **Monthly Draws:** Participate in lottery-style prize draws based on score matches
- **Charity Selection:** Choose a charity to support with every subscription
- **Real-time Analytics:** View personal statistics and draw history
- **Subscription Management:** Flexible monthly and yearly plans

### Admin Features
- **Draw Management:** Configure and execute monthly draws with multiple algorithm modes
- **User Management:** View user activity, subscriptions, and scores
- **Prize Administration:** Manage prize pools and track claims
- **Charity Management:** Add, feature, and manage charities
- **Analytics Dashboard:** Platform-wide statistics and reporting
- **Email Management:** Send transactional and promotional emails

### Technical Features
- **Rate Limiting:** Request throttling to prevent abuse
- **Caching:** In-memory cache for frequently accessed data
- **Security:** Helmet headers, CORS, input validation, Row-Level Security (RLS)
- **Error Handling:** Comprehensive error handling and logging
- **Performance:** Virtual scrolling, lazy loading, code splitting

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Git
- Supabase account
- Stripe account (for payments)
- Resend account (for emails)

### Environment Setup

#### Backend `.env`
```
NODE_ENV=development
PORT=5000
LOG_LEVEL=info

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

RESEND_API_KEY=your_resend_api_key

FRONTEND_URL=http://localhost:5173

JWT_SECRET=your_jwt_secret
```

#### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd golf-charity-platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Database Setup**
   - Execute SQL from `GolfCharity_Master_Prompt_v2.md` PART 4 in Supabase SQL Editor
   - Creates tables, indexes, triggers, and RLS policies

---

## 💾 Database Schema

### Core Tables
- **profiles** - Extended user information & subscriptions
- **charities** - Charity organizations
- **scores** - Golf scores (Stableford format, rolling 5-score limit)
- **draws** - Monthly draw configurations and results
- **draw_entries** - User entries in draws with match counts
- **prize_claims** - Prize claim management and tracking
- **payments** - Subscription payment records

### Key Triggers
- **enforce_score_limit** - Maintains rolling 5-score limit per user
- **increment_charity_total** - Auto-updates charity total raised on payment
- **update_updated_at** - Auto-updates timestamp on profile changes

### Row-Level Security
All tables have RLS enabled:
- Users can access their own data
- Admins have full access
- Public access to charities and published draws

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Scores
- `GET /api/scores` - Get user's scores
- `POST /api/scores` - Add new score
- `PATCH /api/scores/:id` - Update score
- `DELETE /api/scores/:id` - Delete score

### Charities
- `GET /api/charities` - List charities with pagination
- `GET /api/charities/:id` - Get charity details
- `POST /api/charities` - Create (admin only)
- `PATCH /api/charities/:id` - Update (admin only)

### Draws
- `GET /api/draws` - List draws
- `GET /api/draws/:id` - Get draw details
- `GET /api/draws/:id/preview` - Preview draw results
- `POST /api/draws` - Create draw (admin only)
- `POST /api/draws/:id/execute` - Execute draw (admin only)

### Payments
- `POST /api/payments/subscribe` - Create subscription
- `POST /api/payments/webhook` - Stripe webhook
- `GET /api/payments/history` - Payment history

### Admin
- `GET /api/admin/analytics` - Platform analytics
- `GET /api/admin/users` - User management
- `GET /api/admin/claims` - Prize claims

---

## 📊 Design System

### Color Palette
- **Background:** `#0A0A0F`
- **Surface:** Elevated card backgrounds
- **Primary:** Mint/teal accent
- **Secondary:** Muted text
- **Status:** Green (success), Amber (pending), Red (error), Gray (neutral)

### Typography
- **Display Font:** Headlines and display text
- **Body Font:** All content
- **Mono Font:** Numbers and data

### Spacing
- Base unit: 4px
- Grid: 4, 8, 12, 16, 24, 32, 48, 64px
- Max content width: 1200px
- Mobile breakpoint: 375px

### Motion
- Framer Motion for all animations
- Smooth transitions: 200ms
- No motion on non-interactive elements

---

## 🏗️ Development

### Running Locally

**Backend:**
```bash
cd backend
npm run dev        # Development with nodemon
npm start          # Production
npm run seed       # Seed database with test data
```

**Frontend:**
```bash
cd frontend
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # Production build
npm run preview    # Preview production build
```

### Code Standards

- **Backend:** Modular feature-based structure, Zod validation, async/await
- **Frontend:** Functional components with hooks, React Query for data fetching
- **No TypeScript** - JavaScript throughout (per spec)
- **Error Handling:** ApiError for backend, toast notifications for frontend
- **Logging:** Winston for backend, console + error boundary for frontend

### Testing

Run tests (backend):
```bash
npm test
npm run test:coverage
```

Run tests (frontend):
```bash
npm run test
npm run test:coverage
```

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
npm run build
# Vercel auto-deploys from git
```

### Backend (Railway/Render)
1. Connect git repository
2. Set environment variables
3. Configure build command: `npm install`
4. Configure start command: `npm start`

### Database (Supabase)
- Already deployed as managed service
- Enable backups and replication in production
- Configure custom domain

---

## 🔒 Security Features

- **Rate Limiting:** 100 req/15min on API, 10 req/15min on auth endpoints
- **CORS:** Restricted to frontend origin
- **Helmet:** HTTP security headers
- **Input Validation:** Zod schemas on all endpoints
- **Password Security:** Handled by Supabase Auth
- **Tokens:** JWT with expiration
- **Row-Level Security:** Database-level access control
- **HTTPS Only:** Required in production

---

## 📝 Environment Variables

See `.env.example` files in backend and frontend directories.

Key variables:
- `NODE_ENV` - development/production
- `SUPABASE_*` - Database credentials
- `STRIPE_*` - Payment processing
- `RESEND_API_KEY` - Email service
- `FRONTEND_URL` - CORS origin
- `JWT_SECRET` - Token signing

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit: `git commit -m "feat: description"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📚 Additional Documentation

- **[Master Build Prompt](./GolfCharity_Master_Prompt_v2.md)** - Complete build specification
- **[Development Guide](./guide.md)** - Detailed development instructions

---

## 📄 License

[Add your license here]

---

## 👥 Team

Built for recreational golfers who want to combine score tracking, monthly prize draws, and charitable giving in one modern platform.

---

## 📞 Support

For issues or questions:
1. Check the [Master Build Prompt](./GolfCharity_Master_Prompt_v2.md)
2. Review the [Development Guide](./guide.md)
3. Open an issue in the repository

---

**Last Updated:** March 2026
