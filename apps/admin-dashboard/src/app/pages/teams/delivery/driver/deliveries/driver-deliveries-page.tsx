import { useCallback, useEffect, useState } from 'react';
import {
  ErrorAlert,
  LoadingSpinner,
  PageHead,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useDelivery } from '@starcoex-frontend/delivery';
import type { Delivery, DeliveryStatus } from '@starcoex-frontend/delivery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DRIVER_ACCEPTABLE_STATUSES,
  DRIVER_ACTIVE_STATUSES,
} from '@/app/pages/teams/delivery/driver/data/driver-data';
import { DriverDeliveryCard } from './components/driver-delivery-card';

// ── 탭 필터 설정 ──────────────────────────────────────────────────────────────
const FILTER_TABS: {
  label: string;
  statuses: DeliveryStatus[] | undefined;
}[] = [
  { label: '전체', statuses: undefined },
  { label: '수락 대기', statuses: DRIVER_ACCEPTABLE_STATUSES },
  { label: '진행 중', statuses: DRIVER_ACTIVE_STATUSES },
  { label: '완료', statuses: ['DELIVERED'] },
];

export default function DriverDeliveriesPage() {
  const {
    deliveries,
    isLoading,
    error,
    fetchMyDeliveries,
    updateDeliveryInContext,
  } = useDelivery();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchMyDeliveries({ statuses: FILTER_TABS[activeTab].statuses });
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // 상태 변경 후 로컬 컨텍스트 업데이트
  const handleUpdated = useCallback(
    (updated: Delivery) => {
      updateDeliveryInContext(updated.id, updated);
    },
    [updateDeliveryInContext]
  );

  // 현재 탭 기준 클라이언트 필터 (서버 필터와 이중 보장)
  const filtered =
    FILTER_TABS[activeTab].statuses == null
      ? deliveries
      : deliveries.filter((d) =>
          FILTER_TABS[activeTab].statuses!.includes(d.status)
        );

  if (isLoading) {
    return <LoadingSpinner message="배송 목록을 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`내 배송 목록 - ${COMPANY_INFO.name}`}
        description="배정된 배송을 확인하고 수락 또는 거절하세요."
        keywords={['내 배송', '배송 수락', '배달기사', COMPANY_INFO.name]}
        og={{
          title: `내 배송 목록 - ${COMPANY_INFO.name}`,
          description: '배달기사 전용 배송 목록',
          image: '/images/og-delivery.jpg',
          type: 'website',
        }}
      />

      {/* 탭 필터 */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {FILTER_TABS.map((tab, idx) => {
          const count =
            tab.statuses == null
              ? deliveries.length
              : deliveries.filter((d) => tab.statuses!.includes(d.status))
                  .length;

          return (
            <Button
              key={tab.label}
              variant={activeTab === idx ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(idx)}
              className={cn('shrink-0', activeTab === idx && 'shadow-sm')}
            >
              {tab.label}
              {count > 0 && (
                <Badge
                  variant={activeTab === idx ? 'secondary' : 'outline'}
                  className="ml-1.5 text-xs"
                >
                  {count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {error && (
        <ErrorAlert
          error={error}
          onRetry={() =>
            fetchMyDeliveries({ statuses: FILTER_TABS[activeTab].statuses })
          }
        />
      )}

      {!error && (
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((delivery) => (
              <DriverDeliveryCard
                key={delivery.id}
                delivery={delivery}
                onUpdated={handleUpdated}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground text-sm">
                {activeTab === 0
                  ? '배정된 배송이 없습니다.'
                  : `${FILTER_TABS[activeTab].label} 상태의 배송이 없습니다.`}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
