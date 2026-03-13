/**
 * userSession.ts — User Session Storage Layer
 *
 * Handles all localStorage operations for user data.
 * Decoupled from API and UI layers.
 */

import type { User } from '../types';

const STORAGE_KEYS = {
    USER: 'user',
} as const;

/**
 * persistUser
 * Saves user data to localStorage.
 */
export const persistUser = (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * getPersistedUser
 * Reads user from localStorage.
 */
export const getPersistedUser = (): User | null => {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

/**
 * updatePersistedUser
 * Updates the user data in localStorage.
 */
export const updatePersistedUser = (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * clearUser
 * Removes user data from localStorage.
 */
export const clearUser = (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
};
