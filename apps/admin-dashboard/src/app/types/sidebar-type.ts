import React from 'react';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Team {
  name: string;
  logo: React.ElementType;
  plan: string;
}

interface BaseNavItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
  url?: string;
  disabled?: boolean;
}

// 재귀적 NavItem 타입 - 다중 레벨 중첩 지원
export type NavItem = BaseNavItem & {
  items?: NavItem[]; // 하위 아이템들 (재귀적)
};

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarData {
  user: User;
  teams: Team[];
  navGroups: NavGroup[];
}

// 권한 타입 정의
export type UserRole = 'ADMIN' | 'DELIVERY' | 'SUPER_ADMIN' | 'USER';

// 팀 이름 타입 정의
export type TeamName = 'StarcoexMain' | 'StarOil' | 'Zeragae' | 'Delivery';

// 메뉴 권한 설정 타입
interface RolePermission {
  role: UserRole;
  allowedMenus: string[];
}

// 팀별 컨텍스트 설정 타입
interface TeamContext {
  teamName: TeamName;
  userRole: UserRole;
}

// 사이드바 설정 함수들의 타입
export interface SidebarConfig {
  getNavGroupsByTeam: (teamName: TeamName) => NavGroup[];
  filterMenuByRole: (navGroups: NavGroup[], userRole: UserRole) => NavGroup[];
  getSidebarData: (teamName: TeamName, userRole?: UserRole) => SidebarData;
}

// 메뉴 아이템 유틸리티 타입들
export interface MenuItemWithUrl extends BaseNavItem {
  url: string;
  items?: never;
}

export interface MenuItemWithChildren extends BaseNavItem {
  url?: never;
  items: NavItem[];
}

// 대시보드 위젯 관련 타입
export interface DashboardWidget {
  type: string;
  title: string;
  data?: any;
  config?: {
    refreshInterval?: number;
    allowRefresh?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
  };
}

// 팀별 대시보드 설정 타입
export interface TeamDashboardConfig {
  teamName: TeamName;
  widgets: DashboardWidget[];
  layout?: {
    columns: number;
    rows: number;
  };
}

export type { SidebarData, NavGroup, User, Team, RolePermission, TeamContext };

// ✅ 설정 관련 타입 추가 (기존 NavItem 구조 활용)
// 설정 네비게이션 아이템 (기존 NavItem과 호환)
export interface SettingsNavItem extends BaseNavItem {
  href: string; // url 대신 href 사용 (설정 전용)
  items?: never; // 설정은 플랫 구조
  description?: string; // 설정 전용 설명
}

// 설정 네비게이션 그룹
export interface SettingsNavGroup {
  title: string;
  items: SettingsNavItem[];
}

// 설정 사이드바 데이터
export interface SettingsNavData {
  groups: SettingsNavGroup[];
}

// ✅ 건의사항 관련 타입 추가
// 건의사항 상태
export type SuggestionStatus =
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'rejected';

// 건의사항 우선순위
export type SuggestionPriority = 'low' | 'medium' | 'high' | 'urgent';

// 건의사항 카테고리 (팀별 확장 가능)
export type SuggestionCategory =
  | 'safety' // 안전 관련
  | 'service' // 서비스 개선
  | 'facility' // 시설 개선
  | 'equipment' // 장비 개선
  | 'process' // 프로세스 개선
  | 'customer' // 고객 서비스
  | 'routes' // 배달 경로 (배달팀 전용)
  | 'vehicle' // 차량 관련 (배달팀 전용)
  | 'wash-service' // 세차 서비스 (카케어팀 전용)
  | 'other'; // 기타

// 권한별 기능 차이 인터페이스
export interface SuggestionPermissions {
  canViewAll: boolean; // 전체 목록 조회
  canViewDetails: boolean; // 상세 내용 조회
  canComment: boolean; // 댓글 작성
  canEdit: boolean; // 수정 권한 (본인 건의사항만)
  canEditAll: boolean; // 모든 건의사항 수정 권한
  canAssign: boolean; // 담당자 배정
  canChangeStatus: boolean; // 상태 변경
  canDelete: boolean; // 삭제 권한
}

// 역할별 권한 매핑 타입
export type SuggestionRolePermissions = {
  [K in UserRole]: SuggestionPermissions;
};

// 건의사항 필터링 옵션
export interface SuggestionFilters {
  category: 'all' | SuggestionCategory;
  status: 'all' | SuggestionStatus;
  priority: 'all' | SuggestionPriority;
  author: 'all' | 'my' | 'team';
  assignee: 'all' | 'assigned-to-me' | 'unassigned';
  dateRange?: {
    from: Date;
    to: Date;
  };
  teamName?: TeamName; // 통합 관리시 팀별 필터링
}

// 건의사항 기본 구조
export interface Suggestion {
  id: string;
  title: string;
  content: string;
  category: SuggestionCategory;
  priority: SuggestionPriority;
  status: SuggestionStatus;
  teamName: TeamName;

  // 사용자 관련
  submittedBy: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };

  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };

  // 날짜 관련
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  completedAt?: Date;

  // 추가 정보
  attachments?: string[];
  tags?: string[];
  isAnonymous?: boolean;

  // 상호작용
  viewCount?: number;
  commentCount?: number;
  likeCount?: number;
}

// 건의사항 댓글
export interface SuggestionComment {
  id: string;
  suggestionId: string;
  content: string;
  author: {
    id: string;
    name: string;
    role: UserRole;
  };
  createdAt: Date;
  updatedAt?: Date;
  parentId?: string; // 대댓글 지원
  isInternal?: boolean; // 내부 관리자용 댓글
}

// 건의사항 통계
export interface SuggestionStats {
  total: number;
  byStatus: Record<SuggestionStatus, number>;
  byPriority: Record<SuggestionPriority, number>;
  byCategory: Record<SuggestionCategory, number>;
  byTeam: Record<TeamName, number>;
  averageResolutionTime: number; // 평균 해결 시간 (일)
  monthlyTrend: {
    month: string;
    submitted: number;
    completed: number;
  }[];
}

// 건의사항 생성/수정 폼 데이터
export interface SuggestionFormData {
  title: string;
  content: string;
  category: SuggestionCategory;
  priority: SuggestionPriority;
  dueDate?: Date;
  attachments?: File[];
  tags?: string[];
  isAnonymous?: boolean;
}

// 건의사항 액션 타입 (상태 변경 등에 사용)
export type SuggestionAction =
  | 'approve' // 승인
  | 'reject' // 거부
  | 'assign' // 배정
  | 'start' // 진행 시작
  | 'complete' // 완료
  | 'reopen' // 재오픈
  | 'escalate'; // 에스컬레이션

// 건의사항 액션 이력
export interface SuggestionHistory {
  id: string;
  suggestionId: string;
  action: SuggestionAction;
  performedBy: {
    id: string;
    name: string;
    role: UserRole;
  };
  previousStatus?: SuggestionStatus;
  newStatus: SuggestionStatus;
  comment?: string;
  createdAt: Date;
}
