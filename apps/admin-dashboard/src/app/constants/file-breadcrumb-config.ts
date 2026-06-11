export interface FileBreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb?: boolean;
  showActions?: boolean;
  showStats?: boolean;
}

export const FILE_BREADCRUMB_CONFIGS: Record<string, FileBreadcrumbConfig> = {
  ROOT: {
    label: 'File Manager',
    title: 'File Manager',
    showInBreadcrumb: false,
    showActions: true,
    showStats: true,
  },
  RECENT: {
    label: 'Recent Files',
    title: 'Recently Uploaded',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  ANALYSIS: {
    label: 'Storage Analysis',
    title: 'Storage Analysis',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  UPLOAD: {
    label: 'Upload',
    title: '파일 업로드',
    showActions: false, // 업로드 페이지 자체가 액션이므로 헤더 버튼 불필요
    showStats: false,
    showInBreadcrumb: true,
  },
};

export const DEFAULT_FILE_BREADCRUMB_CONFIG: FileBreadcrumbConfig = {
  label: 'File Manager',
  title: 'File Management',
  showInBreadcrumb: true,
  showActions: true,
  showStats: true,
};
