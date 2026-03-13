/**
 * HomePage/index.tsx — Home Page
 *
 * Landing destination after successful authentication.
 */

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import { useUser } from '../../features/users/context/UserContext';

const HomePage: React.FC = () => {
    const { user } = useUser();

    return (
        <Box>
            <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
                Welcome to CampusConnect! 👋
            </Typography>

            {user && (
                <Paper
                    sx={{
                        p: 3,
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Your Profile
                    </Typography>
                    <Typography variant="body2">
                        <strong>Name:</strong> {user.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Email:</strong> {user.email}
                    </Typography>
                    {user.role && (
                        <Typography variant="body2">
                            <strong>Role:</strong> {user.role}
                        </Typography>
                    )}
                </Paper>
            )}

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 3, fontStyle: 'italic' }}
            >
                Use the navigation bar above to explore different sections of the app.
            </Typography>
        </Box>
    );
};

export default HomePage;
