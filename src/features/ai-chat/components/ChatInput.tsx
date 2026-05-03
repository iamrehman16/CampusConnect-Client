import { useState, useRef, useCallback, type KeyboardEvent } from 'react';
import { Box, IconButton, Typography, TextField } from '@mui/material';
import Send from '@mui/icons-material/Send';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled || isOverLimit) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Ask a question…"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          variant="outlined"
          size="small"
          inputRef={textareaRef}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              bgcolor: 'background.paper',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: isOverLimit ? 'error.main' : 'primary.light',
                borderWidth: '1.5px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isOverLimit ? 'error.main' : undefined,
              },
            },
          }}
        />
        <IconButton
          size="small"
          onClick={handleSend}
          disabled={!canSend}
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            mb: 0.25,
            bgcolor: canSend ? 'primary.main' : 'action.disabledBackground',
            color: canSend ? 'primary.contrastText' : 'text.disabled',
            borderRadius: '50%',
            '&:hover': {
              bgcolor: canSend ? 'primary.dark' : 'action.disabledBackground',
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'text.disabled',
            },
          }}
        >
          <Send sx={{ fontSize: 18 }} />
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