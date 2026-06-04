import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type {
  DriverSettlement,
  SettlementStatus,
} from '@starcoex-frontend/delivery';

export const SETTLEMENT_STATUS_BADGE: Record<
  SettlementStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
  }
> = {
  PENDING: { label: '정산 대기', variant: 'outline' },
  CALCULATED: { label: '계산 완료', variant: 'secondary' },
  APPROVED: { label: '승인 완료', variant: 'default' },
  PAID: { label: '지급 완료', variant: 'default' },
};

export function DriverSettlementCard({
  settlement,
}: {
  settlement: DriverSettlement;
}) {
  const badge = SETTLEMENT_STATUS_BADGE[settlement.status];

  return (
    <Card>
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {format(new Date(settlement.settlementDate), 'yyyy년 MM월 dd일', {
              locale: ko,
            })}
          </CardTitle>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="mb-3 flex gap-4 text-xs text-muted-foreground">
          <span>총 {settlement.totalDeliveries}건</span>
          <span className="text-green-600">
            완료 {settlement.completedDeliveries}건
          </span>
          {settlement.cancelledDeliveries > 0 && (
            <span className="text-red-500">
              취소 {settlement.cancelledDeliveries}건
            </span>
          )}
        </div>

        <div className="space-y-1 rounded-md bg-muted/50 p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">총 수입</span>
            <span>₩{Number(settlement.grossAmount).toLocaleString()}</span>
          </div>
          {Number(settlement.deductions) > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">공제액</span>
              <span className="text-red-500">
                -₩{Number(settlement.deductions).toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t pt-1 font-semibold">
            <span>실수령액</span>
            <span className="text-green-600">
              ₩{Number(settlement.netAmount).toLocaleString()}
            </span>
          </div>
        </div>

        {settlement.paidAt && (
          <p className="mt-2 text-xs text-muted-foreground">
            지급일:{' '}
            {format(new Date(settlement.paidAt), 'yyyy.MM.dd HH:mm', {
              locale: ko,
            })}
            {settlement.paymentMethod && ` · ${settlement.paymentMethod}`}
          </p>
        )}
        {settlement.notes && (
          <p className="mt-1 text-xs text-muted-foreground">
            {settlement.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
