import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHead } from '@starcoex-frontend/common';
import { DriverSearch } from '@starcoex-frontend/common';
import type { SelectedDriver } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { Separator } from '@/components/ui/separator';
import { DELIVERY_ROUTES } from '@/app/constants/delivery-routes';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';
import { DriverRegisterForm } from '@/app/pages/dashboard/ecommerce/delivery/drivers/components/driver-register-form';

export default function DeliveryDriverCreatePage() {
  const navigate = useNavigate();
  const [selectedDriver, setSelectedDriver] = useState<SelectedDriver | null>(
    null
  );

  const handleSuccess = (_driver: DeliveryDriver) => {
    navigate(DELIVERY_ROUTES.DRIVERS);
  };

  const handleCancel = () => {
    navigate(DELIVERY_ROUTES.DRIVERS);
  };

  return (
    <>
      <PageHead
        title={`배달기사 등록 - ${COMPANY_INFO.name}`}
        description="새 배달기사를 등록하세요."
        keywords={['배달기사 등록', COMPANY_INFO.name]}
        og={{
          title: `배달기사 등록 - ${COMPANY_INFO.name}`,
          description: '배달기사 등록',
          image: '/images/og-delivery.jpg',
          type: 'website',
        }}
      />

      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold">1. 배달기사 유저 검색</p>
          <p className="text-muted-foreground text-xs">
            DELIVERY role이 부여된 유저를 검색하여 배달기사로 등록합니다.
          </p>
          <DriverSearch
            selected={selectedDriver}
            onSelect={setSelectedDriver}
            onClear={() => setSelectedDriver(null)}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-sm font-semibold">2. 기사 상세 정보 입력</p>
          <DriverRegisterForm
            selectedDriver={selectedDriver}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </>
  );
}
