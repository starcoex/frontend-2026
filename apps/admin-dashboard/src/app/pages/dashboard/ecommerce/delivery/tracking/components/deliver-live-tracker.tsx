import { useState, useEffect, useCallback } from 'react';
import { Map } from 'react-kakao-maps-sdk';
import { Wifi, WifiOff, MapPin, Clock, Truck, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDelivery } from '@starcoex-frontend/delivery';
import type { Delivery } from '@starcoex-frontend/delivery';
import {
  DELIVERY_STATUS_CONFIG,
  formatEstimatedTime,
} from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';
import { DeliveryMapMarker } from '@/app/pages/dashboard/ecommerce/delivery/maps/components/delivery-map-market';
import { DeliveryDriverStatusCard } from '@/app/pages/dashboard/ecommerce/delivery/drivers/components/delivery-driver-status-card';
import { DeliveryRealtimeMap } from '@/app/pages/dashboard/ecommerce/delivery/maps/components/delivery-realtime-map';

interface DeliveryLiveTrackerProps {
  deliveryId?: number;
  showAllActive?: boolean;
}

const DEFAULT_CENTER = { lat: 36.5, lng: 127.5 };

// ✅ 공통 주소 파싱 함수 — 이중 직렬화 대응
function parseAddressField(raw: unknown): string {
  try {
    let obj = raw;
    // 문자열이면 1차 파싱
    if (typeof obj === 'string') obj = JSON.parse(obj);
    // 여전히 문자열이면 2차 파싱 (이중 직렬화)
    if (typeof obj === 'string') obj = JSON.parse(obj);
    if (obj && typeof obj === 'object') {
      const { address, detail } = obj as Record<string, string>;
      return [address, detail].filter(Boolean).join(', ') || '주소 정보 없음';
    }
    return '주소 정보 없음';
  } catch {
    return '주소 정보 없음';
  }
}

