import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { chatSocketService } from "../services/chat-socket.service";
import { useChatSocketContext } from "@/shared/hooks/useChatSocketContext";
import { chatCacheUpdaters } from "../utils/chat-cache.updaters";

export function useChatSocket() {
  const queryClient = useQueryClient();
  const { isConnected } = useChatSocketContext();

  const cache = useMemo(() => chatCacheUpdaters(queryClient), [queryClient]);

  useEffect(() => {
    if (!isConnected) return;

    const offNewMessage = chatSocketService.onNewMessage((message) => {
      cache.prependMessage(message);
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
  }, [isConnected, cache]);

  // Expose emitters directly — components don't touch the service
  return {
    joinConversation: (id: string) => chatSocketService.joinConversation(id),
    sendMessage: (dto: Parameters<typeof chatSocketService.sendMessage>[0]) =>
      chatSocketService.sendMessage(dto),
    markSeen: (id: string) => chatSocketService.markSeen(id),
    deleteMessage: (
      dto: Parameters<typeof chatSocketService.deleteMessage>[0],
    ) => chatSocketService.deleteMessage(dto),
  };
}
