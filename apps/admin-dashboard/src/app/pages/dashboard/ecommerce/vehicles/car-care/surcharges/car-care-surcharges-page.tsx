import { useState } from 'react';
import { Loader2, AlertCircle, Trash2, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useCarCare } from '@starcoex-frontend/vehicles';
import { toast } from 'sonner';
import { CAR_CARE_ROUTES } from '@/app/constants/car-care-routes';
import {
  CAR_CARE_SURCHARGE_TYPE_OPTIONS,
  CarCareSurchargeTypeValue,
} from '@/app/pages/dashboard/ecommerce/vehicles/data/car-care-data';

const SURCHARGE_TYPE_MAP = Object.fromEntries(
  CAR_CARE_SURCHARGE_TYPE_OPTIONS.map((o) => [o.value, o])
) as Record<
  CarCareSurchargeTypeValue,
  (typeof CAR_CARE_SURCHARGE_TYPE_OPTIONS)[number]
>;

export default function CarCareSurchargesPage() {
  const {
    surcharges,
    isLoading,
    error,
    fetchCarCareSurchargesByStore,
    deleteCarCareSurcharge,
  } = useCarCare();
  const [storeId, setStoreId] = useState<string>('');

  const handleFetch = () => {
    const id = parseInt(storeId);
    if (!id) {
      toast.error('스토어 ID를 입력하세요.');
      return;
    }
    fetchCarCareSurchargesByStore(id);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('이 추가금 정책을 삭제하시겠습니까?')) return;
    const res = await deleteCarCareSurcharge(id);
    if (res.success) {
      toast.success('추가금 정책이 삭제되었습니다.');
    } else {
      toast.error(res.error?.message ?? '삭제에 실패했습니다.');
    }
  };

  return (
    <>
      <PageHead
        title={`세차 추가금 정책 - ${COMPANY_INFO.name}`}
        description="스토어별 세차 추가금 정책을 관리하세요."
        keywords={['세차 추가금', '카케어', COMPANY_INFO.name]}
        og={{
          title: `세차 추가금 정책 - ${COMPANY_INFO.name}`,
          description: '세차 추가금 정책 관리',
          image: '/images/og-car-care.jpg',
          type: 'website',
        }}
      />
      <div className="space-y-4">
        <div className="flex items-end gap-3">
          <div className="space-y-1.5">
            <Label>스토어 ID</Label>
            <Input
              type="number"
              min={1}
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              placeholder="스토어 ID 입력"
              className="w-40"
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
            />
          </div>
          <Button onClick={handleFetch} disabled={isLoading}>
            조회
          </Button>
          <Button asChild className="ml-auto">
            <Link to={CAR_CARE_ROUTES.SURCHARGES_CREATE}>
              <PlusCircle className="mr-1.5 h-4 w-4" />
              추가금 추가
            </Link>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>로딩 실패</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {surcharges.map((surcharge) => {
              const typeConfig =
                SURCHARGE_TYPE_MAP[
                  surcharge.surchargeType as CarCareSurchargeTypeValue
                ];
              return (
                <Card key={surcharge.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={(typeConfig?.variant as any) ?? 'secondary'}
                          className="text-xs"
                        >
                          {typeConfig?.label ?? surcharge.surchargeType}
                        </Badge>
                        <Badge
                          variant={surcharge.isActive ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {surcharge.isActive ? '활성' : '비활성'}
                        </Badge>
                      </div>
                      <p className="text-sm">{surcharge.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {surcharge.minAmount != null &&
                          `최소 ${surcharge.minAmount.toLocaleString()}원`}
                        {surcharge.minAmount != null &&
                          surcharge.maxAmount != null &&
                          ' ~ '}
                        {surcharge.maxAmount != null &&
                          `최대 ${surcharge.maxAmount.toLocaleString()}원`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(surcharge.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
            {surcharges.length === 0 && storeId && !isLoading && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                해당 스토어의 추가금 정책이 없습니다.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
