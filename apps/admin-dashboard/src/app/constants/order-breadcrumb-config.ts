export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showTabs: boolean;
}

export const ORDER_BREADCRUMB_CONFIGS = {
  LIST: {
    label: 'Orders',
    title: 'Order Management',
    showInBreadcrumb: true,
    showActions: true,
    showTabs: true,
  },
  CREATE: {
    label: 'Create Order',
    title: 'Create New Order',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: false,
  },
  DETAIL: {
    label: 'Order Details',
    title: 'Order Details',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: false,
  },
} as const;

export const DEFAULT_ORDER_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: 'Orders',
  title: 'Orders',
  showInBreadcrumb: true,
  showActions: false,
  showTabs: false,
};
