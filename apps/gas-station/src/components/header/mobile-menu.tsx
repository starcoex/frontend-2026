import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
} from 'lucide-react';
import { StarcoexService } from '@/app/utils/brand-constants';
import {
  ContactButton,
  UserMenuData,
  UserMenuItem,
  UserMenuLogout,
  UserMenuProvider,
  UserMenuRoot,
  UserMenuSeparator,
} from '@starcoex-frontend/common';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { HeaderServicesMobileSection } from '@/components/header/components/header-services-mobile-section';

// 타입 정의 (header.tsx와 동일한 구조)
interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CompanyMenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
  companyMenuItems: CompanyMenuItem[];
  starcoexServices: StarcoexService[]; // 타입 변경
  isActivePath: (path: string) => boolean;
  user?: UserMenuData | null;
  isAuthenticated?: boolean | null;
  onLogout?: () => void;
}

// Provider Context를 사용하는 알림 섹션
const NotificationSection: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // NotificationProvider의 Context 사용
  // const { unreadCount, hasUnreadNotifications } = useNotificationContext();

  return (
    <div className="mx-2">
      <Button
        variant="ghost"
        className="group flex items-center justify-between w-full h-auto px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <span className="text-foreground group-hover:text-accent-foreground transition-colors">
            알림
            {/*알림 {hasUnreadNotifications && `(${unreadCount})`}*/}
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground transition-transform" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground transition-transform" />
        )}
      </Button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="mt-1 ml-8">
          {/* shadcn-ui NotificationDropdown을 모바일용으로 사용 */}
          {/*<NotificationDropdown*/}
          {/*  className="w-full border-0 shadow-none bg-transparent"*/}
          {/*  renderTrigger={() => (*/}
          {/*    <div className="w-full p-2 text-center text-sm text-muted-foreground">*/}
          {/*      알림을 보려면 클릭하세요*/}
          {/*    </div>*/}
          {/*  )}*/}
          {/*  onViewAll={() => onClose()}*/}
          {/*  maxItems={3}*/}
          {/*/>*/}
        </div>
      </div>
    </div>
  );
};

// Provider Context를 사용하는 장바구니 섹션
const CartSection: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // CartProvider의 Context 사용
  // const { totalItems, totalPrice, isEmpty } = useCartContext();

  return (
    <div className="mx-2">
      <Button
        variant="ghost"
        className="group flex items-center justify-between w-full h-auto px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <span className="text-foreground group-hover:text-accent-foreground transition-colors">
            장바구니
            {/*장바구니 {!isEmpty && `(${totalItems})`}*/}
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground transition-transform" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground transition-transform" />
        )}
      </Button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="mt-1 ml-8">
          {/* shadcn-ui CartDropdown을 모바일용으로 사용 */}
          {/*<CartDropdown*/}
          {/*  className="w-full border-0 shadow-none bg-transparent"*/}
          {/*  renderTrigger={() => (*/}
          {/*    <div className="w-full p-2 text-center text-sm text-muted-foreground">*/}
          {/*      {isEmpty*/}
          {/*        ? '장바구니가 비어있습니다'*/}
          {/*        : `총 ${totalPrice.toLocaleString()}원`}*/}
          {/*    </div>*/}
          {/*  )}*/}
          {/*  onViewCart={() => onClose()}*/}
          {/*/>*/}
        </div>
      </div>
    </div>
  );
};

const NavigationSection: React.FC<{
  items: NavigationItem[];
  isActivePath: (path: string) => boolean;
  onClose: () => void;
}> = ({ items, isActivePath, onClose }) => (
  <div className="space-y-1">
    {items.map((item) => {
      const Icon = item.icon;
      const isActive = isActivePath(item.href);

      return (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            'flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground',
            isActive && 'bg-accent text-accent-foreground'
          )}
          onClick={onClose}
        >
          <Icon className="w-5 h-5" />
          <div className="flex-1">
            <div className="font-medium">{item.label}</div>
          </div>
        </Link>
      );
    })}
  </div>
);

