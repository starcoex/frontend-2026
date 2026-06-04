import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ScanBarcode,
  Search,
  XCircle,
  Camera,
  CameraOff,
  Package,
  Tag,
  BadgeCheck,
  BadgeX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBarcodeScanner, useProducts } from '@starcoex-frontend/products';
import type { Product } from '@starcoex-frontend/products';

export default function ProductScanPage() {
  const { fetchProductByBarcode, isLoading } = useProducts();

  const [barcode, setBarcode] = useState('');
  const [result, setResult] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = useCallback(
    async (code: string) => {
      const trimmed = code.trim();
      if (!trimmed) return;

      setError(null);
      setResult(null);
      setLastScanned(trimmed);

      const res = await fetchProductByBarcode(trimmed);

      if (res.success && res.data && 'id' in res.data) {
        setResult(res.data);
      } else {
        setResult(null);
        setError(`바코드 [${trimmed}] 에 해당하는 제품을 찾을 수 없습니다.`);
      }
    },
    [fetchProductByBarcode]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleScan(barcode);
        setBarcode('');
      }
    },
    [barcode, handleScan]
  );

  const handleReset = useCallback(() => {
    setBarcode('');
    setResult(null);
    setError(null);
    setLastScanned(null);
    inputRef.current?.focus();
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
    onScan: (code) => {
      handleScan(code);
      stopCamera();
    },
    hardwareEnabled: !result,
    cameraEnabled: true,
  });

  const totalStock =
    result?.inventories && result.inventories.length > 0
      ? result.inventories.reduce((sum, inv) => sum + (inv.stock ?? 0), 0)
      : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/admin/products">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">바코드 스캔</h1>
          <p className="text-muted-foreground text-sm">
            바코드를 스캔하거나 직접 입력하여 제품을 조회하세요.
          </p>
        </div>
      </div>

      {/* ── 상단: 2컬럼 입력 영역 ── */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* 바코드 입력 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ScanBarcode className="h-4 w-4" />
              바코드 입력
            </CardTitle>
            <CardDescription>
              하드웨어 스캐너 또는 직접 입력 후 Enter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="바코드 번호 입력..."
                className="font-mono text-base"
                disabled={isLoading}
                autoComplete="off"
                maxLength={20}
              />
              <Button
                onClick={() => {
                  handleScan(barcode);
                  setBarcode('');
                }}
                disabled={isLoading || barcode.trim().length < 8}
                className="shrink-0"
              >
                <Search className="mr-2 h-4 w-4" />
                검색
              </Button>
            </div>

            {barcode.length > 0 && barcode.length < 8 && (
              <p className="text-muted-foreground text-xs">
                {8 - barcode.length}자 더 입력하세요 (최소 8자)
              </p>
            )}

            {lastScanned && (
              <div className="bg-muted rounded-md px-3 py-2 text-xs">
                <span className="text-muted-foreground">마지막 스캔: </span>
                <span className="font-mono font-medium">{lastScanned}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 카메라 스캔 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Camera className="h-4 w-4" />
              카메라 스캔
            </CardTitle>
            <CardDescription>
              카메라로 바코드를 인식합니다. HTTPS 또는 localhost 환경 필요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={isCameraActive ? 'destructive' : 'outline'}
                onClick={isCameraActive ? stopCamera : startCamera}
                className="shrink-0"
              >
                {isCameraActive ? (
                  <>
                    <CameraOff className="mr-2 h-4 w-4" />
                    카메라 끄기
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    카메라 켜기
                  </>
                )}
              </Button>

              {isCameraActive && devices.length > 1 && (
                <Select
                  value={selectedDeviceId}
                  onValueChange={(v) => {
                    setSelectedDeviceId(v);
                    stopCamera();
                    setTimeout(startCamera, 100);
                  }}
                >
                  <SelectTrigger className="h-9 flex-1 text-xs">
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

            {isCameraActive && (
              <div className="relative overflow-hidden rounded-lg border bg-black">
                <video
                  ref={videoRef}
                  className="w-full"
                  style={{ height: 200 }}
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-3/4 rounded-lg border-2 border-dashed border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                </div>
                <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-white/80">
                  바코드를 가이드 안에 맞춰주세요
                </p>
              </div>
            )}

            {cameraError && (
              <p className="text-destructive text-xs">{cameraError}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── 하단: 풀 너비 결과 영역 ── */}

      {/* 로딩 */}
      {isLoading && (
        <Card>
          <CardContent className="flex h-40 items-center justify-center">
            <div className="space-y-3 text-center">
              <ScanBarcode className="text-primary mx-auto h-8 w-8 animate-pulse" />
              <p className="text-muted-foreground text-sm">조회 중...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 에러 */}
      {!isLoading && error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex h-40 flex-col items-center justify-center gap-3 text-center">
            <XCircle className="text-destructive h-8 w-8" />
            <div>
              <p className="text-destructive font-medium">
                제품을 찾을 수 없습니다
              </p>
              <p className="text-muted-foreground mt-1 text-sm">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              다시 스캔
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 결과 — 풀 너비 */}
      {!isLoading && result && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 md:flex-row">
              {/* 이미지 */}
              {result.imageUrls?.length > 0 && (
                <div className="shrink-0 md:w-48">
                  <img
                    src={result.imageUrls[0]}
                    alt={result.name}
                    className="h-48 w-full rounded-lg object-cover md:h-full"
                  />
                </div>
              )}

              {/* 정보 영역 */}
              <div className="flex-1 space-y-4">
                {/* 제품명 + 배지 */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold">{result.name}</h2>
                    {result.description && (
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                        {result.description}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge variant={result.isActive ? 'default' : 'secondary'}>
                      {result.isActive ? '활성' : '비활성'}
                    </Badge>
                    {result.isFeatured && <Badge variant="outline">추천</Badge>}
                  </div>
                </div>

                {/* 가격 블록 */}
                <div className="bg-muted flex gap-6 rounded-lg p-3">
                  <div>
                    <p className="text-muted-foreground mb-0.5 text-xs">
                      기본 가격
                    </p>
                    <p className="font-semibold">
                      ₩{result.basePrice.toLocaleString()}
                    </p>
                  </div>
                  {result.salePrice && (
                    <>
                      <Separator orientation="vertical" className="h-auto" />
                      <div>
                        <p className="text-muted-foreground mb-0.5 text-xs">
                          할인 가격
                        </p>
                        <p className="text-primary font-semibold">
                          ₩{result.salePrice.toLocaleString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* 상세 정보 4컬럼 */}
                <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-4">
                  <div>
                    <dt className="text-muted-foreground flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      SKU
                    </dt>
                    <dd className="font-mono font-medium mt-0.5">
                      {result.sku}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground flex items-center gap-1">
                      <ScanBarcode className="h-3 w-3" />
                      바코드
                    </dt>
                    <dd className="font-mono font-medium mt-0.5">
                      {result.barcode ?? '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      재고
                    </dt>
                    <dd className="font-medium mt-0.5">
                      {totalStock !== null
                        ? `${totalStock.toLocaleString()}개`
                        : '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground flex items-center gap-1">
                      {result.isAvailable ? (
                        <BadgeCheck className="h-3 w-3" />
                      ) : (
                        <BadgeX className="h-3 w-3" />
                      )}
                      판매 가능
                    </dt>
                    <dd className="font-medium mt-0.5">
                      {result.isAvailable ? (
                        <span className="text-green-600">가능</span>
                      ) : (
                        <span className="text-destructive">불가</span>
                      )}
                    </dd>
                  </div>
                </dl>

                <Separator />

                {/* 액션 버튼 */}
                <div className="flex flex-wrap gap-2">
                  <Button asChild>
                    <Link to={`/admin/products/${result.id}`}>상세 보기</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to={`/admin/products/${result.id}/edit`}>
                      수정하기
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={handleReset}>
                    다시 스캔
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
