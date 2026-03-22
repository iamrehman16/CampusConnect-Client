import type { ElementType } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ChatIcon from '@mui/icons-material/Chat';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export interface NavItem {
    label: string;
    path: string;
    icon: ElementType;
    hideInMobileNav?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
    {
        label: 'Home',
        path: '/home',
        icon: HomeIcon,
    },
    {
        label: 'Profile',
        path: '/profile',
        icon: PersonIcon,
        hideInMobileNav: true,
    },
    {
        label: 'Community',
        path: '/community',
        icon: PeopleIcon,
    },
    {
        label: 'Resources',
        path: '/resources',
        icon: LibraryBooksIcon,
    },
    {
        label: 'Messenger',
        path: '/messenger',
        icon: ChatIcon,
    },
    {
        label: 'ChatBot',
        path: '/chatbot',
        icon: SmartToyIcon,
    },
    {
        label: 'Admin',
        path: '/admin',
        icon: AdminPanelSettingsIcon,
        hideInMobileNav: true,
    },
];
