import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { ROUTES } from '@/shared/constants/routes';
import { useChatUIStore } from '@/features/chat/store/chat-ui.store';
import { useThemeModeContext } from '@/shared/hooks/useThemeModeContext';
import SmsIcon from '@mui/icons-material/Sms';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

interface TopBarProps {
  onAvatarClick: () => void;
}

export default function TopBar({ onAvatarClick }: TopBarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mode, toggle } = useThemeModeContext();
  const totalUnread = useChatUIStore((s) =>
    Object.values(s.unreadCounts).reduce((sum, n) => sum + n, 0)
  );

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        display: { xs: 'flex', md: 'none' },
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar
        sx={{
          px: 2,
          minHeight: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left — avatar opens profile drawer */}
        <IconButton onClick={onAvatarClick} size="small" sx={{ p: 0 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: '0.875rem',
              fontWeight: 700,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>

        {/* Center — app name */}
        <Typography
          variant="subtitle1"
          fontWeight={700}
          color="primary.main"
          sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
        >
          CampusConnect
        </Typography>

        {/* Right — theme toggle + messenger with unread badge */}
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton
            onClick={toggle}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            {mode === 'dark' ? (
              <LightModeIcon fontSize="small" />
            ) : (
              <DarkModeIcon fontSize="small" />
            )}
          </IconButton>

          <IconButton
            onClick={() => navigate(ROUTES.CHAT)}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <Badge
              badgeContent={totalUnread}
              color="error"
              max={99}
              sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}
            >
              <SmsIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}