import {
  Box,
  CircularProgress,
  Divider,
  List,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useConversationsQuery } from "../hooks/chat-hooks";
import { ConversationListItem } from "./ConversationListItem";

export function ConversationList() {
  const { conversationId: activeId } = useParams();
  const navigate = useNavigate();
  const { data: conversations, isLoading } = useConversationsQuery();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!conversations?.length) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No conversations yet.
        </Typography>
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
      <Box sx={{ px: 2, py: 1.5, flexShrink: 0 }}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
          Messages
        </Typography>
      </Box>
      <Divider />
      <List disablePadding sx={{ flex: 1, overflowY: "auto" }}>
        {conversations.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === activeId}
            onClick={() => navigate(`/chat/${conversation.id}`)}
          />
        ))}
      </List>
    </Box>
  );
}
