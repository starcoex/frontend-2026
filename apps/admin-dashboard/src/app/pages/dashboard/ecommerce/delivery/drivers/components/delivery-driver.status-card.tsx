import { User, Wifi, WifiOff, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LiveDriverLocation } from '@starcoex-frontend/delivery';
import {
  DRIVER_STATUS_CONFIG,
  VEHICLE_TYPE_CONFIG,
  formatDeliveryFee,
} from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';

interface DeliveryDriverStatusCardProps {
  driver: DeliveryDriver;
  liveLocation?: LiveDriverLocation;
}

export function DeliveryDriverStatusCard({
  driver,
  liveLocation,
}: DeliveryDriverStatusCardProps) {
  const isLive = !!liveLocation;
  const lastUpdated = liveLocation
    ? new Date(liveLocation.updatedAt).toLocaleString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null;

  return (
    <Card className={isLive ? 'border-primary/40 shadow-sm' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <User className="h-4 w-4 opacity-60" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">
                {driver.name}
              </CardTitle>
              <p className="text-muted-foreground font-mono text-xs">
                {driver.driverCode}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={DRIVER_STATUS_CONFIG[driver.status].variant}>
              {DRIVER_STATUS_CONFIG[driver.status].label}
            </Badge>
            <Badge variant={driver.isAvailable ? 'success' : 'secondary'}>
              {driver.isAvailable ? '가용' : '비가용'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        {/* 차량 정보 */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">차량</span>
          <span className="font-medium">
            {VEHICLE_TYPE_CONFIG[driver.vehicleType].label}
            {driver.vehicleNumber && (
              <span className="text-muted-foreground ml-1 font-mono text-xs">
                ({driver.vehicleNumber})
              </span>
            )}
          </span>
        </div>

        {/* 배송 건수 */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">총 배송</span>
          <span className="font-medium">{driver.totalDeliveries}건</span>
        </div>

        {/* 평점 */}
        {driver.avgRating && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">평점</span>
            <span className="font-medium">
              ⭐ {driver.avgRating.toFixed(1)}
            </span>
          </div>
        )}

        {/* 건당 수수료 */}
        {driver.ratePerDelivery && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">건당 수수료</span>
            <span className="font-medium">
              {formatDeliveryFee(driver.ratePerDelivery)}
            </span>
          </div>
        )}

        {/* 실시간 위치 상태 */}
        <div className="border-t pt-2">
          {isLive ? (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs">
                <Wifi className="text-primary h-3.5 w-3.5" />
                <span className="text-primary font-medium">실시간 추적 중</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="text-muted-foreground h-3 w-3" />
                  <span className="text-muted-foreground">
                    마지막 업데이트: {lastUpdated}
                  </span>
                </div>
              </div>
              <div className="text-muted-foreground grid grid-cols-2 gap-1 text-xs">
                <span>위도: {liveLocation.lat.toFixed(6)}</span>
                <span>경도: {liveLocation.lng.toFixed(6)}</span>
                {liveLocation.speed != null && (
                  <span>속도: {liveLocation.speed.toFixed(1)} m/s</span>
                )}
                {liveLocation.heading != null && (
                  <span>방향: {liveLocation.heading.toFixed(0)}°</span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs">
              <WifiOff className="text-muted-foreground h-3.5 w-3.5" />
              <span className="text-muted-foreground">위치 추적 없음</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
