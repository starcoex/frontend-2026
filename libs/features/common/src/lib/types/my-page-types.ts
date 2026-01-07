import React from 'react';
import type { User, UserMembership } from '@starcoex-frontend/graphql';

/**
 * 마이페이지 탭 정의
 */
export interface MyPageTab {
  /** 탭 고유 ID */
  id: string;
  /** 탭 표시 이름 */
  label: string;
  /** 탭 아이콘 (선택) */
  icon?: React.ComponentType<{ className?: string }>;
  /** 탭 내용 컴포넌트 */
  content: React.ReactNode;
  /** 뱃지 (쿠폰 수, 알림 수 등) */
  badge?: number | string;
  /** 비활성화 여부 */
  disabled?: boolean;
}

/**
 * 멤버십 표시 정보 (UI용 확장)
 */
export interface MembershipDisplayInfo {
  /** 원본 멤버십 데이터 */
  data?: UserMembership | null;
  /** 등급 아이콘 (UI용) */
  gradeIcon?: React.ReactNode;
  /** 다음 등급까지 진행률 (0-100) */
  progress?: number;
  /** 다음 등급까지 남은 금액/포인트 (포맷된 문자열) */
  remainingText?: string;
}

/**
 * 마이페이지 레이아웃 Props
 */
export interface MyPageLayoutProps {
  /** 사용자 정보 */
  user: User | null;
  /** 탭 구성 - 각 앱에서 커스터마이징 */
  tabs: MyPageTab[];
  /** 기본 선택 탭 ID */
  defaultTab?: string;
  /** 현재 선택된 탭 ID (외부 제어용) */
  activeTab?: string;
  /** 탭 변경 핸들러 */
  onTabChange?: (tabId: string) => void;
  /** 페이지 타이틀 (기본: "마이페이지") */
  title?: string;
  /** 브랜드/액센트 컬러 (선택) */
  accentColor?: 'default' | 'orange' | 'green' | 'blue' | 'purple';
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 마이페이지 탭 Props
 */
export interface MyPageTabsProps {
  tabs: MyPageTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

/**
 * 프로필 요약 카드 Props (개요 탭에서 사용)
 */
export interface ProfileSummaryCardProps {
  /** 사용자 정보 */
  user: User | null;
  /** 멤버십 표시 정보 */
  membership?: MembershipDisplayInfo;
  /** 프로필 편집 클릭 */
  onEditProfile?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 통계 카드 Props
 */
export interface StatCardProps {
  /** 아이콘 */
  icon: React.ReactNode;
  /** 라벨 */
  label: string;
  /** 값 */
  value: string | number;
  /** 클릭 핸들러 (선택) */
  onClick?: () => void;
  /** 색상 테마 */
  variant?: 'default' | 'primary' | 'success' | 'warning';
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 주문 카드 Props
 */
export interface OrderCardProps {
  /** 주문 ID */
  orderId: string | number;
  /** 주문일 */
  orderDate: string | Date;
  /** 주문 상품명 */
  productName: string;
  /** 주문 금액 */
  amount: number;
  /** 주문 상태 */
  status: 'pending' | 'completed' | 'cancelled' | 'shipping' | 'delivered';
  /** 상태 라벨 (커스텀) */
  statusLabel?: string;
  /** 상세보기 클릭 */
  onViewDetail?: () => void;
  /** 추가 액션 버튼들 */
  actions?: React.ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 쿠폰 카드 Props
 */
export interface CouponCardProps {
  /** 쿠폰 ID */
  couponId: string;
  /** 쿠폰명 */
  name: string;
  /** 쿠폰 설명 */
  description?: string;
  /** 만료일 */
  expiresAt: string | Date;
  /** 사용 가능 여부 */
  isUsable?: boolean;
  /** 사용 완료 여부 */
  isUsed?: boolean;
  /** QR 코드 보기 */
  onShowQR?: () => void;
  /** 선물하기 */
  onGift?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 멤버십 카드 Props
 */
export interface MembershipCardProps {
  /** 사용자 멤버십 데이터 */
  membership: UserMembership | null;
  /** UI 표시용 추가 정보 */
  displayInfo?: MembershipDisplayInfo;
  /** 혜택 목록 */
  benefits?: string[];
  /** 등급 안내 클릭 */
  onViewGradeInfo?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}
