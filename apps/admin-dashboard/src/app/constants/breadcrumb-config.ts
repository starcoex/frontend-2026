export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb?: boolean;
  showActions?: boolean;
  showStats?: boolean;
}

export const BREADCRUMB_CONFIGS: Record<string, BreadcrumbConfig> = {
  LIST: {
    label: 'Users',
    title: 'User List',
    showInBreadcrumb: true,
    showActions: true,
    showStats: true,
  },
  CREATE: {
    label: 'Create User',
    title: 'Create New User',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  ADMINS: {
    label: 'Admin Users',
    title: 'Administrator List',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  MEMBERS: {
    label: 'Member Users',
    title: 'Member List',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  DRIVERS: {
    label: 'Driver Users',
    title: 'Driver List',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
} as const;

export const DEFAULT_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: 'Users',
  title: 'User Management',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
