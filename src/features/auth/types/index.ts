/**
 * types.ts — Auth Feature Type Definitions
 */

import type { User } from '../../users/types';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignupPayload {
    email: string;
    password: string;
    name?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface AuthFormErrors {
    email?: string;
    password?: string;
    name?: string;
    general?: string;
}

export type AuthMode = 'login' | 'signup';

// Re-export User type for convenience
export type { User };
