import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PageLoader from '../components/shared/PageLoader'
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Layouts
const PublicLayout = lazy(() => import('../components/layout/PublicLayout'));
const AppShell = lazy(() => import('../components/layout/AppShell'));
const AdminShell = lazy(() => import('../components/layout/AdminShell'));

// Public pages
const HomePage = lazy(() => import('../features/home/pages/HomePage'));
const CharitiesPage = lazy(() => import('../features/charities/pages/CharitiesPage'));
const CharityDetailPage = lazy(() => import('../features/charities/pages/CharityDetailPage'));
const HowItWorksPage = lazy(() => import('../features/draws/pages/HowItWorksPage'));
const SubscribePage = lazy(() => import('../features/subscribe/pages/SubscribePage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('../features/auth/pages/SignupPage'));

// Authenticated pages
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const SettingsPage = lazy(() => import('../features/settings/pages/SettingsPage'));

// Admin pages
const AdminOverviewPage = lazy(() => import('../features/admin/pages/AdminOverviewPage'));
const AdminUsersPage = lazy(() => import('../features/admin/pages/AdminUsersPage'));
const AdminDrawsPage = lazy(() => import('../features/admin/pages/AdminDrawsPage'));
const AdminCharitiesPage = lazy(() => import('../features/admin/pages/AdminCharitiesPage'));
const AdminWinnersPage = lazy(() => import('../features/admin/pages/AdminWinnersPage'));
const AdminAnalyticsPage = lazy(() => import('../features/admin/pages/AdminAnalyticsPage'));

const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicLayout />
      </Suspense>
    ),
    children: [
      { path: '/', element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense> },
      { path: '/charities', element: <Suspense fallback={<PageLoader />}><CharitiesPage /></Suspense> },
      { path: '/charities/:slug', element: <Suspense fallback={<PageLoader />}><CharityDetailPage /></Suspense> },
      { path: '/how-it-works', element: <Suspense fallback={<PageLoader />}><HowItWorksPage /></Suspense> },
      { path: '/subscribe', element: <Suspense fallback={<PageLoader />}><SubscribePage /></Suspense> },
      { path: '/login', element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: '/signup', element: <Suspense fallback={<PageLoader />}><SignupPage /></Suspense> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <AppShell />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense> },
      { path: '/settings', element: <Suspense fallback={<PageLoader />}><SettingsPage /></Suspense> },
    ],
  },
  {
    element: (
      <AdminRoute>
        <Suspense fallback={<PageLoader />}>
          <AdminShell />
        </Suspense>
      </AdminRoute>
    ),
    children: [
      { path: '/admin', element: <Suspense fallback={<PageLoader />}><AdminOverviewPage /></Suspense> },
      { path: '/admin/users', element: <Suspense fallback={<PageLoader />}><AdminUsersPage /></Suspense> },
      { path: '/admin/draws', element: <Suspense fallback={<PageLoader />}><AdminDrawsPage /></Suspense> },
      { path: '/admin/charities', element: <Suspense fallback={<PageLoader />}><AdminCharitiesPage /></Suspense> },
      { path: '/admin/winners', element: <Suspense fallback={<PageLoader />}><AdminWinnersPage /></Suspense> },
      { path: '/admin/analytics', element: <Suspense fallback={<PageLoader />}><AdminAnalyticsPage /></Suspense> },
    ],
  },
]);

const AppRouter = () => (
  <Suspense fallback={<PageLoader />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default AppRouter;