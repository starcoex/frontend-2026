import { Outlet, useLocation, Link } from 'react-router-dom';
import { useMemo } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { CardTitle } from '@/components/ui/card';
import { CHAT_ROUTES, CHAT_ROUTE_PATTERNS } from '@/app/constants/chat-routes';
import {
  CHAT_BREADCRUMB_CONFIGS,
  DEFAULT_CHAT_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/chat-breadcrumb-config';
import { ChatStats } from './components/chat-stats';
import { useChats } from '@starcoex-frontend/chats';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [CHAT_ROUTES.LIST]: CHAT_BREADCRUMB_CONFIGS.LIST,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const detailMatch = pathname.match(CHAT_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    return {
      label: `채팅방 #${detailMatch[1]}`,
      title: `채팅방 #${detailMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }
  return null;
};

export const ChatsLayout = () => {
  const location = useLocation();
  const { roomStats } = useChats();

  const config = useMemo((): BreadcrumbConfig => {
    const pathname = location.pathname;
    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicRouteConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_CHAT_BREADCRUMB_CONFIG;
  }, [location.pathname]);

  return (
    <main className="flex h-full flex-1 flex-col p-4">
      <div className="mb-4 flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin">홈</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={CHAT_ROUTES.LIST}>채팅 관리</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {config.showInBreadcrumb &&
              location.pathname !== CHAT_ROUTES.LIST && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{config.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex-none text-2xl font-bold tracking-tight">
            {config.title}
          </CardTitle>
        </div>

        {config.showStats && roomStats && <ChatStats stats={roomStats} />}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};
