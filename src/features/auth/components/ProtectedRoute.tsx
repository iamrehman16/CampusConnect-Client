import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../../users/context/UserContext';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

/**
 * ProtectedRoute
 *
 * Ensures a user must be authenticated to access the nested routes.
 * Waits for both authentication state and user hydration to complete.
 */
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isLoading: userLoading } = useUser();

  if (authLoading || userLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;