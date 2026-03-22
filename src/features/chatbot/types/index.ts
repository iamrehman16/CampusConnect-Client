/**
 * chatbot/types/index.ts — Chatbot Feature Types
 *
 * This file contains TypeScript interfaces and types for the Chatbot feature,
 * as defined in the AI module API contract.
 */

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
 * Response for session management
 */
export interface ChatSessionResponse {
    /** Message confirming the action */
    message: string;
}

/**
 * Standard Error Shape (shared across the app, but kept here for contract completeness)
 */
export interface ApiError {
    /** HTTP Status Code */
    statusCode: number;
    /** Error message(s) returned by the server */
    message: string | string[];
    /** Error type/name */
    error: string;
}
