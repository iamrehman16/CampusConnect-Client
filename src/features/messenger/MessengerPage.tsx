/**
 * MessengerPage.tsx — Messenger Page
 */

import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const MessengerPage: React.FC = () => {
    return (
        <Box>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                Messenger
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Direct messaging and conversations go here.
            </Typography>
        </Box>
    );
};

export default MessengerPage;
