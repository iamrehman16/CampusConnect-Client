import type { InfiniteData } from "@tanstack/react-query";
import type { PaginatedResult } from "@/shared/types/api.types";
import type { Message } from "../types/chat-dto";
import { chatKeys } from "../hooks/chat-keys";

export const chatCacheUpdaters = (queryClient: any) => ({
  prependMessage(message: Message) {
    queryClient.setQueryData(
      chatKeys.messages(message.conversationId),
      (old: InfiniteData<PaginatedResult<Message>> | undefined) => {
        if (!old) return old;

        const [firstPage, ...rest] = old.pages;

        const updatedFirstPage: PaginatedResult<Message> = {
          ...firstPage,
          data: [message, ...firstPage.data],
          total: firstPage.total + 1,
        };

        return { ...old, pages: [updatedFirstPage, ...rest] };
      },
    );

    queryClient.invalidateQueries({
      queryKey: chatKeys.conversations(),
    });
  },

  markSeen(conversationId: string, seenBy: string) {
    queryClient.setQueryData(
      chatKeys.messages(conversationId),
      (old: InfiniteData<PaginatedResult<Message>> | undefined) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((msg) =>
              msg.sender !== seenBy && !msg.seen
                ? { ...msg, seen: true, seenAt: new Date() }
                : msg,
            ),
          })),
        };
      },
    );
  },

  deleteMessage(conversationId: string, messageId: string) {
    queryClient.setQueryData(
      chatKeys.messages(conversationId),
      (old: InfiniteData<PaginatedResult<Message>> | undefined) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((msg) =>
              msg.id === messageId ? { ...msg, isDeleted: true } : msg,
            ),
          })),
        };
      },
    );
  },
});
