// src/features/ai-chat/pages/AiChatPage.tsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { useConversation, useSendMessage, useClearSession } from "../hooks/ai-chat.hooks";
import { MessageBubble } from "../components/MessageBubble";
import { ChatInput } from "../components/ChatInput";
import { ChatEmptyState } from "../components/ChatEmptyState";

export default function AiChatPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { data: messages } = useConversation();
  const { mutate: sendMessage, isPending: isThinking } = useSendMessage();
  const { mutate: clearSession } = useClearSession();

  const bottomRef = useRef<HTMLDivElement>(null);
  const [prefill, setPrefill] = useState<string | undefined>(undefined);
  const promptFiredRef = useRef(false);

  useEffect(() => {
    const initialPrompt = location.state?.initialPrompt as string | undefined;
    if (initialPrompt?.trim() && !promptFiredRef.current) {
      promptFiredRef.current = true;
      sendMessage({ message: initialPrompt.trim() });
      window.history.replaceState({}, "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (message: string) => sendMessage({ message });
  const handleSuggestionClick = (text: string) => setPrefill(text);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // AiChatPage is immersive — no TopBar, no BottomNav.
        // It occupies the full viewport height on both mobile and desktop.
        // The previous calc subtracted BOTTOM_NAV_HEIGHT, but routeConfig now
        // sets showBottomNav: false for this route, so AppLayout adds no pb
        // and the nav is hidden. Full 100svh is correct.
        height: "100svh",
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      {/* Header — immersive pages own this entirely.
          Back arrow on the left mirrors ConversationPage's pattern.
          The AI identity (icon + name + subtitle) stays centered-ish.
          Clear button on the right stays as-is. */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          py: 1.5,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
          minHeight: 56,
          gap: 1,
        }}
      >
        {/* Left — back arrow */}
        <IconButton
          size="small"
          onClick={() => navigate("/", { replace: true })}
          sx={{ color: "text.primary", flexShrink: 0 }}
          aria-label="Go back"
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
        </IconButton>

        {/* Center — AI identity, grows to fill space */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <SmartToyOutlinedIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, lineHeight: 1.2 }}
            >
              Campus AI
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Ask anything about your courses
            </Typography>
          </Box>
        </Box>

        {/* Right — clear session, only when there are messages */}
        {messages.length > 0 && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => clearSession()}
            sx={{
              color: "text.secondary",
              borderColor: "divider",
              fontSize: "0.75rem",
              minHeight: 32,
              flexShrink: 0,
            }}
          >
            Clear
          </Button>
        )}
      </Box>

      {/* Message list */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 1.75,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          bgcolor: "background.default",
          "&::-webkit-scrollbar": { width: 3 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "divider", borderRadius: 4 },
        }}
      >
        {messages.length === 0 ? (
          <ChatEmptyState onSuggestionClick={handleSuggestionClick} />
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
        <div ref={bottomRef} />
      </Box>

      {/* Input bar */}
      <Box
        sx={{
          px: 1.5,
          pt: 1,
          pb: 1.5,
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <ChatInput
          onSend={handleSend}
          disabled={isThinking}
          prefillValue={prefill}
          onPrefillConsumed={() => setPrefill(undefined)}
        />
      </Box>
    </Box>
  );
}