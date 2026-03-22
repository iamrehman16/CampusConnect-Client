import React from 'react';
import { useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

import NotificationsIcon from '@mui/icons-material/Notifications';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { useUser } from '../../../features/users/context/UserContext';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <AppBar
            position="sticky"
            sx={{
                bgcolor: 'background.paper',
                color: 'text.primary',
                boxShadow: isMobile ? 1 : 0,
                borderBottom: isMobile ? 'none' : '1px solid',
                borderColor: 'divider',
            }}
        >
            <Toolbar>
                {/* Mobile Brand */}
                {isMobile && (
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, flex: 1, cursor: 'pointer' }}
                        onClick={() => navigate('/home')}
                    >
                        CampusConnect
                    </Typography>
                )}

                {!isMobile && <Box sx={{ flex: 1 }} />}

                {/* Greeting */}
                {user && !isMobile && (
                    <Typography
                        variant="body2"
                        sx={{ mr: 3, color: 'text.secondary' }}
                    >
                        Welcome, {user.name || user.email}
                    </Typography>
                )}

                {/* Notifications */}
                <IconButton color="inherit">
                    <Badge badgeContent={3} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>

                {/* Mobile Admin/Profile */}
                {isMobile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                        <IconButton
                            color="inherit"
                            onClick={() => navigate('/admin')}
                            sx={{ mr: 0.5 }}
                        >
                            <AdminPanelSettingsIcon />
                        </IconButton>

                        <Tooltip title="Profile">
                            <IconButton
                                onClick={() => navigate('/profile')}
                                sx={{ p: 0, ml: 0.5 }}
                            >
                                <Avatar
                                    sx={{
                                        width: 35,
                                        height: 35,
                                        bgcolor: 'secondary.main',
                                        border: '2px solid',
                                        borderColor: 'primary.main',
                                    }}
                                >
                                    {user?.name?.[0] ||
                                        user?.email?.[0]?.toUpperCase() ||
                                        'U'}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;