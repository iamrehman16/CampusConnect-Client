import { createTheme } from '@mui/material/styles';

/**
 * Design Tokens — mapped directly to MUI palette + custom tokens.
 * All color values live here and NOWHERE else.
 */
export const designTokens = {
    inkBlack: '#001219',
    darkTeal: '#005f73',
    darkCyan: '#0a9396',
    pearlAqua: '#94d2bd',
    vanillaCustard: '#e9d8a6',
    oxidizedIron: '#ae2012',
    burntSienna: '#ca6702',
    goldenRod: '#ee9b00',
    alabaster: '#f5f5f5',
    white: '#ffffff',
} as const;

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: designTokens.darkTeal,
            dark: designTokens.inkBlack,
            light: designTokens.darkCyan,
            contrastText: designTokens.white,
        },
        secondary: {
            main: designTokens.pearlAqua,
            contrastText: designTokens.inkBlack,
        },
        error: {
            main: designTokens.oxidizedIron,
        },
        warning: {
            main: designTokens.burntSienna,
        },
        background: {
            default: designTokens.vanillaCustard,
            paper: designTokens.white,
        },
        text: {
            primary: designTokens.inkBlack,
            secondary: designTokens.darkTeal,
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700, letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, letterSpacing: '-0.01em' },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 8,
    },
    spacing: 8,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '10px 24px',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                fullWidth: true,
                size: 'medium',
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiLink: {
            defaultProps: {
                underline: 'hover',
            },
        },
    },
});

export default theme;
