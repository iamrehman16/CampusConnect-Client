/**
 * Generic paginated response from the server.
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Standard API error shape from the server (NestJS).
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}
