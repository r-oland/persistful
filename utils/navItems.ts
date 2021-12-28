import {
  faBallot,
  faCalendarAlt,
  faCog,
  faSignOutAlt,
  faTachometerFast,
} from '@fortawesome/pro-solid-svg-icons';
import { signOut } from 'next-auth/react';

export const navItems = [
  { name: 'Dashboard', link: '/', icon: faTachometerFast },
  { name: 'Overview', link: '/overview', icon: faCalendarAlt },
  { name: 'Activities', link: '/activities', icon: faBallot },
  { name: 'Settings', link: '/settings', icon: faCog },
  {
    name: 'Logout',
    onClick: () => signOut(),
    icon: faSignOutAlt,
    desktopOnly: true,
  },
];

export type NavItem = typeof navItems[0];
