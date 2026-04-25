import { createContext, useEffect, useRef, useState } from "react";
import { chatSocketService } from "@/features/chat/services/chat-socket.service";
import { tokenStorage } from "@/shared/utils/storage";

type ChatSocketContextValue = {
  isConnected: boolean;
};

export const ChatSocketContext = createContext<ChatSocketContextValue | null>(
  null,
);

export function ChatSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = tokenStorage.getAccessToken();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      chatSocketService.disconnect();
      setIsConnected(false);
      return;
    }

    chatSocketService.connect(token);
    setIsConnected(true);

    return () => {
      chatSocketService.disconnect();
      setIsConnected(false);
    };
  }, [token]);

  return (
    <ChatSocketContext.Provider value={{ isConnected }}>
      {children}
    </ChatSocketContext.Provider>
  );
}
