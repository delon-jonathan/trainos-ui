import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Passenger Volume Records', href: paths.dashboard.customers, icon: 'list-numbers' },
  { key: 'integrations', title: 'Users', href: paths.dashboard.integrations, icon: 'users' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'settings', title: 'System Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  /*{ key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },*/
] satisfies NavItemConfig[];
