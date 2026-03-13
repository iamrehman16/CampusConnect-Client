/**
 * authService.ts — Auth Service Layer
 *
 * Abstracts all auth network/logic from the UI layer.
 * Relies on src/services/api.ts for actual network requests.
 * Session storage is handled internally via authSession.ts
 */

import api from '../../../services/api';
import { persistTokens, clearTokens, isAuthenticated } from '../session/authSession';
import { clearUser, persistUser } from '../../users/session/userSession';
import type { LoginPayload, SignupPayload, AuthResponse } from '../types';

// ---------------------------------------------------------------------------
// Auth service functions
// ---------------------------------------------------------------------------

/**
 * loginUser
 * Authenticates user credentials via backend API and persists session.
 */
export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', payload);
    const { accessToken, refreshToken, user } = response.data;
    persistTokens(accessToken, refreshToken);
    persistUser(user);
    return response.data;
};

/**
 * signupUser
 * Registers a new user via backend API and persists session.
 */
export const signupUser = async (payload: SignupPayload): Promise<AuthResponse> => {
    const { name, email, password } = payload;
    const body = name ? { name, email, password } : { email, password };
    const response = await api.post<AuthResponse>('/auth/register', body);
    const { accessToken, refreshToken, user } = response.data;
    persistTokens(accessToken, refreshToken);
    persistUser(user);
    return response.data;
};

/**
 * logoutUser
 * Clears persisted session and logs out on backend.
 */
export const logoutUser = async (): Promise<void> => {
    try {
        await api.post('/auth/signout');
    } catch (err) {
        console.error('Logout failed on backend:', err);
    } finally {
        clearUser();
        clearTokens();
    }
};

/**
 * checkIsAuthenticated
 * Checks if a session access token is present.
 */
export const checkIsAuthenticated = (): boolean => {
    return isAuthenticated();
};
