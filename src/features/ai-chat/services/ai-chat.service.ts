// services/ai-chat.service.ts
import api from "@/shared/api/axios.instance";
import type {
  ChatMessageDto,
  ChatResponseDto,
  Citation,
} from "../types/ai-chat.dto";

// SSE event shapes emitted by the backend
export type SseTokenEvent = { type: "token"; token: string };
export type SseCitationsEvent = { type: "citations"; citations: Citation[] };
export type SseDoneEvent = { type: "done" };
export type SseErrorEvent = { type: "error"; message: string };
export type SseEvent =
  | SseTokenEvent
  | SseCitationsEvent
  | SseDoneEvent
  | SseErrorEvent;

export class AiChatService {
  async sendMessage(dto: ChatMessageDto): Promise<ChatResponseDto> {
    const { data } = await api.post<ChatResponseDto>("ai/chat", dto);
    return data;
  }

  async clearSession(): Promise<void> {
    await api.delete("ai/chat/session");
  }

  async *streamMessage(
    dto: ChatMessageDto,
    signal: AbortSignal,
  ): AsyncGenerator<SseEvent> {
    const baseURL = (
      (import.meta.env.VITE_API_BASE_URL as string) ?? ""
    ).replace(/\/$/, "");
    const token = localStorage.getItem("accessToken") ?? "";

    const response = await fetch(`${baseURL}/api/ai/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
      signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(`Stream failed: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";
      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith("data:")) continue;
        const raw = line.slice(5).trim();
        try {
          yield JSON.parse(raw) as SseEvent;
        } catch {
          // malformed chunk — skip
        }
      }
    }
  }
}

export const aiChatService = new AiChatService();
