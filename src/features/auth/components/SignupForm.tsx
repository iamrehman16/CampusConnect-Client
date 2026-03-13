/**
 * SignupForm.tsx — Signup form view.
 * Purely presentational — all logic lives in useAuthForm.
 */

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';

import AppInput from '../../../components/common/AppInput';
import AppButton from '../../../components/common/AppButton';
import useAuthForm from '../hooks/useAuthForm';

interface SignupFormProps {
    onSwitchMode: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchMode }) => {
    const { values, errors, isLoading, handleChange, handleSubmit } = useAuthForm('signup');

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ color: 'text.primary', mb: 0.5 }}
            >
                Create account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Join CampusConnect and get started
            </Typography>

            {errors.general && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.general}
                </Alert>
            )}

            <Stack spacing={2.5}>
                <AppInput
                    id="signup-name"
                    label="Full Name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={handleChange}
                    errorText={errors.name}
                    autoFocus
                />

                <AppInput
                    id="signup-email"
                    label="Email address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    errorText={errors.email}
                />

                <AppInput
                    id="signup-password"
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={values.password}
                    onChange={handleChange}
                    errorText={errors.password}
                    helperText={!errors.password ? 'Minimum 8 characters' : undefined}
                />

                <AppButton
                    id="signup-submit"
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    isLoading={isLoading}
                    sx={{ mt: 1, py: 1.5 }}
                >
                    Create Account
                </AppButton>
            </Stack>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link
                        component="button"
                        type="button"
                        variant="body2"
                        color="primary"
                        onClick={onSwitchMode}
                        sx={{ fontWeight: 600 }}
                    >
                        Sign in
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default SignupForm;
