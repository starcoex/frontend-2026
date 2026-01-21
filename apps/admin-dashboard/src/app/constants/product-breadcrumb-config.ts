export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showStats: boolean;
}

export const PRODUCT_BREADCRUMB_CONFIGS = {
  LIST: {
    label: 'Products',
    title: 'Product Management',
    showInBreadcrumb: true,
    showActions: true,
    showStats: true,
  },
  CREATE: {
    label: 'Create Product',
    title: 'Add New Product',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
} as const;

export const DEFAULT_PRODUCT_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: 'Products',
  title: 'Products',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
