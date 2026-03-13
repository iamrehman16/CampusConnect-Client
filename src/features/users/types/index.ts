/**
 * types.ts — User Feature Type Definitions
 */

export interface User {
    _id: string;
    email: string;
    name?: string;
    academicInfo?: string;
    expertise?: string;
    contributionScore?: number;
    role?: string;
    accountStatus?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateUserPayload {
    name?: string;
    academicInfo?: string;
    expertise?: string;
}
