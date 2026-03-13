/**
 * UserContext.tsx — User Profile State Management
 *
 * Responsibilities:
 * - Manage current user profile state
 * - Fetch user when authentication becomes valid
 * - Handle profile updates
 * - Provide error state and retry capability
 *
 * Depends on AuthContext for authentication state.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { fetchProfile, updateProfile as updateUserProfile } from '../api/userService';

import {
  persistUser,
  clearUser,
  getPersistedUser,
} from '../session/userSession';

import { useAuth } from '../../auth/context/AuthContext';
import { handleApiError, getErrorMessage } from '../../../utils/errorHandler';

import type { User, UpdateUserPayload } from '../types';

interface UserContextValue {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  updateUser: (updates: UpdateUserPayload) => Promise<User>;
  setUser: (user: User | null) => void;
  retryFetch: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();

  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
    setError(null);

    if (newUser) {
      persistUser(newUser);
    } else {
      clearUser();
    }
  }, []);

  const hydrateUser = useCallback(async () => {
    if (!isAuthenticated) {
      setUser(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const persisted = getPersistedUser();

      if (persisted) {
        setUserState(persisted);
      }

      const freshProfile = await fetchProfile();
      setUser(freshProfile);
    } catch (err) {
      const appError = handleApiError(err);
      const errorMessage = getErrorMessage(appError);
      setError(errorMessage);
      console.error('User hydration failed:', appError);
      setUserState(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, setUser]);

  useEffect(() => {
    hydrateUser();
  }, [hydrateUser]);

  const updateUser = useCallback(
    async (updates: UpdateUserPayload): Promise<User> => {
      try {
        const updated = await updateUserProfile(updates);
        setUser(updated);
        return updated;
      } catch (err) {
        const appError = handleApiError(err);
        const errorMessage = getErrorMessage(appError);
        setError(errorMessage);
        throw appError;
      }
    },
    [setUser]
  );

  const retryFetch = useCallback(async () => {
    await hydrateUser();
  }, [hydrateUser]);

  const value: UserContextValue = {
    user,
    isLoading,
    error,
    updateUser,
    setUser,
    retryFetch,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};