export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showStats: boolean;
}

export const NOTICES_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '공지 목록',
    title: '공지 관리',
    showInBreadcrumb: true,
    showActions: true,
    showStats: true,
  },
  CREATE: {
    label: '공지 추가',
    title: '공지 추가',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  MANUALS: {
    label: '매뉴얼 목록',
    title: '매뉴얼 관리',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  MANUAL_CREATE: {
    label: '매뉴얼 추가',
    title: '매뉴얼 추가',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  CATEGORIES: {
    label: '카테고리 관리',
    title: '카테고리 관리',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  CATEGORY_CREATE: {
    label: '카테고리 추가',
    title: '카테고리 추가',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
} as const;

export const DEFAULT_NOTICES_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '공지 관리',
  title: '공지 관리',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
