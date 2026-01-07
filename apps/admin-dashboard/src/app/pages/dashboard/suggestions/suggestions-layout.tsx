import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
  showInBreadcrumb?: boolean;
  showActions?: boolean; // 액션 버튼 표시 여부
  showStats?: boolean; // 통계 표시 여부
}

export const SuggestionsLayout = () => {
  const location = useLocation();

  // 경로별 설정 정의
  const getBreadcrumbConfig = (pathname: string): BreadcrumbConfig => {
    const pathConfigs: Record<string, BreadcrumbConfig> = {
      // 관리자용 경로 (StarcoexMain)
      '/admin/suggestions': {
        label: 'Suggestions',
        title: 'All Suggestions',
        showInBreadcrumb: true,
        showActions: true,
        showStats: true,
      },
      '/admin/suggestions/pending': {
        label: 'Pending Suggestions',
        title: 'Pending Suggestions',
        showInBreadcrumb: true,
        showActions: true,
        showStats: false,
      },
      '/admin/suggestions/in-progress': {
        label: 'In Progress',
        title: 'In Progress Suggestions',
        showInBreadcrumb: true,
        showActions: true,
        showStats: false,
      },
      '/admin/suggestions/completed': {
        label: 'Completed',
        title: 'Completed Suggestions',
        showInBreadcrumb: true,
        showActions: true,
        showStats: false,
      },
      '/admin/suggestions/analytics': {
        label: 'Analytics',
        title: 'Suggestions Analytics',
        showInBreadcrumb: true,
        showActions: false,
        showStats: true,
      },
      '/admin/suggestions/create': {
        label: 'Create Suggestion',
        title: 'Create New Suggestion',
        showInBreadcrumb: true,
        showActions: false,
        showStats: false,
      },

      // 팀별 일반 경로 (StarOil, Zeragae, Delivery)
      '/suggestions': {
        label: 'Suggestions',
        title: 'All Suggestions',
        showInBreadcrumb: true,
        showActions: true,
        showStats: true,
      },
      '/suggestions/create': {
        label: 'New Suggestion',
        title: 'Create Suggestion',
        showInBreadcrumb: true,
        showActions: false,
        showStats: false,
      },
      '/suggestions/my': {
        label: 'My Suggestions',
        title: 'My Suggestions',
        showInBreadcrumb: true,
        showActions: true,
        showStats: false,
      },

      // 카테고리별 경로 (공통)
      '/suggestions/safety': {
        label: 'Safety Related',
        title: 'Safety Suggestions',
        showInBreadcrumb: true,
        showActions: true,
        showStats: false,
      },
      '/suggestions/service': {
        label: 'Service Improvement',
        title: 'Service Improvement Suggestions',
        showInBreadcrumb: true,
        showActions: true,
        showStats: false,
      },
      '/suggestions/facility': {
        label: 'Facility Improvement',
        title: 'Facility Improvement Suggestions',
        showInBreadcrumb: true,
        showActions: true,
        showStats: false,
      },

      // Zeragae 전용
      '/suggestions/wash-service': {
        label: 'Car Wash Service',
        title: 'Car Wash Service Suggestions',
        showInBreadcrumb: true,
        showActions: true,
        showStats: false,
      },
      '/suggestions/equipment': {
        label: 'Equipment Improvement',
        title: 'Equipment Improvement Suggestions',
        showInBreadcrumb: true,
        showActions: true,
        showStats: false,
      },
      '/suggestions/customer-service': {
        label: 'Customer Service',
        title: 'Customer Service Suggestions',
        showInBreadcrumb: true,
        showActions: true,
        showStats: false,
      },

      // Delivery 전용
      '/suggestions/routes': {
        label: 'Delivery Routes',
        title: 'Delivery Route Suggestions',
        showInBreadcrumb: true,
        showActions: true,
        showStats: false,
      },
      '/suggestions/vehicle': {
        label: 'Vehicle Related',
        title: 'Vehicle Related Suggestions',
        showInBreadcrumb: true,
        showActions: true,
        showStats: false,
      },
      '/suggestions/customer': {
        label: 'Customer Support',
        title: 'Customer Support Suggestions',
        showInBreadcrumb: true,
        showActions: true,
        showStats: false,
      },
    };

    // 동적 라우트 처리
    const suggestionIdMatch = pathname.match(
      /^\/(?:admin\/)?suggestions\/([^\/]+)$/
    );
    const suggestionEditMatch = pathname.match(
      /^\/(?:admin\/)?suggestions\/([^\/]+)\/edit$/
    );

    if (suggestionEditMatch) {
      const suggestionId = suggestionEditMatch[1];
      return {
        label: `Edit Suggestion #${suggestionId}`,
        title: `Edit Suggestion #${suggestionId}`,
        showInBreadcrumb: true,
        showActions: false,
        showStats: false,
      };
    }

    if (suggestionIdMatch && !pathConfigs[pathname]) {
      const suggestionId = suggestionIdMatch[1];
      // 이미 정의된 카테고리 경로가 아닌 경우에만 ID로 처리
      if (
        ![
          'safety',
          'service',
          'facility',
          'wash-service',
          'equipment',
          'customer-service',
          'routes',
          'vehicle',
          'customer',
          'my',
          'create',
        ].includes(suggestionId)
      ) {
        return {
          label: `Suggestion #${suggestionId}`,
          title: `Suggestion Details #${suggestionId}`,
          showInBreadcrumb: true,
          showActions: false,
          showStats: false,
        };
      }
    }

    // 기본값
    return (
      pathConfigs[pathname] || {
        label: 'Suggestions',
        title: 'Suggestion Management',
        showInBreadcrumb: true,
        showActions: false,
        showStats: false,
      }
    );
  };

  const config = getBreadcrumbConfig(location.pathname);

  // 홈 경로 결정 (관리자인지 일반 사용자인지에 따라)
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
                <Link to={homeUrl}>Home</Link>
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
          <h2 className="flex-none text-xl font-bold tracking-tight">
            {config.title}
          </h2>
        </div>
      </div>

      {/* 하위 페이지 컴포넌트가 여기에 렌더링 */}
      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

export default SuggestionsLayout;
