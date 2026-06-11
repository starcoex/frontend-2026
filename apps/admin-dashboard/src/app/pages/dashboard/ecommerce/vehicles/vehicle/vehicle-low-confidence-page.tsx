import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useVehicleManagement } from '@starcoex-frontend/vehicles';
import { VehicleTable } from '../components/vehicle-table';

export default function VehicleLowConfidencePage() {
  const { vehicles, isLoading, fetchLowConfidenceVehicles } =
    useVehicleManagement();

  useEffect(() => {
    fetchLowConfidenceVehicles();
  }, [fetchLowConfidenceVehicles]);

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
        title={`낮은 신뢰도 차량 - ${COMPANY_INFO.name}`}
        description="등급 신뢰도가 낮은 차량 목록입니다. 수동 검토가 필요합니다."
        keywords={['낮은 신뢰도', '차량 등급', COMPANY_INFO.name]}
        og={{
          title: `낮은 신뢰도 차량 - ${COMPANY_INFO.name}`,
          description: '낮은 신뢰도 차량 목록',
          image: '/images/og-vehicles.jpg',
          type: 'website',
        }}
      />
      <VehicleTable
        data={vehicles}
        onRefresh={() => fetchLowConfidenceVehicles()}
      />
    </>
  );
}
