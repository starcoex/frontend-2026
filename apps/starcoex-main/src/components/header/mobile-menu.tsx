import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  ContactButton,
  UserMenuLogout,
  UserMenuProvider,
  UserMenuRoot,
  UserMenuSeparator,
} from '@starcoex-frontend/common';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, User } from 'lucide-react';
import type { User as UserType } from '@starcoex-frontend/graphql';
import { SERVICES_CONFIG } from '@/app/config/service.config';
import { MobileCompanyNav } from '@/components/header/mobile-company-nav';
import { CustomUserMenuItems } from '@/components/header/custom-user-menu-items';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserType | null;
  isAuthenticated?: boolean | null;
  isLoading?: boolean;
  onLogout: () => Promise<void>;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isBusiness: () => boolean;
  isPhoneVerified: () => boolean;
  is2FAEnabled: () => boolean;
}

const GuestSection: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="px-4 pb-3">
    <div className="p-4 bg-muted rounded-xl text-center">
      <User className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
      <p className="text-sm text-muted-foreground mb-4">
        로그인하여 더 많은 기능을 이용해보세요
      </p>
      <div className="space-y-2">
        <Button asChild className="w-full" onClick={onClose}>
          <Link to="/auth/login">로그인</Link>
        </Button>
        <Button asChild variant="outline" className="w-full" onClick={onClose}>
          <Link to="/auth/register">회원가입</Link>
        </Button>
      </div>
    </div>
  </div>
);

/** 서비스 목록 — 아코디언 방식 */
const ServicesAccordion: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(
    SERVICES_CONFIG.some((s) => location.pathname.startsWith(s.href))
  );

  return (
    <div className="border-b border-border/50">
      {/* 아코디언 헤더 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium hover:bg-accent transition-colors"
      >
        <span>서비스</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* 아코디언 콘텐츠 */}
      {isOpen && (
        <div className="pb-2 space-y-0.5">
          {SERVICES_CONFIG.map((service) => {
            const Icon = service.icon;
            const isActive = location.pathname === service.href;

            return (
              <Link
                key={service.id}
                to={service.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  !service.available && 'opacity-50 pointer-events-none'
                )}
              >
                <Icon
                  className={cn('w-4 h-4 shrink-0', service.color.primary)}
                />
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium leading-none mb-0.5">
                    {service.name}
                  </span>
                  <span className="text-xs opacity-70 leading-none">
                    {service.description}
                  </span>
                </div>
                {!service.available && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full shrink-0">
                    준비중
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  currentUser,
  isAuthenticated,
  isLoading,
  onLogout,
  isAdmin,
  isSuperAdmin,
  isBusiness,
  isPhoneVerified,
  is2FAEnabled,
}) => {
  return (
    <div
      className={`bg-background fixed inset-0 top-16 container flex h-[calc(100vh-64px)] flex-col transition-all duration-300 ease-in-out lg:hidden ${
        isOpen
          ? 'visible translate-x-0 opacity-100'
          : 'invisible translate-x-full opacity-0'
      }`}
    >
      <nav className="mt-3 flex flex-1 flex-col gap-4 overflow-y-auto pb-6">
        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3 text-muted-foreground">
              <div className="w-5 h-5 border-2 border-muted border-t-blue-600 rounded-full animate-spin" />
              <span className="text-sm">사용자 정보를 불러오는 중...</span>
            </div>
          </div>
        )}

        {/* ✅ 인증된 사용자 메뉴 — UserMenuProvider를 최상위로 올려서 컨텍스트 보장 */}
        {!isLoading && isAuthenticated && currentUser && (
          <UserMenuProvider
            user={currentUser}
            isAuthenticated={isAuthenticated}
            mobile={true}
            onLogout={onLogout}
            onMenuClick={onClose}
          >
            <UserMenuRoot>
              <CustomUserMenuItems
                currentUser={currentUser}
                isAdmin={isAdmin}
                isSuperAdmin={isSuperAdmin}
                isBusiness={isBusiness}
                isPhoneVerified={isPhoneVerified}
                is2FAEnabled={is2FAEnabled}
              />
              <UserMenuSeparator />
              <UserMenuLogout />
            </UserMenuRoot>
          </UserMenuProvider>
        )}

        {/* 비인증 사용자 */}
        {!isLoading && !isAuthenticated && <GuestSection onClose={onClose} />}

        <Separator />

        {/* 회사소개 — 아코디언 */}
        <MobileCompanyNav onClose={onClose} />

        {/* ✅ 서비스 목록 — 아코디언 방식으로 개선 */}
        <ServicesAccordion onClose={onClose} />

        <Separator />

        <Link
          to="/faq"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium hover:bg-accent transition-colors border-b border-border/50"
        >
          자주 묻는 질문
        </Link>
        <Link
          to="/contact"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium hover:bg-accent transition-colors border-b border-border/50"
        >
          문의하기
        </Link>

        {/* 연락처 */}
        <ContactButton
          variant="outline"
          className="mx-4"
          phoneNumber="064-713-2002"
          showText={true}
          textBreakpoint="always"
        />
      </nav>
    </div>
  );
};
