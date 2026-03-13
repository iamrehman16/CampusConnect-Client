/**
 * userService.ts — User Service Layer
 *
 * Handles all user-related API operations.
 * Relies on src/services/api.ts for actual network requests.
 * Session storage is handled internally via userSession.ts
 */

import api from '../../../services/api';
import { updatePersistedUser } from '../session/userSession';
import type { User, UpdateUserPayload } from '../types';

// ---------------------------------------------------------------------------
// User service functions
// ---------------------------------------------------------------------------

/**
 * fetchProfile
 * Fetches current authenticated user profile.
 */
export const fetchProfile = async (): Promise<User> => {
    const response = await api.get<User>('/users/profile');
    return response.data;
};

/**
 * updateProfile
 * Updates current authenticated user profile and persists to session.
 */
export const updateProfile = async (updates: UpdateUserPayload): Promise<User> => {
    const response = await api.patch<User>('/users/profile', updates);
    updatePersistedUser(response.data);
    return response.data;
};

/**
 * getUserById
 * Fetches a specific user by ID.
 */
export const getUserById = async (userId: string): Promise<User> => {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
};
