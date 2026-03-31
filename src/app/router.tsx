import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import ProtectedRoute from '@/app/routes/ProtectedRoute';
import PublicRoute from '@/app/routes/PublicRoute';
import RoleRoute from '@/app/routes/RoleRoute';
import AppLayout from '@/shared/components/layout/AppLayout';
import LoadingScreen from '@/shared/components/feedback/LoadingScreen';
import { UserRole } from '@/shared/types/enums';

// ── Eager-loaded (first paint) ──────────────────────────────────────
import AuthPage from '@/features/auth/pages/AuthPage';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';

// ── Lazy-loaded (code-split) ────────────────────────────────────────
const ResourceListPage = lazy(() => import('@/features/resources/pages/ResourceListPage'));
const ResourceDetailPage = lazy(() => import('@/features/resources/pages/ResourceDetailPage'));
const AiChatPage = lazy(() => import('@/features/ai-chat/pages/AiChatPage'));
const ChatPage = lazy(() => import('@/features/chat/pages/ChatPage'));
const CommunityPage = lazy(() => import('@/features/community/pages/CommunityPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));

// Admin pages — completely isolated bundle
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('@/features/admin/pages/AdminUsersPage'));
const AdminResourcesPage = lazy(() => import('@/features/admin/pages/AdminResourcesPage'));

/**
 * Wraps a lazy component with Suspense fallback.
 */
function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}

/**
 * Application route definitions.
 */
const router = createBrowserRouter([
  // ── Public routes (redirect if already authenticated) ─────────
  {
    element: <PublicRoute />,
    children: [
      {
        path: ROUTES.AUTH,
        element: <AuthPage />,
      },
    ],
  },

  // ── Protected routes (require authentication) ─────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // Dashboard (home)
          {
            path: ROUTES.HOME,
            element: <DashboardPage />,
          },

          // Resources
          {
            path: ROUTES.RESOURCES,
            element: (
              <SuspenseWrapper>
                <ResourceListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: ROUTES.RESOURCE_DETAIL,
            element: (
              <SuspenseWrapper>
                <ResourceDetailPage />
              </SuspenseWrapper>
            ),
          },

          // AI Chat
          {
            path: ROUTES.AI_CHAT,
            element: (
              <SuspenseWrapper>
                <AiChatPage />
              </SuspenseWrapper>
            ),
          },

          // Real-time Chat
          {
            path: ROUTES.CHAT,
            element: (
              <SuspenseWrapper>
                <ChatPage />
              </SuspenseWrapper>
            ),
          },

          // Community
          {
            path: ROUTES.COMMUNITY,
            element: (
              <SuspenseWrapper>
                <CommunityPage />
              </SuspenseWrapper>
            ),
          },

          // Profile
          {
            path: ROUTES.PROFILE,
            element: (
              <SuspenseWrapper>
                <ProfilePage />
              </SuspenseWrapper>
            ),
          },

          // ── Admin routes (role-gated) ─────────────────────────
          {
            element: <RoleRoute allowedRoles={[UserRole.ADMIN]} />,
            children: [
              {
                path: ROUTES.ADMIN,
                element: (
                  <SuspenseWrapper>
                    <AdminDashboardPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: ROUTES.ADMIN_USERS,
                element: (
                  <SuspenseWrapper>
                    <AdminUsersPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: ROUTES.ADMIN_RESOURCES,
                element: (
                  <SuspenseWrapper>
                    <AdminResourcesPage />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
        ],
      },
    ],
  },

  // ── Catch-all redirect ────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to={ROUTES.HOME} replace />,
  },
]);

export default router;
