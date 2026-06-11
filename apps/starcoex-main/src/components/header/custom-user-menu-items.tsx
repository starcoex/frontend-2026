import React from 'react';
import {
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  CreditCard,
  Phone,
  Settings,
  Shield,
  Star,
  Truck,
  User,
} from 'lucide-react';
import { UserMenuItem, UserMenuSeparator } from '@starcoex-frontend/common';
import type { User as UserType } from '@starcoex-frontend/graphql';

interface CustomUserMenuItemsProps {
  currentUser?: UserType | null;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isBusiness: () => boolean;
  isPhoneVerified: () => boolean;
  is2FAEnabled: () => boolean;
}

export const CustomUserMenuItems: React.FC<CustomUserMenuItemsProps> = ({
  currentUser,
  isAdmin,
  isSuperAdmin,
  isBusiness,
  isPhoneVerified,
  is2FAEnabled,
}) => {
  const items: React.ReactNode[] = [];

  // 멤버십 등급/별 뱃지
  const tier = currentUser?.membership?.currentTierDisplayName;
  const availableStars = currentUser?.membership?.availableStars;

  if (tier) {
    items.push(
      <div
        key="membership-badge"
        className="flex items-center justify-between px-3 py-2 mx-1 rounded-lg bg-muted/50"
      >
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <Star className="w-4 h-4 text-yellow-500" />
          <span>{tier}</span>
        </div>
        {availableStars !== undefined && (
          <span className="text-xs text-muted-foreground">
            {availableStars.toLocaleString()}별
          </span>
        )}
      </div>
    );
  }

  items.push(
    <UserMenuItem key="dashboard" icon={BarChart3} href="/dashboard">
      대시보드
    </UserMenuItem>
  );

  items.push(
    <UserMenuItem key="profile" icon={User} href="/profile">
      프로필 관리
    </UserMenuItem>
  );
  items.push(
    <UserMenuItem
      key="my-applications"
      icon={Briefcase}
      href="/my-applications"
    >
      내 지원 현황
    </UserMenuItem>
  );
  if (isAdmin() || isSuperAdmin()) {
    items.push(
      // <UserMenuItem key="admin" icon={Shield} href="/auth/dashboard">
      <UserMenuItem
        key="admin-panel"
        icon={Shield}
        onClick={() => window.open('https://admin.starcoex.com', '_blank')}
        className="text-primary"
      >
        관리자 패널
      </UserMenuItem>
    );
  }

  if (isBusiness()) {
    items.push(
      <UserMenuItem key="business" icon={Building2} href="/business">
        사업자 관리
      </UserMenuItem>
    );
  }

  if (currentUser?.role === 'DELIVERY') {
    items.push(
      <UserMenuItem key="delivery" icon={Truck} href="/delivery">
        배송 관리
      </UserMenuItem>
    );
  }

  const verificationItems: React.ReactNode[] = [];

  if (!isPhoneVerified()) {
    verificationItems.push(
      <UserMenuItem
        key="verify-phone"
        icon={Phone}
        href="/verify-phone"
        className="text-orange-600"
      >
        휴대폰 인증 필요
      </UserMenuItem>
    );
  }

  if (!is2FAEnabled()) {
    verificationItems.push(
      <UserMenuItem
        key="setup-2fa"
        icon={Shield}
        href="/security"
        className="text-blue-600"
      >
        2단계 인증 설정
      </UserMenuItem>
    );
  }

  if (verificationItems.length > 0) {
    items.push(<UserMenuSeparator key="verification-separator" />);
    items.push(...verificationItems);
  }

  items.push(
    <UserMenuSeparator key="settings-separator" />,
    <UserMenuItem key="notifications" icon={Bell} href="/notifications">
      알림 설정
    </UserMenuItem>,
    <UserMenuItem key="billing" icon={CreditCard} href="/billing">
      결제 정보
    </UserMenuItem>,
    <UserMenuItem key="settings" icon={Settings} href="/settings">
      계정 설정
    </UserMenuItem>
  );

  return <>{items}</>;
};
