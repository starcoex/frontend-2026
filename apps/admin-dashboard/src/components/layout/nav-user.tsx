import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  Settings,
  Shield,
  User,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@starcoex-frontend/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  getInitials,
  getRoleBadgeColor,
  getRoleDisplayText,
} from '@/app/utils/common-header';
import { useTeamContext } from '@/components/team-provider';
import { APP_ROUTES } from '@/app/constants/app-router';

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const { currentUser, isLoading, logout } = useAuth();
  const { currentTeam, userRole } = useTeamContext();

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('로그아웃되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  // 사용자 정보가 없으면 로딩 표시
  if (!currentUser) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">...</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">로딩 중...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={currentUser.avatarUrl || undefined}
                  alt={currentUser.name || currentUser.email}
                />
                <AvatarFallback className="rounded-lg">
                  {getInitials(currentUser.name || currentUser.email)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentUser.name || '사용자'}
                </span>
                <span className="truncate text-xs">{currentUser.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={currentUser.avatarUrl || undefined}
                    alt={currentUser.name || currentUser.email}
                  />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(currentUser.name || currentUser.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {currentUser.name || '사용자'}
                  </span>
                  <span className="truncate text-xs">{currentUser.email}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs font-medium ${getRoleBadgeColor(
                        userRole
                      )}`}
                    >
                      {getRoleDisplayText(userRole)}
                    </span>
                    {currentTeam && (
                      <span className="text-xs text-muted-foreground">
                        • {currentTeam}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to={APP_ROUTES.PROFILE}>
                  <User className="mr-2 h-4 w-4" />
                  프로필
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={APP_ROUTES.SETTINGS}>
                  <Settings className="mr-2 h-4 w-4" />
                  설정
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={APP_ROUTES.NOTIFICATIONS}>
                  <Bell className="mr-2 h-4 w-4" />
                  알림
                </Link>
              </DropdownMenuItem>

              {/* 관리자만 접근 가능한 메뉴 */}
              {(userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={APP_ROUTES.SYSTEM}>
                      <Shield className="mr-2 h-4 w-4" />
                      시스템 관리
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={APP_ROUTES.USERS}>
                      <BadgeCheck className="mr-2 h-4 w-4" />
                      사용자 관리
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
              <LogOut className="mr-2 h-4 w-4" />
              {isLoading ? '로그아웃 중...' : '로그아웃'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
