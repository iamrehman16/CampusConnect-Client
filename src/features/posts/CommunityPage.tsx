/**
 * CommunityPage.tsx — Community/Posts Page
 */

import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const CommunityPage: React.FC = () => {
    return (
        <Box>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                Community
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Community posts and discussions go here.
            </Typography>
        </Box>
    );
};

export default CommunityPage;
