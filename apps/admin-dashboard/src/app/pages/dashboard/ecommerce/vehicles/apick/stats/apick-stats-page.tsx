import { useEffect } from 'react';
import {
  Loader2,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  XCircle,
  CircleDollarSign,
  Search,
  Waves,
  Wrench,
  Tag,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useApick } from '@starcoex-frontend/vehicles';

export default function ApickStatsPage() {
  const { stats, isLoading, fetchApickStats, updateApickDailyStats } =
    useApick();

  useEffect(() => {
    fetchApickStats();
  }, [fetchApickStats]);

  const handleUpdate = async () => {
    const res = await updateApickDailyStats();
    if (res.success) {
      fetchApickStats();
    }
  };

  if (isLoading && !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  const statItems = [
    { label: '전체 조회', value: stats?.totalChecks ?? 0, icon: Search },
    { label: '성공', value: stats?.successChecks ?? 0, icon: CheckCircle2 },
    { label: '실패', value: stats?.failedChecks ?? 0, icon: XCircle },
    {
      label: '총 비용',
      value: `${(stats?.totalCost ?? 0).toLocaleString()}원`,
      icon: CircleDollarSign,
    },
    { label: '침수차 발견', value: stats?.floodedVehicles ?? 0, icon: Waves },
    { label: '폐차사고처리', value: stats?.scrapVehicles ?? 0, icon: Wrench },
    { label: '매매용 차량', value: stats?.saleVehicles ?? 0, icon: Tag },
    {
      label: '평균 응답시간',
      value: `${(stats?.avgResponseTime ?? 0).toFixed(0)}ms`,
      icon: BarChart3,
    },
  ];

  return (
    <>
      <PageHead
        title={`Apick 통계 - ${COMPANY_INFO.name}`}
        description="Apick 차량 조회 서비스 통계를 확인하세요."
        keywords={['Apick 통계', COMPANY_INFO.name]}
        og={{
          title: `Apick 통계 - ${COMPANY_INFO.name}`,
          description: 'Apick 통계',
          image: '/images/og-vehicles.jpg',
          type: 'website',
        }}
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {stats?.date && (
            <p className="text-sm text-muted-foreground">
              기준일: {stats.date}
            </p>
          )}
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchApickStats()}
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              새로고침
            </Button>
            <Button size="sm" onClick={handleUpdate}>
              통계 업데이트
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statItems.map((stat) => (
            <Card key={stat.label}>
              <CardHeader>
                <CardDescription className="flex items-center gap-1.5">
                  <stat.icon className="size-4 opacity-60" />
                  {stat.label}
                </CardDescription>
                <CardTitle className="font-display text-2xl lg:text-3xl">
                  {stat.value}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        {stats && (
          <Card>
            <CardHeader>
              <CardDescription className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 opacity-60" />
                성공률
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-3 flex-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{
                      width: `${
                        stats.totalChecks > 0
                          ? (stats.successChecks / stats.totalChecks) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold min-w-[48px] text-right">
                  {stats.totalChecks > 0
                    ? `${(
                        (stats.successChecks / stats.totalChecks) *
                        100
                      ).toFixed(1)}%`
                    : '0%'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
