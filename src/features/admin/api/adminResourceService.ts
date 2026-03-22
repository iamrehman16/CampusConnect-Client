/**
 * adminResourceService.ts — Admin Domain Resource Service
 *
 * Dedicated service for Resource Moderation Endpoints (Admin).
 * Base Path: /admin/resources
 */

import api from '../../../services/api';
import type { AdminResource, ResourceMetadata } from '../types';

/**
 * 1. Administrative Resource Update
 */
export const updateAdminResource = async (
    id: string,
    payload: Partial<ResourceMetadata>,
): Promise<AdminResource> => {
    const response = await api.patch<AdminResource>(
        `/admin/resources/${id}`,
        payload,
    );
    return response.data;
};

/**
 * 2. Moderated Deletion
 */
export const deleteAdminResource = async (
    id: string,
): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
        `/admin/resources/${id}`,
    );
    return response.data;
};

/**
 * 3. Approval Action
 */
export const approveAdminResource = async (
    id: string,
): Promise<AdminResource> => {
    const response = await api.patch<AdminResource>(
        `/admin/resources/${id}/approve`,
    );
    return response.data;
};

/**
 * 4. Rejection Action (Requires Reason)
 */
export const rejectAdminResource = async (
    id: string,
    payload: { reason: string },
): Promise<AdminResource> => {
    const response = await api.patch<AdminResource>(
        `/admin/resources/${id}/reject`,
        payload,
    );
    return response.data;
};
