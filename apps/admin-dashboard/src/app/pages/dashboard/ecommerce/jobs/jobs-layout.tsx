import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { JOB_ROUTES, JOB_ROUTE_PATTERNS } from '@/app/constants/job-routes';
import {
  JOB_BREADCRUMB_CONFIGS,
  DEFAULT_JOB_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/job-breadcrumb-config';
import { JobPrimaryActions } from '@/app/pages/dashboard/ecommerce/jobs/components/job-primary-action';
import { JobStats } from '@/app/pages/dashboard/ecommerce/jobs/components/job-stats';
import { PageLayout } from '@starcoex-frontend/common';
import { useJobs } from '@starcoex-frontend/jobs';
import { ApplicationStats } from '@/app/pages/dashboard/ecommerce/jobs/applications/components/job-application-stats';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [JOB_ROUTES.LIST]: JOB_BREADCRUMB_CONFIGS.LIST,
  [JOB_ROUTES.CREATE]: JOB_BREADCRUMB_CONFIGS.CREATE,
  [JOB_ROUTES.APPLICATIONS]: JOB_BREADCRUMB_CONFIGS.APPLICATIONS,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const editMatch = pathname.match(JOB_ROUTE_PATTERNS.EDIT);
  if (editMatch)
    return {
      label: `공고 수정 #${editMatch[1]}`,
      title: `공고 수정 #${editMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showTabs: false,
    };

  const postingApplicationsMatch = pathname.match(
    JOB_ROUTE_PATTERNS.POSTING_APPLICATIONS
  );
  if (postingApplicationsMatch)
    return {
      label: '지원자 목록',
      title: '지원자 목록',
      showInBreadcrumb: true,
      showActions: false,
      showTabs: false,
    };

  const detailMatch = pathname.match(JOB_ROUTE_PATTERNS.DETAIL);
  if (detailMatch)
    return {
      label: `공고 #${detailMatch[1]}`,
      title: `공고 #${detailMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showTabs: false,
    };

  return null;
};

export const JobsLayout = () => {
  const location = useLocation();
  const { jobPostings, selectedApplications, fetchJobPostings } = useJobs();
  const isListRoute = location.pathname === JOB_ROUTES.LIST;
  const isApplicationsRoute = location.pathname === JOB_ROUTES.APPLICATIONS;

  useEffect(() => {
    // applications 페이지에서는 JobsLayout이 fetchJobPostings를 호출하지 않음
    // (job-applications-page.tsx 에서 자체적으로 fetchApplicationsByPosting 호출)
    if (isApplicationsRoute) return;
    fetchJobPostings(false);
  }, [isApplicationsRoute]); // eslint-disable-line react-hooks/exhaustive-deps

  const config = useMemo((): BreadcrumbConfig => {
    const staticConfig = PATH_TO_CONFIG_MAP[location.pathname];
    if (staticConfig) return staticConfig;
    return (
      getDynamicRouteConfig(location.pathname) ?? DEFAULT_JOB_BREADCRUMB_CONFIG
    );
  }, [location.pathname]);

  const breadcrumbs = isListRoute
    ? [{ label: 'Home', href: '/admin' }, { label: config.label }]
    : [
        { label: 'Home', href: '/admin' },
        { label: '채용 공고 관리', href: JOB_ROUTES.LIST },
        ...(config.showInBreadcrumb ? [{ label: config.label }] : []),
      ];

  const subContent = config.showTabs ? (
    isApplicationsRoute ? (
      <ApplicationStats applications={selectedApplications} />
    ) : (
      <JobStats jobs={jobPostings} />
    )
  ) : undefined;

  return (
    <PageLayout
      breadcrumbs={breadcrumbs}
      title={config.title}
      actions={config.showActions ? <JobPrimaryActions /> : undefined}
      subContent={subContent}
    >
      <Outlet />
    </PageLayout>
  );
};
