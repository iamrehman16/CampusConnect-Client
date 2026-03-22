/**
 * admin/types/index.ts — Admin Feature Data Shapes
 *
 * Refined based on resource-api-contract.md.
 */

// ---------------------------------------------------------------------------
// User (Admin View)
// ---------------------------------------------------------------------------

export type UserRole = 'Student' | 'Contributor' | 'Admin';
export type AccountStatus = 'Active' | 'Suspended';

export interface AdminUser {
    _id: string;
    email: string;
    name?: string;
    role: UserRole;
    academicInfo?: string;
    expertise?: string;
    contributionScore: number;
    accountStatus: AccountStatus;
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
}

export interface AdminCreateUserDto {
    email: string;
    name?: string;
    password?: string;
    role: UserRole;
    academicInfo?: string;
    expertise?: string;
    accountStatus?: AccountStatus;
}

export interface ChangeUserRoleDto {
    role: UserRole;
}

// ---------------------------------------------------------------------------
// Resource (Admin View)
// ---------------------------------------------------------------------------

export type AdminResourceType =
    | 'Notes'
    | 'Slides'
    | 'Assignment'
    | 'Lab'
    | 'PastPaper'
    | 'Book'
    | 'ResearchPaper'
    | 'Other';

export type AdminFileType = 'PDF' | 'DOC' | 'PPT' | 'IMAGE' | 'ZIP' | 'OTHER';

export type AdminApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface AdminResource {
    _id: string;
    title: string;
    description?: string;
    subject: string;
    course: string;
    semester: number;
    resourceType: AdminResourceType;
    fileType: AdminFileType;
    fileFormat: string;
    fileSize: number;
    fileUrl: string;
    uploadedBy: string; // User ID
    approvalStatus: AdminApprovalStatus;
    rejectionReason?: string;
    downloads: number;
    tags: string[];
    isDeleted?: boolean;
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
}

export interface ResourceMetadata {
    title?: string;
    description?: string;
    subject?: string;
    course?: string;
    semester?: number;
    resourceType?: AdminResourceType;
    tags?: string[];
}
