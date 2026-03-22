/**
 * EditResourceDialog.tsx — Resource Edit Form
 */

import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';

import { RESOURCE_TYPES, SEMESTERS } from '../types';
import type { Resource, ResourceType, UpdateResourcePayload } from '../types';
import { sanitizeString } from '../../../utils/sanitize';

interface EditResourceDialogProps {
    resource: Resource | null;
    open: boolean;
    onClose: () => void;
    onSubmit: (id: string, payload: UpdateResourcePayload) => Promise<void>;
}

const EditResourceDialog: React.FC<EditResourceDialogProps> = ({
    resource,
    open,
    onClose,
    onSubmit,
}) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        subject: '',
        course: '',
        semester: 1 as number,
        resourceType: '' as ResourceType,
        tags: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (resource && open) {
            setForm({
                title: resource.title,
                description: resource.description || '',
                subject: resource.subject,
                course: resource.course,
                semester: resource.semester,
                resourceType: resource.resourceType,
                tags: resource.tags.join(', '),
            });
            setError(null);
        }
    }, [resource, open]);

    const handleChange = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!resource) return;
        if (!form.title.trim() || !form.subject.trim() || !form.course.trim()) {
            setError('Please fill in all required fields.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const tagsArray = form.tags
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0)
                .map(t => sanitizeString(t));

            const payload: UpdateResourcePayload = {
                title: sanitizeString(form.title),
                description: sanitizeString(form.description),
                subject: sanitizeString(form.subject),
                course: sanitizeString(form.course),
                semester: form.semester,
                resourceType: form.resourceType,
                tags: tagsArray,
            };

            await onSubmit(resource._id, payload);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Update failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Edit Resource
                <IconButton onClick={onClose} disabled={loading} size="small"><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                    <TextField 
                        label="Title" 
                        value={form.title} 
                        onChange={(e) => handleChange('title', e.target.value)} 
                        required 
                        fullWidth 
                    />
                    <TextField 
                        label="Description" 
                        value={form.description} 
                        onChange={(e) => handleChange('description', e.target.value)} 
                        multiline 
                        rows={3} 
                        fullWidth 
                    />
                    <TextField 
                        label="Subject" 
                        value={form.subject} 
                        onChange={(e) => handleChange('subject', e.target.value)} 
                        required 
                        fullWidth 
                    />
                    <TextField 
                        label="Course" 
                        value={form.course} 
                        onChange={(e) => handleChange('course', e.target.value)} 
                        required 
                        fullWidth 
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            select
                            label="Semester"
                            value={form.semester}
                            onChange={(e) => handleChange('semester', Number(e.target.value))}
                            required
                            sx={{ flex: 1 }}
                        >
                            {SEMESTERS.map((s) => (
                                <MenuItem key={s} value={s}>Semester {s}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Type"
                            value={form.resourceType}
                            onChange={(e) => handleChange('resourceType', e.target.value as ResourceType)}
                            required
                            sx={{ flex: 1 }}
                        >
                            {RESOURCE_TYPES.map((t) => (
                                <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <TextField 
                        label="Tags (comma separated)" 
                        value={form.tags} 
                        onChange={(e) => handleChange('tags', e.target.value)} 
                        fullWidth 
                        helperText="Calculus, Midterm, 2024"
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={handleSubmit} 
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditResourceDialog;
