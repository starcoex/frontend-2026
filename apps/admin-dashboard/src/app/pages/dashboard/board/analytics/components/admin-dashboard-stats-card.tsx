import { useNavigate } from 'react-router-dom';
import {
  MoreHorizontal,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
} from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { AdminDashboardStatsOutput } from '@starcoex-frontend/analytics';
import { ExportButton } from '@starcoex-frontend/common';

interface Props {
  data: AdminDashboardStatsOutput | null;
  isLoading: boolean;
}

const TOP_USER_EXPORT_COLUMNS = [
  { header: '사용자 ID', key: 'userId' },
  { header: '결제액', key: 'totalAmountFormatted' },
  { header: '주문 수', key: 'orderCountFormatted' },
];

export function AdminDashboardStatsCard({ data, isLoading }: Props) {
  const navigate = useNavigate();

  const stats = [
    {
      label: '전체 사용자',
      value: data?.totalUsers?.toLocaleString() ?? '0',
      suffix: '명',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      label: '오늘 활성 사용자',
      value: data?.activeUsersToday?.toLocaleString() ?? '0',
      suffix: '명',
      icon: Activity,
      color: 'text-emerald-500',
    },
    {
      label: '오늘 매출',
      value: data?.totalRevenueToday?.toLocaleString() ?? '0',
      suffix: '원',
      icon: DollarSign,
      color: 'text-violet-500',
    },
    {
      label: '오늘 주문',
      value: data?.totalOrdersToday?.toLocaleString() ?? '0',
      suffix: '건',
      icon: ShoppingCart,
      color: 'text-orange-500',
    },
  ];

  const topUserExportData = (data?.topUsers ?? []).map((u) => ({
    userId: `#${u.userId}`,
    totalAmountFormatted: `₩${u.totalAmount.toLocaleString()}`,
    orderCountFormatted: `${u.orderCount.toLocaleString()}건`,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>어드민 대시보드</CardTitle>
            <CardDescription>오늘의 전체 현황</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            {topUserExportData.length > 0 && (
              <ExportButton
                data={topUserExportData}
                columns={TOP_USER_EXPORT_COLUMNS}
                fileName="top-users"
                pdfTitle="TOP 사용자"
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
        {/* 요약 통계 */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-md border p-3">
                <div className="flex items-center gap-1.5">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-muted-foreground text-xs">
                    {stat.label}
                  </span>
                </div>
                {isLoading ? (
                  <Skeleton className="mt-1 h-6 w-20" />
                ) : (
                  <p className="mt-1 text-lg font-bold">
                    {stat.value}
                    <span className="text-muted-foreground ml-1 text-xs font-normal">
                      {stat.suffix}
                    </span>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Top 사용자 */}
        {!isLoading && (data?.topUsers?.length ?? 0) > 0 && (
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-medium">
              TOP 사용자
            </p>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>사용자 ID</TableHead>
                    <TableHead className="text-right">결제액</TableHead>
                    <TableHead className="text-right">주문 수</TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data!.topUsers.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell className="font-medium">
                        #{user.userId}
                      </TableCell>
                      <TableCell className="text-right">
                        {user.totalAmount.toLocaleString()}원
                      </TableCell>
                      <TableCell className="text-right">
                        {user.orderCount.toLocaleString()}건
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
                                navigate(`/admin/users/${user.userId}`)
                              }
                            >
                              상세보기
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/admin/orders?userId=${user.userId}`)
                              }
                            >
                              주문 내역 보기
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
      </CardContent>
    </Card>
  );
}
