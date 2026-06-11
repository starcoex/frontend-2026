import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import {
  CONTACT_ROUTES,
  CONTACT_ROUTE_PATTERNS,
} from '@/app/constants/contact-routes';
import {
  CONTACT_BREADCRUMB_CONFIGS,
  DEFAULT_CONTACT_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/contact-breadcrumb-config';
import { useContacts } from '@starcoex-frontend/contact';
import { ContactStats } from './components/contact-stats';
import { ContactPrimaryActions } from './components/contact-primary-action'; // ★ 추가
import { PageLayout } from '@starcoex-frontend/common';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [CONTACT_ROUTES.LIST]: CONTACT_BREADCRUMB_CONFIGS.LIST,
  [CONTACT_ROUTES.STATS]: CONTACT_BREADCRUMB_CONFIGS.STATS,
};

const getDynamicRouteConfig = (pathname: string): BreadcrumbConfig | null => {
  const detailMatch = pathname.match(CONTACT_ROUTE_PATTERNS.DETAIL);
  if (detailMatch)
    return {
      label: `문의 #${detailMatch[1]}`,
      title: `문의 #${detailMatch[1]}`,
      showInBreadcrumb: true,
      showActions: false,
      showTabs: false,
    };
  return null;
};

export const ContactsLayout = () => {
  const location = useLocation();
  const { contacts, fetchAdminContacts } = useContacts();
  const isListRoute = location.pathname === CONTACT_ROUTES.LIST;

  useEffect(() => {
    fetchAdminContacts();
  }, [fetchAdminContacts]);

  const config = useMemo((): BreadcrumbConfig => {
    return (
      PATH_TO_CONFIG_MAP[location.pathname] ??
      getDynamicRouteConfig(location.pathname) ??
      DEFAULT_CONTACT_BREADCRUMB_CONFIG
    );
  }, [location.pathname]);

  const breadcrumbs = isListRoute
    ? [{ label: 'Home', href: '/admin' }, { label: config.label }]
    : [
        { label: 'Home', href: '/admin' },
        { label: '문의 관리', href: CONTACT_ROUTES.LIST },
        ...(config.showInBreadcrumb ? [{ label: config.label }] : []),
      ];

  return (
    <PageLayout
      breadcrumbs={breadcrumbs}
      title={config.title}
      actions={config.showActions ? <ContactPrimaryActions /> : undefined} // ★ 추가
      subContent={
        config.showTabs ? <ContactStats contacts={contacts} /> : undefined
      }
    >
      <Outlet />
    </PageLayout>
  );
};
