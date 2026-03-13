/**
 * ProfileSection.tsx — Profile Section Component
 *
 * Organizes profile fields into sections with headers.
 */

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

interface ProfileSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, description, children }) => {
    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {title}
                </Typography>
                {description && (
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                )}
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box>{children}</Box>
        </Box>
    );
};

export default ProfileSection;
