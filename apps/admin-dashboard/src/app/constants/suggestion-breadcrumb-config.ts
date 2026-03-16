export interface SuggestionBreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb?: boolean;
  showActions?: boolean;
  showStats?: boolean;
}

export const SUGGESTION_BREADCRUMB_CONFIGS: Record<
  string,
  SuggestionBreadcrumbConfig
> = {
  // 관리자 경로
  '/admin/suggestions': {
    label: '건의사항',
    title: '전체 건의사항',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  '/admin/suggestions/pending': {
    label: '대기중',
    title: '대기중 건의사항',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  '/admin/suggestions/reviewing': {
    label: '검토중',
    title: '검토중 건의사항',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  '/admin/suggestions/in-progress': {
    label: '진행중',
    title: '진행중 건의사항',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  '/admin/suggestions/completed': {
    label: '완료됨',
    title: '완료된 건의사항',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  '/admin/suggestions/rejected': {
    label: '거부됨',
    title: '거부된 건의사항',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  '/admin/suggestions/analytics': {
    label: '통계',
    title: '건의사항 통계',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  '/admin/suggestions/create': {
    label: '건의사항 등록',
    title: '건의사항 등록',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },

  // 팀 공통 경로
  '/suggestions': {
    label: '건의사항',
    title: '전체 건의사항',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  '/suggestions/create': {
    label: '건의사항 등록',
    title: '건의사항 등록',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  '/suggestions/my': {
    label: '내 건의사항',
    title: '내 건의사항',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  '/suggestions/safety': {
    label: '안전 관련',
    title: '안전 관련 건의사항',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  '/suggestions/service': {
    label: '서비스 개선',
    title: '서비스 개선 건의사항',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  '/suggestions/facility': {
    label: '시설 개선',
    title: '시설 개선 건의사항',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  '/suggestions/wash-service': {
    label: '세차 서비스',
    title: '세차 서비스 건의사항',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  '/suggestions/equipment': {
    label: '장비 개선',
    title: '장비 개선 건의사항',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  '/suggestions/customer-service': {
    label: '고객 서비스',
    title: '고객 서비스 건의사항',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  '/suggestions/routes': {
    label: '배달 경로',
    title: '배달 경로 건의사항',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  '/suggestions/vehicle': {
    label: '차량 관련',
    title: '차량 관련 건의사항',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  '/suggestions/customer': {
    label: '고객 응대',
    title: '고객 응대 건의사항',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
} as const;

export const DEFAULT_SUGGESTION_BREADCRUMB_CONFIG: SuggestionBreadcrumbConfig =
  {
    label: '건의사항',
    title: '건의사항 관리',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  };

// 정적 경로로 처리하지 않을 동적 세그먼트 목록
const STATIC_SEGMENTS = new Set([
  'safety',
  'service',
  'facility',
  'wash-service',
  'equipment',
  'customer-service',
  'routes',
  'vehicle',
  'customer',
  'my',
  'create',
  'pending',
  'reviewing',
  'in-progress',
  'completed',
  'rejected',
  'analytics',
]);

export const getDynamicSuggestionConfig = (
  pathname: string
): SuggestionBreadcrumbConfig | null => {
  const editMatch = pathname.match(
    /^\/(?:admin\/)?suggestions\/([^/]+)\/edit$/
  );
  if (editMatch) {
    return {
      label: `건의사항 수정 #${editMatch[1]}`,
      title: `건의사항 수정 #${editMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  const detailMatch = pathname.match(/^\/(?:admin\/)?suggestions\/([^/]+)$/);
  if (detailMatch && !STATIC_SEGMENTS.has(detailMatch[1])) {
    return {
      label: `건의사항 #${detailMatch[1]}`,
      title: `건의사항 상세 #${detailMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  return null;
};
