/**
 * chatbotService.ts — Chatbot Service Layer
 *
 * All AI chatbot-related API operations.
 * Relies on src/services/api.ts for network requests.
 *
 * Prefixed with /api/ai
 */

import api from '../../../services/api';
import type {
    ChatMessageRequest,
    ChatResponse,
    ChatSessionResponse,
} from '../types';

// ---------------------------------------------------------------------------
// Chat Interaction
// ---------------------------------------------------------------------------

/**
 * sendChatMessage — processes a user query and returns an AI response with citations.
 * Endpoint: POST /api/ai/chat
 * Status: 201 Created
 */
export const sendChatMessage = async (
    payload: ChatMessageRequest,
): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/ai/chat', payload);
    return response.data;
};

// ---------------------------------------------------------------------------
// Session Management
// ---------------------------------------------------------------------------

/**
 * clearChatSession — clears the persistent conversation history for the user.
 * Endpoint: DELETE /api/ai/chat/session
 * Status: 200 OK
 */
export const clearChatSession = async (): Promise<ChatSessionResponse> => {
    const response = await api.delete<ChatSessionResponse>('/ai/chat/session');
    return response.data;
};
