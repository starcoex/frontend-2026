import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useVehicleManagement } from '@starcoex-frontend/vehicles';
import { VehicleTable } from '../components/vehicle-table';

export default function VehiclePendingReviewPage() {
  const { vehicles, isLoading, fetchPendingReviewVehicles } =
    useVehicleManagement();

  useEffect(() => {
    fetchPendingReviewVehicles();
  }, [fetchPendingReviewVehicles]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`검토 대기 차량 - ${COMPANY_INFO.name}`}
        description="관리자 검토가 필요한 차량 목록입니다."
        keywords={['검토 대기', '차량 검토', COMPANY_INFO.name]}
        og={{
          title: `검토 대기 차량 - ${COMPANY_INFO.name}`,
          description: '검토 대기 차량 목록',
          image: '/images/og-vehicles.jpg',
          type: 'website',
        }}
      />
      <VehicleTable
        data={vehicles}
        onRefresh={() => fetchPendingReviewVehicles()}
      />
    </>
  );
}
