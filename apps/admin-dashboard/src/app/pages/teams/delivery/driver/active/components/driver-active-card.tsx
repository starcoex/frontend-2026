import { MapPin, Package, Navigation } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Delivery } from '@starcoex-frontend/delivery';
import {
  DELIVERY_STATUS_CONFIG,
  DELIVERY_STATUS_TIMELINE,
  DRIVER_ACTIVE_STATUSES,
  DRIVER_STATUS_ACTIONS,
  formatDeliveryFee,
} from '@/app/pages/teams/delivery/driver/data/driver-data';
import { DriverDeliveryRowActions } from '@/app/pages/teams/delivery/driver/deliveries/components/driver-delivery-row-actions';
import { cn } from '@/lib/utils';

interface DriverActiveCardProps {
  delivery: Delivery;
  onUpdated?: (delivery: Delivery) => void;
}

export function DriverActiveCard({
  delivery: d,
  onUpdated,
}: DriverActiveCardProps) {
  const pickupAddr =
    (d.pickupAddress?.roadAddress as string) ??
    (d.pickupAddress?.roadAddr as string) ??
    '픽업 주소 없음';

  const deliveryAddr =
    (d.deliveryAddress?.roadAddress as string) ??
    (d.deliveryAddress?.roadAddr as string) ??
    '배송 주소 없음';

  // 활성 타임라인만 표시 (ACCEPTED ~ DELIVERED)
  const activeTimeline = DELIVERY_STATUS_TIMELINE.filter((s) =>
    [...DRIVER_ACTIVE_STATUSES, 'DELIVERED'].includes(s as any)
  );
  const currentIdx = activeTimeline.indexOf(d.status as any);

  const nextAction = DRIVER_STATUS_ACTIONS[d.status];

  return (
    <Card className="w-full border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="font-mono text-sm font-semibold">
              {d.deliveryNumber}
            </p>
            <Badge variant={DELIVERY_STATUS_CONFIG[d.status].variant}>
              {DELIVERY_STATUS_CONFIG[d.status].label}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-primary">
              {formatDeliveryFee(d.driverFee)}
            </p>
            <p className="text-muted-foreground text-xs">수령액</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-2">
        {/* 진행 타임라인 */}
        <div className="flex items-center justify-between">
          {activeTimeline.map((status, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div key={status} className="flex flex-1 flex-col items-center">
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
                    isCurrent
                      ? 'border-primary bg-primary text-primary-foreground'
                      : isCompleted
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-muted-foreground/30 text-muted-foreground'
                  )}
                >
                  {idx + 1}
                </div>
                <span
                  className={cn(
                    'mt-1 text-center text-[10px] leading-tight',
                    isCompleted
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  {DELIVERY_STATUS_CONFIG[status].label}
                </span>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* 주소 */}
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">픽업</p>
              <p className="truncate">{pickupAddr}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Navigation className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">배송</p>
              <p className="truncate">{deliveryAddr}</p>
            </div>
          </div>
        </div>

        {/* 아이템 수 */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Package className="h-3.5 w-3.5" />
          <span>{d.itemCount}개</span>
          {d.estimatedTime && (
            <span className="ml-2">· 예상 {d.estimatedTime}분</span>
          )}
        </div>

        {/* 다음 액션 안내 */}
        {nextAction && (
          <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            다음 단계: <strong>{nextAction.description}</strong>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <DriverDeliveryRowActions delivery={d} onUpdated={onUpdated} />
      </CardFooter>
    </Card>
  );
}
