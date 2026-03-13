/**
 * ReadOnlyField.tsx — Read-Only Field Component
 *
 * Displays a field that cannot be edited.
 * Used for critical or system-managed data.
 */

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

interface ReadOnlyFieldProps {
    label: string;
    value: string | number | undefined;
    variant?: 'text' | 'chip';
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

const ReadOnlyField: React.FC<ReadOnlyFieldProps> = ({
    label,
    value,
    variant = 'text',
    color = 'default',
}) => {
    const displayValue = value !== undefined && value !== null ? String(value) : 'N/A';

    if (variant === 'chip') {
        return (
            <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    {label}
                </Typography>
                <Chip
                    label={displayValue}
                    color={color as any}
                    variant="outlined"
                    size="small"
                />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                p: 1.5,
                mb: 1,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
            }}
        >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                {displayValue}
            </Typography>
        </Box>
    );
};

export default ReadOnlyField;
