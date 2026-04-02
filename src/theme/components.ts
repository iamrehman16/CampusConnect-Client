import type { Components, Theme } from '@mui/material/styles';

/**
 * Global MUI component style overrides.
 * Provides a consistent, premium feel across all components.
 */
// components.ts
export const componentOverrides: Components<Theme> = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: 8,          // was 12 — slightly less pill-like
        fontWeight: 600,
      },
      sizeSmall: {
        padding: '5px 14px',      // tighter for inline buttons like Save/Cancel
        fontSize: '0.8125rem',
      },
      sizeMedium: {
        padding: '8px 20px',      // was 10px 24px — slightly reduced
      },
      sizeLarge: {
        padding: '12px 28px',
      },
      containedPrimary: {
        background: 'linear-gradient(135deg, #6C63FF 0%, #938BFF 100%)',
        boxShadow: '0 2px 8px rgba(108, 99, 255, 0.25)',   // softer default shadow
        '&:hover': {
          background: 'linear-gradient(135deg, #6C63FF 0%, #938BFF 100%)', // same gradient — no shift
          boxShadow: '0 4px 12px rgba(108, 99, 255, 0.30)', // subtle lift only
          opacity: 0.92,          // simple opacity instead of color change — much less shiny
        },
        '&:active': {
          boxShadow: '0 1px 4px rgba(108, 99, 255, 0.20)',
          opacity: 1,
        },
      },
      outlinedPrimary: {
        borderColor: 'rgba(108, 99, 255, 0.5)',
        '&:hover': {
          borderColor: '#6C63FF',
          backgroundColor: 'rgba(108, 99, 255, 0.06)', // very subtle fill
        },
      },
      text: {
        '&:hover': {
          backgroundColor: 'rgba(148, 163, 184, 0.06)', // near-neutral — not purple tinted
        },
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,         // was 16 — less circular, cleaner
        backgroundImage: 'none',
        border: '1px solid rgba(148, 163, 184, 0.08)',
      },
    },
  },

  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'medium',
    },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,        // was 12 — inputs look better with tighter radius
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
        },
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,          // was 8 — chips look better pill-adjacent not fully pill
      },
    },
  },

  // rest stays the same
  MuiPaper: {
    styleOverrides: {
      root: { backgroundImage: 'none' },
    },
  },
  MuiBottomNavigation: {
    styleOverrides: {
      root: { borderTop: '1px solid rgba(148, 163, 184, 0.08)' },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: { borderRight: '1px solid rgba(148, 163, 184, 0.08)' },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: { textTransform: 'none', fontWeight: 600 },
    },
  },
};