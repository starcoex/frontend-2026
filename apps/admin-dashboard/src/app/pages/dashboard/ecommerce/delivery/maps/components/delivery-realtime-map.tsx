import { useState, useEffect, useCallback } from 'react';
import { Map, useKakaoLoader } from 'react-kakao-maps-sdk';
import { Navigation, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Delivery, LiveDriverLocation } from '@starcoex-frontend/delivery';
import { DeliveryMapMarker } from '@/app/pages/dashboard/ecommerce/delivery/maps/components/delivery-map-market';
import { DELIVERY_STATUS_CONFIG } from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';

interface DeliveryRealtimeMapProps {
  deliveries: Delivery[];
  liveLocations: Record<number, LiveDriverLocation>;
  socketStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  onDeliverySelect?: (delivery: Delivery) => void;
  selectedDeliveryId?: number;
}

const SOCKET_STATUS_CONFIG = {
  connecting: { label: '연결 중...', variant: 'warning' as const },
  connected: { label: '실시간 연결됨', variant: 'success' as const },
  disconnected: { label: '연결 끊김', variant: 'secondary' as const },
  error: { label: '연결 오류', variant: 'destructive' as const },
};

// 한국 중심 좌표 (기본값)
const DEFAULT_CENTER = { lat: 36.5, lng: 127.5 };
const DEFAULT_LEVEL = 13;

export function DeliveryRealtimeMap({
  deliveries,
  liveLocations,
  socketStatus,
  onDeliverySelect,
  selectedDeliveryId,
}: DeliveryRealtimeMapProps) {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_APP_KEY ?? '',
    libraries: ['clusterer'],
  });

  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapLevel, setMapLevel] = useState(DEFAULT_LEVEL);

  const activeDeliveries = deliveries.filter((d) =>
    ['IN_TRANSIT', 'PICKED_UP', 'ACCEPTED', 'DRIVER_ASSIGNED'].includes(
      d.status
    )
  );

  const liveCount = activeDeliveries.filter(
    (d) => d.driverId != null && liveLocations[d.driverId]
  ).length;

  // 실시간 위치 업데이트 시 지도 중심 이동 (선택된 배송이 있을 때)
  useEffect(() => {
    if (!selectedDeliveryId) return;
    const selected = deliveries.find((d) => d.id === selectedDeliveryId);
    if (!selected?.driverId) return;

    const loc = liveLocations[selected.driverId];
    if (loc) {
      setMapCenter({ lat: loc.lat, lng: loc.lng });
      setMapLevel(5);
    }
  }, [liveLocations, selectedDeliveryId, deliveries]);

  // 선택된 배송으로 지도 이동
  const handleDeliverySelect = useCallback(
    (delivery: Delivery) => {
      onDeliverySelect?.(delivery);

      const loc =
        delivery.driverId != null ? liveLocations[delivery.driverId] : null;
      const currentLoc = delivery.currentLocation as {
        lat: number;
        lng: number;
      } | null;

      if (loc) {
        setMapCenter({ lat: loc.lat, lng: loc.lng });
        setMapLevel(5);
      } else if (currentLoc) {
        setMapCenter({ lat: currentLoc.lat, lng: currentLoc.lng });
        setMapLevel(5);
      }
    },
    [liveLocations, onDeliverySelect]
  );

  const handleResetView = () => {
    setMapCenter(DEFAULT_CENTER);
    setMapLevel(DEFAULT_LEVEL);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            실시간 배송 현황
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={SOCKET_STATUS_CONFIG[socketStatus].variant}>
              {socketStatus === 'connected' ? (
                <Wifi className="mr-1 h-3 w-3" />
              ) : (
                <WifiOff className="mr-1 h-3 w-3" />
              )}
              {SOCKET_STATUS_CONFIG[socketStatus].label}
            </Badge>
            <Badge variant="outline">실시간 추적 {liveCount}건</Badge>
            <Button variant="outline" size="sm" onClick={handleResetView}>
              전체 보기
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-0 pb-4">
        {/* 카카오 지도 */}
        <div className="relative h-[480px] w-full overflow-hidden">
          {loading && (
            <div className="bg-muted absolute inset-0 z-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="text-primary h-6 w-6 animate-spin" />
                <p className="text-muted-foreground text-sm">
                  지도를 불러오는 중...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-muted absolute inset-0 z-10 flex items-center justify-center">
              <p className="text-destructive text-sm">
                지도를 불러오는데 실패했습니다. API 키를 확인해주세요.
              </p>
            </div>
          )}

          {!loading && !error && (
            <Map
              center={mapCenter}
              level={mapLevel}
              style={{ width: '100%', height: '100%' }}
              onCenterChanged={(map) =>
                setMapCenter({
                  lat: map.getCenter().getLat(),
                  lng: map.getCenter().getLng(),
                })
              }
              onZoomChanged={(map) => setMapLevel(map.getLevel())}
            >
              {/* 배송 마커 렌더링 */}
              {activeDeliveries.map((delivery) => {
                const liveLocation =
                  delivery.driverId != null
                    ? liveLocations[delivery.driverId]
                    : undefined;

                return (
                  <DeliveryMapMarker
                    key={delivery.id}
                    delivery={delivery}
                    liveLocation={liveLocation}
                    isSelected={delivery.id === selectedDeliveryId}
                    onClick={() => handleDeliverySelect(delivery)}
                  />
                );
              })}
            </Map>
          )}
        </div>

        {/* 활성 배송 목록 */}
        <div className="px-4">
          {activeDeliveries.length === 0 ? (
            <div className="flex h-16 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground text-sm">
                현재 진행 중인 배송이 없습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-medium">
                진행 중인 배송 ({activeDeliveries.length}건)
              </p>
              <div className="max-h-40 space-y-1.5 overflow-y-auto pr-1">
                {activeDeliveries.map((delivery) => {
                  const isTracking =
                    delivery.driverId != null &&
                    !!liveLocations[delivery.driverId];
                  const isSelected = delivery.id === selectedDeliveryId;

                  return (
                    <button
                      key={delivery.id}
                      type="button"
                      onClick={() => handleDeliverySelect(delivery)}
                      className={`w-full rounded-lg border p-2.5 text-left transition-colors hover:bg-muted ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'bg-background'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block h-2 w-2 rounded-full ${
                              isTracking
                                ? 'bg-primary animate-pulse'
                                : 'bg-muted-foreground/30'
                            }`}
                          />
                          <span className="font-mono text-xs font-medium">
                            {delivery.deliveryNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isTracking && (
                            <Badge
                              variant="outline"
                              className="h-4 px-1 text-xs"
                            >
                              <Wifi className="mr-0.5 h-2.5 w-2.5" />
                              Live
                            </Badge>
                          )}
                          <Badge
                            variant={
                              DELIVERY_STATUS_CONFIG[delivery.status].variant
                            }
                            className="h-4 px-1 text-xs"
                          >
                            {DELIVERY_STATUS_CONFIG[delivery.status].label}
                          </Badge>
                        </div>
                      </div>
                      {delivery.driver && (
                        <p className="text-muted-foreground mt-1 text-xs">
                          기사: {delivery.driver.name} ·{' '}
                          {delivery.driver.vehicleType}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
