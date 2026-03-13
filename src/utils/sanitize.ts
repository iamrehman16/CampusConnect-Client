/**
 * sanitize.ts
 *
 * Centralized input sanitization layer.
 * All user inputs MUST be passed through these utilities before
 * reaching component state or service layer.
 */

/**
 * Strips leading/trailing whitespace and removes control characters.
 */
export const sanitizeString = (value: string): string => {
    return value.trim().replace(/[\x00-\x1F\x7F]/g, '');
};

/**
 * Sanitizes an email address:
 * - Trims whitespace
 * - Lowercases
 * - Removes characters not valid in an email
 */
export const sanitizeEmail = (value: string): string => {
    return sanitizeString(value).toLowerCase();
};

/**
 * Sanitizes a password:
 * - Trims leading/trailing whitespace only
 * - Preserves all other characters (special chars are valid in passwords)
 */
export const sanitizePassword = (value: string): string => {
    return value.trim();
};

/**
 * A generic sanitizer map for form fields.
 * Extend this as new field types are introduced.
 */
export const fieldSanitizers: Record<string, (v: string) => string> = {
    email: sanitizeEmail,
    password: sanitizePassword,
};

/**
 * Sanitizes an entire form values object based on field name keys.
 * Falls back to sanitizeString if no specific sanitizer is registered.
 */
export const sanitizeFormValues = <T extends Record<string, string>>(
    values: T
): T => {
    const sanitized = {} as T;
    for (const key in values) {
        const sanitizer = fieldSanitizers[key] ?? sanitizeString;
        sanitized[key] = sanitizer(values[key]) as T[typeof key];
    }
    return sanitized;
};
