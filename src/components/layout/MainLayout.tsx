/**
 * MainLayout.tsx — Main Application Layout
 *
 * Provides sidebar navigation and header for authenticated pages.
 * Structure: Header (top) + Sidebar (left) + Main content (right)
 */

import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';

import { useAuth } from '../../features/auth/context/AuthContext';
import { useUser } from '../../features/users/context/UserContext';
import { NAV_ITEMS } from '../../constants/navigation';

const SIDEBAR_WIDTH = 250;

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { user } = useUser();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: SIDEBAR_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: SIDEBAR_WIDTH,
                        boxSizing: 'border-box',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        pt: 2,
                    },
                }}
            >
                {/* Sidebar Header */}
                <Box sx={{ px: 2, mb: 3 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: 'inherit',
                        }}
                    >
                        CampusConnect
                    </Typography>
                </Box>

                {/* Navigation Items */}
                <List sx={{ px: 1 }}>
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    onClick={() => handleNavigation(item.path)}
                                    sx={{
                                        borderRadius: 1,
                                        bgcolor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        },
                                        color: 'inherit',
                                    }}
                                >
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            variant: 'body2',
                                            fontWeight: isActive ? 600 : 400,
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                {/* Logout Button at Bottom */}
                <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                            },
                            color: 'inherit',
                        }}
                    >
                        <ListItemText
                            primary="Logout"
                            primaryTypographyProps={{
                                variant: 'body2',
                                fontWeight: 500,
                            }}
                        />
                    </ListItemButton>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <AppBar
                    position="static"
                    sx={{
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        boxShadow: 1,
                    }}
                >
                    <Toolbar>
                        {/* Logo/Brand */}
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                cursor: 'pointer',
                                flex: 1,
                            }}
                            onClick={() => navigate('/home')}
                        >
                            CampusConnect
                        </Typography>

                        {/* Greeting */}
                        {user && (
                            <Typography
                                variant="body2"
                                sx={{
                                    mr: 3,
                                    color: 'text.secondary',
                                }}
                            >
                                Welcome, {user.name || user.email}
                            </Typography>
                        )}

                        {/* Notification Icon */}
                        <IconButton
                            color="inherit"
                            sx={{
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                            }}
                        >
                            <Badge badgeContent={0} color="error">
                                <Box
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem',
                                    }}
                                >
                                    🔔
                                </Box>
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* Page Content */}
                <Container
                    maxWidth="lg"
                    sx={{
                        flex: 1,
                        py: 4,
                        overflow: 'auto',
                    }}
                >
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
};

export default MainLayout;
