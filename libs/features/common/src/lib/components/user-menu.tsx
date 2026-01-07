import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../utils/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';
import { DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui';

export interface UserMenuData {
  id?: string | number;
  name?: string | null;
  email?: string | null;
  avatar?: string | { url: string } | null;
  [key: string]: any; // 추가 속성 허용 (유연성 확보)
}

type UserMenuContextValue = {
  user: UserMenuData | null;
  isAuthenticated: boolean;
  mobile?: boolean;
  onLogout?: () => void;
  onMenuClick?: (path: string) => void;
};

const UserMenuContext = React.createContext<UserMenuContextValue | undefined>(
  undefined
);

const useUserMenu = () => {
  const context = React.useContext(UserMenuContext);
  if (!context) {
    throw new Error('useUserMenu must be used within UserMenuProvider');
  }
  return context;
};

// Provider 컴포넌트
type UserMenuProviderProps<T extends UserMenuData = UserMenuData> = {
  user?: T | null;
  isAuthenticated?: boolean | null;
  mobile?: boolean;
  onLogout?: () => void;
  onMenuClick?: (path: string) => void;
  children: React.ReactNode;
};

const UserMenuProvider: React.FC<UserMenuProviderProps> = ({
  user = null,
  isAuthenticated = false,
  mobile = false,
  onLogout,
  onMenuClick,
  children,
}) => {
  const navigate = useNavigate();

  const handleMenuClick = (path: string) => {
    if (onMenuClick) {
      onMenuClick(path);
    } else {
      navigate(path);
    }
  };

  return (
    <UserMenuContext.Provider
      value={{
        user,
        isAuthenticated: isAuthenticated ?? false, // ✅ null을 false로 변환
        mobile,
        onLogout,
        onMenuClick: handleMenuClick,
      }}
    >
      {children}
    </UserMenuContext.Provider>
  );
};

// Root 컴포넌트
type UserMenuProps = {
  className?: string;
  children?: React.ReactNode; // ✅ children 추가
};

const UserMenuRoot: React.FC<UserMenuProps> = ({ className, children }) => {
  const { isAuthenticated, mobile, user } = useUserMenu();
  const [isExpanded, setIsExpanded] = useState(false);
  // 모바일에서는 드롭다운 방식 (클릭 방식)
  if (mobile) {
    if (!isAuthenticated) {
      return (
        <div className="mx-2">
          {/* 드롭다운 헤더 */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">계정</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform" />
            )}
          </button>

          {/* 드롭다운 콘텐츠 - isExpanded일 때만 렌더링 */}
          {isExpanded && (
            <div className="mt-1 ml-8 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
              <UserMenuGuestItems />
            </div>
          )}
        </div>
      );
    }

    const avatarSrc =
      typeof user?.avatar === 'string' ? user.avatar : user?.avatar?.url;

    return (
      <div className="mx-2">
        {/* 드롭다운 헤더 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={avatarSrc} alt={user?.name as string} />
              <AvatarFallback className="text-xs">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-foreground">{user?.name || '사용자'}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform" />
          )}
        </button>

        {/* 드롭다운 콘텐츠 - isExpanded일 때만 렌더링 */}
        {isExpanded && (
          <div className="mt-1 ml-8 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <UserMenuUserInfo />
            <UserMenuSeparator />
            {children}
          </div>
        )}
      </div>
    );
  }

  // 데스크톱에서는 NavigationMenu 사용 (호버 방식)
  if (!isAuthenticated) {
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn(
                'text-foreground bg-transparent [&:hover]:bg-accent [&:hover]:text-accent-foreground [&[data-state=open]]:bg-accent [&[data-state=open]]:text-accent-foreground border-0 transition-colors',
                className
              )}
            >
              <User className="w-4 h-4 mr-2" />
              <span>계정</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-48 p-2 space-y-1">
                {/* ✅ space-y-1 추가 */}
                <UserMenuGuestItems />
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  const avatarSrc =
    typeof user?.avatar === 'string' ? user.avatar : user?.avatar?.url;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              'bg-transparent p-0 h-8 w-8 rounded-full hover:bg-accent',
              className
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarSrc} alt={user?.name as string} />
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-56 p-2 space-y-1">
              <div className="flex flex-col space-y-1">
                <UserMenuUserInfo />
                <UserMenuSeparator />
                {children}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

