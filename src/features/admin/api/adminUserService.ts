/**
 * adminUserService.ts — Admin Domain User Service
 *
 * Dedicated service for User Management Endpoints (Admin).
 * Base Path: /admin/users
 */

import api from '../../../services/api';
import type { AdminUser, AdminCreateUserDto, ChangeUserRoleDto } from '../types';

/**
 * 1. Create User (System-wide)
 */
export const createAdminUser = async (
    payload: AdminCreateUserDto,
): Promise<AdminUser> => {
    const response = await api.post<AdminUser>('/admin/users', payload);
    return response.data;
};

/**
 * 2. List All Users
 */
export const fetchAllUsers = async (): Promise<AdminUser[]> => {
    const response = await api.get<AdminUser[]>('/admin/users');
    return response.data;
};

/**
 * 3. Get User Detail
 */
export const fetchAdminUserById = async (id: string): Promise<AdminUser> => {
    const response = await api.get<AdminUser>(`/admin/users/${id}`);
    return response.data;
};

/**
 * 4. Administrative User Update
 */
export const updateAdminUser = async (
    id: string,
    payload: Partial<AdminCreateUserDto>,
): Promise<AdminUser> => {
    const response = await api.patch<AdminUser>(`/admin/users/${id}`, payload);
    return response.data;
};

/**
 * 5. Remove User (Permanent)
 */
export const deleteAdminUser = async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
};

/**
 * 6. Change User Role
 */
export const changeUserRole = async (
    id: string,
    payload: ChangeUserRoleDto,
): Promise<AdminUser> => {
    const response = await api.patch<AdminUser>(
        `/admin/users/${id}/role`,
        payload,
    );
    return response.data;
};
