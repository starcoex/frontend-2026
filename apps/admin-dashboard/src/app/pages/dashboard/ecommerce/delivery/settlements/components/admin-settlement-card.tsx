import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { IconCheck, IconCash } from '@tabler/icons-react';
import type {
  DriverSettlement,
  SettlementStatus,
  ApproveSettlementInput,
  ProcessPaymentInput,
} from '@starcoex-frontend/delivery';

export const ADMIN_SETTLEMENT_STATUS_BADGE: Record<
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

interface AdminSettlementCardProps {
  settlement: DriverSettlement;
  onApprove: (input: ApproveSettlementInput) => Promise<any>;
  onPay: (input: ProcessPaymentInput) => Promise<any>;
  onUpdated: (updated: DriverSettlement) => void;
}

export function AdminSettlementCard({
  settlement,
  onApprove,
  onPay,
  onUpdated,
}: AdminSettlementCardProps) {
  const [actionLoading, setActionLoading] = useState(false);
  const badge = ADMIN_SETTLEMENT_STATUS_BADGE[settlement.status];

  const handleApprove = async () => {
    setActionLoading(true);
    const res = await onApprove({ settlementId: settlement.id });
    if (res.success && res.data) onUpdated(res.data);
    setActionLoading(false);
  };

  const handlePay = async () => {
    setActionLoading(true);
    const res = await onPay({
      settlementId: settlement.id,
      paymentMethod: '계좌이체',
    });
    if (res.success && res.data) onUpdated(res.data);
    setActionLoading(false);
  };

  return (
    <Card>
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {format(new Date(settlement.settlementDate), 'yyyy년 MM월 dd일', {
              locale: ko,
            })}
            <span className="text-muted-foreground ml-2 text-xs">
              기사 ID: {settlement.driverId}
            </span>
          </CardTitle>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {/* 배송 통계 */}
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

        {/* 금액 */}
        <div className="mb-3 space-y-1 rounded-md bg-muted/50 p-3 text-sm">
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

        {/* 액션 버튼 */}
        <div className="flex gap-2">
          {settlement.status === 'CALCULATED' && (
            <Button
              size="sm"
              variant="default"
              className="flex-1"
              disabled={actionLoading}
              onClick={handleApprove}
            >
              <IconCheck className="mr-1.5 h-4 w-4" />
              {actionLoading ? '처리 중...' : '승인 처리'}
            </Button>
          )}
          {settlement.status === 'APPROVED' && (
            <Button
              size="sm"
              variant="default"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={actionLoading}
              onClick={handlePay}
            >
              <IconCash className="mr-1.5 h-4 w-4" />
              {actionLoading ? '처리 중...' : '지급 처리'}
            </Button>
          )}
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
