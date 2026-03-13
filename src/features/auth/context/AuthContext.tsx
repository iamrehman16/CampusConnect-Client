/**
 * AuthContext.tsx — Authentication State Management
 *
 * Responsibilities:
 * - Manage authentication state only
 * - Handle login / signup / logout
 * - Expose isAuthenticated for other contexts (like UserContext)
 *
 * User profile data is managed separately by UserContext.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  loginUser,
  signupUser,
  logoutUser as apiLogoutUser,
  checkIsAuthenticated,
} from '../api/authService';

import type { LoginPayload, SignupPayload } from '../types';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initAuth = useCallback(() => {
    try {
      const sessionExists = checkIsAuthenticated();
      setIsAuthenticated(sessionExists);
    } catch (err) {
      console.error('Auth initialization failed:', err);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (payload: LoginPayload) => {
    await loginUser(payload);
    setIsAuthenticated(true);
  };

  const signup = async (payload: SignupPayload) => {
    await signupUser(payload);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await apiLogoutUser();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsAuthenticated(false);
    }
  };

  const value: AuthContextValue = {
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};