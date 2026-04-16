import { Box, keyframes } from '@mui/material';
import { ThinkingBubble } from './ThinkingBubble';
import { CitationsChip } from './CitationChip';
import type { ConversationMessage } from '../types/ai-chat.dto';

const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0);   }
`;

interface MessageBubbleProps {
  message: ConversationMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        animation: `${fadeSlideIn} 0.2s ease forwards`,
      }}
    >
      <Box sx={{ maxWidth: '78%' }}>
        <Box
          sx={{
            px: 1.75,
            py: 1.25,
            borderRadius: '14px',
            borderBottomRightRadius: isUser ? '4px' : '14px',
            borderBottomLeftRadius: isUser ? '14px' : '4px',
            ...(isUser
              ? {
                  background: 'linear-gradient(135deg, #6C63FF 0%, #938BFF 100%)',
                  color: '#fff',
                }
              : {
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  color: 'text.primary',
                }),
            fontSize: '0.875rem',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {message.isPending ? <ThinkingBubble /> : message.content}
        </Box>

        {!isUser && !message.isPending && message.citations && message.citations.length > 0 && (
          <CitationsChip citations={message.citations} />
        )}
      </Box>
    </Box>
  );
}