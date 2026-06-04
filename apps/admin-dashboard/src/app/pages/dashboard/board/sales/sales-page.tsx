import { useEffect } from 'react';
import { PageHead } from '@starcoex-frontend/common';
import { LoadingSpinner, ErrorAlert } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { usePayments } from '@starcoex-frontend/payments';
import { useOrders } from '@starcoex-frontend/orders';
import { useAnalytics } from '@starcoex-frontend/analytics';
import { useProducts } from '@starcoex-frontend/products';
import { SalesRevenueChart } from './components/sales-revenue-chart';
import { SalesSummaryCards } from './components/sales-summary-cards';
import { SalesBestProducts } from './components/sales-best-products';
import { SalesOrderTable } from './components/sales-order-table';

export default function SalesPage() {
  const {
    payments,
    listData,
    isLoading: paymentsLoading,
    error: paymentsError,
    fetchPayments,
    clearError: clearPaymentsError,
  } = usePayments();

  const {
    orders,
    isLoading: ordersLoading,
    error: ordersError,
    fetchOrders,
    filteredOrders,
    clearError: clearOrdersError,
  } = useOrders();

  const {
    adminDashboardStats,
    isLoading: analyticsLoading,
    fetchAdminDashboard,
  } = useAnalytics();

  const { products, isLoading: productsLoading, fetchProducts } = useProducts();

  const isLoading =
    paymentsLoading || ordersLoading || analyticsLoading || productsLoading;
  const error = paymentsError || ordersError;

  useEffect(() => {
    fetchPayments();
    fetchOrders();
    fetchAdminDashboard();
    fetchProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = () => {
    clearPaymentsError();
    clearOrdersError();
    fetchPayments();
    fetchOrders();
  };

  if (isLoading && payments.length === 0 && orders.length === 0) {
    return <LoadingSpinner message="매출 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`매출 현황 - ${COMPANY_INFO.name} 관리자 대시보드`}
        description="실시간 매출 데이터 분석 및 관리."
        keywords={['매출 대시보드', '매출 관리', COMPANY_INFO.name]}
        og={{
          title: `매출 현황 대시보드 - ${COMPANY_INFO.name}`,
          description: '실시간 매출 데이터 분석 및 관리.',
          image: '/images/og-sales-dashboard.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {error && <ErrorAlert error={error} onRetry={handleRetry} />}

        {/* 요약 카드 (BalanceCard·IncomeCard·ExpenseCard 대체) */}
        <SalesSummaryCards
          listData={listData}
          adminStats={adminDashboardStats}
          isLoading={isLoading}
        />

        {/* 차트 + 요약 카드 */}
        <div className="gap-4 space-y-4 md:grid md:grid-cols-2 lg:space-y-0 xl:grid-cols-8">
          <div className="md:col-span-8">
            <SalesRevenueChart
              payments={payments}
              isLoading={paymentsLoading}
            />
          </div>
        </div>

        {/* 베스트 상품 + 주문 현황 */}
        <div className="gap-4 space-y-4 lg:space-y-0 xl:grid xl:grid-cols-3">
          <div className="xl:col-span-1">
            <SalesBestProducts
              products={products}
              isLoading={productsLoading}
            />
          </div>
          <div className="xl:col-span-2">
            <SalesOrderTable
              orders={filteredOrders()}
              isLoading={ordersLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
