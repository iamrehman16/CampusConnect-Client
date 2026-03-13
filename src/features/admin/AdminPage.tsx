/**
 * AdminPage.tsx — Admin Page
 */

import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const AdminPage: React.FC = () => {
    return (
        <Box>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                Admin
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Admin dashboard and controls go here.
            </Typography>
        </Box>
    );
};

export default AdminPage;
