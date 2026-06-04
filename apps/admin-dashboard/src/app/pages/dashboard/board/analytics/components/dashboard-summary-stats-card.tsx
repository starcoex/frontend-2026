import { useNavigate } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserDashboardSummaryStats } from '@starcoex-frontend/analytics';
import { ExportButton } from '@starcoex-frontend/common';

interface Props {
  data: UserDashboardSummaryStats | null;
  isLoading: boolean;
}

const TOP_SAVER_EXPORT_COLUMNS = [
  { header: '사용자 ID', key: 'userId' },
  { header: '절약액', key: 'totalSavingsFormatted' },
  { header: '사용액', key: 'totalAmountFormatted' },
];

export function DashboardSummaryStatsCard({ data, isLoading }: Props) {
  const navigate = useNavigate();

  const achievementRate =
    data && data.totalAchievements > 0
      ? Math.round((data.completedAchievements / data.totalAchievements) * 100)
      : 0;

  const topSaverExportData = (data?.topSavers ?? []).map((s) => ({
    userId: `#${s.userId}`,
    totalSavingsFormatted: `₩${s.totalSavings.toLocaleString()}`,
    totalAmountFormatted: `₩${s.totalAmount.toLocaleString()}`,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>대시보드 요약</CardTitle>
            <CardDescription>사용자 전체 활동 집계</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            {topSaverExportData.length > 0 && (
              <ExportButton
                data={topSaverExportData}
                columns={TOP_SAVER_EXPORT_COLUMNS}
                fileName="top-savers"
                pdfTitle="TOP 절약 사용자"
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => navigate('/admin/users')}
            >
              전체보기
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : (
          <>
            {/* 주요 지표 */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '전체 사용자', value: data?.totalUsers, suffix: '명' },
                { label: '총 이벤트', value: data?.totalEvents, suffix: '건' },
                {
                  label: '사용자당 평균 사용액',
                  value: data?.avgAmountPerUser,
                  suffix: '원',
                },
                {
                  label: '사용자당 평균 절약액',
                  value: data?.avgSavingsPerUser,
                  suffix: '원',
                },
              ].map((item) => (
                <div key={item.label} className="rounded-md border p-3">
                  <p className="text-muted-foreground text-xs">{item.label}</p>
                  <p className="mt-0.5 text-lg font-bold">
                    {item.value?.toLocaleString() ?? '0'}
                    <span className="text-muted-foreground ml-1 text-xs font-normal">
                      {item.suffix}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* 업적 달성률 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">업적 달성률</span>
                <span className="font-medium">
                  {data?.completedAchievements ?? 0} /{' '}
                  {data?.totalAchievements ?? 0}
                  <span className="text-muted-foreground ml-1">
                    ({achievementRate}%)
                  </span>
                </span>
              </div>
              <Progress value={achievementRate} className="h-2" />
            </div>

            {/* Top 절약 사용자 */}
            {(data?.topSavers?.length ?? 0) > 0 && (
              <div>
                <p className="text-muted-foreground mb-2 text-xs font-medium">
                  TOP 절약 사용자
                </p>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>사용자 ID</TableHead>
                        <TableHead className="text-right">절약액</TableHead>
                        <TableHead className="text-right">사용액</TableHead>
                        <TableHead className="w-8" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data!.topSavers.map((saver) => (
                        <TableRow key={saver.userId}>
                          <TableCell className="font-medium">
                            #{saver.userId}
                          </TableCell>
                          <TableCell className="text-right text-emerald-500">
                            {saver.totalSavings.toLocaleString()}원
                          </TableCell>
                          <TableCell className="text-right">
                            {saver.totalAmount.toLocaleString()}원
                          </TableCell>
                          {/* ⋮ 메뉴 */}
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                >
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(`/admin/users/${saver.userId}`)
                                  }
                                >
                                  상세보기
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(`/admin/loyalty/${saver.userId}`)
                                  }
                                >
                                  로열티 내역
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
