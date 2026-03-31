import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChatIcon from '@mui/icons-material/Chat';
import ForumIcon from '@mui/icons-material/Forum';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { ROUTES } from '@/shared/constants/routes';
import { useAuth } from '@/shared/hooks/useAuth';
import { UserRole } from '@/shared/types/enums';

export const SIDEBAR_WIDTH = 260;

const MAIN_NAV = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.HOME },
  { label: 'Resources', icon: <LibraryBooksIcon />, path: ROUTES.RESOURCES },
  { label: 'AI Assistant', icon: <SmartToyIcon />, path: ROUTES.AI_CHAT },
  { label: 'Messages', icon: <ChatIcon />, path: ROUTES.CHAT },
  { label: 'Community', icon: <ForumIcon />, path: ROUTES.COMMUNITY },
];

const BOTTOM_NAV = [
  { label: 'Profile', icon: <PersonIcon />, path: ROUTES.PROFILE },
];

/**
 * Desktop sidebar navigation.
 * Permanent drawer visible at `md` breakpoint and above (handled by AppLayout).
 */
export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === UserRole.ADMIN;

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== ROUTES.HOME && location.pathname.startsWith(path));

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Logo / Brand */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <SmartToyIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6C63FF 0%, #00D9A6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          AcademiQ
        </Typography>
      </Box>

      <Divider />

      {/* Main Navigation */}
      <List sx={{ flex: 1, px: 1, py: 1 }}>
        {MAIN_NAV.map((item) => (
          <ListItemButton
            key={item.label}
            selected={isActive(item.path)}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'action.selected',
                '& .MuiListItemIcon-root': { color: 'primary.main' },
                '& .MuiListItemText-primary': { fontWeight: 600 },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItemButton
              selected={isActive(ROUTES.ADMIN)}
              onClick={() => navigate(ROUTES.ADMIN)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                  '& .MuiListItemText-primary': { fontWeight: 600 },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Admin Panel" />
            </ListItemButton>
          </>
        )}
      </List>

      <Divider />

      {/* Bottom actions */}
      <List sx={{ px: 1, py: 1 }}>
        {BOTTOM_NAV.map((item) => (
          <ListItemButton
            key={item.label}
            selected={isActive(item.path)}
            onClick={() => navigate(item.path)}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 2,
            '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.08)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{ '& .MuiListItemText-primary': { color: 'error.main' } }}
          />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
