export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showStats: boolean;
}

export const STORE_BREADCRUMB_CONFIGS = {
  LIST: {
    label: 'Stores',
    title: 'Store Management',
    showInBreadcrumb: true,
    showActions: true,
    showStats: true,
  },
  CREATE: {
    label: 'Create Store',
    title: 'Add New Store',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  BRANDS: {
    label: 'Brands',
    title: 'Brand Management',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  BRANDS_CREATE: {
    label: 'Create Brand',
    title: 'Add New Brand',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
} as const;

export const DEFAULT_STORE_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: 'Stores',
  title: 'Store Management',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
