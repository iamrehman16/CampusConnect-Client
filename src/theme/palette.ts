/**
 * Color palette tokens for the application.
 * Curated dark-mode-first palette with vibrant accents.
 */

export const palette = {
  primary: {
    main: '#6C63FF',
    light: '#938BFF',
    dark: '#4B44B2',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#00D9A6',
    light: '#33E1B8',
    dark: '#009874',
    contrastText: '#000000',
  },
  error: {
    main: '#FF6B6B',
    light: '#FF9B9B',
    dark: '#CC5555',
  },
  warning: {
    main: '#FFB347',
    light: '#FFCF87',
    dark: '#CC8F39',
  },
  success: {
    main: '#4ECB71',
    light: '#7DD99A',
    dark: '#3EA259',
  },
  info: {
    main: '#54A0FF',
    light: '#82BAFF',
    dark: '#4380CC',
  },
  background: {
    default: '#0A0E1A',
    paper: '#111827',
  },
  text: {
    primary: '#F1F5F9',
    secondary: '#94A3B8',
    disabled: '#475569',
  },
  divider: 'rgba(148, 163, 184, 0.12)',
  action: {
    hover: 'rgba(108, 99, 255, 0.08)',
    selected: 'rgba(108, 99, 255, 0.16)',
    focus: 'rgba(108, 99, 255, 0.12)',
  },
} as const;
