import { MapPin, Package, Clock, Banknote } from 'lucide-react';
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
  DELIVERY_PRIORITY_CONFIG,
  formatDeliveryFee,
} from '@/app/pages/teams/delivery/driver/data/driver-data';
import { DriverDeliveryRowActions } from './driver-delivery-row-actions';

interface DriverDeliveryCardProps {
  delivery: Delivery;
  onUpdated?: (delivery: Delivery) => void;
}

export function DriverDeliveryCard({
  delivery: d,
  onUpdated,
}: DriverDeliveryCardProps) {
  const pickupAddr =
    (d.pickupAddress?.roadAddress as string) ??
    (d.pickupAddress?.roadAddr as string) ??
    '픽업 주소 없음';

  const deliveryAddr =
    (d.deliveryAddress?.roadAddress as string) ??
    (d.deliveryAddress?.roadAddr as string) ??
    '배송 주소 없음';

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="font-mono text-sm font-semibold">
              {d.deliveryNumber}
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant={DELIVERY_STATUS_CONFIG[d.status].variant}>
                {DELIVERY_STATUS_CONFIG[d.status].label}
              </Badge>
              <Badge variant={DELIVERY_PRIORITY_CONFIG[d.priority].variant}>
                {DELIVERY_PRIORITY_CONFIG[d.priority].label}
              </Badge>
              {d.issueReported && <Badge variant="destructive">이슈</Badge>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-primary">
              {formatDeliveryFee(d.driverFee)}
            </p>
            <p className="text-muted-foreground text-xs">수령액</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pb-2">
        {/* 픽업 주소 */}
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs">픽업</p>
            <p className="truncate">{pickupAddr}</p>
          </div>
        </div>

        {/* 배송 주소 */}
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs">배송</p>
            <p className="truncate">{deliveryAddr}</p>
          </div>
        </div>

        <Separator />

        {/* 하단 정보 */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Package className="h-3.5 w-3.5" />
            <span>{d.itemCount}개</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Banknote className="h-3.5 w-3.5" />
            <span>{formatDeliveryFee(d.deliveryFee)}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {new Date(d.requestedAt).toLocaleString('ko-KR', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* 고객 요청사항 */}
        {d.customerNotes && (
          <div className="bg-muted rounded-md px-3 py-2 text-xs">
            <span className="text-muted-foreground">고객 요청: </span>
            {d.customerNotes}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <DriverDeliveryRowActions delivery={d} onUpdated={onUpdated} />
      </CardFooter>
    </Card>
  );
}
