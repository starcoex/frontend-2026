import { MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import type { Delivery, LiveDriverLocation } from '@starcoex-frontend/delivery';
import { DELIVERY_STATUS_CONFIG } from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';

interface DeliveryMapMarkerProps {
  delivery: Delivery;
  liveLocation?: LiveDriverLocation;
  isSelected?: boolean;
  onClick?: () => void;
}

// 배송 상태별 마커 색상
const STATUS_MARKER_COLOR: Record<string, string> = {
  PENDING: '#94a3b8',
  DRIVER_ASSIGNED: '#3b82f6',
  ACCEPTED: '#6366f1',
  PICKED_UP: '#f59e0b',
  IN_TRANSIT: '#f97316',
  DELIVERED: '#22c55e',
  FAILED: '#ef4444',
  CANCELLED: '#ef4444',
  RETURNED: '#94a3b8',
};

export function DeliveryMapMarker({
  delivery,
  liveLocation,
  isSelected,
  onClick,
}: DeliveryMapMarkerProps) {
  // 기사 실시간 위치가 있으면 그 위치, 없으면 배송 주소 기반 위치 사용
  const position = liveLocation
    ? { lat: liveLocation.lat, lng: liveLocation.lng }
    : delivery.currentLocation
    ? {
        lat: (delivery.currentLocation as { lat: number; lng: number }).lat,
        lng: (delivery.currentLocation as { lat: number; lng: number }).lng,
      }
    : null;

  if (!position) return null;

  const color = STATUS_MARKER_COLOR[delivery.status] ?? '#94a3b8';
  const statusLabel = DELIVERY_STATUS_CONFIG[delivery.status].label;

  return (
    <>
      {/* 기사 위치 마커 */}
      <MapMarker
        position={position}
        onClick={onClick}
        image={{
          src: `https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/pin_b.png`,
          size: { width: isSelected ? 40 : 32, height: isSelected ? 48 : 38 },
        }}
      />

      {/* 선택된 배송 오버레이 */}
      {isSelected && (
        <CustomOverlayMap position={position} yAnchor={2.2}>
          <div
            style={{
              background: '#fff',
              border: `2px solid ${color}`,
              borderRadius: '8px',
              padding: '6px 10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              minWidth: '140px',
              fontSize: '12px',
            }}
          >
            <p
              style={{
                fontWeight: 700,
                color: '#111',
                fontFamily: 'monospace',
                marginBottom: '2px',
              }}
            >
              {delivery.deliveryNumber}
            </p>
            <p style={{ color, fontWeight: 600 }}>{statusLabel}</p>
            {delivery.driver && (
              <p style={{ color: '#666' }}>기사: {delivery.driver.name}</p>
            )}
            {liveLocation && (
              <p style={{ color: '#22c55e', fontSize: '11px' }}>
                ● 실시간 추적 중
              </p>
            )}
          </div>
        </CustomOverlayMap>
      )}

      {/* 실시간 추적 중 펄스 효과 */}
      {liveLocation && !isSelected && (
        <CustomOverlayMap position={position} yAnchor={0.5}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid #fff',
              boxShadow: '0 0 0 4px rgba(34,197,94,0.3)',
              animation: 'pulse 1.5s infinite',
            }}
          />
        </CustomOverlayMap>
      )}
    </>
  );
}
