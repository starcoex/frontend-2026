import { useEffect } from 'react';
import { PageHead } from '@starcoex-frontend/common';
import { LoadingSpinner, ErrorAlert } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { usePayments } from '@starcoex-frontend/payments';
import { PaymentTable } from './components/payment-table';
import { PaymentFilterBar } from './components/payment-filter-bar';
import { PaymentStats } from './components/payment-stats';

export default function PaymentsPage() {
  const {
    payments,
    listData,
    filter,
    isLoading,
    error,
    fetchPayments,
    handleFilterChange,
    handleResetFilter,
  } = usePayments();

  useEffect(() => {
    fetchPayments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading && payments.length === 0) {
    return <LoadingSpinner message="결제 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`결제 관리 - ${COMPANY_INFO.name}`}
        description="결제 목록을 조회하고 관리하세요."
        keywords={['결제 관리', '결제 목록', COMPANY_INFO.name]}
        og={{
          title: `결제 관리 - ${COMPANY_INFO.name}`,
          description: '결제 목록 조회 및 관리 시스템',
          image: '/images/og-payments.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 통계 카드 — 목록 페이지에서만 */}
        <PaymentStats payments={payments} listData={listData} />

        {/* 서버사이드 필터 바 */}
        <PaymentFilterBar
          filter={filter}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilter}
          isLoading={isLoading}
        />

        {error && (
          <ErrorAlert error={error} onRetry={() => fetchPayments(filter)} />
        )}

        {!error && (
          <PaymentTable
            data={payments}
            total={listData?.total ?? 0}
            isLoading={isLoading}
          />
        )}
      </div>
    </>
  );
}