export function DeliveryLiveTracker({
  deliveryId,
  showAllActive = false,
}: DeliveryLiveTrackerProps) {
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
    deliveryId,
    joinDriversRoom: showAllActive,
  });

  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [singleMapCenter, setSingleMapCenter] = useState(DEFAULT_CENTER);

  const ACTIVE_STATUSES = [
    'IN_TRANSIT',
    'PICKED_UP',
    'ACCEPTED',
    'DRIVER_ASSIGNED',
  ] as const;
  const INACTIVE_STATUSES = ['DELIVERED', 'FAILED', 'CANCELLED', 'RETURNED'];

  useEffect(() => {
    if (deliveryId) {
      fetchDeliveryById(deliveryId);
    } else if (showAllActive) {
      fetchDeliveries({
        statuses: [...ACTIVE_STATUSES],
        includeDriver: true,
        limit: 50,
      });
    }
  }, [deliveryId, showAllActive]);

  // 단일 추적: currentDelivery → selectedDelivery 동기화
  useEffect(() => {
    if (deliveryId && currentDelivery) {
      setSelectedDelivery(currentDelivery);
    }
  }, [deliveryId, currentDelivery]);

  // ✅ 소켓 업데이트 시 selectedDelivery 동기화
  useEffect(() => {
    if (!selectedDelivery) return;
    const updated = deliveries.find((d) => d.id === selectedDelivery.id);

    if (!updated) {
      // deliveries에서 사라진 경우 (삭제 등)
      setSelectedDelivery(null);
      return;
    }

    if (updated.status !== selectedDelivery.status) {
      // ✅ 비활성 상태가 되면 즉시 null 처리 (렌더 전에)
      if (INACTIVE_STATUSES.includes(updated.status)) {
        unsubscribeDelivery(updated.id);
        setSelectedDelivery(null);
      } else {
        setSelectedDelivery(updated);
      }
    }
  }, [deliveries, selectedDelivery]);

  // // ✅ 비활성 상태 배송 자동 해제
  // useEffect(() => {
  //   if (!showAllActive || !selectedDelivery) return;
  //   if (INACTIVE_STATUSES.includes(selectedDelivery.status)) {
  //     unsubscribeDelivery(selectedDelivery.id);
  //     setSelectedDelivery(null);
  //   }
  // }, [deliveries, showAllActive, selectedDelivery, unsubscribeDelivery]);

  // 기사 위치 업데이트 시 지도 중심 이동
  useEffect(() => {
    if (!deliveryId || !selectedDelivery?.driverId) return;
    const loc = liveLocations[selectedDelivery.driverId];
    if (loc) {
      setSingleMapCenter({ lat: loc.lat, lng: loc.lng });
    }
  }, [liveLocations, deliveryId, selectedDelivery]);

  const handleSelectDelivery = useCallback(
    (d: Delivery) => {
      setSelectedDelivery(d);
      subscribeDelivery(d.id);
    },
    [subscribeDelivery]
  );

  // ── 단일 배송 추적 뷰 ──────────────────────────────────────────

  if (deliveryId && selectedDelivery) {
    const d = selectedDelivery;
    const driverLocation =
      d.driverId != null ? liveLocations[d.driverId] : undefined;

    return (
      <div className="space-y-4">
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
                    {/* ✅ parseAddressField 사용 */}
                    <p className="text-muted-foreground pl-5 text-xs">
                      {parseAddressField(d.pickupAddress)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <MapPin className="text-destructive h-3.5 w-3.5" />
                      배송 주소
                    </div>
                    {/* ✅ parseAddressField 사용 */}
                    <p className="text-muted-foreground pl-5 text-xs">
                      {parseAddressField(d.deliveryAddress)}
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
                    <p className="font-medium">기사 현재 위치 (실시간)</p>
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

  // ── 전체 활성 배송 대시보드 뷰 ─────────────────────────────────

  // ✅ 활성 상태 배송만 필터링 (소켓으로 비활성화된 것 제외)
  const activeDeliveries = deliveries.filter(
    (d) => !INACTIVE_STATUSES.includes(d.status)
  );

  const activeDrivers = Object.values(
    activeDeliveries.reduce((acc, d) => {
      if (d.driver && !acc[d.driver.id]) acc[d.driver.id] = d.driver;
      return acc;
    }, {} as Record<number, NonNullable<(typeof deliveries)[0]['driver']>>)
  );

  return (
    <div className="space-y-4">
      {/* ✅ 진행 중인 배송 건수 표시 */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          진행 중인 배송{' '}
          <span className="text-foreground font-semibold">
            {activeDeliveries.length}건
          </span>
        </p>
        <p className="text-muted-foreground text-sm">
          활성 기사{' '}
          <span className="text-foreground font-semibold">
            {activeDrivers.length}명
          </span>
        </p>
      </div>

      <DeliveryRealtimeMap
        deliveries={activeDeliveries}
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
                  {/* ✅ optional chaining으로 undefined 방어 */}
                  <Badge
                    variant={
                      DELIVERY_STATUS_CONFIG[selectedDelivery.status]
                        ?.variant ?? 'outline'
                    }
                  >
                    {DELIVERY_STATUS_CONFIG[selectedDelivery.status]?.label ??
                      selectedDelivery.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">픽업 주소</p>
                  {/* ✅ parseAddressField 사용 */}
                  <p className="text-xs">
                    {parseAddressField(selectedDelivery.pickupAddress)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">배송 주소</p>
                  {/* ✅ parseAddressField 사용 */}
                  <p className="text-xs">
                    {parseAddressField(selectedDelivery.deliveryAddress)}
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
                {selectedDelivery.driver && (
                  <div>
                    <p className="text-muted-foreground text-xs">배달기사</p>
                    {/* ✅ driver.totalDeliveries 올바르게 표시 */}
                    <p className="text-xs font-medium">
                      {selectedDelivery.driver.name} · 총{' '}
                      {selectedDelivery.driver.totalDeliveries}건
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
