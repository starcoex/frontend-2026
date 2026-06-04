import { useCallback, useState } from 'react';
import {
  LoadingSpinner,
  PageHead,
  ErrorAlert,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useDelivery } from '@starcoex-frontend/delivery';
import type {
  DriverSettlement,
  SettlementStatus,
  SettlementSummaryOutput,
} from '@starcoex-frontend/delivery';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  IconWallet,
  IconSearch,
  IconUser,
  IconCalendar,
} from '@tabler/icons-react';
import { AdminSettlementSummary } from './components/admin-settlement-summary';
import { AdminSettlementCard } from './components/admin-settlement-card';

const STATUS_TABS: { label: string; status: SettlementStatus | undefined }[] = [
  { label: '전체', status: undefined },
  { label: '정산 대기', status: 'PENDING' },
  { label: '계산 완료', status: 'CALCULATED' },
  { label: '승인 대기', status: 'APPROVED' },
  { label: '지급 완료', status: 'PAID' },
];

export default function DeliverySettlementsPage() {
  const {
    fetchSettlementsByPeriod,
    fetchSettlementSummary,
    approveSettlement,
    processSettlementPayment,
    isLoading,
    error,
  } = useDelivery();

  const [settlements, setSettlements] = useState<DriverSettlement[]>([]);
  const [summary, setSummary] = useState<SettlementSummaryOutput | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [driverIdInput, setDriverIdInput] = useState('');
  const today = format(new Date(), 'yyyy-MM-dd');
  const firstDay = format(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    'yyyy-MM-dd'
  );
  const [dateFrom, setDateFrom] = useState(firstDay);
  const [dateTo, setDateTo] = useState(today);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    const driverId = driverIdInput ? parseInt(driverIdInput, 10) : undefined;
    const res = await fetchSettlementsByPeriod({ dateFrom, dateTo, driverId });
    if (res.success && res.data) {
      setSettlements(res.data);
      setSearched(true);
    }
    const summaryRes = await fetchSettlementSummary(dateFrom, dateTo);
    if (summaryRes.success && summaryRes.data) setSummary(summaryRes.data);
  }, [
    driverIdInput,
    dateFrom,
    dateTo,
    fetchSettlementsByPeriod,
    fetchSettlementSummary,
  ]);

  const updateSettlement = useCallback((updated: DriverSettlement) => {
    setSettlements((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  }, []);

  const filtered =
    STATUS_TABS[activeTab].status == null
      ? settlements
      : settlements.filter((s) => s.status === STATUS_TABS[activeTab].status);

  return (
    <>
      <PageHead
        title={`정산 관리 - ${COMPANY_INFO.name}`}
        description="배달기사 정산 내역을 조회하고 승인/지급 처리하세요."
        keywords={['정산 관리', '기사 정산', '지급', COMPANY_INFO.name]}
        og={{
          title: `정산 관리 - ${COMPANY_INFO.name}`,
          description: '관리자 정산 관리',
          image: '/images/og-delivery.jpg',
          type: 'website',
        }}
      />

      {/* 검색 조건 */}
      <Card className="mb-4">
        <CardContent className="space-y-3 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="flex items-center gap-1 text-xs">
                <IconCalendar className="h-3.5 w-3.5" />
                시작일
              </Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="flex items-center gap-1 text-xs">
                <IconCalendar className="h-3.5 w-3.5" />
                종료일
              </Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <IconUser className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="기사 ID (선택 — 비우면 전체 조회)"
                value={driverIdInput}
                onChange={(e) => setDriverIdInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              <IconSearch className="mr-1.5 h-4 w-4" />
              조회
            </Button>
          </div>
        </CardContent>
      </Card>

      {!searched ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <IconWallet className="text-muted-foreground mb-3 h-12 w-12" />
          <p className="text-muted-foreground text-sm">
            기간을 선택하고 조회 버튼을 눌러주세요.
          </p>
        </div>
      ) : (
        <>
          {/* ✅ 요약 — 분리된 컴포넌트 */}
          {summary && <AdminSettlementSummary summary={summary} />}

          {/* 탭 필터 */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {STATUS_TABS.map((tab, idx) => {
              const count =
                tab.status == null
                  ? settlements.length
                  : settlements.filter((s) => s.status === tab.status).length;
              return (
                <Button
                  key={tab.label}
                  variant={activeTab === idx ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab(idx)}
                  className={cn('shrink-0', activeTab === idx && 'shadow-sm')}
                >
                  {tab.label}
                  {count > 0 && (
                    <Badge
                      variant={activeTab === idx ? 'secondary' : 'outline'}
                      className="ml-1.5 text-xs"
                    >
                      {count}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>

          {error && <ErrorAlert error={error} onRetry={handleSearch} />}

          {/* ✅ 정산 카드 — 분리된 컴포넌트 */}
          {!error && (
            <div className="space-y-3">
              {isLoading ? (
                <LoadingSpinner message="조회 중..." />
              ) : filtered.length > 0 ? (
                filtered.map((settlement) => (
                  <AdminSettlementCard
                    key={settlement.id}
                    settlement={settlement}
                    onApprove={approveSettlement}
                    onPay={processSettlementPayment}
                    onUpdated={updateSettlement}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-muted-foreground text-sm">
                    {activeTab === 0
                      ? '정산 내역이 없습니다.'
                      : `${STATUS_TABS[activeTab].label} 상태의 정산이 없습니다.`}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
