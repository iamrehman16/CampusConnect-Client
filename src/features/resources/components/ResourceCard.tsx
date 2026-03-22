/**
 * ResourceCard.tsx — Single Resource Display Card
 *
 * Mobile-first card component for displaying resource info.
 * Includes a kebab menu for contributors to Edit/Delete their own resources.
 */

import React, { useState } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
    return s.replace(/([A-Z])/g, ' $1').trim();
};

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

// ---------------------------------------------------------------------------

interface ResourceCardProps {
    resource: Resource;
    onDownload: (id: string) => void;
    onSelect?: (resource: Resource) => void;
    onEdit?: (resource: Resource) => void;
    onDelete?: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ResourceCard: React.FC<ResourceCardProps> = ({
    resource,
    onDownload,
    onSelect,
    onEdit,
    onDelete,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event?: any) => {
        if (event) event.stopPropagation();
        setAnchorEl(null);
    };

    const handleEdit = (event: React.MouseEvent) => {
        event.stopPropagation();
        handleMenuClose();
        onEdit?.(resource);
    };

    const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        handleMenuClose();
        onDelete?.(resource._id);
    };

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
                border: 1,
                borderColor: 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}
        >
            <CardContent sx={{ flex: 1, pb: 1 }}>
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
                            {resource.course} · Sem {resource.semester}
                        </Typography>
                    </Box>

                    {(onEdit || onDelete) && (
                        <Box>
                            <IconButton
                                aria-label="settings"
                                aria-controls={open ? 'resource-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleMenuClick}
                                size="small"
                                sx={{ flexShrink: 0 }}
                            >
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                            <Menu
                                id="resource-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleMenuClose}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                {onEdit && (
                                    <MenuItem onClick={handleEdit}>
                                        <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText>Edit</ListItemText>
                                    </MenuItem>
                                )}
                                {onDelete && (
                                    <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                                        <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                                        <ListItemText>Delete</ListItemText>
                                    </MenuItem>
                                )}
                            </Menu>
                        </Box>
                    )}
                </Box>

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
                            fontSize: '0.85rem'
                        }}
                    >
                        {resource.description}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 'auto' }}>
                    <Chip
                        label={capitalize(resource.resourceType)}
                        size="small"
                        color="primary"
                        sx={{ fontSize: '0.7rem', height: 22 }}
                    />
                    <Chip
                        label={resource.approvalStatus}
                        size="small"
                        variant="outlined"
                        color={
                            resource.approvalStatus === 'Approved' ? 'success' : 
                            resource.approvalStatus === 'Rejected' ? 'error' : 'warning'
                        }
                        sx={{ fontSize: '0.7rem', height: 22 }}
                    />
                </Box>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 1.5, pt: 0, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ThumbUpOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">{resource.upvotes?.length || 0}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DownloadIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">{resource.downloads}</Typography>
                    </Box>
                </Box>

                <Tooltip title="Download">
                    <IconButton
                        onClick={(e) => { e.stopPropagation(); onDownload(resource._id); }}
                        color="primary"
                        size="small"
                        sx={{ minWidth: 40, minHeight: 40 }}
                    >
                        <DownloadIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
};

export default ResourceCard;
