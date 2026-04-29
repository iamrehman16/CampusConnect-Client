import { Box, Typography } from "@mui/material";
import { useAuth } from "@/shared/hooks/useAuth";
import type { Message } from "../types/chat-dto";
import { MessageStatusIcon } from "./MessageStatusIcon";
import { format } from "date-fns";

interface Props {
  message: Message;
  retryMessage: (clientId: string, dto: { conversationId: string; content: string }) => void;
}

export function MessageBubble({ message, retryMessage }: Props) {
  const { user } = useAuth();
  const isOwn = message.sender === user?._id;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isOwn ? "flex-end" : "flex-start",
        maxWidth: "70%",
        alignSelf: isOwn ? "flex-end" : "flex-start",
      }}
    >
      <Box
        sx={{
          px: 1.5,
          py: 1,
          borderRadius: 2,
          bgcolor: isOwn ? "primary.main" : "action.hover",
          color: isOwn ? "primary.contrastText" : "text.primary",
          opacity: message._status === "PENDING" ? 0.7 : 1,
        }}
      >
        {message.isDeleted ? (
          <Typography
            variant="body2"
            fontStyle="italic"
            color={isOwn ? "primary.contrastText" : "text.disabled"}
          >
            This message was deleted
          </Typography>
        ) : (
          <Typography variant="body2">{message.content}</Typography>
        )}
      </Box>

      {/* Timestamp + status row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25, px: 0.5 }}>
        {message.createdAt && message._status !== "PENDING" && (
          <Typography variant="caption" color="text.disabled">
            {format(new Date(message.createdAt), "HH:mm")}
          </Typography>
        )}
        {isOwn && (
          <MessageStatusIcon
            status={message._status}
            clientId={message.clientId}
            conversationId={message.conversationId}
            content={message.content}
            retryMessage={retryMessage}
          />
        )}
      </Box>
    </Box>
  );
}