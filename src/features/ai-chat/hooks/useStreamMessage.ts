import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { aiChatService } from "../services/ai-chat.service";
import { setConversation } from "../utils/ai-chat.cache";
import { generateId } from "../utils/generate-id";
import { useStreamRefs } from "./useStreamRefs";
import { useDrainQueue } from "./useDrainQueue";
import type { ChatMessageDto, ConversationMessage } from "../types/ai-chat.dto";

export function useStreamMessage() {
  const queryClient = useQueryClient();
  const [streamingBubble, setStreamingBubble] =
    useState<ConversationMessage | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const refs = useStreamRefs();
  const { abortRef, accRef, queueRef } = refs;

  const { startDrainInterval, waitForDrainThenCommit, commitOnAbort, cleanup } =
    useDrainQueue({ refs, setStreamingBubble, setIsStreaming });

  const stop = useCallback(() => {
    console.log("[STOP CALLED]", abortRef.current);
    abortRef.current?.abort();
  }, [abortRef]);

  const sendMessage = useCallback(
    async (dto: ChatMessageDto) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const userBubbleId = generateId();
      const assistantBubbleId = generateId();

      setConversation(queryClient, (prev) => [
        ...prev,
        { id: userBubbleId, role: "user", content: dto.message },
      ]);

      refs.reset();
      setStreamingBubble({
        id: assistantBubbleId,
        role: "assistant",
        content: "",
        isPending: true,
      });
      setIsStreaming(true);
      startDrainInterval();

      const handleAbort = () => {
        commitOnAbort(assistantBubbleId);
      };
      controller.signal.addEventListener("abort", handleAbort);

      try {
        for await (const event of aiChatService.streamMessage(
          dto,
          controller.signal,
        )) {
          if (event.type === "token") {
            accRef.current += event.token;
            queueRef.current.push(...event.token.split(""));
          } else if (event.type === "citations") {
            setStreamingBubble((prev) =>
              prev ? { ...prev, citations: event.citations } : prev,
            );
          } else if (event.type === "done") {
            waitForDrainThenCommit(assistantBubbleId);
            return;
          } else if (event.type === "error") {
            throw new Error(event.message);
          }
        }
      } catch (err: unknown) {
        console.log(
          "[HOOK CATCH]",
          err,
          err instanceof DOMException,
          (err as any)?.name,
        );
        const isAbort =
          err instanceof DOMException && err.name === "AbortError";
        if (isAbort) {
          // handled by the event listener above
        } else {
          cleanup();
        }
      } finally {
        controller.signal.removeEventListener("abort", handleAbort);
      }
    },
    [
      queryClient,
      refs,
      accRef,
      queueRef,
      abortRef,
      startDrainInterval,
      waitForDrainThenCommit,
      commitOnAbort,
      cleanup,
    ],
  );

  return { sendMessage, stop, isStreaming, streamingBubble };
}
