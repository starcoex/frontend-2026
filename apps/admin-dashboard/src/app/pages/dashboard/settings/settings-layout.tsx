import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SidebarNav from './components/sidebar-nav';
import { NavItem } from '@/app/types/sidebar-type';
import { getSettingsNavItems } from '@/app/utils/settings-nav-items.utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbConfig {
  label: string;
  title: string;
  description?: string;
  showInBreadcrumb?: boolean;
  showActions?: boolean; // 액션 버튼 표시 여부
  showStats?: boolean; // 통계 표시 여부
}

export const SettingsLayout = () => {
  const location = useLocation();

  // ✅ sidebar-data.tsx의 설정 그룹 사용
  const sidebarNavItems: NavItem[] = getSettingsNavItems();

  // 경로별 설정 정의
  const getBreadcrumbConfig = (pathname: string): BreadcrumbConfig => {
    const pathConfigs: Record<string, BreadcrumbConfig> = {
      '/settings': {
        label: 'Settings',
        title: 'Settings',
        description: 'Update account preferences and manage integrations.',
        showInBreadcrumb: true,
        showActions: false,
        showStats: false,
      },
      '/admin/settings': {
        label: '일반 설정',
        title: '일반 설정',
        description: '기본 애플리케이션 설정 및 환경 설정을 구성합니다.',
        showInBreadcrumb: true,
        showActions: true,
        showStats: false,
      },
      '/settings/profile': {
        label: 'Profile',
        title: 'Profile Settings',
        description: 'Manage your personal information and account details.',
        showInBreadcrumb: true,
        showActions: true,
        showStats: false,
      },
      '/settings/billing': {
        label: 'Billing',
        title: 'Billing & Payments',
        description:
          'Manage your subscription, payment methods, and billing history.',
        showInBreadcrumb: true,
        showActions: true,
        showStats: true,
      },
      '/settings/notifications': {
        label: 'Notifications',
        title: 'Notification Settings',
        description: 'Configure how and when you receive notifications.',
        showInBreadcrumb: true,
        showActions: true,
        showStats: false,
      },
    };

    return (
      pathConfigs[pathname] || {
        label: 'Settings',
        title: 'Settings',
        description: 'Manage your application settings.',
        showInBreadcrumb: true,
        showActions: false,
        showStats: false,
      }
    );
  };

  const config = getBreadcrumbConfig(location.pathname);

  // 홈 경로 결정
  const getHomeUrl = (pathname: string): string => {
    return pathname.startsWith('/admin') ? '/admin' : '/';
  };

  const homeUrl = getHomeUrl(location.pathname);

  return (
    <main className="flex h-full flex-1 flex-col p-4">
      <div className="mb-4 flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={homeUrl}>홈</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {config.showInBreadcrumb && (
              <BreadcrumbItem>
                <BreadcrumbPage>{config.label}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-0.5">
          <div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">
              {config.title}
            </h1>
            {config.description && (
              <p className="text-muted-foreground">{config.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ 설정 레이아웃: 사이드바 + 컨텐츠 */}
      <div className="flex flex-1 flex-col space-y-8 overflow-auto md:space-y-2 md:overflow-hidden lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="lg:sticky lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex w-full overflow-y-scroll p-1 pr-4 md:overflow-y-hidden">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default SettingsLayout;
