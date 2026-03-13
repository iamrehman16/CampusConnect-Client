/**
 * EditableField.tsx — Inline Editable Field Component
 *
 * Displays a field that can be toggled between view and edit mode.
 * Handles validation and error states.
 * Uses theme tokens from MUI ThemeProvider for all styling.
 */

import React, { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import AppButton from './AppButton';

interface EditableFieldProps {
    label: string;
    value: string | undefined;
    onSave: (newValue: string) => Promise<void>;
    multiline?: boolean;
    rows?: number;
    disabled?: boolean;
    validator?: (value: string) => string | null;
}

const EditableField: React.FC<EditableFieldProps> = ({
    label,
    value = '',
    onSave,
    multiline = false,
    rows = 1,
    disabled = false,
    validator,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sync external value changes
    useEffect(() => {
        setEditValue(value || '');
    }, [value]);

    const handleEdit = useCallback(() => {
        if (!disabled) {
            setIsEditing(true);
            setError(null);
        }
    }, [disabled]);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        setEditValue(value || '');
        setError(null);
    }, [value]);

    const handleSave = useCallback(async () => {
        // Validate if validator provided
        if (validator) {
            const validationError = validator(editValue);
            if (validationError) {
                setError(validationError);
                return;
            }
        }

        // Check if value actually changed
        if (editValue === value) {
            setIsEditing(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await onSave(editValue);
            setIsEditing(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save changes';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [editValue, value, onSave, validator]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !multiline) {
                handleSave();
            } else if (e.key === 'Escape') {
                handleCancel();
            }
        },
        [handleSave, handleCancel, multiline]
    );

    if (isEditing) {
        return (
            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    label={label}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    multiline={multiline}
                    rows={rows}
                    disabled={isLoading}
                    error={!!error}
                    helperText={error}
                    size="small"
                    autoFocus
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'background.paper',
                        },
                    }}
                />
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <AppButton
                        onClick={handleSave}
                        disabled={isLoading}
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ minWidth: '80px' }}
                    >
                        {isLoading && <CircularProgress size={16} color="inherit" sx={{ mr: 0.5 }} />}
                        Save
                    </AppButton>
                    <AppButton
                        onClick={handleCancel}
                        disabled={isLoading}
                        variant="outlined"
                        color="inherit"
                        size="small"
                        sx={{ minWidth: '80px' }}
                    >
                        Cancel
                    </AppButton>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                mb: 1,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                '&:hover': {
                    bgcolor: disabled ? 'background.paper' : 'action.hover',
                },
            }}
        >
            <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    {label}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        wordBreak: 'break-word',
                        color: value ? 'text.primary' : 'text.secondary',
                        fontStyle: value ? 'normal' : 'italic',
                    }}
                >
                    {value || 'Not set'}
                </Typography>
            </Box>
            {!disabled && (
                <IconButton
                    size="small"
                    onClick={handleEdit}
                    sx={{
                        ml: 1,
                        color: 'primary.main',
                    }}
                    title="Edit"
                >
                    ✏️
                </IconButton>
            )}
        </Box>
    );
};

export default EditableField;
