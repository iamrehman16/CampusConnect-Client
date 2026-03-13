/**
 * ResourcePage.tsx — Resources Page
 */

import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ResourcePage: React.FC = () => {
    return (
        <Box>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                Resources
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Learning resources and materials go here.
            </Typography>
        </Box>
    );
};

export default ResourcePage;
