# AI Module - Service Layer API Contract

This document defines the service-level interface for the AI module. All endpoints are prefixed with `/api/ai`.

---

## 1. Data Models (TypeScript)

```typescript
/**
 * Request body for sending a chat message
 */
export interface ChatMessageRequest {
  /** The message text to send to the AI */
  message: string;
}

/**
 * Individual citation pointing to source material
 */
export interface Citation {
  /** Title of the resource */
  title: string;
  /** Page number where the context was found */
  pageNumber: number;
  /** Semester the resource belongs to */
  semester: number;
  /** Course code or name */
  course: string;
  /** ID of the resource for navigation/linking */
  resourceId: string;
}

/**
 * AI response including the generated answer and source citations
 */
export interface ChatResponse {
  /** Markdown formatted string containing the AI's answer */
  answer: string;
  /** List of source materials used to generate the answer */
  citations: Citation[];
}

/**
 * Standard Error Shape
 */
export interface ApiError {
  /** HTTP Status Code */
  statusCode: number;
  /** Error message(s) returned by the server */
  message: string | string[];
  /** Error type/name */
  error: string;
}
```

---

## 2. API Endpoints

### A. Chat Interaction
Processes a user query and returns an AI-generated response with citations.

- **Method:** `POST`
- **Path:** `/api/ai/chat`
- **Request Body:** `ChatMessageRequest`
- **Success Response:** 
  - Status: `201 Created`
  - Body: `ChatResponse`
- **Error Responses:**
  - `400 Bad Request`: Validation failure (e.g., empty message).
  - `500 Internal Server Error`: AI service or retrieval failure.

### B. Session Management
Clears the persistent conversation history for the authenticated user.

- **Method:** `DELETE`
- **Path:** `/api/ai/chat/session`
- **Success Response:** 
  - Status: `200 OK`
  - Body: `{ "message": "string" }`
- **Error Responses:**
  - `500 Internal Server Error`: Database operation failure.
