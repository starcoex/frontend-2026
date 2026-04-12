import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useDelivery } from '@starcoex-frontend/delivery';
import { GPS_CONFIG } from '@/app/pages/teams/delivery/driver/data/driver-data';

export type GpsStatus = 'idle' | 'watching' | 'error' | 'unsupported';

interface UseDriverGpsOptions {
  driverId: number | null;
  /** active 페이지 진입 시 자동 시작 여부 */
  autoStart?: boolean;
}

interface UseDriverGpsReturn {
  gpsStatus: GpsStatus;
  currentPosition: GeolocationCoordinates | null;
  startTracking: () => void;
  stopTracking: () => void;
  lastSentAt: Date | null;
}

export function useDriverGps({
  driverId,
  autoStart = true,
}: UseDriverGpsOptions): UseDriverGpsReturn {
  const { updateDriverLocation } = useDelivery();
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('idle');
  const [currentPosition, setCurrentPosition] =
    useState<GeolocationCoordinates | null>(null);
  const [lastSentAt, setLastSentAt] = useState<Date | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const latestPositionRef = useRef<GeolocationCoordinates | null>(null);
  const driverIdRef = useRef(driverId);
  driverIdRef.current = driverId;

  // ── 서버 전송 (10초 간격) ──────────────────────────────────────────────────
  const sendLocation = useCallback(async () => {
    const pos = latestPositionRef.current;
    const id = driverIdRef.current;
    if (!pos || !id) return;

    try {
      await updateDriverLocation(id, pos.latitude, pos.longitude);
      setLastSentAt(new Date());
    } catch {
      // 전송 실패는 silent — 다음 인터벌에서 재시도
    }
  }, [updateDriverLocation]);

  // ── GPS 추적 시작 ──────────────────────────────────────────────────────────
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsStatus('unsupported');
      toast.error('이 기기는 GPS를 지원하지 않습니다.');
      return;
    }
    if (watchIdRef.current !== null) return; // 이미 추적 중

    setGpsStatus('watching');

    // watchPosition — 위치 변경 시마다 latestPosition 갱신
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        latestPositionRef.current = position.coords;
        setCurrentPosition(position.coords);
        setGpsStatus('watching');
      },
      (err) => {
        console.error('[GPS] watchPosition error:', err);
        setGpsStatus('error');
        toast.error('GPS 위치를 가져올 수 없습니다. 위치 권한을 확인하세요.');
      },
      GPS_CONFIG.GEO_OPTIONS
    );

    // 10초 간격 서버 전송
    intervalRef.current = setInterval(
      sendLocation,
      GPS_CONFIG.SEND_INTERVAL_MS
    );
  }, [sendLocation]);

  // ── GPS 추적 중지 ──────────────────────────────────────────────────────────
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setGpsStatus('idle');
  }, []);

  // ── autoStart & cleanup ────────────────────────────────────────────────────
  useEffect(() => {
    // ✅ driverId가 확정된 이후에만 GPS 시작 (인증 에러 방지)
    if (autoStart && driverId != null) {
      startTracking();
    }
    return () => {
      stopTracking();
    };
  }, [driverId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    gpsStatus,
    currentPosition,
    startTracking,
    stopTracking,
    lastSentAt,
  };
}
