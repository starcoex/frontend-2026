import { useState } from 'react';
import { Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import {
  useCarCare,
  VEHICLE_BODY_TYPE_ORDER,
  VEHICLE_BODY_TYPES,
  VEHICLE_SIZE_GRADE_ORDER,
} from '@starcoex-frontend/vehicles';
import { toast } from 'sonner';

export default function CarCarePricesPage() {
  const {
    prices,
    isLoading,
    error,
    fetchCarCarePricesByStore,
    deleteCarCarePrice,
  } = useCarCare();

  const [storeId, setStoreId] = useState<string>('');

  const handleFetch = () => {
    const id = parseInt(storeId);
    if (!id) {
      toast.error('스토어 ID를 입력하세요.');
      return;
    }
    fetchCarCarePricesByStore(id);
  };

  const handleDelete = async (id: number) => {
    const res = await deleteCarCarePrice(id);
    if (res.success) {
      toast.success('가격이 삭제되었습니다.');
    } else {
      toast.error(res.error?.message ?? '삭제에 실패했습니다.');
    }
  };

  return (
    <>
      <PageHead
        title={`세차 가격 관리 - ${COMPANY_INFO.name}`}
        description="스토어별 세차 가격 정책을 관리하세요."
        keywords={['세차 가격', '카케어', COMPANY_INFO.name]}
        og={{
          title: `세차 가격 관리 - ${COMPANY_INFO.name}`,
          description: '세차 가격 정책 관리',
          image: '/images/og-car-care.jpg',
          type: 'website',
        }}
      />
      <div className="space-y-4">
        {/* 스토어 선택 */}
        <Card>
          <CardContent className="flex items-end gap-3 pt-4">
            <div className="flex-1 space-y-1.5">
              <Label>스토어 ID</Label>
              <Input
                type="number"
                min={1}
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                placeholder="스토어 ID 입력"
                onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              />
            </div>
            <Button onClick={handleFetch} disabled={isLoading}>
              조회
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>로딩 실패</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 가격 그리드 */}
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        ) : prices.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">
                    서비스 코드
                  </th>
                  {VEHICLE_BODY_TYPE_ORDER.map((bt) =>
                    VEHICLE_SIZE_GRADE_ORDER.map((sg) => (
                      <th
                        key={`${bt}-${sg}`}
                        className="px-3 py-3 text-center font-medium text-xs"
                      >
                        {VEHICLE_BODY_TYPES[bt]
                          .replace(/[🚗🚙🚐🚚]/g, '')
                          .trim()}
                        <br />
                        {sg}
                      </th>
                    ))
                  )}
                  <th className="px-4 py-3 text-center font-medium">관리</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((price) => (
                  <tr key={price.id} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-2 font-mono text-xs">
                      {price.serviceTypeCode}
                    </td>
                    <td className="px-4 py-2 text-center font-semibold">
                      ₩{price.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Badge
                          variant={price.isActive ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {price.isActive ? '활성' : '비활성'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(price.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : storeId ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            해당 스토어의 세차 가격 정책이 없습니다.
          </p>
        ) : null}
      </div>
    </>
  );
}
