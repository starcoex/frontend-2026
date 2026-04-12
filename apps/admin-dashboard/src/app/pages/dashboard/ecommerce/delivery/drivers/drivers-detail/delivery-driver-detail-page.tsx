import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useDelivery } from '@starcoex-frontend/delivery';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';
import { toast } from 'sonner';
import { DELIVERY_ROUTES } from '@/app/constants/delivery-routes';
import { DriverDetailHeader } from '@/app/pages/dashboard/ecommerce/delivery/drivers/drivers-detail/components/driver-detail-header';
import { DriverStatsCard } from '@/app/pages/dashboard/ecommerce/delivery/drivers/drivers-detail/components/driver-stats-card';
import { DriverBasicInfoCard } from '@/app/pages/dashboard/ecommerce/delivery/drivers/drivers-detail/components/driver-basic-info-card';
import { DriverVehicleCard } from '@/app/pages/dashboard/ecommerce/delivery/drivers/drivers-detail/components/driver-vehicle-card';
import { DriverPaymentCard } from '@/app/pages/dashboard/ecommerce/delivery/drivers/drivers-detail/components/driver-payment-card';
import { DriverWorkCard } from '@/app/pages/dashboard/ecommerce/delivery/drivers/drivers-detail/components/driver-work-card';
import { DriverDeliveryTab } from '@/app/pages/dashboard/ecommerce/delivery/drivers/drivers-detail/components/driver-delivery-tab';
import { DriverSettlementTab } from '@/app/pages/dashboard/ecommerce/delivery/drivers/drivers-detail/components/driver-settlement-tab';
import { DriverLicenseTab } from '@/app/pages/dashboard/ecommerce/delivery/drivers/drivers-detail/components/driver-license-tab';

export default function DeliveryDriverDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    fetchDriverById, // ✅ 전용 API 사용
    updateDriverAvailability,
    deactivateDriver,
  } = useDelivery();

  const [driver, setDriver] = useState<DeliveryDriver | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isActing, setIsActing] = useState(false);

  // ✅ getDriverById 전용 API 사용
  useEffect(() => {
    if (!id) return;
    setIsFetching(true);
    fetchDriverById(parseInt(id))
      .then((res) => {
        if (res?.success && res.data) {
          setDriver(res.data);
        }
      })
      .finally(() => setIsFetching(false));
  }, [id, fetchDriverById]);

  const handleToggleAvailability = useCallback(async () => {
    if (!driver) return;
    setIsActing(true);
    const res = await updateDriverAvailability(driver.id, !driver.isAvailable);
    if (res.success && res.data) {
      setDriver((prev) =>
        prev ? { ...prev, isAvailable: res.data!.isAvailable } : prev
      );
      toast.success('가용 상태가 변경되었습니다.');
    } else {
      toast.error(res.error?.message ?? '상태 변경에 실패했습니다.');
    }
    setIsActing(false);
  }, [driver, updateDriverAvailability]);

  const handleDeactivate = useCallback(async () => {
    if (!driver) return;
    setIsActing(true);
    const res = await deactivateDriver(driver.id);
    if (res.success) {
      setDriver((prev) => (prev ? { ...prev, status: 'INACTIVE' } : prev));
      toast.success('기사가 비활성화되었습니다.');
    } else {
      toast.error(res.error?.message ?? '비활성화에 실패했습니다.');
    }
    setIsActing(false);
  }, [driver, deactivateDriver]);

  const handleLicenseVerified = useCallback((licenseNumber: string) => {
    setDriver((prev) => (prev ? { ...prev, licenseNumber } : prev));
  }, []);

  const handleProfileUpdated = useCallback((updated: DeliveryDriver) => {
    setDriver(updated);
  }, []);

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            기사 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">기사 정보를 찾을 수 없습니다.</p>
        <Button onClick={() => navigate(DELIVERY_ROUTES.DRIVERS)}>
          기사 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`${driver.name} - 기사 상세 - ${COMPANY_INFO.name}`}
        description="배달기사 상세 정보를 확인하세요."
        keywords={[
          '배달기사',
          driver.name,
          driver.driverCode,
          COMPANY_INFO.name,
        ]}
        og={{
          title: `${driver.name} - 기사 상세`,
          description: '배달기사 상세 정보',
          image: '/images/og-delivery.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        <DriverDetailHeader
          driver={driver}
          onToggleAvailability={handleToggleAvailability}
          onDeactivate={handleDeactivate}
          isLoading={isActing}
        />

        <DriverStatsCard driver={driver} />

        <Tabs defaultValue="info">
          <TabsList className="w-full">
            <TabsTrigger value="info" className="flex-1">
              기본 정보
            </TabsTrigger>
            <TabsTrigger value="deliveries" className="flex-1">
              배송 이력
              {driver.deliveries.length > 0 && (
                <span className="bg-primary text-primary-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs">
                  {driver.deliveries.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="settlements" className="flex-1">
              정산 내역
            </TabsTrigger>
            <TabsTrigger value="license" className="flex-1">
              면허 인증
              {driver.licenseNumber && (
                <span className="ml-1.5 text-xs">✅</span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <DriverBasicInfoCard
                driver={driver}
                onUpdated={handleProfileUpdated}
              />
              <DriverVehicleCard
                driver={driver}
                onUpdated={handleProfileUpdated}
              />
              <DriverPaymentCard driver={driver} />
              <DriverWorkCard
                driver={driver}
                onUpdated={handleProfileUpdated}
              />
            </div>
          </TabsContent>

          <TabsContent value="deliveries" className="mt-4">
            <DriverDeliveryTab driver={driver} />
          </TabsContent>

          {/* ✅ 정산 내역: getDriverSettlements API 사용 */}
          <TabsContent value="settlements" className="mt-4">
            <DriverSettlementTab driverId={driver.id} />
          </TabsContent>

          <TabsContent value="license" className="mt-4">
            <DriverLicenseTab
              driver={driver}
              onVerified={handleLicenseVerified}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
