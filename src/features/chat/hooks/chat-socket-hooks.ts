import { useCallback, useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { chatSocketService } from "../services/chat-socket.service";
import { useChatSocketContext } from "@/shared/hooks/useChatSocketContext";
import { chatCacheUpdaters } from "../utils/chat-cache.updaters";
import type { CreateMessageDto, DeleteMessageDto } from "../types/chat-dto";
import { useAuth } from "@/shared/hooks/useAuth";
import { chatEventHandlers } from "../utils/chatEventHandler";

const SEND_TIMEOUT_MS = 6000;

export function useChatSocket() {
  const queryClient = useQueryClient();
  const { isConnected } = useChatSocketContext();
  const { user } = useAuth();
  const currentUserId = user?._id!;
  const cache = useMemo(() => chatCacheUpdaters(queryClient), [queryClient]);

  // Tracks live timers keyed by clientId — cleared on promotion, fired on silence
  const pendingTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  // ─── Timeout helpers ───────────────────────────────────────────────────────

  const startSendTimeout = useCallback(
    (clientId: string, conversationId: string) => {
      const timeout = setTimeout(() => {
        pendingTimeouts.current.delete(clientId);
        cache.markFailed(conversationId, clientId);
      }, SEND_TIMEOUT_MS);

      pendingTimeouts.current.set(clientId, timeout);
    },
    [cache],
  );

  const clearSendTimeout = useCallback((clientId: string) => {
    const timeout = pendingTimeouts.current.get(clientId);
    if (timeout) {
      clearTimeout(timeout);
      pendingTimeouts.current.delete(clientId);
    }
  }, []);

  // ─── Socket listeners ──────────────────────────────────────────────────────

  const handlers = useMemo(() => chatEventHandlers(cache), [cache]);

  useEffect(() => {
    if (!isConnected) return;

    const offNewMessage = chatSocketService.onNewMessage((message) => {
      handlers.handleIncomingMessage(message, clearSendTimeout);
    });

    const offMessagesSeen = chatSocketService.onMessagesSeen(
      ({ conversationId, seenBy }) => {
        cache.markSeen(conversationId, seenBy);
      },
    );

    const offMessageDeleted = chatSocketService.onMessageDeleted(
      ({ conversationId, messageId }) => {
        cache.deleteMessage(conversationId, messageId);
      },
    );

    return () => {
      offNewMessage();
      offMessagesSeen();
      offMessageDeleted();
    };
  }, [isConnected, handlers, cache, clearSendTimeout]);

  // ─── Emitters ──────────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    (dto: Omit<CreateMessageDto, "clientId">): string => {
      const clientId = uuidv4();

      cache.appendOptimistic({
        clientId,
        id: "",
        conversationId: dto.conversationId,
        sender: currentUserId,
        content: dto.content,
        seenAt: null,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        _status: "PENDING",
      });

      try {
        chatSocketService.sendMessage({ ...dto, clientId });
        startSendTimeout(clientId, dto.conversationId);
      } catch {
        // Synchronous throw — socket not connected, no point starting timer
        cache.markFailed(dto.conversationId, clientId);
      }

      return clientId;
    },
    [cache, currentUserId, startSendTimeout],
  );

  const retryMessage = useCallback(
    (clientId: string, dto: Omit<CreateMessageDto, "clientId">): void => {
      cache.markPending(dto.conversationId, clientId);

      try {
        chatSocketService.sendMessage({ ...dto, clientId });
        startSendTimeout(clientId, dto.conversationId);
      } catch {
        cache.markFailed(dto.conversationId, clientId);
      }
    },
    [cache, startSendTimeout],
  );

  return {
    joinConversation: (id: string) => chatSocketService.joinConversation(id),
    sendMessage,
    retryMessage,
    markSeen: (id: string) => chatSocketService.markSeen(id),
    deleteMessage: (dto: DeleteMessageDto) =>
      chatSocketService.deleteMessage(dto),
  };
}
