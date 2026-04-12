import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDelivery } from '@starcoex-frontend/delivery';
import type {
  DriverSettlement,
  DriverSettlementSummary,
  SettlementStatus,
} from '@starcoex-frontend/delivery';

const SETTLEMENT_STATUS_CONFIG: Record<
  SettlementStatus,
  { label: string; variant: 'outline' | 'secondary' | 'warning' | 'success' }
> = {
  PENDING: { label: '대기', variant: 'outline' },
  CALCULATED: { label: '계산 완료', variant: 'secondary' },
  APPROVED: { label: '승인 완료', variant: 'warning' },
  PAID: { label: '지급 완료', variant: 'success' },
};

interface Props {
  driverId: number; // ✅ driver 객체 대신 driverId만 받음
}

export function DriverSettlementTab({ driverId }: Props) {
  const { fetchDriverSettlements } = useDelivery();

  const [settlements, setSettlements] = useState<DriverSettlement[]>([]);
  const [summary, setSummary] = useState<DriverSettlementSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchDriverSettlements({ driverId, limit: 20 })
      .then((res) => {
        if (res?.success && res.data) {
          setSettlements(res.data.settlements ?? []);
          setSummary(res.data.summary ?? null);
        }
      })
      .finally(() => setIsLoading(false));
  }, [driverId, fetchDriverSettlements]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-24 items-center justify-center">
          <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 정산 요약 */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: '총 배송 건수', value: `${summary.totalDeliveries}건` },
            {
              label: '총 수입',
              value: `₩${Number(summary.totalGrossAmount).toLocaleString()}`,
            },
            {
              label: '실수령 합계',
              value: `₩${Number(summary.totalNetAmount).toLocaleString()}`,
            },
          ].map((s) => (
            <Card key={s.label}>
              <CardHeader className="pb-2">
                <CardDescription>{s.label}</CardDescription>
                <CardTitle className="text-xl">{s.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* 정산 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>
            정산 내역 ({summary?.totalCount ?? settlements.length}건)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {settlements.length === 0 ? (
            <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground text-sm">
                정산 내역이 없습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {settlements.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                      {new Date(s.settlementDate).toLocaleDateString('ko-KR')}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      배송 {s.completedDeliveries}/{s.totalDeliveries}건 ·{' '}
                      실수령{' '}
                      <span className="text-foreground font-semibold">
                        ₩{Number(s.netAmount).toLocaleString()}
                      </span>
                    </p>
                    {s.notes && (
                      <p className="text-muted-foreground text-xs">{s.notes}</p>
                    )}
                  </div>
                  <Badge variant={SETTLEMENT_STATUS_CONFIG[s.status].variant}>
                    {SETTLEMENT_STATUS_CONFIG[s.status].label}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
