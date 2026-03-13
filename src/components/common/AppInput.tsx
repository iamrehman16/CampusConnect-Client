/**
 * AppInput.tsx — Reusable text input wrapper.
 * Forwards all MUI TextField props + provides a consistent error display.
 */

import React from 'react';
import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';

type AppInputProps = TextFieldProps & {
    /** Error message string. If truthy, puts input into error state. */
    errorText?: string;
};

const AppInput: React.FC<AppInputProps> = ({ errorText, helperText, ...rest }) => {
    return (
        <TextField
            error={!!errorText}
            helperText={errorText ?? helperText}
            {...rest}
        />
    );
};

export default AppInput;
