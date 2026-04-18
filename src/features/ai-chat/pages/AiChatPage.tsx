import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { useConversation, useSendMessage, useClearSession } from '../hooks/ai-chat.hooks';
import { MessageBubble } from '../components/MessageBubble';
import { ChatInput } from '../components/ChatInput';
import { ChatEmptyState } from '../components/ChatEmptyState';

// Bottom nav height — keep in sync with your BottomNavigation component.
// Only applied on mobile (xs/sm); desktop has no bottom nav.
const BOTTOM_NAV_HEIGHT = 56;

export default function AiChatPage() {
  const { data: messages } = useConversation();
  const { mutate: sendMessage, isPending: isThinking } = useSendMessage();
  const { mutate: clearSession } = useClearSession();

  const bottomRef = useRef<HTMLDivElement>(null);
  const [prefill, setPrefill] = useState<string | undefined>(undefined);

  // Auto-scroll to the latest message whenever the list changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (message: string) => {
    sendMessage({ message });
  };

  const handleSuggestionClick = (text: string) => {
    setPrefill(text);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // On mobile the bottom nav eats 56px; desktop has no bottom nav
        height: {
          xs: `calc(100dvh - ${BOTTOM_NAV_HEIGHT}px)`,
          md: '100dvh',
        },
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6C63FF 0%, #938BFF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SmartToyOutlinedIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              Campus AI
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Ask anything about your courses
            </Typography>
          </Box>
        </Box>

        {messages.length > 0 && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => clearSession()}
            sx={{ color: 'text.secondary', borderColor: 'divider', fontSize: '0.75rem' }}
          >
            Clear
          </Button>
        )}
      </Box>

      {/* Message list */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 1.75,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          // Thin scrollbar on desktop
          '&::-webkit-scrollbar': { width: 3 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 4 },
        }}
      >
        {messages.length === 0 ? (
          <ChatEmptyState onSuggestionClick={handleSuggestionClick} />
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </Box>

      {/* Input bar */}
      <Box
        sx={{
          px: 1.5,
          pt: 1,
          pb: 1.5,
          bgcolor: 'background.default',
          borderColor: 'divider',
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