/**
 * validators.ts
 *
 * Pure validation functions. No side effects.
 * Returns an error string on failure, or null if valid.
 */

export const validateEmail = (value: string): string | null => {
    if (!value) return 'Email is required.';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) return 'Enter a valid email address.';
    return null;
};

export const validatePassword = (value: string): string | null => {
    if (!value) return 'Password is required.';
    if (value.length < 8) return 'Password must be at least 8 characters.';
    return null;
};

export const validateName = (value: string): string | null => {
    if (!value) return 'Name is required.';
    if (value.trim().length < 2) return 'Name must be at least 2 characters.';
    return null;
};

export type FieldValidator = (value: string) => string | null;

export const authValidators: Record<string, FieldValidator> = {
    email: validateEmail,
    password: validatePassword,
    name: validateName,
};
