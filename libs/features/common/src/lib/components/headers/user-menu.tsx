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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from '../ui';
import { cn } from '../../utils';

export interface UserMenuData {
  id?: string | number;
  name?: string | null;
  email?: string | null;
  avatar?: string | { url: string } | null;
  [key: string]: any;
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
        isAuthenticated: isAuthenticated ?? false,
        mobile,
        onLogout,
        onMenuClick: handleMenuClick,
      }}
    >
      {children}
    </UserMenuContext.Provider>
  );
};

type UserMenuProps = {
  className?: string;
  children?: React.ReactNode;
};

const UserMenuRoot: React.FC<UserMenuProps> = ({ className, children }) => {
  const { isAuthenticated, mobile, user } = useUserMenu();
  const [isExpanded, setIsExpanded] = useState(false);

  // 모바일: 기존 아코디언 방식 유지
  if (mobile) {
    if (!isAuthenticated) {
      return (
        <div className="mx-2">
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

  // 데스크톱: NavigationMenu 대신 DropdownMenu 사용
  if (!isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'text-foreground bg-transparent hover:bg-accent hover:text-accent-foreground border-0',
              className
            )}
          >
            <User className="w-4 h-4 mr-2" />
            <span>계정</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 p-2 space-y-1">
          <UserMenuGuestItems />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const avatarSrc =
    typeof user?.avatar === 'string' ? user.avatar : user?.avatar?.url;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'bg-transparent p-0 h-8 w-8 rounded-full hover:bg-accent',
            className
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarSrc} alt={user?.name as string} />
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2 space-y-1">
        <div className="flex flex-col space-y-1">
          <UserMenuUserInfo />
          <UserMenuSeparator />
          {children}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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
    <DropdownMenuItem
      onClick={handleClick}
      className={cn('flex items-center gap-2 cursor-pointer', className)}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span>{children}</span>
    </DropdownMenuItem>
  );
};

const UserMenuSeparator: React.FC = () => {
  return <div className="my-1 h-px bg-border" />;
};

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
      {children}
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
