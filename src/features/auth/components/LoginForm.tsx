/**
 * LoginForm.tsx — Login form view.
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

interface LoginFormProps {
    onSwitchMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchMode }) => {
    const { values, errors, isLoading, handleChange, handleSubmit } = useAuthForm('login');

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ color: 'text.primary', mb: 0.5 }}
            >
                Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Sign in to your CampusConnect account
            </Typography>

            {errors.general && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.general}
                </Alert>
            )}

            <Stack spacing={2.5}>
                <AppInput
                    id="login-email"
                    label="Email address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    errorText={errors.email}
                    autoFocus
                />

                <AppInput
                    id="login-password"
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={values.password}
                    onChange={handleChange}
                    errorText={errors.password}
                />

                <AppButton
                    id="login-submit"
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    isLoading={isLoading}
                    sx={{ mt: 1, py: 1.5 }}
                >
                    Sign In
                </AppButton>
            </Stack>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Don&apos;t have an account?{' '}
                    <Link
                        component="button"
                        type="button"
                        variant="body2"
                        color="primary"
                        onClick={onSwitchMode}
                        sx={{ fontWeight: 600 }}
                    >
                        Create one
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default LoginForm;
