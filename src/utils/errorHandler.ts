/**
 * errorHandler.ts — Centralized Error Handling
 *
 * Provides consistent error handling across the application.
 */

export class AppError extends Error {
    code: string;
    statusCode?: number;

    constructor(code: string, message: string, statusCode?: number) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}

/**
 * Handles API errors and converts them to AppError
 * Intelligently detects error types based on status codes and error codes
 */
export const handleApiError = (err: unknown): AppError => {
    // Handle axios errors
    if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as any;
        const statusCode = axiosErr.response?.status;
        const responseData = axiosErr.response?.data;

        // Try to get error code from response
        let code = responseData?.code || 'API_ERROR';
        let message = responseData?.message || 'An error occurred';

        // Intelligent error detection based on status code
        if (statusCode === 401) {
            // 401 Unauthorized - could be invalid credentials or expired token
            code = 'INVALID_CREDENTIALS';
            message = 'Invalid email or password';
        } else if (statusCode === 400) {
            // 400 Bad Request - validation error
            if (responseData?.code === 'EMAIL_ALREADY_EXISTS') {
                code = 'EMAIL_ALREADY_EXISTS';
                message = 'This email is already registered';
            } else if (responseData?.code === 'INVALID_EMAIL') {
                code = 'INVALID_EMAIL';
                message = 'Please enter a valid email address';
            } else if (responseData?.code === 'PASSWORD_TOO_SHORT') {
                code = 'PASSWORD_TOO_SHORT';
                message = 'Password must be at least 8 characters';
            } else if (responseData?.code === 'NAME_TOO_SHORT') {
                code = 'NAME_TOO_SHORT';
                message = 'Name must be at least 2 characters';
            }
        } else if (statusCode === 404) {
            code = 'USER_NOT_FOUND';
            message = 'User not found';
        } else if (statusCode === 500) {
            code = 'INTERNAL_SERVER_ERROR';
            message = 'Server error. Please try again later.';
        } else if (statusCode === 503) {
            code = 'SERVICE_UNAVAILABLE';
            message = 'Service is temporarily unavailable. Please try again later.';
        }

        return new AppError(code, message, statusCode);
    }

    // Handle network errors
    if (err && typeof err === 'object' && 'code' in err) {
        const networkErr = err as any;
        if (networkErr.code === 'ECONNABORTED') {
            return new AppError('TIMEOUT', 'Request timed out. Please try again.');
        }
        if (networkErr.code === 'ERR_NETWORK') {
            return new AppError('NETWORK_ERROR', 'Connection failed. Please check your internet connection.');
        }
    }

    // Handle Error objects
    if (err instanceof Error) {
        return new AppError('ERROR', err.message);
    }

    // Handle unknown errors
    return new AppError('UNKNOWN', 'An unexpected error occurred');
};

/**
 * User-friendly error messages
 * Maps error codes to user-friendly messages
 */
export const ERROR_MESSAGES: Record<string, string> = {
    // Auth errors
    'INVALID_CREDENTIALS': 'Invalid email or password',
    'EMAIL_ALREADY_EXISTS': 'This email is already registered',
    'USER_NOT_FOUND': 'User not found',
    'INVALID_TOKEN': 'Your session has expired. Please log in again.',
    'TOKEN_EXPIRED': 'Your session has expired. Please log in again.',

    // Validation errors
    'INVALID_EMAIL': 'Please enter a valid email address',
    'PASSWORD_TOO_SHORT': 'Password must be at least 8 characters',
    'NAME_TOO_SHORT': 'Name must be at least 2 characters',
    'REQUIRED_FIELD': 'This field is required',

    // Network errors
    'NETWORK_ERROR': 'Connection failed. Please check your internet connection.',
    'TIMEOUT': 'Request timed out. Please try again.',

    // Server errors
    'INTERNAL_SERVER_ERROR': 'Server error. Please try again later.',
    'SERVICE_UNAVAILABLE': 'Service is temporarily unavailable. Please try again later.',

    // Generic
    'API_ERROR': 'An error occurred. Please try again.',
    'ERROR': 'An error occurred. Please try again.',
    'UNKNOWN': 'An unexpected error occurred. Please try again.',
};

/**
 * Gets user-friendly error message
 * First checks ERROR_MESSAGES map, then falls back to error message
 */
export const getErrorMessage = (error: AppError | unknown): string => {
    if (error instanceof AppError) {
        // First try to get mapped message
        const mappedMessage = ERROR_MESSAGES[error.code];
        if (mappedMessage) {
            return mappedMessage;
        }
        // Fall back to error message if no mapping exists
        return error.message;
    }
    return ERROR_MESSAGES['UNKNOWN'];
};
