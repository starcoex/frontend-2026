import { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';

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
  // readerRef → controls 로 교체 (decodeFromVideoDevice 반환값 저장)
  const controlsRef = useRef<IScannerControls | null>(null);
  const hardwareBufferRef = useRef('');
  const hardwareTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── 하드웨어 스캐너: 키보드 이벤트 감지 ──────────────────────────────────
  useEffect(() => {
    if (!hardwareEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'Enter') {
        const code = hardwareBufferRef.current.trim();
        if (code.length >= 8) {
          onScan(code);
        }
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

  // ── 카메라 장치 목록 조회 ──────────────────────────────────────────────────
  const loadDevices = useCallback(async () => {
    try {
      const videoDevices =
        await BrowserMultiFormatReader.listVideoInputDevices();
      const mapped: VideoDevice[] = videoDevices.map((d) => ({
        deviceId: d.deviceId,
        label: d.label,
      }));
      setDevices(mapped);
      if (mapped.length > 0) {
        setSelectedDeviceId(mapped[0].deviceId);
      }
    } catch {
      setCameraError('카메라 장치를 불러오는데 실패했습니다.');
    }
  }, []);

  // ── 카메라 스캔 시작 ───────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    if (!cameraEnabled || !videoRef.current) return;

    setCameraError(null);
    try {
      await loadDevices();
      const reader = new BrowserMultiFormatReader();

      // controls 저장 → stop() 으로 중지
      const controls = await reader.decodeFromVideoDevice(
        selectedDeviceId || undefined,
        videoRef.current,
        (result, error) => {
          if (result) {
            onScan(result.getText());
          }
          if (error && !error.message?.includes('No MultiFormat Readers')) {
            // 프레임마다 발생하는 일반 에러 무시
          }
        }
      );
      controlsRef.current = controls;
      setIsCameraActive(true);
    } catch {
      setCameraError('카메라를 시작할 수 없습니다. 권한을 확인해주세요.');
      setIsCameraActive(false);
    }
  }, [cameraEnabled, loadDevices, onScan, selectedDeviceId]);

  // ── 카메라 스캔 중지 ───────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setIsCameraActive(false);
  }, []);

  // ── 언마운트 시 정리 ───────────────────────────────────────────────────────
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
