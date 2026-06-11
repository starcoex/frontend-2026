import { useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useVehicleManagement } from '@starcoex-frontend/vehicles';
import { VehicleTable } from '@/app/pages/dashboard/ecommerce/vehicles/components/vehicle-table';

export default function VehiclesPage() {
  const { vehicles, isLoading, error, fetchAdminVehicles } =
    useVehicleManagement();

  useEffect(() => {
    fetchAdminVehicles();
  }, [fetchAdminVehicles]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            차량 데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`차량 관리 - ${COMPANY_INFO.name}`}
        description="등록된 차량 목록을 관리하세요."
        keywords={['차량 관리', '차량 목록', COMPANY_INFO.name]}
        og={{
          title: `차량 관리 - ${COMPANY_INFO.name}`,
          description: '차량 목록 관리',
          image: '/images/og-vehicles.jpg',
          type: 'website',
        }}
      />
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>데이터 로딩 실패</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAdminVehicles()}
              className="ml-4"
            >
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {!error && (
        <VehicleTable data={vehicles} onRefresh={() => fetchAdminVehicles()} />
      )}
    </>
  );
}
