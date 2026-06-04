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
import {
  BreadcrumbConfig,
  DEFAULT_SETTINGS_BREADCRUMB_CONFIG,
  SETTINGS_BREADCRUMB_CONFIGS,
} from '@/app/constants/settings-breadcrumb-config';
import { SETTINGS_ROUTES } from '@/app/constants/setting-routes';

const SETTINGS_PATH_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [SETTINGS_ROUTES.ROOT]: SETTINGS_BREADCRUMB_CONFIGS.ROOT,
  [SETTINGS_ROUTES.BILLING]: SETTINGS_BREADCRUMB_CONFIGS.BILLING,
  [SETTINGS_ROUTES.NOTIFICATIONS]: SETTINGS_BREADCRUMB_CONFIGS.NOTIFICATIONS,
};

export const SettingsLayout = () => {
  const location = useLocation();

  const sidebarNavItems: NavItem[] = getSettingsNavItems();

  const config: BreadcrumbConfig =
    SETTINGS_PATH_CONFIG_MAP[location.pathname] ??
    DEFAULT_SETTINGS_BREADCRUMB_CONFIG;

  const homeUrl = location.pathname.startsWith('/admin') ? '/admin' : '/';

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
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={SETTINGS_ROUTES.ROOT}>설정</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {location.pathname !== SETTINGS_ROUTES.ROOT &&
              config.showInBreadcrumb && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{config.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            {location.pathname === SETTINGS_ROUTES.ROOT && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{config.label}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-0.5">
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            {config.title}
          </h1>
          {config.description && (
            <p className="text-muted-foreground">{config.description}</p>
          )}
        </div>
      </div>

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
