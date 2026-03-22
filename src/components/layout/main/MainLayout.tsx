import React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import Sidebar from './SideBar';
import Header from './Header';
import BottomNav from './BotomNav';

const MainLayout: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                flexDirection: isMobile ? 'column' : 'row',
            }}
        >
            {/* Desktop Sidebar */}
            {!isMobile && <Sidebar />}

            {/* Main Content Area */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    mb: isMobile ? '60px' : 0,
                }}
            >
                <Header />

                <Container
                    maxWidth="lg"
                    sx={{
                        flex: 1,
                        py: isMobile ? 2 : 4,
                        px: isMobile ? 2 : 3,
                        overflow: 'auto',
                    }}
                >
                    <Outlet />
                </Container>
            </Box>

            {/* Mobile Bottom Navigation */}
            {isMobile && <BottomNav />}
        </Box>
    );
};

export default MainLayout;