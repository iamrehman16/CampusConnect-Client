import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Sidebar, { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar';
import BottomNav from './BottomNav';
import TopBar from './TopBar';
import ProfileDrawer from './ProfileDrawer';
import { useUIStore } from '@/shared/store/ui.store';

/**
 * Main application layout shell.
 * - Desktop (md+): Permanent sidebar on the left + content area
 * - Mobile (<md): Full-width content with bottom navigation
 */
export default function AppLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { sidebarCollapsed } = useUIStore();
  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);

  return (
    <>
      <TopBar onAvatarClick={() => setProfileDrawerOpen(true)} />
      <ProfileDrawer
        open={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
      />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Desktop sidebar */}
        {isDesktop && <Sidebar />}

        {/* Main content area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: isDesktop ? `calc(100% - ${sidebarWidth}px)` : '100%',
            // Mobile: pad top for TopBar (56px) + bottom for BottomNav (64px)
            pt: { xs: '56px', md: 0 },
            pb: { xs: '64px', md: 0 },
            overflow: 'auto',
            bgcolor: 'background.default',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Outlet />
        </Box>

        {/* Mobile bottom navigation */}
        {!isDesktop && <BottomNav />}
      </Box>
    </>
  );
}
