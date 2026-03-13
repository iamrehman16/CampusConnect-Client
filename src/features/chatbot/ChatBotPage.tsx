/**
 * ChatBotPage.tsx — ChatBot Page
 */

import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ChatBotPage: React.FC = () => {
    return (
        <Box>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                ChatBot
            </Typography>
            <Typography variant="body1" color="text.secondary">
                AI ChatBot assistance goes here.
            </Typography>
        </Box>
    );
};

export default ChatBotPage;
