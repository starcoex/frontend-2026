import { useMemo } from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useQueue } from '@starcoex-frontend/queue';
import { QueueSessionStatus } from '@starcoex-frontend/queue';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function QueueStatsPage() {
  const { integratedStats, sessions } = useQueue();
  console.log('integratedStats:', integratedStats);

  const summary = useMemo(() => {
    const totalWaiting = integratedStats.reduce(
      (s, q) => s + q.waitingCount,
      0
    );
    const totalToday = integratedStats.reduce((s, q) => s + q.todayTotal, 0);
    const openStores = integratedStats.filter((q) => q.isOpen).length;
    const avgWait = integratedStats.length
      ? Math.round(
          integratedStats.reduce((s, q) => s + q.estimatedWaitMin, 0) /
            integratedStats.length
        )
      : 0;
    const completed = sessions.filter(
      (s) => s.status === QueueSessionStatus.COMPLETED
    ).length;
    const cancelled = sessions.filter(
      (s) => s.status === QueueSessionStatus.CANCELLED
    ).length;
    return {
      totalWaiting,
      totalToday,
      openStores,
      avgWait,
      completed,
      cancelled,
    };
  }, [integratedStats, sessions]);

  const statItems = [
    {
      label: '현재 대기',
      value: summary.totalWaiting,
      icon: Users,
      badge:
        summary.totalWaiting > 0
          ? { label: '대기 중', variant: 'warning' as const }
          : null,
    },
    {
      label: '오늘 총 접수',
      value: summary.totalToday,
      icon: TrendingUp,
      badge: null,
    },
    {
      label: '완료',
      value: summary.completed,
      icon: CheckCircle2,
      badge: null,
    },
    {
      label: '취소',
      value: summary.cancelled,
      icon: XCircle,
      badge:
        summary.cancelled > 0
          ? { label: '주의', variant: 'destructive' as const }
          : null,
    },
  ];

  // 지점별 대기 현황 차트 데이터
  const storeChartData = integratedStats.map((s) => ({
    name: `지점 #${s.storeId}`,
    대기: s.waitingCount,
    오늘: s.todayTotal,
  }));

  return (
    <>
      <PageHead
        title={`대기열 통계 - ${COMPANY_INFO.name}`}
        description="대기열 현황 및 통계 데이터를 확인하세요."
        keywords={['대기열 통계', '대기열 현황', COMPANY_INFO.name]}
        og={{
          title: `대기열 통계 - ${COMPANY_INFO.name}`,
          description: '대기열 현황 및 통계 분석',
          image: '/images/og-queue.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 요약 카드 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statItems.map((item) => (
            <Card key={item.label}>
              <CardHeader>
                <CardDescription className="flex items-center gap-1.5">
                  <item.icon className="size-4 opacity-60" />
                  {item.label}
                </CardDescription>
                <CardTitle className="font-display text-2xl lg:text-3xl">
                  {item.value}
                </CardTitle>
                {item.badge && (
                  <CardAction>
                    <Badge variant={item.badge.variant}>
                      {item.badge.label}
                    </Badge>
                  </CardAction>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* 운영 현황 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardDescription className="flex items-center gap-1.5">
                <Clock className="size-4 opacity-60" />
                평균 대기 시간
              </CardDescription>
              <CardTitle className="font-display text-2xl lg:text-3xl">
                {summary.avgWait}분
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 opacity-60" />
                운영 중인 지점
              </CardDescription>
              <CardTitle className="font-display text-2xl lg:text-3xl">
                {summary.openStores}개
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* 지점별 현황 차트 */}
        {storeChartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardDescription className="flex items-center gap-1.5">
                <BarChart3 className="size-4 opacity-60" />
                지점별 대기 현황
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={storeChartData}
                  margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip labelStyle={{ fontSize: 12 }} />
                  <Bar
                    dataKey="대기"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="오늘"
                    fill="hsl(var(--primary) / 0.4)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