// Trigger 컴포넌트
type UserMenuTriggerProps = {
  className?: string;
  children: React.ReactNode;
};

const UserMenuTrigger: React.FC<UserMenuTriggerProps> = ({
  className,
  children,
}) => {
  const { mobile, isAuthenticated } = useUserMenu();

  return (
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size={mobile ? 'default' : 'sm'}
        className={cn(
          mobile
            ? 'w-full justify-start'
            : isAuthenticated
            ? 'relative h-8 w-8 rounded-full'
            : 'hidden sm:flex items-center space-x-2',
          className
        )}
      >
        {children}
      </Button>
    </DropdownMenuTrigger>
  );
};

// Content 컴포넌트
type UserMenuContentProps = {
  children: React.ReactNode;
};

const UserMenuContent: React.FC<UserMenuContentProps> = ({ children }) => {
  const { mobile } = useUserMenu();

  return (
    <DropdownMenuContent align={mobile ? 'start' : 'end'} className="w-56">
      {children}
    </DropdownMenuContent>
  );
};

// 사용자 정보 표시 컴포넌트
const UserMenuUserInfo: React.FC = () => {
  const { user, mobile } = useUserMenu();

  if (mobile || !user) return null;

  return (
    <div className="flex items-center justify-start gap-2 p-2">
      <div className="flex flex-col space-y-1 leading-none">
        <p className="font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
};

// 메뉴 아이템 컴포넌트
type UserMenuItemProps = {
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string;
  className?: string;
  children: React.ReactNode;
};

const UserMenuItem: React.FC<UserMenuItemProps> = ({
  icon: Icon,
  onClick,
  href,
  className,
  children,
}) => {
  const { onMenuClick } = useUserMenu();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href && onMenuClick) {
      onMenuClick(href);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      className={cn('w-full justify-start gap-2 h-9 px-3', className)}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span>{children}</span>
    </Button>
  );
};

// 구분선 컴포넌트
const UserMenuSeparator: React.FC = () => {
  return <div className="my-1 h-px bg-border" />;
};

// 기본 게스트 메뉴 아이템들
const UserMenuGuestItems: React.FC = () => {
  return (
    <div className="space-y-1">
      <UserMenuItem icon={LogIn} href="/auth/login">
        로그인
      </UserMenuItem>
      <UserMenuItem icon={UserPlus} href="/auth/register">
        회원가입
      </UserMenuItem>
    </div>
  );
};

// 로그아웃 버튼
const UserMenuLogout: React.FC = () => {
  const { onLogout } = useUserMenu();

  return (
    <UserMenuItem
      icon={LogOut}
      onClick={onLogout}
      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
    >
      로그아웃
    </UserMenuItem>
  );
};

// 메인 UserMenu 컴포넌트 (backward compatibility)
type UserMenuMainProps<T extends UserMenuData = UserMenuData> = {
  user?: T | null;
  isAuthenticated?: boolean;
  mobile?: boolean;
  onLogout?: () => void;
  onMenuClick?: (path: string) => void;
  className?: string;
  children?: React.ReactNode;
};

const UserMenu: React.FC<UserMenuMainProps> = ({
  user,
  isAuthenticated,
  mobile,
  onLogout,
  onMenuClick,
  className,
  children,
}) => {
  return (
    <UserMenuProvider
      user={user}
      isAuthenticated={isAuthenticated}
      mobile={mobile}
      onLogout={onLogout}
      onMenuClick={onMenuClick}
    >
      <UserMenuRoot className={className} />
      {children} {/* ✅ UserMenuRoot의 children prop으로 전달 */}
    </UserMenuProvider>
  );
};

export {
  UserMenu,
  UserMenuProvider,
  UserMenuRoot,
  UserMenuTrigger,
  UserMenuContent,
  UserMenuUserInfo,
  UserMenuItem,
  UserMenuSeparator,
  UserMenuGuestItems,
  UserMenuLogout,
  useUserMenu,
};
