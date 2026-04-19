import type { UserRole, UserStatus } from './enums';

/**
 * User profile as returned by GET /api/users/profile.
 */
export interface User {
  _id: string;
  email: string;
  name?: string;
  role: UserRole;
  academicInfo?: string;
  expertise?: string;
  contributionScore: number;
  accountStatus: UserStatus;
  createdAt: string;
  updatedAt: string;
  semester?:number;
}

/**
 * Token pair response from /api/auth/login and /api/auth/refresh.
 */
export interface AuthTokens {
  id: string;
  accessToken: string;
  refreshToken: string;
}

/**
 * Shape of the AuthContext state.
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
