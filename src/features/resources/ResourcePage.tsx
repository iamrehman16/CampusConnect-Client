/**
 * ResourcePage.tsx — Resources Hub
 *
 * Server-driven pagination, search, filtering, and sorting.
 * Mobile-first: FAB for upload, responsive grid, full-screen dialogs.
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import AddIcon from '@mui/icons-material/Add';

import ResourceCard from './components/ResourceCard';
import ResourceFilters from './components/ResourceFilters';
import UploadResourceDialog from './components/UploadResourceDialog';
import ResourceDetailDialog from './components/ResourceDetailDialog';

import {
    fetchResources,
    createResource,
    downloadResource,
} from './api/resourceService';

import { useDebounce } from '../../hooks/useDebounce';
import { handleApiError, getErrorMessage } from '../../utils/errorHandler';
import type {
    Resource,
    ResourceType,
    ResourceSort,
    CreateResourcePayload,
} from './types';
import { DEFAULT_PAGE_LIMIT } from './types';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ResourcePage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Data
    const [resources, setResources] = useState<Resource[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters (controlled by user, sent to server)
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState<ResourceType | ''>('');
    const [selectedSemester, setSelectedSemester] = useState<number | ''>('');
    const [selectedSort, setSelectedSort] = useState<ResourceSort>('newest');
    const [page, setPage] = useState(1);

    // Debounce search so we don't fire on every keystroke
    const debouncedSearch = useDebounce(search, 400);

    // Dialogs
    const [uploadOpen, setUploadOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

    // Track if initial load has happened to avoid double-fetch
    const initialLoadDone = useRef(false);

    // -------------------------------------------------------------------
    // Fetch
    // -------------------------------------------------------------------

    const loadResources = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchResources({
                search: debouncedSearch || undefined,
                type: selectedType || undefined,
                semester: selectedSemester || undefined,
                sort: selectedSort,
                page,
                limit: DEFAULT_PAGE_LIMIT,
            });
            setResources(result.data);
            setTotal(result.total);
        } catch (err) {
            const appError = handleApiError(err);
            setError(getErrorMessage(appError));
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, selectedType, selectedSemester, selectedSort, page]);

    // Fetch when filters/page change
    useEffect(() => {
        loadResources();
        initialLoadDone.current = true;
    }, [loadResources]);

    // Reset to page 1 when filters change (not on initial load)
    useEffect(() => {
        if (initialLoadDone.current) {
            setPage(1);
        }
    }, [debouncedSearch, selectedType, selectedSemester, selectedSort]);

    // -------------------------------------------------------------------
    // Handlers
    // -------------------------------------------------------------------

    const handleDownload = useCallback((id: string) => {
        downloadResource(id);
    }, []);

    const handleUploadSubmit = useCallback(
        async (data: {
            title: string;
            description: string;
            subject: string;
            course: string;
            semester: number;
            resourceType: ResourceType;
            tags: string[];
            file: File;
        }) => {
            const payload: CreateResourcePayload = {
                file: data.file,
                title: data.title,
                subject: data.subject,
                course: data.course,
                semester: data.semester,
                resourceType: data.resourceType,
                description: data.description || undefined,
                tags: data.tags.length > 0 ? data.tags : undefined,
            };

            try {
                await createResource(payload);
                // Refresh the current page to show the new resource
                await loadResources();
            } catch (err) {
                const appError = handleApiError(err);
                throw new Error(getErrorMessage(appError));
            }
        },
        [loadResources],
    );

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        // Scroll to top on page change for mobile UX
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // -------------------------------------------------------------------
    // Derived
    // -------------------------------------------------------------------

    const totalPages = Math.ceil(total / DEFAULT_PAGE_LIMIT);
    const hasFilters = !!(debouncedSearch || selectedType || selectedSemester);

    // -------------------------------------------------------------------
    // Render helpers
    // -------------------------------------------------------------------

    const renderSkeletons = () => (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                },
                gap: 2,
            }}
        >
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="rounded"
                    height={220}
                    sx={{ borderRadius: 2 }}
                />
            ))}
        </Box>
    );

    const renderEmptyState = () => (
        <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No resources found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {hasFilters
                    ? 'Try adjusting your filters.'
                    : 'Be the first to upload a resource!'}
            </Typography>
            {!hasFilters && (
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setUploadOpen(true)}
                >
                    Upload Resource
                </Button>
            )}
        </Box>
    );

    // -------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------

    return (
        <Box>
            {/* Page header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                }}
            >
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                    Resources
                </Typography>

                {/* Desktop upload button */}
                {!isMobile && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setUploadOpen(true)}
                    >
                        Upload
                    </Button>
                )}
            </Box>

            {/* Filters */}
            <ResourceFilters
                search={search}
                onSearchChange={setSearch}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                selectedSemester={selectedSemester}
                onSemesterChange={setSelectedSemester}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
            />

            {/* Error */}
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        <Button color="inherit" size="small" onClick={loadResources}>
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            {/* Content */}
            {isLoading ? (
                renderSkeletons()
            ) : resources.length === 0 ? (
                renderEmptyState()
            ) : (
                <>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                            },
                            gap: 2,
                        }}
                    >
                        {resources.map((resource) => (
                            <ResourceCard
                                key={resource._id}
                                resource={resource}
                                onDownload={handleDownload}
                                onSelect={setSelectedResource}
                            />
                        ))}
                    </Box>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 4,
                                mb: isMobile ? 2 : 0,
                            }}
                        >
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size={isMobile ? 'small' : 'medium'}
                                siblingCount={isMobile ? 0 : 1}
                            />
                        </Box>
                    )}
                </>
            )}

            {/* Mobile FAB */}
            {isMobile && (
                <Fab
                    color="primary"
                    aria-label="Upload resource"
                    onClick={() => setUploadOpen(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 76,
                        right: 16,
                        width: 56,
                        height: 56,
                    }}
                >
                    <AddIcon />
                </Fab>
            )}

            {/* Upload Dialog */}
            <UploadResourceDialog
                open={uploadOpen}
                onClose={() => setUploadOpen(false)}
                onSubmit={handleUploadSubmit}
            />

            {/* Detail Dialog */}
            <ResourceDetailDialog
                resource={selectedResource}
                open={!!selectedResource}
                onClose={() => setSelectedResource(null)}
                onDownload={handleDownload}
            />
        </Box>
    );
};

export default ResourcePage;
