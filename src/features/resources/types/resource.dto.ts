// resource/types/resource.dto.ts
import type { ResourceType } from "@/shared/types/enums";
import type { ApprovalStatus } from "@/shared/types/enums";
import type { FileType } from "@/shared/types/enums";
import type { ResourceSort } from "@/shared/types/enums";
import type { PaginationParams } from "@/shared/types/api.types";

// ─── Nested types ─────────────────────────────────────────────────────────────

export interface ResourceAuthor {
  _id: string;
  name: string;
  email: string;
}

// ─── Core entity ──────────────────────────────────────────────────────────────

export interface Resource {
  _id: string;
  title: string;
  description?: string;
  subject: string;
  course: string;
  semester: number;
  resourceType: ResourceType;
  fileType: FileType;
  fileFormat: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: ResourceAuthor;
  approvalStatus: ApprovalStatus;
  rejectionReason?: string;
  downloads: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Create ───────────────────────────────────────────────────────────────────

// what the form collects
export interface CreateResourceForm {
  title: string;
  description?: string;
  subject: string;
  course: string;
  semester: number;
  resourceType: ResourceType;
  tags?: string[];
  file: File;
}

// what gets sent to the backend as FormData — no file field, mirrors backend DTO
export interface CreateResourceDto {
  title: string;
  description?: string;
  subject: string;
  course: string;
  semester: number;
  resourceType: ResourceType;
  tags?: string[];
}

// ─── Update ───────────────────────────────────────────────────────────────────

export interface UpdateResourceDto {
  title?: string;
  description?: string;
  subject?: string;
  course?: string;
  semester?: number;
  resourceType?: ResourceType;
  tags?: string[];
}

// ─── Admin moderation ─────────────────────────────────────────────────────────

export interface RejectResourceDto {
  reason: string;
}

// ─── Filter params ────────────────────────────────────────────────────────────

interface ResourceBaseFilterParams extends PaginationParams {
  search?: string;
  type?: ResourceType;
  semester?: number;
  sort?: ResourceSort;
  status:ApprovalStatus;
  uploadedBy:string;
}

// public — approved resources, no moderation concerns
export interface ResourceFilterParams extends ResourceBaseFilterParams {}

// admin browsing approved resources — same as public plus contributor filter
// pending resources use a dedicated endpoint with PaginationParams only
export interface AdminResourceFilterParams extends ResourceBaseFilterParams {}

// admin pending queue — dedicated endpoint needs only pagination
export interface PendingResourceParams extends PaginationParams {}