const CompanySection: React.FC<{
  items: CompanyMenuItem[];
  onClose: () => void;
}> = ({ items, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mx-2">
      <Button
        variant="ghost"
        className="group flex items-center justify-between w-full h-auto px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <Building2 className="w-5 h-5 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
          <span className="text-foreground group-hover:text-accent-foreground transition-colors">
            회사 정보
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground transition-transform" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground transition-transform" />
        )}
      </Button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="mt-1 ml-8 space-y-1">
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={onClose}
              className="group flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
              <div>
                <div className="font-medium text-sm text-foreground group-hover:text-accent-foreground transition-colors">
                  {item.label}
                </div>
                <div className="text-xs text-muted-foreground group-hover:text-accent-foreground transition-colors mt-0.5">
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navigationItems,
  companyMenuItems,
  starcoexServices, // props 이름 변경
  isActivePath,
  user,
  isAuthenticated,
  onLogout,
}) => {
  if (!isOpen) return null;

  const handleMenuClick = (path: string) => {
    onClose();
  };

  return (
    <div className="lg:hidden py-4 border-t bg-background">
      <div className="space-y-3">
        {/* 사용자 메뉴 섹션 */}
        <div className="px-4 pb-3">
          <UserMenuProvider
            user={user}
            isAuthenticated={isAuthenticated}
            mobile={true}
            onLogout={onLogout}
            onMenuClick={handleMenuClick}
          >
            <UserMenuRoot>
              {isAuthenticated && (
                <div className="mt-2 space-y-1">
                  <UserMenuItem icon={LayoutDashboard} href="/my">
                    마이페이지
                  </UserMenuItem>
                  <UserMenuItem href="/profile">프로필</UserMenuItem>
                  <UserMenuItem href="/settings">설정</UserMenuItem>
                  <UserMenuSeparator />
                  <UserMenuLogout />
                </div>
              )}
            </UserMenuRoot>
          </UserMenuProvider>
        </div>

        {/* 인증된 사용자에게만 알림과 장바구니 섹션 표시 */}
        {isAuthenticated && (
          <>
            <Separator className="mx-4" />

            {/* Provider Context를 사용하는 알림 섹션 */}
            <NotificationSection onClose={onClose} />

            {/* Provider Context를 사용하는 장바구니 섹션 */}
            <CartSection onClose={onClose} />
          </>
        )}

        <Separator className="mx-4" />

        {/* 주요 네비게이션 메뉴 */}
        <NavigationSection
          items={navigationItems}
          isActivePath={isActivePath}
          onClose={onClose}
        />

        <Separator className="mx-4" />

        {/* 회사 정보 드롭다운 */}
        <CompanySection items={companyMenuItems} onClose={onClose} />

        {/* 다른 서비스 드롭다운 - 공통 컴포넌트 사용 */}
        <HeaderServicesMobileSection
          services={starcoexServices || []} // undefined 체크 추가
          onClose={onClose}
          onServiceClick={(service) => {
            console.log(`${service.title} 클릭됨`);
            window.open(service.href, '_blank');
          }}
        />

        <Separator className="mx-4" />
        {/* 연락처 버튼 - 공통 컴포넌트 사용 */}
        <div className="px-4 pt-6">
          <ContactButton
            className="w-full justify-center h-auto py-3 text-sm font-medium text-foreground border-border bg-background hover:bg-accent hover:text-accent-foreground"
            phoneNumber="064-713-2002"
            showText={true}
            textBreakpoint="always"
            variant="outline"
          />
        </div>

        {/*/!* 연락처 버튼 *!/*/}
        {/*<div className="px-4 pt-6">*/}
        {/*  <Button*/}
        {/*    variant="outline"*/}
        {/*    className="w-full justify-center space-x-2 h-auto py-3 text-sm font-medium text-foreground border-border bg-background hover:bg-accent hover:text-accent-foreground"*/}
        {/*    onClick={() => (window.location.href = 'tel:064-713-2002')}*/}
        {/*  >*/}
        {/*    <Phone className="w-5 h-5" />*/}
        {/*    <span>064-713-2002</span>*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};
