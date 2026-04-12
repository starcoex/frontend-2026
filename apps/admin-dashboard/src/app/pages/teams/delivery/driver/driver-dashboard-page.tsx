import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Navigation, CheckCircle, Clock } from 'lucide-react';
import { useDelivery } from '@starcoex-frontend/delivery';
import { LoadingSpinner } from '@starcoex-frontend/common';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DELIVERY_STATUS_CONFIG } from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';
import { DRIVER_ROUTES } from '@/app/constants/teams/driver-routes';

// ✅ Record<string, unknown> 타입 에러 방지
function extractRoadAddress(
  address: Record<string, unknown> | null | undefined
): string {
  if (!address) return '주소 없음';
  return (
    (address['roadAddress'] as string) ??
    (address['roadAddr'] as string) ??
    '주소 없음'
  );
}

export default function DriverDashboardPage() {
  const navigate = useNavigate();
  // ✅ fetchDeliveries 유지 — 기존과 동일한 API, skipSocket만 추가
  const { deliveries, isLoading, fetchDeliveries } = useDelivery({
    skipSocket: true,
  });

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  if (isLoading) {
    return <LoadingSpinner message="배송 정보를 불러오는 중..." />;
  }

  const pending = deliveries.filter((d) =>
    ['PENDING', 'DRIVER_ASSIGNED'].includes(d.status)
  );
  const active = deliveries.filter((d) =>
    ['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT'].includes(d.status)
  );
  const completed = deliveries.filter((d) => d.status === 'DELIVERED');

  const statCards = [
    {
      label: '대기 중',
      value: pending.length,
      icon: Clock,
      variant: 'warning' as const,
      to: DRIVER_ROUTES.DELIVERIES,
    },
    {
      label: '진행 중',
      value: active.length,
      icon: Navigation,
      variant: 'secondary' as const,
      to: DRIVER_ROUTES.ACTIVE,
    },
    {
      label: '완료',
      value: completed.length,
      icon: CheckCircle,
      variant: 'success' as const,
      to: DRIVER_ROUTES.DELIVERIES,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">오늘의 배송 현황</h2>
        <p className="text-muted-foreground text-sm">
          총 {deliveries.length}건의 배송이 있습니다.
        </p>
      </div>

      {/* ✅ 통계 카드 — 항상 표시 (건수 0이어도 필터 역할) */}
      <div className="grid grid-cols-3 gap-3">
        {statCards.map(({ label, value, icon: Icon, variant, to }) => (
          <Card
            key={label}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => navigate(to)}
          >
            <CardHeader className="p-4">
              <CardDescription className="flex items-center gap-1 text-xs">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </CardDescription>
              <CardTitle className="text-2xl">{value}</CardTitle>
              <Badge variant={variant} className="w-fit text-xs">
                {label}
              </Badge>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* ✅ 진행 중인 배송 섹션 — 항상 표시, 없을 때 안내 메시지 */}
      <div className="space-y-2">
        <h3 className="font-semibold">진행 중인 배송</h3>
        {active.length > 0 ? (
          active.map((d) => (
            <Card key={d.id}>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm font-medium">
                      {d.deliveryNumber}
                    </p>
                    {/* ✅ 타입 에러 수정 */}
                    <p className="text-muted-foreground truncate text-xs">
                      {extractRoadAddress(d.deliveryAddress)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={DELIVERY_STATUS_CONFIG[d.status].variant}>
                      {DELIVERY_STATUS_CONFIG[d.status].label}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => navigate(DRIVER_ROUTES.ACTIVE)}
                    >
                      <Package className="mr-1 h-3.5 w-3.5" />
                      이동
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        ) : (
          // ✅ 진행 중 배송 없을 때 — 섹션은 유지하되 안내 메시지
          <Card>
            <CardContent className="flex items-center justify-center py-6">
              <p className="text-muted-foreground text-sm">
                현재 진행 중인 배송이 없습니다.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ✅ 전체 배송 없을 때만 표시 */}
      {deliveries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Package className="text-muted-foreground mb-3 h-12 w-12" />
          <p className="text-muted-foreground">배정된 배송이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
