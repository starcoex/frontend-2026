import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconCircleCheck,
  IconCircleX,
  IconExclamationCircle,
  IconStopwatch,
  IconEye,
} from '@tabler/icons-react';
import type { SuggestionStatus } from '@starcoex-frontend/suggestions';

export const suggestionStatuses = [
  { value: 'PENDING', label: '대기중', icon: IconExclamationCircle },
  { value: 'REVIEWING', label: '검토중', icon: IconEye },
  { value: 'IN_PROGRESS', label: '진행중', icon: IconStopwatch },
  { value: 'COMPLETED', label: '완료됨', icon: IconCircleCheck },
  { value: 'REJECTED', label: '거부됨', icon: IconCircleX },
];

export const suggestionPriorities = [
  { value: 'LOW', label: '낮음', icon: IconArrowDown },
  { value: 'MEDIUM', label: '보통', icon: IconArrowRight },
  { value: 'HIGH', label: '높음', icon: IconArrowUp },
];

export const suggestionCategories = [
  { value: 'FEATURE_REQUEST', label: '기능 요청' },
  { value: 'BUG_REPORT', label: '버그 신고' },
  { value: 'IMPROVEMENT', label: '개선 제안' },
  { value: 'COMPLAINT', label: '불만 사항' },
  { value: 'UI_UX', label: 'UI/UX 개선' },
  { value: 'OTHER', label: '기타' },
];

// ✅ 라우트 경로 → SuggestionStatus 매핑 (suggestionStatuses에서 파생)
export const PATH_STATUS_MAP: Record<string, SuggestionStatus> = {
  pending: 'PENDING',
  reviewing: 'REVIEWING',
  'in-progress': 'IN_PROGRESS',
  completed: 'COMPLETED',
  rejected: 'REJECTED', // ✅ 거부됨 별도 탭
};

// ✅ 라우트 경로 → 페이지 제목 매핑 (suggestionStatuses에서 파생)
export const PATH_TITLE_MAP: Record<string, string> = Object.fromEntries([
  ...suggestionStatuses.map((s) => [
    // value를 경로 키로 변환: IN_PROGRESS → in-progress
    s.value.toLowerCase().replace(/_/g, '-'),
    `${s.label} 건의사항`,
  ]),
  ['analytics', '건의사항 통계'],
]);
// 결과: { pending: '대기중 건의사항', reviewing: '검토중 건의사항', ... }
