import { Box, IconButton, TextField } from "@mui/material";
import { Send } from "@mui/icons-material";
import { useState, useCallback } from "react";
import type { CreateMessageDto } from "../types/chat-dto";

interface Props {
  conversationId: string;
  sendMessage: (dto: Omit<CreateMessageDto, "clientId">) => string;
}

export function MessageInput({ conversationId, sendMessage }: Props) {
  const [content, setContent] = useState("");

  const handleSend = useCallback(() => {
    const trimmed = content.trim();
    if (!trimmed) return;
    sendMessage({ conversationId, content: trimmed });
    setContent("");
  }, [content, conversationId, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: 1,
        px: 2,
        py: 1.5,
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="Write a message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        variant="outlined"
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: "background.default",
          },
        }}
      />
      <IconButton
        onClick={handleSend}
        disabled={!content.trim()}
        color="primary"
        sx={{ mb: 0.25, minWidth: 44, minHeight: 44 }}
      >
        <Send fontSize="small" />
      </IconButton>
    </Box>
  );
}