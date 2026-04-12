import { useCallback, useEffect, useState } from 'react';
import {
  ErrorAlert,
  LoadingSpinner,
  PageHead,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useDelivery } from '@starcoex-frontend/delivery';
import type { Delivery, DeliveryDriver } from '@starcoex-frontend/delivery';
import { Navigation } from 'lucide-react';
import { DRIVER_ACTIVE_STATUSES } from '@/app/pages/teams/delivery/driver/data/driver-data';
import { useDriverGps } from './hooks/useDriverGps';
import { DriverGpsStatus } from './components/driver-gps-status';
import { DriverActiveCard } from './components/driver-active-card';

export default function DriverActivePage() {
  const {
    deliveries,
    isLoading,
    error,
    fetchMyDeliveries,
    fetchMyDriverProfile,
    updateDeliveryInContext,
  } = useDelivery();

  // ✅ getMyDriverProfile로 정확한 driverId 획득
  const [myProfile, setMyProfile] = useState<DeliveryDriver | null>(null);

  useEffect(() => {
    const init = async () => {
      const [profileRes] = await Promise.all([
        fetchMyDriverProfile(),
        fetchMyDeliveries({ statuses: DRIVER_ACTIVE_STATUSES }),
      ]);
      if (profileRes.success && profileRes.data) {
        setMyProfile(profileRes.data);
      }
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    gpsStatus,
    currentPosition,
    lastSentAt,
    startTracking,
    stopTracking,
  } = useDriverGps({
    driverId: myProfile?.id ?? null,
    autoStart: true,
  });

  const handleUpdated = useCallback(
    (updated: Delivery) => {
      updateDeliveryInContext(updated.id, updated);
    },
    [updateDeliveryInContext]
  );

  const activeDeliveries = deliveries.filter((d) =>
    DRIVER_ACTIVE_STATUSES.includes(d.status)
  );

  if (isLoading) {
    return <LoadingSpinner message="진행 중인 배송을 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`진행 중인 배송 - ${COMPANY_INFO.name}`}
        description="현재 진행 중인 배송을 관리하고 위치를 전송하세요."
        keywords={['진행 중 배송', 'GPS', '위치 전송', COMPANY_INFO.name]}
        og={{
          title: `진행 중인 배송 - ${COMPANY_INFO.name}`,
          description: '배달기사 실시간 배송 관리',
          image: '/images/og-delivery.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* GPS 상태 배너 */}
        <DriverGpsStatus
          gpsStatus={gpsStatus}
          lastSentAt={lastSentAt}
          currentPosition={currentPosition}
          onStart={startTracking}
          onStop={stopTracking}
        />

        {error && (
          <ErrorAlert
            error={error}
            onRetry={() =>
              fetchMyDeliveries({ statuses: DRIVER_ACTIVE_STATUSES })
            }
          />
        )}

        {!error && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                진행 중인 배송
                {activeDeliveries.length > 0 && (
                  <span className="text-primary ml-2 text-sm">
                    {activeDeliveries.length}건
                  </span>
                )}
              </h3>
            </div>

            {activeDeliveries.length > 0 ? (
              <div className="space-y-3">
                {activeDeliveries.map((delivery) => (
                  <DriverActiveCard
                    key={delivery.id}
                    delivery={delivery}
                    onUpdated={handleUpdated}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Navigation className="text-muted-foreground mb-3 h-12 w-12" />
                <p className="text-muted-foreground text-sm">
                  현재 진행 중인 배송이 없습니다.
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  배송 목록에서 배송을 수락하면 여기에 표시됩니다.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
