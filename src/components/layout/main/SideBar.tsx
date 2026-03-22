import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { NAV_ITEMS } from '../../../constants/navigation';
import { useUser } from '../../../features/users/context/UserContext';

const SIDEBAR_WIDTH = 250;

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();

    const navItems = NAV_ITEMS.filter(item => !item.hideInMobileNav);

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
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
            {/* Brand */}
            <Box sx={{ px: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    CampusConnect
                </Typography>
            </Box>

            {/* Navigation */}
            <List sx={{ px: 1 }}>
                {navItems.map(item => {
                    const Icon = item.icon as React.ElementType;
                    const isActive = location.pathname === item.path;

                    return (
                        <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    borderRadius: 1,
                                    bgcolor: isActive
                                        ? 'rgba(255,255,255,0.15)'
                                        : 'transparent',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                    <Icon />
                                </ListItemIcon>

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

            {/* Footer Actions */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    p: 2,
                    borderTop: '1px solid',
                    borderColor: 'rgba(255,255,255,0.1)',
                }}
            >
                <ListItemButton
                    onClick={() => handleNavigation('/admin')}
                    sx={{ borderRadius: 1, mb: 0.5 }}
                >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                        <AdminPanelSettingsIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Admin Panel"
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    />
                </ListItemButton>

                <ListItemButton
                    onClick={() => handleNavigation('/profile')}
                    sx={{ borderRadius: 1 }}
                >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'secondary.main',
                                fontSize: '0.875rem',
                            }}
                        >
                            {user?.name?.[0] ||
                                user?.email?.[0]?.toUpperCase() ||
                                'U'}
                        </Avatar>
                    </ListItemIcon>

                    <ListItemText
                        primary="My Profile"
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    />
                </ListItemButton>
            </Box>
        </Drawer>
    );
};

export default Sidebar;