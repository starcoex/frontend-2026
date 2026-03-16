import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
import { SuggestionPrimaryActions } from './components/suggestion-primary-actions';
import {
  SUGGESTION_BREADCRUMB_CONFIGS,
  DEFAULT_SUGGESTION_BREADCRUMB_CONFIG,
  getDynamicSuggestionConfig,
  type SuggestionBreadcrumbConfig,
} from '@/app/constants/suggestion-breadcrumb-config';

export const SuggestionsLayout = () => {
  const location = useLocation();

  const config = useMemo((): SuggestionBreadcrumbConfig => {
    const pathname = location.pathname;

    const staticConfig = SUGGESTION_BREADCRUMB_CONFIGS[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicSuggestionConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_SUGGESTION_BREADCRUMB_CONFIG;
  }, [location.pathname]);

  const homeUrl = location.pathname.startsWith('/admin') ? '/admin' : '/';

  return (
    <main className="flex h-full flex-1 flex-col p-4">
      <div className="mb-4 flex flex-col gap-4">
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

        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex-none text-xl font-bold tracking-tight lg:text-2xl">
            {config.title}
          </CardTitle>
          {config.showActions && <SuggestionPrimaryActions />}
        </div>
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

export default SuggestionsLayout;
