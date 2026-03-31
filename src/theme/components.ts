import type { Components, Theme } from '@mui/material/styles';

/**
 * Global MUI component style overrides.
 * Provides a consistent, premium feel across all components.
 */
export const componentOverrides: Components<Theme> = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: 12,
        fontWeight: 600,
        padding: '10px 24px',
      },
      containedPrimary: {
        background: 'linear-gradient(135deg, #6C63FF 0%, #938BFF 100%)',
        boxShadow: '0 4px 14px rgba(108, 99, 255, 0.3)',
        '&:hover': {
          background: 'linear-gradient(135deg, #5B53E0 0%, #827AFF 100%)',
          boxShadow: '0 6px 20px rgba(108, 99, 255, 0.4)',
        },
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
          borderRadius: 12,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        backgroundImage: 'none',
        border: '1px solid rgba(148, 163, 184, 0.08)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
  MuiBottomNavigation: {
    styleOverrides: {
      root: {
        borderTop: '1px solid rgba(148, 163, 184, 0.08)',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: '1px solid rgba(148, 163, 184, 0.08)',
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
};
