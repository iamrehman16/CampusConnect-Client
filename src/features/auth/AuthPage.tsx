/**
 * AuthPage.tsx — Unified Authentication Page
 *
 * Hosts both Login and Signup flows in a single centered layout.
 * Switches between modes via local state (no route change needed for the toggle).
 */

import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';

import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import type { AuthMode } from './types';

const AuthPage: React.FC = () => {
    const [mode, setMode] = useState<AuthMode>('login');

    const switchToLogin = () => setMode('login');
    const switchToSignup = () => setMode('signup');

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                py: 4,
            }}
        >
            <Container maxWidth="xs">
                {/* Brand header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                        variant="h5"
                        component="p"
                        sx={{
                            fontWeight: 700,
                            color: 'primary.main',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        CampusConnect
                    </Typography>
                </Box>

                {/* Auth card */}
                <Paper
                    elevation={0}
                    sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: { xs: 3, sm: 4 },
                    }}
                >
                    <Fade in key={mode} timeout={200}>
                        <Box>
                            {mode === 'login' ? (
                                <LoginForm onSwitchMode={switchToSignup} />
                            ) : (
                                <SignupForm onSwitchMode={switchToLogin} />
                            )}
                        </Box>
                    </Fade>
                </Paper>

                {/* Footer note */}
                <Box sx={{ mt: 3 }}>
                    <Divider />
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', textAlign: 'center', mt: 2 }}
                    >
                        By continuing, you agree to our Terms of Service &amp; Privacy Policy.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default AuthPage;
