import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import { NAV_ITEMS } from '../../../constants/navigation';

const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = NAV_ITEMS.filter(item => !item.hideInMobileNav);

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
            }}
            elevation={3}
        >
            <BottomNavigation
                showLabels={false}
                value={location.pathname}
                onChange={(_, newValue) => handleNavigation(newValue)}
                sx={{
                    height: 60,
                    '& .MuiBottomNavigationAction-root': {
                        minWidth: 0,
                        padding: '6px 0',
                    },
                }}
            >
                {navItems.map(item => {
                    const Icon = item.icon as React.ElementType;

                    return (
                        <BottomNavigationAction
                            key={item.path}
                            value={item.path}
                            icon={<Icon />}
                        />
                    );
                })}
            </BottomNavigation>
        </Paper>
    );
};

export default BottomNav;