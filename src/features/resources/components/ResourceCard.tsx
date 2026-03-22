/**
 * ResourceCard.tsx — Single Resource Display Card
 *
 * Mobile-first card component for displaying resource info.
 * Touch-friendly with 48px minimum tap targets.
 *
 * Optional `onEdit` callback renders a kebab/edit icon.
 * This keeps the card reusable across resource page (read-only)
 * and profile page (editable own resources) without duplication.
 */

import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';

import DownloadIcon from '@mui/icons-material/Download';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DescriptionIcon from '@mui/icons-material/Description';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScienceIcon from '@mui/icons-material/Science';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArticleIcon from '@mui/icons-material/Article';
import FolderIcon from '@mui/icons-material/Folder';

import type { Resource, ResourceType } from '../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const RESOURCE_ICON_MAP: Record<ResourceType, React.ElementType> = {
    Notes: DescriptionIcon,
    Slides: SlideshowIcon,
    Assignment: AssignmentIcon,
    Lab: ScienceIcon,
    PastPaper: HistoryEduIcon,
    Book: MenuBookIcon,
    ResearchPaper: ArticleIcon,
    Other: FolderIcon,
};

const capitalize = (s: string): string => {
    if (!s) return s;
    // The server values are already "PascalCase" or "Capitalized", 
    // but some might have multiple words like PastPaper or ResearchPaper
    return s.replace(/([A-Z])/g, ' $1').trim();
};

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (iso: string): string => {
    try {
        return new Date(iso).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    } catch {
        return iso;
    }
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ResourceCardProps {
    resource: Resource;
    onDownload: (id: string) => void;
    onSelect?: (resource: Resource) => void;
    /** When provided, renders a kebab/edit action on the card. */
    onEdit?: (resource: Resource) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ResourceCard: React.FC<ResourceCardProps> = ({
    resource,
    onDownload,
    onSelect,
    onEdit,
}) => {
    const TypeIcon = RESOURCE_ICON_MAP[resource.resourceType] ?? FolderIcon;

    return (
        <Card
            onClick={() => onSelect?.(resource)}
            sx={{
                cursor: onSelect ? 'pointer' : 'default',
                transition: 'box-shadow 0.2s, transform 0.15s',
                '&:hover': {
                    boxShadow: 4,
                    transform: onSelect ? 'translateY(-2px)' : 'none',
                },
                '&:active': {
                    transform: onSelect ? 'translateY(0)' : 'none',
                },
                border: 1,
                borderColor: 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <CardContent sx={{ flex: 1, pb: 1 }}>
                {/* Header: Icon + Title + optional kebab */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                    <Box
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            borderRadius: 1.5,
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <TypeIcon fontSize="small" />
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                lineHeight: 1.3,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            {resource.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {resource.course} · Semester {resource.semester}
                        </Typography>
                    </Box>

                    {/* Optional edit/kebab — only rendered when onEdit is provided */}
                    {onEdit && (
                        <Tooltip title="Edit">
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(resource);
                                }}
                                size="small"
                                sx={{ flexShrink: 0, minWidth: 40, minHeight: 40 }}
                            >
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                {/* Description (truncated) */}
                {resource.description && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}
                    >
                        {resource.description}
                    </Typography>
                )}

                {/* Tags */}
                {resource.tags.length > 0 && (
                    <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                        {resource.tags.slice(0, 3).map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 24 }}
                            />
                        ))}
                        {resource.tags.length > 3 && (
                            <Chip
                                label={`+${resource.tags.length - 3}`}
                                size="small"
                                sx={{ fontSize: '0.7rem', height: 24 }}
                            />
                        )}
                    </Stack>
                )}

                {/* Meta row */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        flexWrap: 'wrap',
                        mt: 'auto',
                    }}
                >
                    <Chip
                        label={capitalize(resource.resourceType)}
                        size="small"
                        color="primary"
                        sx={{ fontSize: '0.7rem', height: 24 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        {formatFileSize(resource.fileSize)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {formatDate(resource.createdAt)}
                    </Typography>
                </Box>
            </CardContent>

            <CardActions
                sx={{
                    px: 2,
                    pb: 1.5,
                    pt: 0,
                    justifyContent: 'space-between',
                }}
            >
                {/* Stats */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ThumbUpOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                            {resource.upvotes?.length || 0}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DownloadIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                            {resource.downloads}
                        </Typography>
                    </Box>
                </Box>

                {/* Download button — 48x48 touch target */}
                <Tooltip title="Download">
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onDownload(resource._id);
                        }}
                        color="primary"
                        sx={{ minWidth: 48, minHeight: 48 }}
                    >
                        <DownloadIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
};

export default ResourceCard;
