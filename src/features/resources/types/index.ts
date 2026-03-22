/**
 * types/index.ts — Resource Feature Type Definitions
 *
 * Refined based on resource-api-contract.md.
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type ResourceType =
    | 'Notes'
    | 'Slides'
    | 'Assignment'
    | 'Lab'
    | 'PastPaper'
    | 'Book'
    | 'ResearchPaper'
    | 'Other';

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export type FileType = 'PDF' | 'DOC' | 'PPT' | 'IMAGE' | 'ZIP' | 'OTHER';

export type ResourceSort = 'newest' | 'oldest' | 'popular';

// ---------------------------------------------------------------------------
// Resource Object (API Response Shape)
// ---------------------------------------------------------------------------

export interface Resource {
    _id: string;
    title: string;
    description?: string; // Made optional as per server schema
    subject: string;
    course: string;
    semester: number;
    resourceType: ResourceType;
    fileType: FileType;
    fileFormat: string;
    fileSize: number;
    fileUrl: string;
    uploadedBy: string; // User ID
    approvalStatus: ApprovalStatus;
    rejectionReason?: string;
    tags: string[];
    downloads: number;
    upvotes?: string[]; // Array of user IDs
    isDeleted?: boolean;
    createdAt: string;
    updatedAt: string;
}

// ---------------------------------------------------------------------------
// Paginated Response (Server shape)
// ---------------------------------------------------------------------------

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

// ---------------------------------------------------------------------------
// Query Params — maps to GET /resources query string
// ---------------------------------------------------------------------------

export interface ResourceQueryParams {
    search?: string;
    type?: ResourceType;
    semester?: number;
    sort?: ResourceSort;
    status?: ApprovalStatus;
    uploadedBy?: string;
    page?: number;
    limit?: number;
}

// ---------------------------------------------------------------------------
// Request Payloads
// ---------------------------------------------------------------------------

export interface CreateResourcePayload {
    file: File;
    title: string;
    description?: string;
    subject: string;
    course: string;
    semester: number;
    resourceType: ResourceType;
    tags?: string[];
}

export interface UpdateResourcePayload {
    title?: string;
    description?: string;
    subject?: string;
    course?: string;
    semester?: number;
    resourceType?: ResourceType;
    tags?: string[];
}

export interface RejectResourcePayload {
    reason: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const RESOURCE_TYPES: { value: ResourceType; label: string }[] = [
    { value: 'Notes', label: 'Notes' },
    { value: 'Slides', label: 'Lecture Slides' },
    { value: 'Assignment', label: 'Assignments' },
    { value: 'Lab', label: 'Lab Reports' },
    { value: 'PastPaper', label: 'Past Papers' },
    { value: 'Book', label: 'Books' },
    { value: 'ResearchPaper', label: 'Research Papers' },
    { value: 'Other', label: 'Other' },
];

export const RESOURCE_SORTS: { value: ResourceSort; label: string }[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'popular', label: 'Most Popular' },
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const DEFAULT_PAGE_LIMIT = 12;
