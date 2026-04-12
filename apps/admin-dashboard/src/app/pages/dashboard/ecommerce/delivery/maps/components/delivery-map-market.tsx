import { useRef, useEffect } from 'react';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';
import type { Delivery, LiveDriverLocation } from '@starcoex-frontend/delivery';
import { DELIVERY_STATUS_CONFIG } from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';

interface DeliveryMapMarkerProps {
  delivery: Delivery;
  liveLocation?: LiveDriverLocation;
  isSelected?: boolean;
  onClick?: () => void;
}

const STATUS_COLOR: Record<string, string> = {
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

const VEHICLE_SVG_PATH: Record<string, string> = {
  BICYCLE:
    'M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0M15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0M12 17V7l-3 3m6-3-3 3M9 10h6',
  MOTORCYCLE:
    'M12 12h4l3 5H9l3-5zm0 0V7M6 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0M14 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0',
  CAR: 'M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0M15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0M3 11h18',
  TRUCK:
    'M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0M16 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0',
};

export function DeliveryMapMarker({
  delivery,
  liveLocation,
  isSelected,
  onClick,
}: DeliveryMapMarkerProps) {
  // ✅ Hook은 항상 최상단에 — 조기 리턴 전에 모두 선언
  const containerRef = useRef<HTMLDivElement>(null);

  // position 계산 (Hook 아님 — 일반 변수)
  const position = liveLocation
    ? { lat: liveLocation.lat, lng: liveLocation.lng }
    : delivery.currentLocation
    ? {
        lat: (delivery.currentLocation as { lat: number; lng: number }).lat,
        lng: (delivery.currentLocation as { lat: number; lng: number }).lng,
      }
    : null;

  // ✅ useEffect는 반드시 조기 리턴 전에 선언
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !position) return; // position 없으면 내부에서 early return

    const popup = el.querySelector<HTMLElement>('[data-popup]');
    let hideTimer: ReturnType<typeof setTimeout>;

    const showPopup = () => {
      if (popup) popup.style.display = 'block';
      clearTimeout(hideTimer);
    };

    const hidePopup = () => {
      hideTimer = setTimeout(() => {
        if (popup) popup.style.display = 'none';
      }, 150);
    };

    el.addEventListener('mouseenter', showPopup);
    el.addEventListener('mouseleave', hidePopup);
    if (popup) {
      popup.addEventListener('mouseenter', showPopup);
      popup.addEventListener('mouseleave', hidePopup);
    }
    el.addEventListener('click', () => onClick?.());

    return () => {
      el.removeEventListener('mouseenter', showPopup);
      el.removeEventListener('mouseleave', hidePopup);
      if (popup) {
        popup.removeEventListener('mouseenter', showPopup);
        popup.removeEventListener('mouseleave', hidePopup);
      }
      clearTimeout(hideTimer);
    };
  }, [delivery.id, isSelected, !!position]);

  // ✅ Hook 선언 이후에 조기 리턴
  if (!position) return null;

  const color = STATUS_COLOR[delivery.status] ?? '#94a3b8';
  const statusLabel = DELIVERY_STATUS_CONFIG[delivery.status].label;
  const vehicleType = delivery.driver?.vehicleType ?? 'CAR';
  const svgPath = VEHICLE_SVG_PATH[vehicleType] ?? VEHICLE_SVG_PATH.CAR;

  const MARKER_SIZE = isSelected ? 32 : 26;
  const ICON_SIZE = isSelected ? 14 : 11;

  return (
    <CustomOverlayMap
      position={position}
      yAnchor={1.1}
      zIndex={isSelected ? 10 : 1}
    >
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* 팝업 */}
        <div
          data-popup
          style={{
            display: 'none',
            position: 'absolute',
            bottom: `${MARKER_SIZE + 10}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fff',
            border: `2px solid ${color}`,
            borderRadius: '8px',
            padding: '8px 10px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            minWidth: '150px',
            maxWidth: '190px',
            whiteSpace: 'nowrap',
            zIndex: 100,
          }}
        >
          <p
            style={{
              fontWeight: 700,
              color: '#111',
              fontFamily: 'monospace',
              fontSize: '12px',
              marginBottom: '4px',
            }}
          >
            {delivery.deliveryNumber}
          </p>
          <span
            style={{
              display: 'inline-block',
              background: color,
              color: '#fff',
              borderRadius: '4px',
              padding: '1px 6px',
              fontSize: '10px',
              fontWeight: 600,
              marginBottom: '3px',
            }}
          >
            {statusLabel}
          </span>
          {delivery.driver && (
            <p style={{ color: '#555', fontSize: '11px', marginTop: '3px' }}>
              {delivery.driver.name}
              {delivery.driver.vehicleNumber
                ? ` · ${delivery.driver.vehicleNumber}`
                : ''}
            </p>
          )}
          {liveLocation && (
            <p
              style={{
                color: '#22c55e',
                fontSize: '10px',
                marginTop: '3px',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: '#22c55e',
                }}
              />
              실시간 추적 중
            </p>
          )}
          {/* 팝업 꼬리 */}
          <div
            style={{
              position: 'absolute',
              bottom: '-7px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: `7px solid ${color}`,
            }}
          />
        </div>

        {/* 펄스 링 */}
        {liveLocation && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${MARKER_SIZE + 14}px`,
              height: `${MARKER_SIZE + 14}px`,
              borderRadius: '50%',
              background: `${color}18`,
              border: `2px solid ${color}45`,
              animation: 'pulse 2s ease-in-out infinite',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}

        {/* 원형 마커 */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: `${MARKER_SIZE}px`,
            height: `${MARKER_SIZE}px`,
            borderRadius: '50%',
            background: '#fff',
            border: `2.5px solid ${color}`,
            boxShadow: isSelected
              ? `0 0 0 3px ${color}35, 0 3px 10px rgba(0,0,0,0.2)`
              : '0 2px 6px rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          <svg
            width={ICON_SIZE}
            height={ICON_SIZE}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={svgPath} />
          </svg>
        </div>

        {/* 마커 꼬리 */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: `6px solid ${color}`,
            marginTop: '-1px',
            zIndex: 1,
          }}
        />
      </div>
    </CustomOverlayMap>
  );
}
