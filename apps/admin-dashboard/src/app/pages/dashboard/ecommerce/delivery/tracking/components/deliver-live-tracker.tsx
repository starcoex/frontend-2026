import { useState, useEffect, useCallback } from 'react';
import { Map } from 'react-kakao-maps-sdk';
import { Wifi, WifiOff, MapPin, Clock, Truck, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDelivery } from '@starcoex-frontend/delivery';
import { useAuth } from '@starcoex-frontend/auth';
import type { Delivery } from '@starcoex-frontend/delivery';
import {
  DELIVERY_STATUS_CONFIG,
  formatEstimatedTime,
} from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';
import { DeliveryMapMarker } from '@/app/pages/dashboard/ecommerce/delivery/maps/components/delivery-map-market';
import { DeliveryDriverStatusCard } from '@/app/pages/dashboard/ecommerce/delivery/drivers/components/delivery-driver.status-card';
import { DeliveryRealtimeMap } from '@/app/pages/dashboard/ecommerce/delivery/maps/components/delivery-realtime-map';

interface DeliveryLiveTrackerProps {
  deliveryId?: number;
  showAllActive?: boolean;
}

const DEFAULT_CENTER = { lat: 36.5, lng: 127.5 };

export function DeliveryLiveTracker({
  deliveryId,
  showAllActive = false,
}: DeliveryLiveTrackerProps) {
  const { currentUser } = useAuth();
  const {
    deliveries,
    currentDelivery,
    liveLocations,
    socketStatus,
    isSocketConnected,
    subscribeDelivery,
    unsubscribeDelivery,
    fetchDeliveryById,
    fetchDeliveries,
  } = useDelivery({
    token: currentUser?.accessToken ?? null,
    deliveryId,
    joinDriversRoom: showAllActive,
  });

  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [singleMapCenter, setSingleMapCenter] = useState(DEFAULT_CENTER);

  useEffect(() => {
    if (deliveryId) {
      fetchDeliveryById(deliveryId);
    } else if (showAllActive) {
      fetchDeliveries({
        statuses: ['IN_TRANSIT', 'PICKED_UP', 'ACCEPTED', 'DRIVER_ASSIGNED'],
        includeDriver: true,
        limit: 50,
      });
    }
  }, [deliveryId, showAllActive]);

  useEffect(() => {
    if (deliveryId && currentDelivery) {
      setSelectedDelivery(currentDelivery);
    }
  }, [deliveryId, currentDelivery]);

  // 단일 추적 시 기사 위치 업데이트 → 지도 중심 이동
  useEffect(() => {
    if (!deliveryId || !selectedDelivery?.driverId) return;
    const loc = liveLocations[selectedDelivery.driverId];
    if (loc) {
      setSingleMapCenter({ lat: loc.lat, lng: loc.lng });
    }
  }, [liveLocations, deliveryId, selectedDelivery]);

  // ── 단일 배송 추적 뷰 ──────────────────────────────────────────────────────

  if (deliveryId && selectedDelivery) {
    const d = selectedDelivery;
    const driverLocation =
      d.driverId != null ? liveLocations[d.driverId] : undefined;

    return (
      <div className="space-y-4">
        {/* 연결 상태 배너 */}
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm ${
            isSocketConnected
              ? 'border-primary/30 bg-primary/5 text-primary'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {isSocketConnected ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
          <span>
            {isSocketConnected
              ? '실시간 위치 추적 중입니다.'
              : '실시간 연결이 끊겼습니다. 재연결 시도 중...'}
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* 단일 배송 지도 */}
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="h-[360px] w-full overflow-hidden rounded-lg">
                  <Map
                    center={singleMapCenter}
                    level={5}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <DeliveryMapMarker
                      delivery={d}
                      liveLocation={driverLocation}
                      isSelected
                    />
                  </Map>
                </div>
              </CardContent>
            </Card>

            {/* 배송 정보 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Truck className="h-4 w-4" />
                    {d.deliveryNumber}
                  </CardTitle>
                  <Badge variant={DELIVERY_STATUS_CONFIG[d.status].variant}>
                    {DELIVERY_STATUS_CONFIG[d.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <MapPin className="text-primary h-3.5 w-3.5" />
                      픽업 주소
                    </div>
                    <p className="text-muted-foreground pl-5 text-xs">
                      {(d.pickupAddress as { address?: string }).address ??
                        JSON.stringify(d.pickupAddress)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <MapPin className="text-destructive h-3.5 w-3.5" />
                      배송 주소
                    </div>
                    <p className="text-muted-foreground pl-5 text-xs">
                      {(d.deliveryAddress as { address?: string }).address ??
                        JSON.stringify(d.deliveryAddress)}
                    </p>
                  </div>
                </div>

                {d.estimatedTime && (
                  <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm">
                    <Clock className="text-primary h-4 w-4" />
                    <span>
                      예상 소요 시간:{' '}
                      <strong>{formatEstimatedTime(d.estimatedTime)}</strong>
                    </span>
                  </div>
                )}

                {driverLocation ? (
                  <div className="rounded-md bg-muted px-3 py-2 text-xs">
                    <p className="font-medium">📍 기사 현재 위치 (실시간)</p>
                    <p className="text-muted-foreground mt-1">
                      위도: {driverLocation.lat.toFixed(6)} / 경도:{' '}
                      {driverLocation.lng.toFixed(6)}
                    </p>
                    <p className="text-muted-foreground">
                      마지막 업데이트:{' '}
                      {new Date(driverLocation.updatedAt).toLocaleString(
                        'ko-KR'
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed px-3 py-2 text-xs">
                    <p className="text-muted-foreground">
                      기사 위치 정보가 없습니다.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 기사 상태 카드 */}
          <div>
            {d.driver ? (
              <DeliveryDriverStatusCard
                driver={d.driver}
                liveLocation={driverLocation}
              />
            ) : (
              <Card>
                <CardContent className="flex h-32 items-center justify-center">
                  <div className="text-center">
                    <User className="text-muted-foreground mx-auto mb-2 h-6 w-6 opacity-40" />
                    <p className="text-muted-foreground text-sm">
                      배달기사 미배정
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── 전체 활성 배송 대시보드 뷰 ────────────────────────────────────────────

  const activeDrivers = Object.values(
    deliveries.reduce((acc, d) => {
      if (d.driver && !acc[d.driver.id]) acc[d.driver.id] = d.driver;
      return acc;
    }, {} as Record<number, NonNullable<(typeof deliveries)[0]['driver']>>)
  );

  const handleSelectDelivery = useCallback(
    (d: Delivery) => {
      setSelectedDelivery(d);
      subscribeDelivery(d.id);
    },
    [subscribeDelivery]
  );

  return (
    <div className="space-y-4">
      <DeliveryRealtimeMap
        deliveries={deliveries}
        liveLocations={liveLocations}
        socketStatus={socketStatus}
        onDeliverySelect={handleSelectDelivery}
        selectedDeliveryId={selectedDelivery?.id}
      />

      {selectedDelivery && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    선택된 배송: {selectedDelivery.deliveryNumber}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      unsubscribeDelivery(selectedDelivery.id);
                      setSelectedDelivery(null);
                    }}
                  >
                    닫기
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-xs">상태</p>
                  <Badge
                    variant={
                      DELIVERY_STATUS_CONFIG[selectedDelivery.status].variant
                    }
                  >
                    {DELIVERY_STATUS_CONFIG[selectedDelivery.status].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">배송 주소</p>
                  <p className="text-xs">
                    {(
                      selectedDelivery.deliveryAddress as {
                        address?: string;
                      }
                    ).address ?? '-'}
                  </p>
                </div>
                {selectedDelivery.estimatedTime && (
                  <div>
                    <p className="text-muted-foreground text-xs">
                      예상 소요 시간
                    </p>
                    <p className="text-xs font-medium">
                      {formatEstimatedTime(selectedDelivery.estimatedTime)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div>
            {selectedDelivery.driver && (
              <DeliveryDriverStatusCard
                driver={selectedDelivery.driver}
                liveLocation={
                  selectedDelivery.driverId != null
                    ? liveLocations[selectedDelivery.driverId]
                    : undefined
                }
              />
            )}
          </div>
        </div>
      )}

      {activeDrivers.length > 0 && (
        <div>
          <p className="text-muted-foreground mb-3 text-sm font-medium">
            활성 배달기사 ({activeDrivers.length}명)
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeDrivers.map((driver) => (
              <DeliveryDriverStatusCard
                key={driver.id}
                driver={driver}
                liveLocation={liveLocations[driver.id]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
