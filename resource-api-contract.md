# Resource Module - Service Layer API Contract

This document defines the service-level interface for resource management, including contributor and admin operations.

---

## 1. Data Models (TypeScript)

### Enums
```typescript
export enum ResourceType {
  NOTES = 'Notes',
  SLIDES = 'Slides',
  ASSIGNMENT = 'Assignment',
  LAB = 'Lab',
  PAST_PAPER = 'PastPaper',
  BOOK = 'Book',
  RESEARCH_PAPER = 'ResearchPaper',
  OTHER = 'Other'
}

export enum ResourceSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  POPULAR = 'popular',
}

export enum ApprovalStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export enum FileType {
  PDF = 'PDF',
  DOC = 'DOC',
  PPT = 'PPT',
  IMAGE = 'IMAGE',
  ZIP = 'ZIP',
  OTHER = 'OTHER'
}
```

### Core Interfaces
```typescript
export interface Resource {
  _id: string;
  title: string;
  description: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```

### Request DTOs
```typescript
export interface CreateResourceRequest {
  title: string;
  description?: string;
  subject: string;
  course: string;
  semester: number;
  resourceType: ResourceType;
  tags?: string[];
  /** File must be sent as multipart/form-data with field name 'file' */
  file: File; 
}

export interface UpdateResourceRequest {
  title?: string;
  description?: string;
  subject?: string;
  course?: string;
  semester?: number;
  resourceType?: ResourceType;
  tags?: string[];
}

export interface ResourceQuery {
  search?: string;
  type?: ResourceType;
  semester?: number;
  sort?: ResourceSort;
  page?: number;
  limit?: number;
}

export interface RejectResourceRequest {
  reason: string;
}
```

---

## 2. API Endpoints

### A. Public & Contributor Endpoints (`/api/resources`)

| Action | Method | Path | Request | Success Response | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Create Resource** | `POST` | `/` | `multipart/form-data` | `Resource` | Requires `ADMIN` or `CONTRIBUTOR` role. |
| **List Resources** | `GET` | `/` | Query: `ResourceQuery` | `PaginatedResponse<Resource>` | Public. |
| **Get Details** | `GET` | `/:id` | - | `Resource` | Public. |
| **Download** | `GET` | `/:id/download` | - | `302 Redirect` | Redirects to Cloudinary URL. |
| **Update Own** | `PATCH` | `/:id/my` | `UpdateResourceRequest` | `Resource` | Contributor can only update their own resources. |

### B. Admin Endpoints (`/api/admin/resources`)
*All admin endpoints require the `ADMIN` role.*

| Action | Method | Path | Request | Success Response |
| :--- | :--- | :--- | :--- | :--- |
| **Update Any** | `PATCH` | `/:id` | `UpdateResourceRequest` | `Resource` |
| **Delete** | `DELETE` | `/:id` | - | `{ "message": "string" }` |
| **Approve** | `PATCH` | `/:id/approve` | - | `Resource` |
| **Reject** | `PATCH` | `/:id/reject` | `RejectResourceRequest` | `Resource` |

---

## 3. Error Shapes

Standard NestJS error response:
```typescript
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}
```
- `400 Bad Request`: Validation failure or invalid file type.
- `403 Forbidden`: Insufficient permissions (e.g., non-contributor trying to upload).
- `404 Not Found`: Resource ID does not exist.
