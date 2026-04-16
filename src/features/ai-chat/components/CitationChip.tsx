import { useState } from 'react';
import { Box, Chip, Collapse, Typography } from '@mui/material';
import type { Citation } from '../types/ai-chat.dto';

interface CitationsChipProps {
  citations: Citation[];
}

export function CitationsChip({ citations }: CitationsChipProps) {
  const [open, setOpen] = useState(false);

  if (citations.length === 0) return null;

  return (
    <Box sx={{ mt: 1 }}>
      <Chip
        label={`Sources (${citations.length})`}
        size="small"
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          fontSize: '0.7rem',
          fontWeight: 600,
          color: 'primary.light',
          bgcolor: 'rgba(108, 99, 255, 0.10)',
          border: '1px solid rgba(108, 99, 255, 0.20)',
          borderRadius: '6px',
          cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(108, 99, 255, 0.16)' },
        }}
      />
      <Collapse in={open}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mt: 1 }}>
          {citations.map((citation, idx) => (
            <CitationItem key={`${citation.resourceId}-${citation.pageNumber}`} citation={citation} index={idx + 1} />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

interface CitationItemProps {
  citation: Citation;
  index: number;
}

function CitationItem({ citation, index }: CitationItemProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1,
        bgcolor: 'rgba(108, 99, 255, 0.06)',
        border: '1px solid rgba(108, 99, 255, 0.12)',
        borderRadius: '8px',
        p: '7px 10px',
      }}
    >
      <Box
        sx={{
          minWidth: 20,
          height: 20,
          borderRadius: '4px',
          bgcolor: 'rgba(108, 99, 255, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: '1px',
        }}
      >
        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'primary.light' }}>
          {index}
        </Typography>
      </Box>
      <Box>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.primary', lineHeight: 1.4 }}>
          {citation.title}
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: '2px' }}>
          {citation.course} · Sem {citation.semester} · Page.{citation.pageNumber}
        </Typography>
      </Box>
    </Box>
  );
}