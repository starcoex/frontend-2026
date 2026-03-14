import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ScanBarcode, Search, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProducts } from '@starcoex-frontend/products';
import type { Product } from '@starcoex-frontend/products';

export default function ProductScanPage() {
  const { fetchProductByBarcode, isLoading } = useProducts();

  const [barcode, setBarcode] = useState('');
  const [result, setResult] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // 페이지 진입 시 input 포커스 (하드웨어 스캐너 대비)
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

      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError(`바코드 [${trimmed}] 에 해당하는 제품을 찾을 수 없습니다.`);
      }
    },
    [fetchProductByBarcode]
  );

  // Enter 키 또는 하드웨어 스캐너 입력 완료 감지
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

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/admin/products">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">바코드 스캔</h1>
      </div>

      {/* 스캔 입력 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanBarcode className="h-5 w-5" />
            바코드 스캔 / 입력
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="바코드를 스캔하거나 직접 입력 후 Enter"
              className="font-mono"
              disabled={isLoading}
              autoComplete="off"
            />
            <Button
              onClick={() => {
                handleScan(barcode);
                setBarcode('');
              }}
              disabled={isLoading || !barcode.trim()}
            >
              <Search className="h-4 w-4" />
            </Button>
            {(result || error) && (
              <Button variant="outline" onClick={handleReset}>
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
          {lastScanned && (
            <p className="text-muted-foreground text-xs">
              마지막 스캔:{' '}
              <span className="font-mono font-medium">{lastScanned}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* 로딩 */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground animate-pulse">조회 중...</p>
          </CardContent>
        </Card>
      )}

      {/* 에러 */}
      {!isLoading && error && (
        <Card className="border-destructive">
          <CardContent className="py-6 text-center">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* 제품 결과 */}
      {!isLoading && result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">제품 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 이미지 */}
            {result.imageUrls?.length > 0 && (
              <img
                src={result.imageUrls[0]}
                alt={result.name}
                className="h-48 w-full rounded-md object-cover"
              />
            )}

            {/* 기본 정보 */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-xl font-bold">{result.name}</h2>
                <div className="flex gap-1">
                  {result.isActive ? (
                    <Badge>활성</Badge>
                  ) : (
                    <Badge variant="secondary">비활성</Badge>
                  )}
                  {result.isFeatured && <Badge variant="outline">추천</Badge>}
                </div>
              </div>
              {result.description && (
                <p className="text-muted-foreground text-sm">
                  {result.description}
                </p>
              )}
            </div>

            <Separator />

            {/* 상세 정보 */}
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">SKU</dt>
                <dd className="font-mono font-medium">{result.sku}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">바코드</dt>
                <dd className="font-mono font-medium">
                  {result.barcode ?? '-'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">기본 가격</dt>
                <dd className="font-medium">
                  ₩{result.basePrice.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">할인 가격</dt>
                <dd className="font-medium">
                  {result.salePrice
                    ? `₩${result.salePrice.toLocaleString()}`
                    : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">재고</dt>
                <dd className="font-medium">
                  {result.baseStock.toLocaleString()}개
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">판매 가능</dt>
                <dd className="font-medium">
                  {result.isAvailable ? '✅ 가능' : '❌ 불가'}
                </dd>
              </div>
            </dl>

            <Separator />

            {/* 액션 버튼 */}
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link to={`/admin/products/${result.id}`}>상세 보기</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to={`/admin/products/${result.id}/edit`}>수정하기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
