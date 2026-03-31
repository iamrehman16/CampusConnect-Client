import { useMutation } from '@tanstack/react-query';
import authService from '../services/auth.service';
import type { RegisterRequest } from '../types/auth.dto';

/**
 * TanStack mutation hook for the register flow.
 * On success: the caller should switch to the login tab.
 */
export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
  });
}
