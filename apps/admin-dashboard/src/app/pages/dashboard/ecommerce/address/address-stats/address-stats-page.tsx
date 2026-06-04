import { useState, useMemo, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import {
  PageHead,
  LoadingSpinner,
  ErrorAlert,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  ResponsiveContainer,
} from 'recharts';
import {
  MapPin,
  Building2,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Search,
} from 'lucide-react';
import { useAddress } from '@starcoex-frontend/address';
import type { AddressStatsResult } from '@starcoex-frontend/address';
import {
  buildAddressSummaryStats,
  buildDailyAddressData,
  buildAddressStatusChartData,
  buildRegionChartData,
  buildTopKeywordsData,
} from '@/app/utils/address-stats-utils';

// ============================================================================
// 포맷 헬퍼
// ============================================================================

const formatCount = (value: unknown): string => {
  if (typeof value === 'number') return `${value}건`;
  return String(value);
};

// ============================================================================
// Page
// ============================================================================

export default function AddressStatsPage() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const defaultStart = format(subDays(new Date(), 29), 'yyyy-MM-dd');

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(today);
  const [statsData, setStatsData] = useState<AddressStatsResult | null>(null);

  const {
    savedAddresses,
    isLoading,
    error,
    getUserAddresses,
    getUserAddressStats,
    getUserSearchLogs,
  } = useAddress();

  const [searchLogs, setSearchLogs] = useState<
    Awaited<ReturnType<typeof getUserSearchLogs>> extends {
      data: { data: infer T } | null;
    }
      ? T
      : never[]
  >([]);

  const fetchData = async (start: string, end: string) => {
    await getUserAddresses({ page: 1, limit: 200 });

    const statsRes = await getUserAddressStats();
    if (statsRes.success && statsRes.data) setStatsData(statsRes.data);

    const logsRes = await getUserSearchLogs({
      startDate: start,
      endDate: end,
      page: 1,
      limit: 200,
    });
    if (logsRes.success && logsRes.data)
      setSearchLogs(logsRes.data.data as any);
  };

  useEffect(() => {
    fetchData(defaultStart, today);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApply = () => {
    fetchData(startDate, endDate);
  };

  const handleReset = () => {
    setStartDate(defaultStart);
    setEndDate(today);
    fetchData(defaultStart, today);
  };

  // ── 차트 데이터 ──────────────────────────────────────────────────────────────

  const summary = useMemo(
    () => buildAddressSummaryStats(savedAddresses),
    [savedAddresses]
  );

  const dailyData = useMemo(
    () => buildDailyAddressData(savedAddresses, startDate, endDate),
    [savedAddresses, startDate, endDate]
  );

  const statusChartData = useMemo(
    () => buildAddressStatusChartData(savedAddresses),
    [savedAddresses]
  );

  const regionChartData = useMemo(
    () => buildRegionChartData(savedAddresses),
    [savedAddresses]
  );

  const topKeywordsData = useMemo(
    () => buildTopKeywordsData(searchLogs as any, 10),
    [searchLogs]
  );

  if (isLoading && savedAddresses.length === 0) {
    return <LoadingSpinner message="통계 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`주소 통계 - ${COMPANY_INFO.name}`}
        description="주소 등록 및 검색 통계를 확인하세요."
        keywords={['주소 통계', '주소 분석', COMPANY_INFO.name]}
        og={{
          title: `주소 통계 - ${COMPANY_INFO.name}`,
          description: '주소 통계 및 분석',
          image: '/images/og-address.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-6">
        {/* ── 날짜 필터 ──────────────────────────────────────────────────────── */}
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

        {/* ── 요약 카드 ──────────────────────────────────────────────────────── */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: MapPin,
              label: '전체 주소 수',
              value: `${statsData?.totalAddresses ?? summary.totalCount}건`,
              sub: `활성 ${
                statsData?.activeAddresses ?? summary.activeCount
              }건`,
              badge: null,
            },
            {
              icon: CheckCircle2,
              label: '활성 주소',
              value: `${statsData?.activeAddresses ?? summary.activeCount}건`,
              sub: `전체의 ${summary.activeRate}%`,
              badge: { label: '활성', variant: 'success' as const },
            },
            {
              icon: Building2,
              label: '자주 사용 주소',
              value: `${statsData?.frequentAddresses ?? 0}건`,
              sub: '5회 이상 사용',
              badge:
                (statsData?.frequentAddresses ?? 0) > 0
                  ? { label: '자주 사용', variant: 'default' as const }
                  : { label: '없음', variant: 'outline' as const },
            },
            {
              icon: Search,
              label: '총 검색 횟수',
              value: `${statsData?.totalSearches ?? searchLogs.length}회`,
              sub: `최근 30일 기준`,
              badge:
                (statsData?.totalSearches ?? 0) > 0
                  ? { label: '검색 있음', variant: 'default' as const }
                  : { label: '검색 없음', variant: 'outline' as const },
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

        {/* ── 일별 등록 추이 ─────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 opacity-60" />
              일별 주소 등록 추이
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dailyData.every((d) => d.registered === 0) ? (
              <div className="flex h-[280px] items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  해당 기간 등록 데이터가 없습니다.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient
                      id="colorRegistered"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorActive"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
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
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      formatCount(value),
                      name === 'registered' ? '등록 건수' : '활성 건수',
                    ]}
                    labelClassName="font-medium"
                  />
                  <Area
                    type="monotone"
                    dataKey="registered"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#colorRegistered)"
                    name="registered"
                  />
                  <Area
                    type="monotone"
                    dataKey="active"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fill="url(#colorActive)"
                    name="active"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* ── 상태 분포 + 지역별 분포 ────────────────────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* 상태별 분포 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingDown className="size-4 opacity-60" />
                주소 상태 분포
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statusChartData.length === 0 ? (
                <div className="flex h-[240px] items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    데이터가 없습니다.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="60%" height={240}>
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatCount(value)]} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* 범례 */}
                  <div className="flex flex-1 flex-col gap-2">
                    {statusChartData.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="size-3 flex-none rounded-full"
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

          {/* 건물 유형 분포 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="size-4 opacity-60" />
                건물 유형 분포
              </CardTitle>
            </CardHeader>
            <CardContent>
              {summary.totalCount === 0 ? (
                <div className="flex h-[240px] items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    데이터가 없습니다.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="60%" height={240}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: '공동주택',
                            value: summary.apartmentCount,
                            color: '#6366f1',
                          },
                          {
                            name: '단독주택',
                            value: summary.singleHouseCount,
                            color: '#22c55e',
                          },
                        ].filter((d) => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {[{ color: '#6366f1' }, { color: '#22c55e' }].map(
                          (entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          )
                        )}
                      </Pie>
                      <Tooltip formatter={(value) => [formatCount(value)]} />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="flex flex-1 flex-col gap-2">
                    {[
                      {
                        name: '공동주택',
                        value: summary.apartmentCount,
                        color: '#6366f1',
                      },
                      {
                        name: '단독주택',
                        value: summary.singleHouseCount,
                        color: '#22c55e',
                      },
                    ].map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="size-3 flex-none rounded-full"
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

        {/* ── 지역별 주소 분포 ───────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="size-4 opacity-60" />
              지역별 주소 분포 (상위 10개)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {regionChartData.length === 0 ? (
              <div className="flex h-[240px] items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  지역 데이터가 없습니다.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={regionChartData}
                  layout="vertical"
                  margin={{ left: 16 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    type="category"
                    dataKey="region"
                    width={100}
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    formatter={(value) => [formatCount(value), '주소 수']}
                    labelClassName="font-medium"
                  />
                  <Bar
                    dataKey="count"
                    fill="#6366f1"
                    radius={[0, 4, 4, 0]}
                    name="주소 수"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* ── 인기 검색 키워드 ───────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="size-4 opacity-60" />
              인기 검색 키워드 (상위 10개)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topKeywordsData.length === 0 ? (
              <div className="flex h-[240px] items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  해당 기간 검색 로그가 없습니다.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={topKeywordsData}
                  layout="vertical"
                  margin={{ left: 16 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    type="category"
                    dataKey="keyword"
                    width={100}
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    formatter={(value) => [formatCount(value), '검색 횟수']}
                    labelClassName="font-medium"
                  />
                  <Bar
                    dataKey="count"
                    fill="#f59e0b"
                    radius={[0, 4, 4, 0]}
                    name="검색 횟수"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
