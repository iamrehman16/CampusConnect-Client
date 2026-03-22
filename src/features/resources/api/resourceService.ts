/**
 * resourceService.ts — Resource Service Layer
 *
 * All resource-related API operations.
 * Relies on src/services/api.ts for network requests.
 *
 * Functions are grouped:
 *   Public  — fetchResources, fetchResourceById, downloadResource
 *   Auth    — createResource, updateOwnResource, fetchMyResources, deleteOwnResource
 */

import api from '../../../services/api';
import type {
    Resource,
    PaginatedResponse,
    ResourceQueryParams,
    CreateResourcePayload,
    UpdateResourcePayload,
} from '../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Builds a clean query-string object from ResourceQueryParams,
 * stripping undefined/empty values so axios doesn't send them.
 */
const buildParams = (
    params: ResourceQueryParams,
): Record<string, string | number> => {
    const out: Record<string, string | number> = {};

    if (params.search?.trim()) out.search = params.search.trim();
    if (params.type) out.type = params.type;
    if (params.semester) out.semester = params.semester;
    if (params.sort) out.sort = params.sort;
    if (params.status) out.status = params.status;
    if (params.uploadedBy) out.uploadedBy = params.uploadedBy;
    if (params.page && params.page > 1) out.page = params.page;
    if (params.limit) out.limit = params.limit;

    return out;
};

// ---------------------------------------------------------------------------
// Public
// ---------------------------------------------------------------------------

/**
 * fetchResources — paginated + filtered list.
 * Server handles search, type, semester, sort, page, limit.
 */
export const fetchResources = async (
    params: ResourceQueryParams = {},
): Promise<PaginatedResponse<Resource>> => {
    const response = await api.get<PaginatedResponse<Resource>>('/resources', {
        params: buildParams(params),
    });
    return response.data;
};

/**
 * fetchResourceById — single resource by Mongo ObjectId.
 */
export const fetchResourceById = async (id: string): Promise<Resource> => {
    const response = await api.get<Resource>(`/resources/${id}`);
    return response.data;
};

/**
 * downloadResource — opens redirect URL in a new tab.
 * The server increments the download count and 302s to Cloudinary.
 */
export const downloadResource = (id: string): void => {
    const baseUrl =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:3100/api';
    window.open(`${baseUrl}/resources/${id}/download`, '_blank');
};

// ---------------------------------------------------------------------------
// Authenticated (Contributor / Admin)
// ---------------------------------------------------------------------------

/**
 * fetchMyResources — contributors view their own uploads.
 */
export const fetchMyResources = async (
    params: ResourceQueryParams = {},
): Promise<PaginatedResponse<Resource>> => {
    const response = await api.get<PaginatedResponse<Resource>>('/resources/my', {
        params: buildParams(params),
    });
    return response.data;
};

/**
 * createResource — multipart/form-data upload.
 */
export const createResource = async (
    payload: CreateResourcePayload,
): Promise<Resource> => {
    const formData = new FormData();

    formData.append('file', payload.file);
    formData.append('title', payload.title);
    formData.append('subject', payload.subject);
    formData.append('course', payload.course);
    formData.append('semester', String(payload.semester));
    formData.append('resourceType', payload.resourceType);

    if (payload.description) {
        formData.append('description', payload.description);
    }
    if (payload.tags && payload.tags.length > 0) {
        payload.tags.forEach(tag => formData.append('tags', tag));
    }

    const response = await api.post<Resource>('/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

/**
 * updateOwnResource — contributor patches their own resource.
 */
export const updateOwnResource = async (
    id: string,
    payload: UpdateResourcePayload,
): Promise<Resource> => {
    const response = await api.patch<Resource>(`/resources/${id}/my`, payload);
    return response.data;
};

/**
 * deleteOwnResource — contributor soft-deletes their own resource.
 */
export const deleteOwnResource = async (id: string): Promise<void> => {
    await api.delete(`/resources/${id}/my`);
};
