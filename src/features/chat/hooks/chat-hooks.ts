import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { chatService } from "../services/chat-service";
import { chatKeys } from "./chat-keys";

export function useConversationsQuery() {
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: () => chatService.getMyConversations(),
    staleTime: 1000 * 30, // 30s — socket events invalidate this anyway
  });
}

export function useMessagesQuery(conversationId: string) {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(conversationId),
    queryFn: ({ pageParam = 1 }) =>
      chatService.getMessages({ conversationId, page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: !!conversationId,
    staleTime: 1000 * 60,
  });
}

export function useFindOrCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatService.findOrCreateConversation.bind(chatService),
    onSuccess: () => {
      // New conversation may have been created — refetch the list
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    },
  });
}
