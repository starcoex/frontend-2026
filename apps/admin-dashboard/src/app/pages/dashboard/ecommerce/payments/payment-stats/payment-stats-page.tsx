import { useState, useMemo } from 'react';
import { format, subDays } from 'date-fns';
import {
  PageHead,
  LoadingSpinner,
  ErrorAlert,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  XCircle,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatAmount } from '../data/payment-data';
import { usePayments } from '@starcoex-frontend/payments';
import {
  buildDailyChartData,
  buildStatusChartData,
  buildSummaryStats,
} from '@/app/utils/payment-stats-utils';

// 금액 축 포맷 (₩10,000 → 1만)
const formatYAxis = (value: number) => {
  if (value >= 10000) return `${(value / 10000).toFixed(0)}만`;
  return `${value}`;
};

// 툴팁 금액 포맷 — ValueType 대응
const formatTooltipAmount = (value: unknown): string => {
  if (typeof value === 'number') return `₩${value.toLocaleString()}`;
  return String(value);
};

export default function PaymentStatsPage() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const defaultStart = format(subDays(new Date(), 29), 'yyyy-MM-dd');

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(today);

  const { payments, isLoading, error, handleFilterChange } = usePayments();

  // 날짜 범위 적용
  const handleApply = () => {
    handleFilterChange({
      startDate,
      endDate,
      limit: 100,
      offset: 0,
    });
  };

  // 초기화
  const handleReset = () => {
    setStartDate(defaultStart);
    setEndDate(today);
    handleFilterChange({
      startDate: defaultStart,
      endDate: today,
      limit: 100,
      offset: 0,
    });
  };

  // 차트 데이터 계산
  const dailyData = useMemo(
    () => buildDailyChartData(payments, startDate, endDate),
    [payments, startDate, endDate]
  );

  const statusData = useMemo(() => buildStatusChartData(payments), [payments]);

  const summary = useMemo(() => buildSummaryStats(payments), [payments]);

  if (isLoading && payments.length === 0) {
    return <LoadingSpinner message="통계 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`결제 통계 - ${COMPANY_INFO.name}`}
        description="결제 통계를 확인하세요."
        keywords={['결제 통계', '결제 분석', COMPANY_INFO.name]}
        og={{
          title: `결제 통계 - ${COMPANY_INFO.name}`,
          description: '결제 통계 및 분석',
          image: '/images/og-payments.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-6">
        {/* 날짜 필터 */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <Input
                type="date"
                className="h-8 w-[150px]"
                value={startDate}
                max={endDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-muted-foreground text-sm">~</span>
              <Input
                type="date"
                className="h-8 w-[150px]"
                value={endDate}
                min={startDate}
                max={today}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <Button size="sm" className="h-8" onClick={handleApply}>
                조회
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8"
                onClick={handleReset}
              >
                <RotateCcw className="mr-1 size-3.5" />
                최근 30일
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && <ErrorAlert error={error} onRetry={handleApply} />}

        {/* 요약 카드 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: CreditCard,
              label: '전체 결제 건수',
              value: `${summary.totalCount}건`,
              sub: `완료 ${summary.paidCount}건`,
              badge: null,
            },
            {
              icon: TrendingUp,
              label: '결제 완료 총액',
              value: formatAmount(summary.totalPaidAmount),
              sub: `${summary.paidCount}건`,
              badge: { label: '완료', variant: 'success' as const },
            },
            {
              icon: XCircle,
              label: '취소 총액',
              value: formatAmount(summary.totalCancelledAmount),
              sub: `${summary.cancelledCount}건`,
              badge:
                summary.cancelledCount > 0
                  ? {
                      label: `취소율 ${summary.cancelRate}%`,
                      variant: 'destructive' as const,
                    }
                  : { label: '취소 없음', variant: 'outline' as const },
            },
            {
              icon: AlertCircle,
              label: '실패 건수',
              value: `${summary.failedCount}건`,
              sub: `전체의 ${
                summary.totalCount > 0
                  ? ((summary.failedCount / summary.totalCount) * 100).toFixed(
                      1
                    )
                  : 0
              }%`,
              badge:
                summary.failedCount > 0
                  ? { label: '확인 필요', variant: 'warning' as const }
                  : { label: '정상', variant: 'outline' as const },
            },
          ].map((item) => (
            <Card key={item.label}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <item.icon className="text-muted-foreground size-5" />
                  {item.badge && (
                    <Badge variant={item.badge.variant}>
                      {item.badge.label}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">{item.label}</p>
                <p className="font-display text-2xl font-bold">{item.value}</p>
                <p className="text-muted-foreground text-xs">{item.sub}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* 일별 결제 금액 추이 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 opacity-60" />
              일별 결제 금액 추이
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dailyData.every(
              (d) => d.amount === 0 && d.cancelledAmount === 0
            ) ? (
              <div className="flex h-[280px] items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  해당 기간 결제 데이터가 없습니다.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient
                      id="colorAmount"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorCancelled"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tickFormatter={formatYAxis}
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      formatTooltipAmount(value),
                      name === 'amount' ? '결제 완료' : '취소 금액',
                    ]}
                    labelClassName="font-medium"
                  />
                  <Legend
                    formatter={(value) =>
                      value === 'amount' ? '결제 완료' : '취소 금액'
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fill="url(#colorAmount)"
                  />
                  <Area
                    type="monotone"
                    dataKey="cancelledAmount"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#colorCancelled)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* 일별 결제 건수 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="size-4 opacity-60" />
                일별 결제 건수
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dailyData.every((d) => d.count === 0) ? (
                <div className="flex h-[240px] items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    해당 기간 결제 데이터가 없습니다.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={dailyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                    />
                    <Tooltip
                      formatter={(value) => [
                        typeof value === 'number' ? `${value}건` : `${value}건`,
                        '결제 건수',
                      ]}
                      labelClassName="font-medium"
                    />

                    <Bar
                      dataKey="count"
                      fill="#6366f1"
                      radius={[4, 4, 0, 0]}
                      name="결제 건수"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* 상태별 분포 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingDown className="size-4 opacity-60" />
                결제 상태 분포
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statusData.length === 0 ? (
                <div className="flex h-[240px] items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    해당 기간 결제 데이터가 없습니다.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="60%" height={240}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          typeof value === 'number'
                            ? `${value}건`
                            : `${value}건`,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* 범례 */}
                  <div className="flex flex-1 flex-col gap-2">
                    {statusData.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="size-3 rounded-full flex-none"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-muted-foreground text-sm font-medium">
                          {item.value}건
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
