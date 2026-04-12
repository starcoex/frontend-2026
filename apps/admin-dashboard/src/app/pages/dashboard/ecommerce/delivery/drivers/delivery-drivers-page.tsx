import { useCallback, useEffect, useState } from 'react';
import {
  LoadingSpinner,
  ErrorAlert,
  PageHead,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useDelivery } from '@starcoex-frontend/delivery';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';
import { DriverStats } from './components/driver-stats';
import { DriverTable } from './components/driver-table';

export default function DeliveryDriversPage() {
  const { isLoading, error, fetchDrivers } = useDelivery(); // ✅ fetchDrivers 사용
  const [drivers, setDrivers] = useState<DeliveryDriver[]>([]);

  useEffect(() => {
    fetchDrivers().then((res) => {
      // ✅ getDrivers API 직접 호출
      if (res?.success && res.data) {
        setDrivers(res.data.drivers); // ✅ GetDriversOutput.drivers 배열 접근
      }
    });
  }, [fetchDrivers]);

  const handleStatusChange = useCallback(
    (driverId: number, status: DeliveryDriver['status']) => {
      setDrivers((prev) =>
        prev.map((d) => (d.id === driverId ? { ...d, status } : d))
      );
    },
    []
  );

  const handleAvailabilityChange = useCallback(
    (driverId: number, isAvailable: boolean) => {
      setDrivers((prev) =>
        prev.map((d) => (d.id === driverId ? { ...d, isAvailable } : d))
      );
    },
    []
  );

  const handleDeleted = useCallback((driverId: number) => {
    setDrivers((prev) => prev.filter((d) => d.id !== driverId));
  }, []);

  const handleDeleteSuccess = useCallback(() => {
    // 다건 삭제 후 목록 새로고침
    fetchDrivers().then((res) => {
      if (res?.success && res.data) {
        setDrivers(res.data.drivers);
      }
    });
  }, [fetchDrivers]);

  if (isLoading)
    return <LoadingSpinner message="기사 데이터를 불러오는 중..." />;

  return (
    <>
      <PageHead
        title={`배달기사 관리 - ${COMPANY_INFO.name}`}
        description="배달기사를 등록하고 관리하세요."
        keywords={['배달기사', '기사 관리', COMPANY_INFO.name]}
        og={{
          title: `배달기사 관리 - ${COMPANY_INFO.name}`,
          description: '배달기사 등록 및 관리 시스템',
          image: '/images/og-delivery.jpg',
          type: 'website',
        }}
      />

      {error && <ErrorAlert error={error} onRetry={() => fetchDrivers()} />}

      {!error && (
        <div className="space-y-4">
          <DriverStats drivers={drivers} />
          <DriverTable
            data={drivers}
            onStatusChange={handleStatusChange}
            onAvailabilityChange={handleAvailabilityChange}
            onDeleted={handleDeleted} // ✅ 추가
            onDeleteSuccess={handleDeleteSuccess} // ✅ 추가
          />
        </div>
      )}
    </>
  );
}
