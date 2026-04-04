import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Building2,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  ShoppingBag,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAuth } from '@starcoex-frontend/auth';
import { useNotifications } from '@starcoex-frontend/notifications';
import {
  ContactButton,
  HeaderServicesMobileSection,
  NotificationStatus,
  UserMenuData,
  UserMenuItem,
  UserMenuLogout,
  UserMenuProvider,
  UserMenuRoot,
  UserMenuSeparator,
} from '@starcoex-frontend/common';
import { StarcoexService } from '@/app/utils/brand-constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// ── 타입 정의 ──────────────────────────────────────────────────────────────────

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
  starcoexServices: StarcoexService[];
  isActivePath: (path: string) => boolean;
  user?: UserMenuData | null;
  isAuthenticated?: boolean | null;
  onLogout?: () => void;
}

// ── 알림 섹션 ──────────────────────────────────────────────────────────────────

const NotificationSection: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const { currentUser } = useAuth();
  const userId = currentUser?.id ?? null;

  const {
    notifications,
    unreadCount,
    isLoading,
    fetchMyNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const hasUnread = unreadCount > 0;
  const recentNotifications = notifications.slice(0, 3);

  const handleExpand = async () => {
    const next = !isExpanded;
    setIsExpanded(next);
    if (next && userId) {
      await fetchMyNotifications({ userId, limit: 3, offset: 0 });
    }
  };

  const handleItemClick = async (notification: any) => {
    if (notification.status === NotificationStatus.UNREAD) {
      await markAsRead(notification.id);
    }
    onClose();
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  // 비로그인 시 렌더링하지 않음
  if (!userId) return null;

  return (
    <div className="mx-2">
      {/* 토글 버튼 */}
      <Button
        variant="ghost"
        className="group flex items-center justify-between w-full h-auto px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-lg"
        onClick={handleExpand}
      >
        <div className="flex items-center space-x-3">
          <Bell className="w-5 h-5 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
          <span className="text-foreground group-hover:text-accent-foreground transition-colors">
            알림
          </span>
          {hasUnread && (
            <Badge
              variant="destructive"
              className="min-w-[18px] h-[18px] flex items-center justify-center p-0 text-[10px] font-bold"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground transition-transform" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground transition-transform" />
        )}
      </Button>

      {/* 알림 목록 (아코디언) */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="mt-1 ml-4 mr-2 space-y-1 pb-2">
          {isLoading ? (
            <p className="text-xs text-muted-foreground px-3 py-2">
              불러오는 중...
            </p>
          ) : recentNotifications.length === 0 ? (
            <p className="text-xs text-muted-foreground px-3 py-2">
              새로운 알림이 없습니다
            </p>
          ) : (
            recentNotifications.map((notification) => {
              const isUnread =
                notification.status === NotificationStatus.UNREAD;
              const timeAgo = formatDistanceToNow(
                new Date(notification.createdAt),
                { addSuffix: true, locale: ko }
              );

              return (
                <Button
                  key={notification.id}
                  variant="ghost"
                  className={cn(
                    'w-full h-auto justify-start text-left px-3 py-2 rounded-lg',
                    isUnread && 'bg-primary/5 border-l-2 border-l-primary'
                  )}
                  onClick={() => handleItemClick(notification)}
                >
                  <div className="flex items-start gap-2.5 w-full">
                    <span
                      className={cn(
                        'mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full',
                        isUnread ? 'bg-primary' : 'bg-muted-foreground/30'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm truncate',
                          isUnread
                            ? 'font-semibold'
                            : 'font-medium text-muted-foreground'
                        )}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {timeAgo}
                      </p>
                    </div>
                  </div>
                </Button>
              );
            })
          )}

          {/* 액션 버튼 */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-xs h-8"
              onClick={() => {
                onClose();
                navigate('/notifications');
              }}
            >
              모든 알림 보기
            </Button>
            {hasUnread && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 px-3"
                onClick={() => markAllAsRead()}
                disabled={isLoading}
              >
                모두 읽음
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── 네비게이션 섹션 ────────────────────────────────────────────────────────────

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

// ── 회사 정보 섹션 ─────────────────────────────────────────────────────────────

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

// ── MobileMenu ─────────────────────────────────────────────────────────────────

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navigationItems,
  companyMenuItems,
  starcoexServices,
  isActivePath,
  user,
  isAuthenticated,
  onLogout,
}) => {
  if (!isOpen) return null;

  const handleMenuClick = () => onClose();

  return (
    <div className="lg:hidden py-4 border-t bg-background">
      <div className="space-y-3">
        {/* 사용자 메뉴 */}
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
                  <UserMenuItem icon={LayoutDashboard} href="/dashboard">
                    마이페이지
                  </UserMenuItem>
                  <UserMenuItem icon={ShoppingBag} href="/orders">
                    주문 내역
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

        {/* 알림 섹션 — 인증 사용자만, 내부에서 userId 확인 */}
        {isAuthenticated && (
          <>
            <Separator className="mx-4" />
            <NotificationSection onClose={onClose} />
          </>
        )}

        <Separator className="mx-4" />

        {/* 주요 네비게이션 */}
        <NavigationSection
          items={navigationItems}
          isActivePath={isActivePath}
          onClose={onClose}
        />

        <Separator className="mx-4" />

        {/* 회사 정보 */}
        <CompanySection items={companyMenuItems} onClose={onClose} />

        {/* 다른 서비스 */}
        <HeaderServicesMobileSection
          services={starcoexServices || []}
          onClose={onClose}
          onServiceClick={(service) => {
            window.open(service.href, '_blank');
          }}
        />

        <Separator className="mx-4" />

        {/* 연락처 */}
        <div className="px-4 pt-6">
          <ContactButton
            className="w-full justify-center h-auto py-3 text-sm font-medium text-foreground border-border bg-background hover:bg-accent hover:text-accent-foreground"
            phoneNumber="064-713-2002"
            showText={true}
            textBreakpoint="always"
            variant="outline"
          />
        </div>
      </div>
    </div>
  );
};
