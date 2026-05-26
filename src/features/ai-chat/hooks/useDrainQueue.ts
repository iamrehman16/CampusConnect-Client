import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { setConversation } from "../utils/ai-chat.cache";
import type { ConversationMessage } from "../types/ai-chat.dto";
import type { useStreamRefs } from "./useStreamRefs";

interface UseDrainQueueOptions {
  refs: ReturnType<typeof useStreamRefs>;
  setStreamingBubble: React.Dispatch<React.SetStateAction<ConversationMessage | null>>;
  setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useDrainQueue({
  refs,
  setStreamingBubble,
  setIsStreaming,
}: UseDrainQueueOptions) {
  const queryClient = useQueryClient();
  const { accRef, queueRef, renderRef, flushRef, reset } = refs;

  const startDrainInterval = useCallback(() => {
    flushRef.current = setInterval(() => {
      if (queueRef.current.length === 0) return;
      const char = queueRef.current.shift()!;
      renderRef.current += char;
      setStreamingBubble((prev) =>
        prev ? { ...prev, content: renderRef.current } : prev
      );
    }, 4);
  }, [flushRef, queueRef, renderRef, setStreamingBubble]);

  const commitFinal = useCallback(
    (assistantBubbleId: string) => {
      clearInterval(flushRef.current!);
      setConversation(queryClient, (prev) => [
        ...prev,
        {
          id: assistantBubbleId,
          role: "assistant" as const,
          content: accRef.current,
          isPending: false,
        },
      ]);
      setStreamingBubble(null);
      setIsStreaming(false);
      reset();
    },
    [queryClient, accRef, flushRef, reset, setStreamingBubble, setIsStreaming],
  );

  const waitForDrainThenCommit = useCallback(
    (assistantBubbleId: string) => {
      const poll = () => {
        if (queueRef.current.length === 0) {
          commitFinal(assistantBubbleId);
        } else {
          setTimeout(poll, 18);
        }
      };
      poll();
    },
    [queueRef, commitFinal],
  );

  const commitOnAbort = useCallback(
    (assistantBubbleId: string) => {
      clearInterval(flushRef.current!);
      setConversation(queryClient, (prev) => [
        ...prev,
        {
          id: assistantBubbleId,
          role: "assistant" as const,
          content: renderRef.current, // only what was actually painted
          isPending: false,
        },
      ]);
      setStreamingBubble(null);
      setIsStreaming(false);
      reset();
    },
    [queryClient, renderRef, flushRef, reset, setStreamingBubble, setIsStreaming],
  );

  const cleanup = useCallback(() => {
    clearInterval(flushRef.current!);
    setStreamingBubble(null);
    setIsStreaming(false);
    reset();
  }, [flushRef, reset, setStreamingBubble, setIsStreaming]);

  return { startDrainInterval, waitForDrainThenCommit, commitOnAbort, cleanup };
}