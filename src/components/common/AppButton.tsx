/**
 * AppButton.tsx — Reusable button wrapper.
 * Wraps MUI Button with a loading indicator and consistent styling.
 */

import React from 'react';
import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

type AppButtonProps = ButtonProps & {
    isLoading?: boolean;
};

const AppButton: React.FC<AppButtonProps> = ({
    isLoading = false,
    disabled,
    children,
    ...rest
}) => {
    return (
        <Button
            disabled={disabled || isLoading}
            startIcon={
                isLoading ? (
                    <CircularProgress size={16} color="inherit" thickness={5} />
                ) : undefined
            }
            {...rest}
        >
            {children}
        </Button>
    );
};

export default AppButton;
