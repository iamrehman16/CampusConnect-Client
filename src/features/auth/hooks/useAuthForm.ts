/**
 * useAuthForm.ts — Auth Form Logic Hook
 *
 * Centralizes all form state, validation, sanitization, and submission
 * for both login and signup flows. UI components remain dumb consumers.
 */

import { useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';

import { sanitizeEmail, sanitizePassword, sanitizeString } from '../../../utils/sanitize';
import { authValidators } from '../../../utils/validators';
import { handleApiError, getErrorMessage } from '../../../utils/errorHandler';
import { useAuth } from '../context/AuthContext';
import type { AuthFormErrors, AuthMode } from '../types';

interface FormValues {
    email: string;
    password: string;
    name: string;
}

const INITIAL_VALUES: FormValues = { email: '', password: '', name: '' };
const INITIAL_ERRORS: AuthFormErrors = {};

// ---------------------------------------------------------------------------
// Field-level sanitizer dispatch
// ---------------------------------------------------------------------------
const sanitizeField = (field: keyof FormValues, value: string): string => {
    if (field === 'email') return sanitizeEmail(value);
    if (field === 'password') return sanitizePassword(value);
    return sanitizeString(value); // any other string fields (like name)
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
const useAuthForm = (mode: AuthMode) => {
    const { login, signup } = useAuth(); // Retrieve global auth functions

    const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
    const [errors, setErrors] = useState<AuthFormErrors>(INITIAL_ERRORS);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * handleChange — sanitizes input before committing to state.
     * Validation clears the field error on change for live feedback.
     */
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const field = e.target.name as keyof FormValues;
            const sanitized = sanitizeField(field, e.target.value);

            setValues((prev) => ({ ...prev, [field]: sanitized }));

            // Clear error for this field when user starts correcting it
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        },
        []
    );

    /**
     * validate — runs validators against current values.
     * Returns true if the form is valid.
     */
    const validate = useCallback((): boolean => {
        const newErrors: AuthFormErrors = {};

        const emailError = authValidators.email(values.email);
        if (emailError) newErrors.email = emailError;

        const passwordError = authValidators.password(values.password);
        if (passwordError) newErrors.password = passwordError;

        if (mode === 'signup') {
            const nameError = authValidators.name(values.name);
            if (nameError) newErrors.name = nameError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [mode, values]);

    /**
     * handleSubmit — validates, then calls the appropriate service function.
     */
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (!validate()) return;

            setIsLoading(true);
            setErrors(INITIAL_ERRORS);

            try {
                if (mode === 'login') {
                    await login({ email: values.email, password: values.password });
                } else {
                    await signup({
                        email: values.email,
                        password: values.password,
                        name: values.name,
                    });
                }
                // AuthContext updates the user, and React Router logic in PublicRoute will seamlessly sweep them to /home natively once the state propagates, preventing redirect race conditions.
            } catch (err: unknown) {
                // Use centralized error handler
                const appError = handleApiError(err);
                const message = getErrorMessage(appError);
                setErrors({ general: message });
            } finally {
                setIsLoading(false);
            }
        },
        [mode, validate, values, login, signup]
    );

    return { values, errors, isLoading, handleChange, handleSubmit };
};

export default useAuthForm;
