import { useEffect, useRef, useState } from 'react';
import { useAnalytics } from '@starcoex-frontend/analytics';
import { usePayments } from '@starcoex-frontend/payments';
import { useOrders } from '@starcoex-frontend/orders';
import { useReservations } from '@starcoex-frontend/reservations';
import { useDelivery } from '@starcoex-frontend/delivery';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { usePromotions } from '@starcoex-frontend/promotions';
import { useReviews } from '@starcoex-frontend/reviews';
import { useStores } from '@starcoex-frontend/stores';
import { useAuth } from '@starcoex-frontend/auth';
import { LoadingSpinner, ErrorAlert } from '@starcoex-frontend/common';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { format } from 'date-fns';

import { OverviewKpiCards } from './components/overview-kpi-cards';
import { OverviewAnalyticsSummary } from './components/overview-analytics-summary';
import { OverviewRevenueChart } from './components/overview-revenue-chart';
import { OverviewOrderStatus } from './components/overview-order-status';
import { OverviewReservationStatus } from './components/overview-reservation-status';
import { OverviewDeliveryStatus } from './components/overview-delivery-status';
import { OverviewStoreStats } from './components/overview-store-stats';
import { OverviewLoyaltyStats } from './components/overview-loyalty-stats';
import { OverviewPromotionStats } from './components/overview-promotion-stats';
import { OverviewReviewStats } from './components/overview-review-stats';
import { OverviewTeamMembers } from './components/overview-team-members';

const INIT_TIMEOUT_MS = 10_000;

export const OverviewPage = () => {
  const today = format(new Date(), 'yyyy-MM-dd');

  // ✅ 모바일 무한 로딩 방지용 타임아웃
  const [forceReady, setForceReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    adminDashboardStats,
    analyticsSummaryStats,
    isLoading: analyticsLoading,
    error: analyticsError,
    fetchAdminDashboard,
    fetchAnalyticsSummaryStats,
    clearError: clearAnalyticsError,
  } = useAnalytics();

  const {
    payments,
    listData: paymentsListData,
    isLoading: paymentsLoading,
    fetchPayments,
  } = usePayments();

  const { isLoading: ordersLoading, fetchOrders, filteredOrders } = useOrders();

  const {
    reservations,
    walkIns,
    isLoading: reservationsLoading,
    fetchReservations,
    fetchWalkIns,
  } = useReservations();

  const {
    deliveries,
    isLoading: deliveryLoading,
    fetchDeliveries,
  } = useDelivery({ skipSocket: true });

  const { isLoading: loyaltyLoading, adminGetMembershipList } = useLoyalty();

  const {
    summaryStats: promotionStats,
    isLoading: promotionsLoading,
    fetchPromotionSummaryStats,
  } = usePromotions();

  const {
    summaryStats: reviewStats,
    isLoading: reviewsLoading,
    fetchReviewSummaryStats,
  } = useReviews();

  const {
    stores,
    statistics: storeStatistics,
    isLoading: storesLoading,
    fetchStores,
    fetchStatistics,
  } = useStores();

  const { isLoading: authLoading, getAllUsers } = useAuth();

  useEffect(() => {
    // ✅ 10초 후 강제로 페이지 표시 (모바일 타임아웃 방어)
    timerRef.current = setTimeout(() => setForceReady(true), INIT_TIMEOUT_MS);

    fetchAdminDashboard();
    fetchAnalyticsSummaryStats();
    fetchPayments({ limit: 30 });
    fetchOrders(20, 0);
    fetchReservations({ dateFrom: today, dateTo: today, limit: 10 });
    fetchWalkIns({});
    fetchDeliveries({ limit: 10 });
    adminGetMembershipList({ limit: 1, offset: 0 });
    fetchPromotionSummaryStats();
    fetchReviewSummaryStats();
    fetchStores();
    fetchStatistics();
    getAllUsers({ page: 1, limit: 10 });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ 핵심 KPI(analytics + payments)만 초기 게이트로 사용
  // 나머지 위젯은 각자 isLoading prop으로 스켈레톤 처리
  const coreLoading = analyticsLoading || paymentsLoading;

  if (coreLoading && !adminDashboardStats && !forceReady) {
    return <LoadingSpinner message="대시보드 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`관리 시스템 - ${COMPANY_INFO.name}`}
        description="전사 현황 요약 대시보드"
        keywords={['대시보드', '요약 분석', COMPANY_INFO.name]}
        og={{
          title: `관리 시스템 - ${COMPANY_INFO.name}`,
          description: '전사 현황 요약 대시보드',
          image: '/images/og-dashboard.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {analyticsError && (
          <ErrorAlert
            error={analyticsError}
            onRetry={() => {
              clearAnalyticsError();
              fetchAdminDashboard();
            }}
          />
        )}

        <OverviewKpiCards
          adminStats={adminDashboardStats}
          paymentsListData={paymentsListData}
          isLoading={analyticsLoading || paymentsLoading}
        />

        <OverviewAnalyticsSummary
          data={analyticsSummaryStats}
          isLoading={analyticsLoading}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <OverviewRevenueChart
              payments={payments}
              isLoading={paymentsLoading}
            />
          </div>
          <div className="lg:col-span-2">
            <OverviewOrderStatus
              orders={filteredOrders()}
              isLoading={ordersLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <OverviewReservationStatus
            reservations={reservations}
            walkIns={walkIns}
            isLoading={reservationsLoading}
          />
          <OverviewDeliveryStatus
            deliveries={deliveries}
            isLoading={deliveryLoading}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <OverviewStoreStats
            stores={stores}
            statistics={storeStatistics}
            isLoading={storesLoading}
          />
          <OverviewLoyaltyStats isLoading={loyaltyLoading} />
          <OverviewPromotionStats
            data={promotionStats}
            isLoading={promotionsLoading}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <OverviewReviewStats data={reviewStats} isLoading={reviewsLoading} />
          <OverviewTeamMembers isLoading={authLoading} />
        </div>
      </div>
    </>
  );
};
