import { useCallback, useState } from 'react';
import { ScanBarcode, Camera, CameraOff, Search, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBarcodeScanner, useProducts } from '@starcoex-frontend/products';
import type { Product } from '@starcoex-frontend/products';
import { BarcodeScanResult } from './barcode-scan-result';

interface BarcodeScanDialogProps {
  children?: React.ReactNode;
}

export function BarcodeScanDialog({ children }: BarcodeScanDialogProps) {
  const { fetchProductByBarcode, isLoading } = useProducts();
  const [open, setOpen] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [result, setResult] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  const handleScan = useCallback(
    async (barcode: string) => {
      const trimmed = barcode.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      setResult(null);
      setLastScanned(trimmed);
      setManualInput('');

      const res = await fetchProductByBarcode(trimmed);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError(`[${trimmed}] 에 해당하는 제품을 찾을 수 없습니다.`);
      }
    },
    [fetchProductByBarcode, isLoading]
  );

  const handleReset = useCallback(() => {
    setResult(null);
    setError(null);
    setLastScanned(null);
    setManualInput('');
  }, []);

  const handleClose = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      handleReset();
      stopCamera();
    }
  }, []);

  const {
    videoRef,
    isCameraActive,
    cameraError,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    startCamera,
    stopCamera,
  } = useBarcodeScanner({
    onScan: handleScan,
    hardwareEnabled: open && !result,
    cameraEnabled: true,
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="outline">
            <ScanBarcode className="mr-2 h-4 w-4" />
            바코드 스캔
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanBarcode className="h-5 w-5" />
            바코드 스캔
          </DialogTitle>
        </DialogHeader>

        {result ? (
          <BarcodeScanResult product={result} onReset={handleReset} />
        ) : (
          <div className="space-y-4">
            {/* 수동 입력 */}
            <div className="flex gap-2">
              <Input
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleScan(manualInput);
                }}
                placeholder="바코드 스캔 또는 직접 입력 후 Enter"
                className="font-mono"
                disabled={isLoading}
                autoFocus
              />
              <Button
                onClick={() => handleScan(manualInput)}
                disabled={isLoading || !manualInput.trim()}
                size="icon"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* 카메라 영역 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={isCameraActive ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={isCameraActive ? stopCamera : startCamera}
                >
                  {isCameraActive ? (
                    <>
                      <CameraOff className="mr-2 h-4 w-4" />
                      카메라 끄기
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      카메라 스캔
                    </>
                  )}
                </Button>

                {/* 카메라 장치 선택 */}
                {isCameraActive && devices.length > 1 && (
                  <Select
                    value={selectedDeviceId}
                    onValueChange={(v) => {
                      setSelectedDeviceId(v);
                      stopCamera();
                      setTimeout(startCamera, 100);
                    }}
                  >
                    <SelectTrigger className="h-8 flex-1 text-xs">
                      <SelectValue placeholder="카메라 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.map((d) => (
                        <SelectItem key={d.deviceId} value={d.deviceId}>
                          {d.label || `카메라 ${d.deviceId.slice(0, 8)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* 카메라 뷰파인더 */}
              {isCameraActive && (
                <div className="relative overflow-hidden rounded-md border bg-black">
                  <video
                    ref={videoRef}
                    className="w-full"
                    style={{ height: 220 }}
                  />
                  {/* 스캔 가이드라인 */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-3/4 rounded border-2 border-dashed border-white/60" />
                  </div>
                </div>
              )}

              {cameraError && (
                <p className="text-destructive text-xs">{cameraError}</p>
              )}
            </div>

            {/* 에러 */}
            {error && (
              <div className="flex items-center gap-2">
                <XCircle className="text-destructive h-4 w-4 shrink-0" />
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {/* 마지막 스캔 */}
            {lastScanned && isLoading && (
              <p className="text-muted-foreground animate-pulse text-xs">
                조회 중: <span className="font-mono">{lastScanned}</span>
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
