/**
 * authSession.ts — Auth Session Storage Layer
 *
 * Handles all localStorage operations for auth tokens.
 * User data persistence is delegated to userSession.ts
 * Decoupled from API and UI layers.
 */

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
} as const;

/**
 * persistTokens
 * Saves auth tokens to localStorage.
 */
export const persistTokens = (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
};

/**
 * getAccessToken
 * Retrieves the access token from localStorage.
 */
export const getAccessToken = (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * getRefreshToken
 * Retrieves the refresh token from localStorage.
 */
export const getRefreshToken = (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * isAuthenticated
 * Checks if a session access token is present.
 */
export const isAuthenticated = (): boolean => {
    return !!getAccessToken();
};

/**
 * clearTokens
 * Removes all auth tokens from localStorage.
 */
export const clearTokens = (): void => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

