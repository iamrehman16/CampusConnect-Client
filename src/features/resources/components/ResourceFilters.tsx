/**
 * ResourceFilters.tsx — Filter/Search Bar for Resources
 *
 * Stacks vertically on mobile, inline row on desktop.
 * All filtering is server-driven — parent owns the state,
 * this component is purely presentational.
 */

import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

import SearchIcon from '@mui/icons-material/Search';

import type { ResourceType, ResourceSort } from '../types';
import { RESOURCE_TYPES, RESOURCE_SORTS, SEMESTERS } from '../types';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ResourceFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    selectedType: ResourceType | '';
    onTypeChange: (value: ResourceType | '') => void;
    selectedSemester: number | '';
    onSemesterChange: (value: number | '') => void;
    selectedSort: ResourceSort;
    onSortChange: (value: ResourceSort) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ResourceFilters: React.FC<ResourceFiltersProps> = ({
    search,
    onSearchChange,
    selectedType,
    onTypeChange,
    selectedSemester,
    onSemesterChange,
    selectedSort,
    onSortChange,
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1.5,
                mb: 3,
            }}
        >
            {/* Search */}
            <TextField
                placeholder="Search resources…"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                size="small"
                sx={{ flex: { sm: 2 } }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Type filter */}
            <TextField
                select
                label="Type"
                value={selectedType}
                onChange={(e) =>
                    onTypeChange(e.target.value as ResourceType | '')
                }
                size="small"
                sx={{ flex: { sm: 1 }, minWidth: 130 }}
            >
                <MenuItem value="">All Types</MenuItem>
                {RESOURCE_TYPES.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                        {t.label}
                    </MenuItem>
                ))}
            </TextField>

            {/* Semester filter */}
            <TextField
                select
                label="Semester"
                value={selectedSemester}
                onChange={(e) => {
                    const v = e.target.value;
                    onSemesterChange(v === '' ? '' : Number(v));
                }}
                size="small"
                sx={{ flex: { sm: 1 }, minWidth: 120 }}
            >
                <MenuItem value="">All Semesters</MenuItem>
                {SEMESTERS.map((s) => (
                    <MenuItem key={s} value={s}>
                        Semester {s}
                    </MenuItem>
                ))}
            </TextField>

            {/* Sort */}
            <TextField
                select
                label="Sort"
                value={selectedSort}
                onChange={(e) => onSortChange(e.target.value as ResourceSort)}
                size="small"
                sx={{ flex: { sm: 1 }, minWidth: 140 }}
            >
                {RESOURCE_SORTS.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                        {s.label}
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    );
};

export default ResourceFilters;
