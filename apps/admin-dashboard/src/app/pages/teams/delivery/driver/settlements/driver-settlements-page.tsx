import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  LoadingSpinner,
  PageHead,
  ErrorAlert,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useDelivery } from '@starcoex-frontend/delivery';
import type {
  DeliveryDriver,
  DriverSettlement,
} from '@starcoex-frontend/delivery';
import { DriverSettlementSummary } from './components/driver-settlement-summary';
import { DriverSettlementTable } from './components/driver-settlement-table';

export default function DriverSettlementsPage() {
  const [searchParams] = useSearchParams();
  // ✅ ?status=paid → 'paid' / 없으면 undefined
  const statusParam = searchParams.get('status') ?? undefined;

  const { fetchMyDriverProfile, fetchMySettlements, isLoading, error } =
    useDelivery({ skipSocket: true });

  const [myProfile, setMyProfile] = useState<DeliveryDriver | null>(null);
  const [settlements, setSettlements] = useState<DriverSettlement[]>([]);

  useEffect(() => {
    fetchMyDriverProfile().then((res) => {
      if (res.success && res.data) setMyProfile(res.data);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSettlements = useCallback(
    async (driverId: number) => {
      const res = await fetchMySettlements(driverId);
      if (res.success && res.data) setSettlements(res.data);
    },
    [fetchMySettlements]
  );

  useEffect(() => {
    if (myProfile?.id) loadSettlements(myProfile.id);
  }, [myProfile?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading && settlements.length === 0) {
    return <LoadingSpinner message="정산 내역을 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`내 정산 내역 - ${COMPANY_INFO.name}`}
        description="배송 완료 후 정산 내역을 확인하세요."
        keywords={['정산', '수익', '배달기사', COMPANY_INFO.name]}
        og={{
          title: `내 정산 내역 - ${COMPANY_INFO.name}`,
          description: '배달기사 정산 내역',
          image: '/images/og-delivery.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        <DriverSettlementSummary settlements={settlements} />

        {error && (
          <ErrorAlert
            error={error}
            onRetry={() => myProfile?.id && loadSettlements(myProfile.id)}
          />
        )}

        {!error && (
          <DriverSettlementTable
            data={settlements}
            initialStatusFilter={statusParam} // ✅ ?status=paid 주입
          />
        )}
      </div>
    </>
  );
}
