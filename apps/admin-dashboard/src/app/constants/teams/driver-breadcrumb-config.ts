export type { BreadcrumbConfig } from '../delivery-breadcrumb-config';

export const DRIVER_BREADCRUMB_CONFIGS = {
  DASHBOARD: {
    label: '대시보드',
    title: '배송 현황',
    showInBreadcrumb: false,
    showActions: false,
    showStats: true,
  },
  DELIVERIES: {
    label: '배송 목록',
    title: '내 배송 목록',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  ACTIVE: {
    label: '진행 중인 배송',
    title: '진행 중인 배송',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  PROFILE: {
    label: '내 프로필',
    title: '내 프로필',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  SETTLEMENTS: {
    label: '내 정산',
    title: '정산 내역',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  SUGGESTIONS: {
    // ✅ 신규
    label: '건의사항',
    title: '건의사항',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
} as const;

export const DEFAULT_DRIVER_BREADCRUMB_CONFIG = {
  label: '배달기사',
  title: '배달기사 앱',
  showInBreadcrumb: false,
  showActions: false,
  showStats: false,
};
