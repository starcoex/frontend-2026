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

// ✅ UI 상수: 상태별 스타일 (백엔드 Role enum과 일치)
export const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  INACTIVE: 'bg-neutral-300/40 border-neutral-300',
  INVITED: 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300',
  SUSPENDED:
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  PENDING: 'bg-yellow-100/30 text-yellow-900 border-yellow-200',
};

// ✅ UI 상수: 역할별 아이콘 (백엔드 Role enum과 일치)
export const userTypes = [
  {
    label: 'Super Admin',
    value: 'SUPER_ADMIN', // ← GraphQL enum과 일치
    icon: IconShield,
  },
  {
    label: 'Admin',
    value: 'ADMIN',
    icon: IconUserShield,
  },
  {
    label: 'User',
    value: 'USER',
    icon: IconUsersGroup,
  },
  {
    label: 'Delivery',
    value: 'DELIVERY',
    icon: IconCash,
  },
] as const;

// ✅ UI 상수: 통계 카드 메타데이터
export interface UserStatProps {
  title: string;
  desc: string;
  stat: string; // 실제 값은 useUsers에서 설정
  statDesc: string;
  icon: TablerIcon;
}

export const userStatsConfig: UserStatProps[] = [
  {
    title: 'Total Users',
    desc: 'Total number of users',
    stat: '0', // placeholder
    statDesc: 'All registered users',
    icon: IconUsersGroup,
  },
  {
    title: 'New Users',
    desc: 'Users joined this month',
    stat: '0',
    statDesc: 'Monthly growth',
    icon: IconUsersPlus,
  },
  {
    title: 'Pending Verifications',
    desc: 'Users awaiting verification',
    stat: '0',
    statDesc: 'Requires action',
    icon: IconUserScan,
  },
  {
    title: 'Active Users',
    desc: 'Active in last 30 days',
    stat: '0',
    statDesc: 'Engagement rate',
    icon: IconUserCheck,
  },
];
