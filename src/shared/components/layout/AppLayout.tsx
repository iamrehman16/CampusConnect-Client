import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar';
import BottomNav from './BottomNav';

/**
 * Main application layout shell.
 * - Desktop (md+): Permanent sidebar on the left + content area
 * - Mobile (<md): Full-width content with bottom navigation
 */
export default function AppLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop sidebar */}
      {isDesktop && <Sidebar />}

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isDesktop ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%',
          // On mobile, add bottom padding for the fixed BottomNavigation
          pb: isDesktop ? 0 : '72px',
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>

      {/* Mobile bottom navigation */}
      {!isDesktop && <BottomNav />}
    </Box>
  );
}
