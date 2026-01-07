import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  User,
  BarChart3,
  Building2,
  Mail,
  Shield,
  Bell,
  CreditCard,
  Settings,
  Truck,
} from 'lucide-react';
import type { User as UserType } from '@starcoex-frontend/graphql';
import {
  UserMenuItem,
  UserMenuProvider,
  UserMenuRoot,
  UserMenuSeparator,
} from '@starcoex-frontend/common';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SERVICES_CONFIG } from '@/app/config/service.config';
import { cn } from '@/lib/utils';

interface AuthStatus {
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isBusinessVerified: boolean;
  is2FAEnabled: boolean;
  isAdmin: boolean;
  isBusiness: boolean;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserType | null;
  isAuthenticated?: boolean | null;
  isLoading?: boolean;
  onLogout?: () => void;
  authStatus?: AuthStatus;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  user = null,
  isAuthenticated = false,
  isLoading = false,
  onLogout,
  authStatus,
}) => {
  if (!isOpen) return null;

  // 모바일용 커스텀 메뉴 아이템들 (header.tsx와 동일한 패턴)
  const MobileCustomMenuItems: React.FC = () => {
    if (!authStatus) return null;

    const items = [];

    // 대시보드
    items.push(
      <UserMenuItem key="dashboard" icon={BarChart3} href="/dashboard">
        대시보드
      </UserMenuItem>
    );

    // 프로필
    items.push(
      <UserMenuItem key="profile" icon={User} href="/profile">
        프로필 관리
      </UserMenuItem>
    );

    // 관리자 전용 메뉴
    if (authStatus.isAdmin) {
      items.push(
        <UserMenuItem key="admin" icon={Shield} href="/admin">
          관리자 패널
        </UserMenuItem>
      );
    }

    // 사업자 전용 메뉴
    if (authStatus.isBusiness) {
      items.push(
        <UserMenuItem key="business" icon={Building2} href="/business">
          사업자 관리
        </UserMenuItem>
      );
    }

    // 배송 관련 메뉴
    if (user?.role === 'DELIVERY') {
      items.push(
        <UserMenuItem key="delivery" icon={Truck} href="/delivery">
          배송 관리
        </UserMenuItem>
      );
    }

    // 인증 관련 알림 메뉴
    const verificationItems = [];

    if (!authStatus.isEmailVerified) {
      verificationItems.push(
        <UserMenuItem
          key="verify-email"
          icon={Mail}
          href="/verify-email"
          className="text-orange-600"
        >
          이메일 인증 필요
        </UserMenuItem>
      );
    }

    if (!authStatus.isPhoneVerified) {
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

    if (!authStatus.is2FAEnabled) {
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

    // 일반 설정 메뉴
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

  // 비인증 사용자용 섹션
  const GuestSection: React.FC = () => (
    <div className="px-4 pb-3">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
        <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          로그인하여 더 많은 기능을 이용해보세요
        </p>
        <div className="space-y-2">
          <Button asChild className="w-full" onClick={onClose}>
            <Link to="/auth/login">로그인</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full"
            onClick={onClose}
          >
            <Link to="/auth/register">회원가입</Link>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="lg:hidden py-4 border-t bg-white dark:bg-gray-900">
      <div className="space-y-3">
        {/* 로딩 상태 */}
        {isLoading && (
          <div className="px-4 flex items-center justify-center py-8">
            <div className="flex items-center space-x-3 text-gray-500">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span>사용자 정보를 불러오는 중...</span>
            </div>
          </div>
        )}

        {/* 인증된 사용자 - header.tsx와 동일한 패턴 */}
        {!isLoading && isAuthenticated && (
          <div className="px-4">
            <UserMenuProvider
              user={user}
              isAuthenticated={isAuthenticated}
              mobile={true} // 모바일 모드
              onLogout={onLogout}
              onMenuClick={(path) => {
                onClose(); // 메뉴 클릭 시 모바일 메뉴 닫기
              }}
            >
              {/* ✅ header.tsx와 동일한 패턴으로 커스텀 메뉴 전달 */}
              <UserMenuRoot>
                <MobileCustomMenuItems />
              </UserMenuRoot>
            </UserMenuProvider>
          </div>
        )}

        {/* 비인증 사용자 */}
        {!isLoading && !isAuthenticated && <GuestSection />}

        <Separator className="mx-4" />

        {/* 서비스 메뉴 */}
        {SERVICES_CONFIG.map((service) => {
          const Icon = service.icon;
          return (
            <Link
              key={service.id}
              to={service.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 mx-4 rounded-lg text-sm font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-800',
                !service.available && 'opacity-50 cursor-not-allowed'
              )}
              onClick={onClose}
            >
              <Icon className={`w-5 h-5 ${service.color.primary}`} />
              <div className="flex-1">
                <div className="font-medium">{service.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {service.description}
                </div>
              </div>
              {!service.available && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  준비중
                </span>
              )}
            </Link>
          );
        })}

        <Separator className="mx-4" />

        {/* 연락처 버튼 */}
        <div className="px-4 pt-3">
          <Button
            variant="outline"
            className="w-full justify-center space-x-2"
            onClick={() => (window.location.href = 'tel:064-713-2002')}
          >
            <Phone className="w-4 h-4" />
            <span>064-713-2002</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
