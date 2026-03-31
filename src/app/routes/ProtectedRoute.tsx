import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { ROUTES } from '@/shared/constants/routes';
import LoadingScreen from '@/shared/components/feedback/LoadingScreen';

/**
 * Protects routes that require authentication.
 * Redirects unauthenticated users to the auth page.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen message="Checking authentication..." />;

  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.AUTH} replace />;
}
