/**
 * ResourceDetailDialog.tsx — Resource Detail View
 *
 * Full-screen on mobile, standard dialog on desktop.
 * Shows all resource metadata, description, and actions.
 */

import React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StorageIcon from '@mui/icons-material/Storage';

import type { TransitionProps } from '@mui/material/transitions';
import type { Resource } from '../types';

// ---------------------------------------------------------------------------
// Transition
// ---------------------------------------------------------------------------

const SlideUpTransition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const capitalize = (s: string): string => {
    if (!s) return s;
    return s.replace(/([A-Z])/g, ' $1').trim();
};

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ResourceDetailDialogProps {
    resource: Resource | null;
    open: boolean;
    onClose: () => void;
    onDownload: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ResourceDetailDialog: React.FC<ResourceDetailDialogProps> = ({
    resource,
    open,
    onClose,
    onDownload,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (!resource) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={isMobile}
            fullWidth
            maxWidth="sm"
            TransitionComponent={isMobile ? SlideUpTransition : undefined}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pr: 1,
                }}
            >
                <Typography
                    variant="h6"
                    component="span"
                    sx={{
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mr: 1,
                    }}
                >
                    {resource.title}
                </Typography>
                <IconButton onClick={onClose} sx={{ minWidth: 48, minHeight: 48 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {/* Status chips */}
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip label={capitalize(resource.resourceType)} color="primary" size="small" />
                    <Chip label={resource.fileType.toUpperCase()} variant="outlined" size="small" />
                    <Chip
                        label={capitalize(resource.approvalStatus)}
                        size="small"
                        color={
                            resource.approvalStatus === 'Approved'
                                ? 'success'
                                : resource.approvalStatus === 'Rejected'
                                  ? 'error'
                                  : 'warning'
                        }
                    />
                </Stack>

                {/* Description */}
                {resource.description && (
                    <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.7 }}>
                        {resource.description}
                    </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Details grid */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 2,
                    }}
                >
                    <DetailItem label="Subject" value={resource.subject} />
                    <DetailItem label="Course" value={resource.course} />
                    <DetailItem label="Semester" value={`Semester ${resource.semester}`} />
                    <DetailItem label="File Format" value={resource.fileFormat} />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Stats row */}
                <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <StorageIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {formatFileSize(resource.fileSize)}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <ThumbUpOutlinedIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {resource.upvotes?.length || 0} upvotes
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <DownloadIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {resource.downloads} downloads
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <CalendarTodayIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(resource.createdAt)}
                        </Typography>
                    </Box>
                </Stack>

                {/* Tags */}
                {resource.tags.length > 0 && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Tags
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                            {resource.tags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    size="small"
                                    variant="outlined"
                                />
                            ))}
                        </Stack>
                    </>
                )}

                {/* Rejection reason */}
                {resource.approvalStatus === 'Rejected' && resource.rejectionReason && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" color="error" sx={{ mb: 0.5 }}>
                            Rejection Reason
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {resource.rejectionReason}
                        </Typography>
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose}>Close</Button>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => onDownload(resource._id)}
                    sx={{ minWidth: 120 }}
                >
                    Download
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// ---------------------------------------------------------------------------
// Sub-component
// ---------------------------------------------------------------------------

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <Box>
        <Typography variant="caption" color="text.secondary">
            {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {value}
        </Typography>
    </Box>
);

export default ResourceDetailDialog;
