import { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { DecodeHintType, BarcodeFormat } from '@zxing/library';

interface UseBarcodeScannerOptions {
  onScan: (barcode: string) => void;
  hardwareEnabled?: boolean;
  cameraEnabled?: boolean;
}

interface VideoDevice {
  deviceId: string;
  label: string;
}

export const useBarcodeScanner = ({
  onScan,
  hardwareEnabled = true,
  cameraEnabled = false,
}: UseBarcodeScannerOptions) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [devices, setDevices] = useState<VideoDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const hardwareBufferRef = useRef('');
  const hardwareTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── 하드웨어 스캐너: 키보드 이벤트 감지 ────────────────────────────────────
  useEffect(() => {
    if (!hardwareEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'Enter') {
        const code = hardwareBufferRef.current.trim();
        if (code.length >= 8) onScan(code);
        hardwareBufferRef.current = '';
        return;
      }

      if (e.key.length === 1) {
        hardwareBufferRef.current += e.key;
        if (hardwareTimerRef.current) clearTimeout(hardwareTimerRef.current);
        hardwareTimerRef.current = setTimeout(() => {
          hardwareBufferRef.current = '';
        }, 100);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (hardwareTimerRef.current) clearTimeout(hardwareTimerRef.current);
    };
  }, [hardwareEnabled, onScan]);

  // ── 카메라 장치 목록 조회 ───────────────────────────────────────────────────
  const loadDevices = useCallback(async (): Promise<VideoDevice[]> => {
    try {
      const videoDevices =
        await BrowserMultiFormatReader.listVideoInputDevices();
      const mapped: VideoDevice[] = videoDevices.map((d) => ({
        deviceId: d.deviceId,
        label: d.label || `카메라 ${d.deviceId.slice(0, 8)}`,
      }));
      setDevices(mapped);

      // ✅ 모바일 후면 카메라 우선 선택
      const rearCamera = mapped.find((d) =>
        /back|rear|environment/i.test(d.label)
      );
      const preferred = rearCamera ?? mapped[0];
      if (preferred) setSelectedDeviceId(preferred.deviceId);

      return mapped;
    } catch {
      setCameraError('카메라 장치를 불러오는데 실패했습니다.');
      return [];
    }
  }, []);

  // ── 카메라 스캔 시작 ────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    if (!cameraEnabled || !videoRef.current) return;

    setCameraError(null);

    try {
      const loaded = await loadDevices();
      if (loaded.length === 0) {
        setCameraError('사용 가능한 카메라가 없습니다.');
        return;
      }

      // ✅ 바코드 인식 최적화 힌트
      const hints = new Map<DecodeHintType, any>();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.QR_CODE,
      ]);
      hints.set(DecodeHintType.TRY_HARDER, true);

      const reader = new BrowserMultiFormatReader(hints);

      // ✅ 모바일 후면 카메라 우선 — facingMode constraint 사용
      const deviceId = selectedDeviceId || undefined;
      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: { ideal: 'environment' } }, // 후면 카메라 우선
      };

      const controls = await reader.decodeFromConstraints(
        constraints,
        videoRef.current,
        (result, error) => {
          if (result) {
            onScan(result.getText());
          }
          // 프레임마다 발생하는 일반 NotFound 에러 무시
          if (
            error &&
            !error.message?.includes('No MultiFormat Readers') &&
            !error.message?.includes('NotFoundException')
          ) {
            console.warn('[BarcodeScanner]', error.message);
          }
        }
      );

      controlsRef.current = controls;
      setIsCameraActive(true);
    } catch (e) {
      const message = e instanceof Error ? e.message : '';

      // ✅ 에러 유형별 안내 메시지
      if (message.includes('Permission') || message.includes('NotAllowed')) {
        setCameraError(
          '카메라 권한이 거부되었습니다. 브라우저 설정에서 허용해주세요.'
        );
      } else if (
        message.includes('NotFound') ||
        message.includes('DevicesNotFound')
      ) {
        setCameraError('카메라를 찾을 수 없습니다.');
      } else if (message.includes('https') || message.includes('secure')) {
        setCameraError('카메라는 HTTPS 환경에서만 사용할 수 있습니다.');
      } else {
        setCameraError('카메라를 시작할 수 없습니다. 권한을 확인해주세요.');
      }

      setIsCameraActive(false);
    }
  }, [cameraEnabled, loadDevices, onScan, selectedDeviceId]);

  // ── 카메라 스캔 중지 ────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setIsCameraActive(false);
  }, []);

  // ── 언마운트 시 정리 ────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    isCameraActive,
    cameraError,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    startCamera,
    stopCamera,
  };
};
