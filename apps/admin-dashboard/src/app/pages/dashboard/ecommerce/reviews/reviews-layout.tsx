import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { CardTitle } from '@/components/ui/card';
import {
  BreadcrumbConfig,
  DEFAULT_REVIEW_BREADCRUMB_CONFIG,
  REVIEW_BREADCRUMB_CONFIGS,
} from '@/app/constants/reviews-breadcrumb-config';
import {
  REVIEW_ROUTE_PATTERNS,
  REVIEW_ROUTES,
} from '@/app/constants/reviews-routes';
import { useReviews } from '@starcoex-frontend/reviews';
import { ReviewPrimaryActions } from '@/app/pages/dashboard/ecommerce/reviews/components/review-primary-actions';
import { ReviewStats } from '@/app/pages/dashboard/ecommerce/reviews/components/review-stats';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [REVIEW_ROUTES.LIST]: REVIEW_BREADCRUMB_CONFIGS.LIST,
  [REVIEW_ROUTES.CREATE]: REVIEW_BREADCRUMB_CONFIGS.CREATE,
  [REVIEW_ROUTES.SCOPES]: REVIEW_BREADCRUMB_CONFIGS.SCOPES,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const editMatch = pathname.match(REVIEW_ROUTE_PATTERNS.EDIT);
  if (editMatch) {
    return {
      label: `리뷰 수정 #${editMatch[1]}`,
      title: `리뷰 수정 #${editMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  const detailMatch = pathname.match(REVIEW_ROUTE_PATTERNS.DETAIL);
  if (detailMatch) {
    return {
      label: `리뷰 상세 #${detailMatch[1]}`,
      title: `리뷰 상세 #${detailMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showStats: false,
    };
  }

  return null;
};

export const ReviewsLayout = () => {
  const location = useLocation();
  const { summaryStats, fetchReviews, fetchReviewSummaryStats } = useReviews();

  useEffect(() => {
    fetchReviews({ page: 1, limit: 20 });
    fetchReviewSummaryStats();
  }, [fetchReviews, fetchReviewSummaryStats]);

  const config = useMemo((): BreadcrumbConfig => {
    const pathname = location.pathname;
    const staticConfig = PATH_TO_CONFIG_MAP[pathname];
    if (staticConfig) return staticConfig;

    const dynamicConfig = getDynamicRouteConfig(pathname);
    if (dynamicConfig) return dynamicConfig;

    return DEFAULT_REVIEW_BREADCRUMB_CONFIG;
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
            {config.showInBreadcrumb && (
              <BreadcrumbItem>
                <BreadcrumbPage>{config.label}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex-none text-2xl font-bold tracking-tight">
            {config.title}
          </CardTitle>
          {config.showActions && <ReviewPrimaryActions />}
        </div>

        {config.showStats && summaryStats && (
          <ReviewStats stats={summaryStats} />
        )}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};
