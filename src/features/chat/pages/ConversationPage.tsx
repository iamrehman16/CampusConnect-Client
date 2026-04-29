import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import { useChatSocket } from "../hooks/chat-socket-hooks";
import { useConversationsQuery, useMessagesQuery } from "../hooks/chat-hooks";
import { MessageFeed } from "../components/MessageFeed";
import { MessageInput } from "../components/MessageInput";
import { useAuth } from "@/shared/hooks/useAuth";

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { user } = useAuth();
  const { sendMessage, retryMessage, markSeen } = useChatSocket();

  const { data: conversations } = useConversationsQuery();
  const conversation = conversations?.find((c) => c.id === conversationId);
  const otherParticipant = conversation?.participants.find(
    (p) => p.id !== user?._id,
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMessagesQuery(conversationId!);
  const messages = data?.pages.flatMap((p) => p.data) ?? [];

  // Cold cache — user navigated directly via URL before conversation list loaded
  if (!conversation) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          flexShrink: 0,
        }}
      >
        {isMobile && (
          <IconButton size="small" onClick={() => navigate("/chat")}>
            <ArrowBack fontSize="small" />
          </IconButton>
        )}
        <Avatar sx={{ width: 36, height: 36 }} />
        <Typography variant="subtitle1" fontWeight={600}>
          {otherParticipant?.name ?? "Unknown"}
        </Typography>
      </Box>

      {/* Feed */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <MessageFeed
          messages={messages}
          retryMessage={retryMessage}
          fetchNextPage={fetchNextPage}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onVisible={() => markSeen(conversationId!)}
        />
      </Box>

      <Divider />

      {/* Input */}
      <Box sx={{ flexShrink: 0 }}>
        <MessageInput
          conversationId={conversationId!}
          sendMessage={sendMessage}
        />
      </Box>
    </Box>
  );
}
