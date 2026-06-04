export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showStats: boolean;
}

export const CHAT_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '채팅 관리',
    title: '채팅 관리',
    showInBreadcrumb: true,
    showActions: false,
    showStats: true,
  },
  DETAIL: {
    label: '채팅방 상세',
    title: '채팅방 상세',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
} as const;

export const DEFAULT_CHAT_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '채팅',
  title: '채팅 관리',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
