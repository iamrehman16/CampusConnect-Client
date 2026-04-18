import { useState, useRef, useCallback, type KeyboardEvent } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const MAX_CHARS = 1000;

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  /** Allows the parent to seed the input (e.g. suggestion chips). */
  prefillValue?: string;
  onPrefillConsumed?: () => void;
}

export function ChatInput({ onSend, disabled, prefillValue, onPrefillConsumed }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync prefill from parent (suggestion chips)
  if (prefillValue !== undefined && prefillValue !== value) {
    setValue(prefillValue);
    onPrefillConsumed?.();
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    autoResize();
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled || isOverLimit) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const charCount = value.length;
  const isOverLimit = charCount > MAX_CHARS;
  const showCounter = charCount > MAX_CHARS * 0.8; // show counter at 80% usage
  const canSend = value.trim().length > 0 && !disabled && !isOverLimit;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1,
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: isOverLimit ? 'error.main' : 'divider',
          borderRadius: '12px',
          px: 1.75,
          py: 1,
          transition: 'border-color 0.15s',
          '&:focus-within': {
            borderColor: isOverLimit ? 'error.main' : 'rgba(108, 99, 255, 0.5)',
          },
        }}
      >
        <Box
          component="textarea"
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question…"
          rows={1}
          sx={{
            flex: 1,
            bgcolor: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontFamily: 'inherit',
            fontSize: '0.875rem',
            color: 'text.primary',
            lineHeight: 1.55,
            minHeight: '22px',
            maxHeight: '120px',
            py: 0.25,
            '&::placeholder': { color: 'text.disabled' },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!canSend}
          size="small"
          sx={{
            width: 34,
            height: 34,
            borderRadius: '9px',
            flexShrink: 0,
            background: canSend
              ? 'linear-gradient(135deg, #6C63FF 0%, #938BFF 100%)'
              : 'rgba(108, 99, 255, 0.15)',
            color: '#fff',
            transition: 'opacity 0.15s, transform 0.1s',
            '&:hover': { opacity: 0.88, background: 'linear-gradient(135deg, #6C63FF 0%, #938BFF 100%)' },
            '&:active': { transform: 'scale(0.93)' },
            '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' },
          }}
        >
          <ArrowUpwardIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Character counter — only visible at 80%+ usage */}
      {showCounter && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'right',
            mt: 0.5,
            pr: 0.5,
            color: isOverLimit ? 'error.main' : 'text.secondary',
            fontWeight: isOverLimit ? 600 : 400,
            transition: 'color 0.15s',
          }}
        >
          {charCount} / {MAX_CHARS}
        </Typography>
      )}
    </Box>
  );
}