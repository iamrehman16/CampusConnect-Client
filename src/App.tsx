/**
 * App.tsx — Application Root
 *
 * Responsibilities:
 * - Provide the MUI ThemeProvider (single source of truth for tokens)
 * - Provide CssBaseline for cross-browser reset
 * - Provide AuthProvider for authentication state
 * - Provide UserProvider for user profile state
 * - Define top-level routing structure
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from './theme/theme';
import AuthPage from './features/auth/AuthPage';
import HomePage from './pages/HomePage';
import MainLayout from './components/layout/main/MainLayout';
import ProfilePage from './features/users/ProfilePage';
import CommunityPage from './features/posts/CommunityPage';
import ResourcePage from './features/resources/ResourcePage';
import MessengerPage from './features/messenger/MessengerPage';
import ChatBotPage from './features/chatbot/ChatBotPage';
import AdminPage from './features/admin/AdminPage';

import { AuthProvider } from './features/auth/context/AuthContext';
import { UserProvider } from './features/users/context/UserContext';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import PublicRoute from './features/auth/components/PublicRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <UserProvider>
          <Router>
            <Routes>
              {/* Public routes (guests only) */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/signup" element={<AuthPage />} />
              </Route>

              {/* Protected routes with layout */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/resources" element={<ResourcePage />} />
                  <Route path="/messenger" element={<MessengerPage />} />
                  <Route path="/chatbot" element={<ChatBotPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Route>
              </Route>

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/home" replace />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </Router>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;