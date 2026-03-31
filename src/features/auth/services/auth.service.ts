import api from '@/shared/api/axios.instance';
import type { AuthTokens } from '@/shared/types/auth.types';
import type { LoginRequest, RegisterRequest } from '../types/auth.dto';

/**
 * Auth service — the ONLY place that makes auth API calls.
 */
const authService = {
  /**
   * POST /api/auth/login
   * Returns { id, accessToken, refreshToken }
   */
  async login(data: LoginRequest): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>('/auth/login', data);
    return response.data;
  },

  /**
   * POST /api/auth/register
   * Returns the created user (we don't auto-login on register).
   */
  async register(data: RegisterRequest): Promise<void> {
    await api.post('/auth/register', data);
  },

  /**
   * POST /api/auth/signout
   * Clears the refresh token on the server.
   */
  async signout(): Promise<void> {
    await api.post('/auth/signout');
  },
};

export default authService;
