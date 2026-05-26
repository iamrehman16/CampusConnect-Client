import { useEffect, useRef, useState } from "react";
import type { ConversationMessage } from "../types/ai-chat.dto";

interface UseChatScrollOptions {
  messages: ConversationMessage[];
  streamingContent: string | undefined;
  isStreaming: boolean;
}

export function useChatScroll({
  messages,
  streamingContent,
  isStreaming,
}: UseChatScrollOptions) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isPinnedRef = useRef(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Track whether user has scrolled away from bottom
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atBottom = scrollHeight - scrollTop - clientHeight < 80;
      isPinnedRef.current = atBottom;
      setShowScrollBtn(!atBottom);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll only when pinned
  useEffect(() => {
    if (!isPinnedRef.current) return;
    bottomRef.current?.scrollIntoView({
      behavior: isStreaming ? "instant" : "smooth",
    });
  }, [messages, streamingContent, isStreaming]);

  const scrollToBottom = () => {
    isPinnedRef.current = true;
    setShowScrollBtn(false);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return { scrollContainerRef, bottomRef, showScrollBtn, scrollToBottom };
}