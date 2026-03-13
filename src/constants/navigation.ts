/**
 * navigation.ts — Navigation Constants
 *
 * Centralized navigation configuration for the app.
 */

export interface NavItem {
    label: string;
    path: string;
    icon?: string; // Icon name for future use
}

export const NAV_ITEMS: NavItem[] = [
    {
        label: 'Home',
        path: '/home',
        icon: 'home',
    },
    {
        label: 'Profile',
        path: '/profile',
        icon: 'person',
    },
    {
        label: 'Community',
        path: '/community',
        icon: 'people',
    },
    {
        label: 'Resources',
        path: '/resources',
        icon: 'library_books',
    },
    {
        label: 'Messenger',
        path: '/messenger',
        icon: 'mail',
    },
    {
        label: 'ChatBot',
        path: '/chatbot',
        icon: 'smart_toy',
    },
    {
        label: 'Admin',
        path: '/admin',
        icon: 'admin_panel_settings',
    },
];
