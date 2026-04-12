import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Power, PowerOff } from 'lucide-react';
import { useDelivery } from '@starcoex-frontend/delivery';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DRIVER_STATUS_CONFIG,
  VEHICLE_TYPE_CONFIG,
  formatDeliveryFee,
} from '@/app/pages/teams/delivery/driver/data/driver-data';

interface DriverAvailabilityCardProps {
  driver: DeliveryDriver;
  onUpdated: (driver: DeliveryDriver) => void;
}

export function DriverAvailabilityCard({
  driver,
  onUpdated,
}: DriverAvailabilityCardProps) {
  const { updateDriverAvailability } = useDelivery();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      const res = await updateDriverAvailability(
        driver.id,
        !driver.isAvailable
      );
      if (res.success && res.data) {
        toast.success(
          res.data.isAvailable
            ? '출근 처리되었습니다. 배송을 받을 수 있습니다.'
            : '퇴근 처리되었습니다.'
        );
        onUpdated(res.data);
      } else {
        toast.error(res.error?.message ?? '상태 변경에 실패했습니다.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">가용 상태</CardTitle>
          <Badge variant={DRIVER_STATUS_CONFIG[driver.status].variant}>
            {DRIVER_STATUS_CONFIG[driver.status].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 현재 상태 표시 */}
        <div
          className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
            driver.isAvailable
              ? 'border-primary/30 bg-primary/5'
              : 'bg-muted border-muted'
          }`}
        >
          <div className="flex items-center gap-2">
            {driver.isAvailable ? (
              <Power className="text-primary h-5 w-5" />
            ) : (
              <PowerOff className="text-muted-foreground h-5 w-5" />
            )}
            <div>
              <p
                className={`text-sm font-semibold ${
                  driver.isAvailable ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {driver.isAvailable ? '출근 중' : '퇴근 중'}
              </p>
              <p className="text-muted-foreground text-xs">
                {driver.isAvailable
                  ? '배송 요청을 받을 수 있습니다.'
                  : '배송 요청을 받지 않습니다.'}
              </p>
            </div>
          </div>
          <Button
            variant={driver.isAvailable ? 'outline' : 'default'}
            size="sm"
            onClick={handleToggle}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : driver.isAvailable ? (
              '퇴근'
            ) : (
              '출근'
            )}
          </Button>
        </div>

        <Separator />

        {/* 기사 통계 요약 */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-muted rounded-md p-3">
            <p className="text-muted-foreground text-xs">총 배송</p>
            <p className="text-lg font-bold">
              {driver.totalDeliveries.toLocaleString()}건
            </p>
          </div>
          <div className="bg-muted rounded-md p-3">
            <p className="text-muted-foreground text-xs">완료율</p>
            <p className="text-lg font-bold">
              {driver.completionRate != null
                ? `${driver.completionRate.toFixed(1)}%`
                : '-'}
            </p>
          </div>
          <div className="bg-muted rounded-md p-3">
            <p className="text-muted-foreground text-xs">평균 평점</p>
            <p className="text-lg font-bold">
              {driver.avgRating != null
                ? `★ ${driver.avgRating.toFixed(1)}`
                : '-'}
            </p>
          </div>
          <div className="bg-muted rounded-md p-3">
            <p className="text-muted-foreground text-xs">건당 수수료</p>
            <p className="text-lg font-bold">
              {driver.ratePerDelivery != null
                ? formatDeliveryFee(driver.ratePerDelivery)
                : '-'}
            </p>
          </div>
        </div>

        {/* 차량 정보 요약 */}
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span>
            {VEHICLE_TYPE_CONFIG[driver.vehicleType]?.label ??
              driver.vehicleType}
          </span>
          {driver.vehicleNumber && (
            <>
              <span>·</span>
              <span>{driver.vehicleNumber}</span>
            </>
          )}
          {driver.driverCode && (
            <>
              <span>·</span>
              <span className="font-mono">{driver.driverCode}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
