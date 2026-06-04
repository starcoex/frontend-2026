export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showTabs: boolean;
}

export const JOB_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '채용 공고 관리',
    title: '채용 공고 관리',
    showInBreadcrumb: true,
    showActions: true,
    showTabs: true,
  },
  CREATE: {
    label: '채용 공고 추가',
    title: '채용 공고 추가',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: false,
  },
  APPLICATIONS: {
    label: '지원자 관리',
    title: '지원자 관리',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: true,
  },
} satisfies Record<string, BreadcrumbConfig>;

export const DEFAULT_JOB_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '채용 공고 관리',
  title: '채용 공고 관리',
  showInBreadcrumb: true,
  showActions: false,
  showTabs: false,
};
