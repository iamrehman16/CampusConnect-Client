/**
 * UploadResourceDialog.tsx — Resource Upload Form
 *
 * Full-screen dialog on mobile, standard dialog on desktop.
 * Follows Approach.md PWA-first pattern.
 */

import React, { useState, useCallback } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import type { TransitionProps } from '@mui/material/transitions';

import { RESOURCE_TYPES, SEMESTERS } from '../types';
import type { ResourceType } from '../types';
import { sanitizeString } from '../../../utils/sanitize';

// ---------------------------------------------------------------------------
// Slide-up transition for mobile full-screen
// ---------------------------------------------------------------------------

const SlideUpTransition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormValues {
    title: string;
    description: string;
    subject: string;
    course: string;
    semester: number | '';
    resourceType: ResourceType | '';
    tags: string;
}

interface UploadResourceDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<FormValues, 'tags'> & { file: File; tags: string[] }) => Promise<void>;
}

const INITIAL_VALUES: FormValues = {
    title: '',
    description: '',
    subject: '',
    course: '',
    semester: '',
    resourceType: '',
    tags: '',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const UploadResourceDialog: React.FC<UploadResourceDialogProps> = ({
    open,
    onClose,
    onSubmit,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [form, setForm] = useState<FormValues>(INITIAL_VALUES);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Reset state when dialog opens/closes
    const handleClose = useCallback(() => {
        if (loading) return; // Prevent closing during upload
        setForm(INITIAL_VALUES);
        setFile(null);
        setError(null);
        onClose();
    }, [loading, onClose]);

    const handleChange = (field: keyof FormValues, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;
        setFile(selected);
    };

    const validate = (): string | null => {
        if (!file) return 'Please select a file to upload.';
        if (!form.title.trim()) return 'Title is required.';
        if (form.title.length > 200) return 'Title must be 200 characters or less.';
        if (form.description.length > 2000) return 'Description must be 2000 characters or less.';
        if (!form.subject.trim()) return 'Subject is required.';
        if (!form.course.trim()) return 'Course is required.';
        if (!form.semester) return 'Semester is required.';
        if (!form.resourceType) return 'Resource type is required.';
        return null;
    };

    const handleSubmit = async () => {
        setError(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const tagsArray = form.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0)
                .map((tag) => sanitizeString(tag));

            await onSubmit({
                ...form,
                title: sanitizeString(form.title),
                description: sanitizeString(form.description),
                subject: sanitizeString(form.subject),
                course: sanitizeString(form.course),
                tags: tagsArray,
                semester: form.semester === '' ? 1 : form.semester,
                file: file!,
            });
            handleClose();
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : 'Upload failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen={isMobile}
            fullWidth
            maxWidth="sm"
            TransitionComponent={isMobile ? SlideUpTransition : undefined}
        >
            {/* Title */}
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                Upload Resource
                <IconButton
                    onClick={handleClose}
                    disabled={loading}
                    sx={{ minWidth: 48, minHeight: 48 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        pt: 1,
                    }}
                >
                    {/* File input */}
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        sx={{ py: 1.5, textTransform: 'none' }}
                    >
                        {file ? file.name : 'Choose File'}
                        <input
                            type="file"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                    {file && (
                        <Typography variant="caption" color="text.secondary">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </Typography>
                    )}

                    <TextField
                        label="Title"
                        value={form.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        required
                        inputProps={{ maxLength: 200 }}
                    />

                    <TextField
                        label="Description"
                        value={form.description}
                        onChange={(e) =>
                            handleChange('description', e.target.value)
                        }
                        multiline
                        rows={3}
                        inputProps={{ maxLength: 2000 }}
                    />

                    <TextField
                        label="Subject"
                        value={form.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        required
                    />

                    <TextField
                        label="Course"
                        value={form.course}
                        onChange={(e) => handleChange('course', e.target.value)}
                        required
                    />

                    <TextField
                        select
                        label="Semester"
                        value={form.semester}
                        onChange={(e) =>
                            handleChange('semester', Number(e.target.value))
                        }
                        required
                    >
                        {SEMESTERS.map((s) => (
                            <MenuItem key={s} value={s}>
                                Semester {s}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Resource Type"
                        value={form.resourceType}
                        onChange={(e) =>
                            handleChange('resourceType', e.target.value as ResourceType)
                        }
                        required
                    >
                        {RESOURCE_TYPES.map((t) => (
                            <MenuItem key={t.value} value={t.value}>
                                {t.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Tags (comma-separated)"
                        value={form.tags}
                        onChange={(e) => handleChange('tags', e.target.value)}
                        helperText="e.g. calculus, midterm, 2024"
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={
                        loading ? (
                            <CircularProgress size={18} color="inherit" />
                        ) : undefined
                    }
                    sx={{ minWidth: 120 }}
                >
                    {loading ? 'Uploading…' : 'Upload'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadResourceDialog;
