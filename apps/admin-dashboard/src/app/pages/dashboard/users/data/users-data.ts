import {
  IconCash,
  IconShield,
  IconUserCheck,
  IconUserScan,
  IconUsersGroup,
  IconUserShield,
  IconUsersPlus,
  TablerIcon,
} from '@tabler/icons-react';

// 상태별 스타일 (백엔드 status 값과 일치)
export const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  INACTIVE: 'bg-neutral-300/40 border-neutral-300',
  INVITED: 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300',
  SUSPENDED:
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  PENDING: 'bg-yellow-100/30 text-yellow-900 border-yellow-200',
};

// 역할별 레이블 + 아이콘 (백엔드 Role enum과 일치)
export const userTypes = [
  {
    label: '최고 관리자',
    value: 'SUPER_ADMIN',
    icon: IconShield,
  },
  {
    label: '관리자',
    value: 'ADMIN',
    icon: IconUserShield,
  },
  {
    label: '일반 회원',
    value: 'USER',
    icon: IconUsersGroup,
  },
  {
    label: '배송 담당',
    value: 'DELIVERY',
    icon: IconCash,
  },
] as const;

// 통계 카드 메타데이터 타입
export interface UserStatProps {
  title: string;
  desc: string;
  stat: string;
  statDesc: string;
  icon: TablerIcon;
}

// 통계 카드 설정 — stat 값은 users-stats.tsx에서 실제 API 데이터로 주입
export const userStatsConfig: UserStatProps[] = [
  {
    title: '전체 사용자',
    desc: '시스템에 등록된 전체 사용자 수',
    stat: '0',
    statDesc: '누적 가입자',
    icon: IconUsersGroup,
  },
  {
    title: '활성 사용자',
    desc: '현재 활성 상태인 사용자 수',
    stat: '0',
    statDesc: '정상 이용 중',
    icon: IconUserCheck,
  },
  {
    title: '이메일 미인증',
    desc: '이메일 인증을 완료하지 않은 사용자',
    stat: '0',
    statDesc: '조치 필요',
    icon: IconUserScan,
  },
  {
    title: '비활성 사용자',
    desc: '비활성화된 사용자 수',
    stat: '0',
    statDesc: '접근 제한 상태',
    icon: IconUsersPlus,
  },
];
