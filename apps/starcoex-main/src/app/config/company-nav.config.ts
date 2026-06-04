import { Building2, Lightbulb, Clock, Palette, Users } from 'lucide-react';
import React from 'react';

export interface CompanyNavItem {
  label: string;
  labelEn: string;
  href: string;
  description: string;
  icon: React.ComponentType<any>;
}

export const COMPANY_NAV_CONFIG: CompanyNavItem[] = [
  {
    label: '회사소개',
    labelEn: 'About Us',
    href: '/about',
    description: '스타코엑스의 이야기',
    icon: Building2,
  },
  {
    label: '경영철학',
    labelEn: 'Philosophy',
    href: '/about/philosophy',
    description: '끊임없는 변화와 혁신',
    icon: Lightbulb,
  },
  {
    label: '주요 연혁',
    labelEn: 'History',
    href: '/about/history',
    description: '걸어온 발자취',
    icon: Clock,
  },
  {
    label: 'CI 소개',
    labelEn: 'CI',
    href: '/about/ci',
    description: '브랜드 아이덴티티',
    icon: Palette,
  },
  {
    label: '인재채용',
    labelEn: 'Careers',
    href: '/careers',
    description: '함께 성장할 인재 모집',
    icon: Users,
  },
] as const;
